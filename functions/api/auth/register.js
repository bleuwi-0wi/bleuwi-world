// Cloudflare Pages Function: /api/auth/register
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  generateSalt,
  hashPassword,
  createJWT,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const { username, email, password, fullName, phone, website_bot_trap_check, human_verified } = body

    // 1. Anti-Bot Defense: Honeypot & Human Verification Check
    if (website_bot_trap_check && String(website_bot_trap_check).trim().length > 0) {
      return errorResponse('Automated bot request blocked by Edge Security.', 403)
    }

    if (human_verified === false) {
      return errorResponse('Please complete the interactive human verification check before signing up.', 400)
    }

    if (!username || !email || !password || !fullName) {
      return errorResponse('All required fields (username, email, password, fullName) must be provided.', 400)
    }

    const cleanUsername = String(username).trim().toLowerCase()
    const cleanEmail = String(email).trim().toLowerCase()
    const cleanFullName = String(fullName).trim()
    const cleanPhone = phone ? String(phone).trim() : ''

    // 2. Maximum Security Protection: Whitelist & Master Account Protection
    // Under NO circumstances can anyone register the master admin username or email!
    if (cleanUsername === 'damimehdi' || cleanEmail === 'admin@bleuwi.world' || cleanUsername.includes('admin') || cleanUsername.includes('bleuwi')) {
      return errorResponse('This username or email is reserved for system administration. Public registration is forbidden.', 403)
    }

    if (cleanUsername.length < 3) {
      return errorResponse('Username must be at least 3 characters long.', 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return errorResponse('Please provide a valid email address.', 400)
    }

    if (String(password).length < 6) {
      return errorResponse('Password must be at least 6 characters long.', 400)
    }

    // Check if D1 database is attached
    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured in this environment.', 500)
    }

    // Check existing email or username
    const existing = await env.DB.prepare(
      'SELECT id, username, email FROM users WHERE email = ? OR username = ?'
    )
      .bind(cleanEmail, cleanUsername)
      .first()

    if (existing) {
      if (existing.email === cleanEmail) {
        return errorResponse('An account with this email address already exists.', 409)
      }
      if (existing.username === cleanUsername) {
        return errorResponse('This username is already taken. Please choose another.', 409)
      }
    }

    // Hash password with cryptographically secure salt
    const salt = generateSalt(16)
    const passwordHash = await hashPassword(password, salt)
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Public registrations are ALWAYS strictly 'user' - never allow admin escalation
    const role = 'user'

    // Insert user into D1
    await env.DB.prepare(
      `INSERT INTO users (id, username, email, password_hash, salt, role, full_name, phone, balance, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        userId,
        cleanUsername,
        cleanEmail,
        passwordHash,
        salt,
        role,
        cleanFullName,
        cleanPhone,
        0.0,
        'active'
      )
      .run()

    // Create session token
    const token = await createJWT(
      {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        role,
      },
      env.JWT_SECRET
    )

    const user = {
      id: userId,
      username: cleanUsername,
      email: cleanEmail,
      role,
      fullName: cleanFullName,
      phone: cleanPhone,
      balance: 0.0,
      status: 'active',
    }

    return jsonResponse({
      success: true,
      message: 'Account created successfully!',
      token,
      user,
    }, 201)
  } catch (err) {
    return errorResponse(err.message || 'Internal server error during registration', 500)
  }
}
