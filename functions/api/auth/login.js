// Cloudflare Pages Function: /api/auth/login
// Strictly enforces Google Authenticator TOTP 2FA for ADMINS ONLY.
// Regular users log in directly without 2FA.

import {
  jsonResponse,
  errorResponse,
  handleOptions,
  verifyPassword,
  createJWT,
} from '../utils.js'
import {
  generateSecretBase32,
  encryptSecret,
  getOTPAuthURI,
  generateBackupCodes,
  hashBackupCode,
} from '../utils/totp.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const { identifier, password, website_bot_trap_check, human_verified } = body

    // 1. Anti-Bot Trap Defense
    if (website_bot_trap_check && String(website_bot_trap_check).trim().length > 0) {
      return errorResponse('Automated bot request blocked by Edge Security.', 403)
    }

    if (human_verified === false) {
      return errorResponse('Please complete the interactive human verification check before logging in.', 400)
    }

    if (!identifier || !password) {
      return errorResponse('Email/Username and Password are required.', 400)
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase()

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    // Look up user by email or username
    const user = await env.DB.prepare(
      `SELECT id, username, email, password_hash, salt, role, full_name, phone, avatar, balance, status,
              two_factor_secret, two_factor_enabled, two_factor_confirmed_at,
              two_factor_failed_attempts, two_factor_locked_until
       FROM users
       WHERE email = ? OR username = ?`
    )
      .bind(cleanIdentifier, cleanIdentifier)
      .first()

    if (!user) {
      return errorResponse('Invalid email/username or password.', 401)
    }

    if (user.status === 'banned') {
      return errorResponse('This account has been suspended by an administrator. Please contact support.', 403)
    }

    // Verify master password against salt and stored PBKDF2 hash
    const isValid = await verifyPassword(password, user.salt, user.password_hash)
    if (!isValid) {
      return errorResponse('Invalid email/username or password.', 401)
    }

    // Master Admin Whitelist: only damimehdi / admin@bleuwi.world / damimehdi20@gmail.com can have admin role
    const isMasterAdminAccount =
      (user.username && user.username.toLowerCase() === 'damimehdi') ||
      (user.email && user.email.toLowerCase() === 'admin@bleuwi.world') ||
      (user.email && user.email.toLowerCase() === 'damimehdi20@gmail.com')

    const effectiveRole = (user.role === 'admin' && isMasterAdminAccount) ? 'admin' : 'user'

    // ========================================================
    // REQUIREMENT 1: 2FA APPLIES ONLY TO MASTER ADMIN
    // Regular users log in directly without any 2FA flow!
    // ========================================================
    if (effectiveRole !== 'admin') {
      const clientIp =
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for') ||
        request.headers.get('cf-pseudo-ipv4') ||
        '127.0.0.1'

      try {
        await env.DB.prepare(
          "UPDATE users SET last_login_ip = ?, last_login_at = datetime('now') WHERE id = ?"
        )
          .bind(clientIp, user.id)
          .run()
      } catch (e) {}

      const token = await createJWT(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: 'user',
        },
        env.JWT_SECRET,
        7 * 24 * 60 * 60 // 7 days
      )

      return jsonResponse({
        success: true,
        requires2FA: false,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: 'user',
          fullName: user.full_name,
          phone: user.phone || '',
          avatar: user.avatar || '',
          balance: user.balance || 0,
          status: user.status,
        },
        message: 'Logged in successfully.',
      })
    }

    // ========================================================
    // ADMIN 2FA FLOW: Google Authenticator (TOTP)
    // ========================================================

    // 1. Check Rate Limit / 15-Minute Account Lock
    if (user.two_factor_locked_until) {
      const lockExpiry = new Date(user.two_factor_locked_until).getTime()
      if (Date.now() < lockExpiry) {
        const remainingMinutes = Math.max(1, Math.ceil((lockExpiry - Date.now()) / 60000))
        return errorResponse(
          `Security Alert: Too many failed 2FA attempts. Account locked for ${remainingMinutes} more minute(s).`,
          429
        )
      } else {
        // Lock expired -> reset counters
        await env.DB.prepare(
          'UPDATE users SET two_factor_failed_attempts = 0, two_factor_locked_until = NULL WHERE id = ?'
        )
          .bind(user.id)
          .run()
      }
    }

    // Issue signed pre-auth token (expires in 5 minutes)
    const preAuthToken = await createJWT(
      {
        id: user.id,
        isPreAuth: true,
      },
      env.JWT_SECRET,
      300 // 5 minutes
    )

    const isConfirmed = user.two_factor_enabled === 1 && user.two_factor_confirmed_at != null && user.two_factor_secret

    // 2. RETURNING ADMIN LOGIN (2FA already confirmed)
    if (isConfirmed) {
      // NEVER expose secret or QR code in API response after initial setup!
      return jsonResponse({
        success: true,
        requires2FA: true,
        isFirstTimeSetup: false,
        preAuthToken,
        message: 'Please enter the 6-digit code from your Google Authenticator app.',
      })
    }

    // 3. FIRST-TIME SETUP FLOW (Show QR code, manual backup key, and 8 backup codes)
    const plainSecret = generateSecretBase32(20) // 32 characters Base32
    const encryptedSecret = await encryptSecret(plainSecret, env.JWT_SECRET)

    // Generate 8 one-time backup recovery codes
    const backupCodes = generateBackupCodes(8)
    const hashedBackupCodes = await Promise.all(backupCodes.map((c) => hashBackupCode(c)))

    // Save encrypted pending secret and hashed backup codes in database
    await env.DB.prepare(
      `UPDATE users 
       SET two_factor_secret = ?,
           two_factor_backup_codes = ?,
           two_factor_enabled = 0,
           two_factor_confirmed_at = NULL,
           two_factor_failed_attempts = 0
       WHERE id = ?`
    )
      .bind(encryptedSecret, JSON.stringify(hashedBackupCodes), user.id)
      .run()

    const otpAuthUri = getOTPAuthURI(user.email, plainSecret, 'BLEUWI WORLD')
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(otpAuthUri)}`

    return jsonResponse({
      success: true,
      requires2FA: true,
      isFirstTimeSetup: true,
      preAuthToken,
      secret: plainSecret,
      backupCodes,
      otpAuthUri,
      qrCodeUrl,
      message: 'First-time setup: Scan QR code with Google Authenticator and save your 8 backup recovery codes.',
    })
  } catch (err) {
    return errorResponse(err.message || 'Internal server error during login', 500)
  }
}
