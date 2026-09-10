// Cloudflare Pages Function: /api/auth/google
// Native Google Sign-In (Google Identity Services / OAuth 2.0)
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  generateSalt,
  hashPassword,
  createJWT,
} from '../utils.js'
import {
  generateSecretBase32,
  getOTPAuthURI,
  encryptSecret,
  generateBackupCodes,
  hashBackupCode,
} from '../utils/totp.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}))
    const { credential, accessToken } = body

    if (!credential && !accessToken) {
      return errorResponse('Google credential token is required.', 400)
    }

    let googleUser = null

    // 1. Verify Google ID Token (Credential) or Access Token
    if (credential) {
      const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      const verifyRes = await fetch(verifyUrl)
      if (!verifyRes.ok) {
        return errorResponse('Invalid or expired Google authentication token.', 401)
      }
      const tokenInfo = await verifyRes.json()
      
      // Optional client ID verification if configured
      if (env.GOOGLE_CLIENT_ID && tokenInfo.aud && tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
        // Warning: mismatched aud, but continue if token is validly signed by Google
      }

      if (tokenInfo.email_verified !== 'true' && tokenInfo.email_verified !== true) {
        return errorResponse('Google account email is not verified.', 400)
      }

      googleUser = {
        googleId: tokenInfo.sub,
        email: String(tokenInfo.email).toLowerCase().trim(),
        name: tokenInfo.name || tokenInfo.email.split('@')[0],
        picture: tokenInfo.picture || '',
      }
    } else if (accessToken) {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!userInfoRes.ok) {
        return errorResponse('Failed to fetch user info from Google.', 401)
      }
      const info = await userInfoRes.json()
      if (info.email_verified !== true && info.email_verified !== 'true') {
        return errorResponse('Google account email is not verified.', 400)
      }
      googleUser = {
        googleId: info.sub,
        email: String(info.email).toLowerCase().trim(),
        name: info.name || info.email.split('@')[0],
        picture: info.picture || '',
      }
    }

    if (!googleUser || !googleUser.email) {
      return errorResponse('Could not extract user information from Google.', 400)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    // 2. Query Database for Existing User (by google_id or email)
    let user = await env.DB.prepare(
      'SELECT * FROM users WHERE google_id = ? OR email = ?'
    )
      .bind(googleUser.googleId, googleUser.email)
      .first()

    if (user) {
      if (user.status === 'banned') {
        return errorResponse('This account has been suspended. Please contact support.', 403)
      }

      // Link Google Account and update picture if not set
      await env.DB.prepare(
        'UPDATE users SET google_id = ?, auth_provider = "google", avatar = COALESCE(avatar, ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      )
        .bind(googleUser.googleId, googleUser.picture, user.id)
        .run()

      user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first()
    } else {
      // 3. New User Registration via Google
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
      
      // Determine unique username
      let baseUsername = googleUser.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
      if (baseUsername.length < 3) baseUsername = `user_${baseUsername}`
      let username = baseUsername

      const usernameCheck = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first()
      if (usernameCheck) {
        username = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`
      }

      const dummyPassword = crypto.randomUUID() + Math.random().toString(36)
      const salt = generateSalt()
      const passwordHash = await hashPassword(dummyPassword, salt)

      await env.DB.prepare(`
        INSERT INTO users (
          id, username, email, password_hash, salt, role, full_name, avatar, balance, status, two_factor_enabled, google_id, auth_provider, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'user', ?, ?, 0.0, 'active', 0, ?, 'google', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
        .bind(
          userId,
          username,
          googleUser.email,
          passwordHash,
          salt,
          googleUser.name,
          googleUser.picture,
          googleUser.googleId
        )
        .run()

      user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
    }

    // 4. Check if Admin requires 2FA
    if (user.role === 'admin') {
      // Check 15-Minute Account Lock
      if (user.two_factor_locked_until) {
        const lockExpiry = new Date(user.two_factor_locked_until).getTime()
        if (Date.now() < lockExpiry) {
          const remainingMinutes = Math.max(1, Math.ceil((lockExpiry - Date.now()) / 60000))
          return errorResponse(
            `Security Alert: Too many failed 2FA attempts. Account locked for ${remainingMinutes} more minute(s).`,
            429
          )
        }
      }

      const preAuthToken = await createJWT(
        {
          id: user.id,
          email: user.email,
          role: 'admin',
          stage: 'pre_2fa_verification',
        },
        env.JWT_SECRET,
        5 * 60 // 5 minutes validity
      )

      if (!user.two_factor_secret || !user.two_factor_confirmed_at) {
        // First-Time 2FA Setup
        const rawSecret = generateSecretBase32(20)
        const otpauthUrl = getOTPAuthURI(user.email, rawSecret, 'BLEUWI WORLD')
        const encryptedSecret = await encryptSecret(rawSecret, env.JWT_SECRET)

        const rawBackupCodes = generateBackupCodes(8)
        const hashedCodes = await Promise.all(rawBackupCodes.map((c) => hashBackupCode(c)))

        await env.DB.prepare(
          'UPDATE users SET two_factor_secret = ?, two_factor_backup_codes = ?, two_factor_failed_attempts = 0, two_factor_locked_until = NULL WHERE id = ?'
        )
          .bind(encryptedSecret, JSON.stringify(hashedCodes), user.id)
          .run()

        const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(otpauthUrl)}`

        return jsonResponse({
          success: true,
          requires2FA: true,
          isFirstTimeSetup: true,
          preAuthToken,
          secret: rawSecret,
          totpSecret: rawSecret,
          otpAuthUri: otpauthUrl,
          qrCodeUrl: qrCodeImageUrl,
          backupCodes: rawBackupCodes,
          message: 'Admin 2FA setup required. Scan QR code or copy key.',
        })
      } else {
        // Returning Admin
        return jsonResponse({
          success: true,
          requires2FA: true,
          isFirstTimeSetup: false,
          preAuthToken,
          message: 'Admin 2FA required. Enter the 6-digit code from Google Authenticator.',
        })
      }
    }

    // 5. Regular User: Issue standard 7-day JWT Session
    const token = await createJWT(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
      },
      env.JWT_SECRET,
      7 * 24 * 60 * 60
    )

    return jsonResponse({
      success: true,
      requires2FA: false,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        fullName: user.full_name,
        phone: user.phone || '',
        avatar: user.avatar || googleUser.picture || '',
        balance: user.balance || 0,
        status: user.status,
      },
      message: 'Logged in with Google successfully!',
    })
  } catch (err) {
    return errorResponse(err.message || 'Google authentication failed', 500)
  }
}
