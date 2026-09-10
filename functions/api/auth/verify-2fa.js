// Cloudflare Pages Function: /api/auth/verify-2fa
// Verifies Google Authenticator TOTP codes with constant-time comparison,
// clock drift allowance (+/- 30s), one-time backup recovery codes,
// rate limiting (5 attempts -> 15 min lock), and secret encryption.

import {
  jsonResponse,
  errorResponse,
  handleOptions,
  verifyJWT,
  createJWT,
} from '../utils.js'
import {
  verifyTOTP,
  decryptSecret,
  hashBackupCode,
  timingSafeEqualString,
} from '../utils/totp.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const { preAuthToken, code } = body

    if (!preAuthToken || !code) {
      return errorResponse('preAuthToken and verification code are required.', 400)
    }

    const cleanCode = String(code).trim().replace(/\s+/g, '')
    if (!cleanCode) {
      return errorResponse('Verification code is required.', 400)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    // Verify preAuthToken signature and 5-minute expiry
    const payload = await verifyJWT(preAuthToken, env.JWT_SECRET)
    if (!payload || !payload.id || !payload.isPreAuth) {
      return errorResponse('2FA session expired or invalid. Please log in again.', 401)
    }

    const userId = payload.id

    // Fetch user details from D1
    const user = await env.DB.prepare(
      `SELECT id, username, email, role, full_name, phone, avatar, balance, status,
              two_factor_secret, two_factor_backup_codes, two_factor_enabled, two_factor_confirmed_at,
              two_factor_failed_attempts, two_factor_locked_until
       FROM users
       WHERE id = ?`
    )
      .bind(userId)
      .first()

    if (!user || user.status === 'banned') {
      return errorResponse('Account is suspended or inactive.', 403)
    }

    // Check if account is currently locked due to rate limiting
    if (user.two_factor_locked_until) {
      const lockExpiry = new Date(user.two_factor_locked_until).getTime()
      if (Date.now() < lockExpiry) {
        const remainingMinutes = Math.max(1, Math.ceil((lockExpiry - Date.now()) / 60000))
        return errorResponse(
          `Security Lockout: Account temporarily locked due to failed 2FA attempts. Please retry in ${remainingMinutes} minute(s).`,
          429
        )
      }
    }

    let isCodeValid = false
    let usedBackupCodeHash = null

    // 1. If 6 numeric digits: verify with Google Authenticator RFC 6238 TOTP (allow +/- 30s window)
    if (/^\d{6}$/.test(cleanCode) && user.two_factor_secret) {
      const plainSecret = await decryptSecret(user.two_factor_secret, env.JWT_SECRET)
      if (plainSecret) {
        isCodeValid = await verifyTOTP(plainSecret, cleanCode, 1)
      }
    }

    // 2. If not matched, check if code matches any of the 8 one-time backup recovery codes
    if (!isCodeValid && user.two_factor_backup_codes) {
      try {
        const storedHashes = JSON.parse(user.two_factor_backup_codes)
        if (Array.isArray(storedHashes) && storedHashes.length > 0) {
          const submittedHash = await hashBackupCode(cleanCode)
          for (const savedHash of storedHashes) {
            if (timingSafeEqualString(savedHash, submittedHash)) {
              isCodeValid = true
              usedBackupCodeHash = savedHash
              break
            }
          }
        }
      } catch (e) {}
    }

    // ========================================================
    // RATE LIMITING: MAX 5 ATTEMPTS -> 15-MINUTE LOCK
    // ========================================================
    if (!isCodeValid) {
      const newAttempts = (user.two_factor_failed_attempts || 0) + 1

      if (newAttempts >= 5) {
        // Lock account for 15 minutes
        await env.DB.prepare(
          `UPDATE users 
           SET two_factor_failed_attempts = ?, two_factor_locked_until = datetime('now', '+15 minutes')
           WHERE id = ?`
        )
          .bind(newAttempts, userId)
          .run()

        return errorResponse(
          'Maximum failed 2FA attempts exceeded (5/5). Account locked for 15 minutes for security.',
          429
        )
      } else {
        await env.DB.prepare(
          'UPDATE users SET two_factor_failed_attempts = ? WHERE id = ?'
        )
          .bind(newAttempts, userId)
          .run()

        const remaining = 5 - newAttempts
        return errorResponse(
          `Invalid verification code. ${remaining} attempt(s) remaining before a 15-minute lockout.`,
          400
        )
      }
    }

    // ========================================================
    // SUCCESS: RESET ATTEMPTS & CONFIRM SETUP IF FIRST TIME
    // ========================================================
    let updatedBackupCodes = user.two_factor_backup_codes
    if (usedBackupCodeHash) {
      try {
        const storedHashes = JSON.parse(user.two_factor_backup_codes)
        const filtered = storedHashes.filter((h) => h !== usedBackupCodeHash)
        updatedBackupCodes = JSON.stringify(filtered)
      } catch (e) {}
    }

    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-pseudo-ipv4') ||
      '127.0.0.1'

    if (!user.two_factor_confirmed_at) {
      await env.DB.prepare(
        `UPDATE users 
         SET two_factor_enabled = 1,
             two_factor_confirmed_at = CURRENT_TIMESTAMP,
             two_factor_backup_codes = ?,
             two_factor_failed_attempts = 0,
             two_factor_locked_until = NULL,
             last_login_ip = ?,
             last_login_at = datetime('now')
         WHERE id = ?`
      )
        .bind(updatedBackupCodes, clientIp, userId)
        .run()
    } else {
      await env.DB.prepare(
        `UPDATE users 
         SET two_factor_backup_codes = ?,
             two_factor_failed_attempts = 0,
             two_factor_locked_until = NULL,
             last_login_ip = ?,
             last_login_at = datetime('now')
         WHERE id = ?`
      )
        .bind(updatedBackupCodes, clientIp, userId)
        .run()
    }

    // Strict Security Guard: Verify role from database record
    const effectiveRole = user.role === 'admin' ? 'admin' : 'user'

    // Clean up any legacy OTP codes (ignore if table doesn't exist)
    try {
      await env.DB.prepare('DELETE FROM two_factor_codes WHERE user_id = ?').bind(userId).run()
    } catch (e) {}

    // Issue 7-day authenticated JWT session
    const token = await createJWT(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: effectiveRole,
      },
      env.JWT_SECRET,
      7 * 24 * 60 * 60
    )

    const sanitizedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: effectiveRole,
      fullName: user.full_name,
      phone: user.phone || '',
      avatar: user.avatar || '',
      balance: user.balance || 0,
      status: user.status,
    }

    return jsonResponse({
      success: true,
      message: 'Google Authenticator 2FA verified successfully!',
      token,
      user: sanitizedUser,
    })
  } catch (err) {
    return errorResponse(err.message || 'Error verifying 2FA code', 500)
  }
}
