// Cloudflare Pages Function: /api/auth/resend-2fa
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  verifyJWT,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const { preAuthToken } = body

    if (!preAuthToken) {
      return errorResponse('preAuthToken is required', 400)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const payload = await verifyJWT(preAuthToken, env.JWT_SECRET)
    if (!payload || !payload.id || !payload.isPreAuth) {
      return errorResponse('2FA session expired. Please sign in again.', 401)
    }

    const user = await env.DB.prepare('SELECT id, email, phone FROM users WHERE id = ?')
      .bind(payload.id)
      .first()

    if (!user) {
      return errorResponse('User not found', 404)
    }

    const newCode = String(Math.floor(100000 + Math.random() * 900000))
    const codeId = `2fa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    await env.DB.prepare('DELETE FROM two_factor_codes WHERE user_id = ?').bind(user.id).run()

    await env.DB.prepare(
      `INSERT INTO two_factor_codes (id, user_id, code, channel, destination, attempts, expires_at)
       VALUES (?, ?, ?, 'email', ?, 0, datetime('now', '+5 minutes'))`
    )
      .bind(codeId, user.id, newCode, user.email)
      .run()

    return jsonResponse({
      success: true,
      code: newCode,
      message: 'New 6-digit verification code sent!',
    })
  } catch (err) {
    return errorResponse(err.message || 'Error resending 2FA code', 500)
  }
}
