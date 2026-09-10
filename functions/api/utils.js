// Cloudflare Pages Functions - Edge Cryptographic & Utility Functions
// Runs directly in Cloudflare V8 Workers Runtime

const DEFAULT_SECRET = 'bleuwi_jwt_super_secret_key_2026_production'

/**
 * Standard CORS and JSON response builder
 */
export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
  })
}

/**
 * Standard error response builder
 */
export function errorResponse(message, status = 400, extra = {}) {
  return jsonResponse(
    {
      success: false,
      error: message,
      ...extra,
    },
    status
  )
}

/**
 * Handle HTTP OPTIONS preflight for CORS
 */
export function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

/**
 * Convert ArrayBuffer to Hex String
 */
function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate cryptographically secure random salt
 */
export function generateSalt(length = 16) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bufferToHex(bytes)
}

/**
 * Hash password using Web Crypto PBKDF2 with SHA-256 (100,000 iterations)
 */
export async function hashPassword(password, salt) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )

  return bufferToHex(derivedBits)
}

/**
 * Verify plaintext password against stored salt and hash
 */
export async function verifyPassword(password, salt, storedHash) {
  const computedHash = await hashPassword(password, salt)
  return computedHash === storedHash
}

/**
 * Base64URL encode string or buffer
 */
function base64UrlEncode(input) {
  let str = ''
  if (typeof input === 'string') {
    str = btoa(unescape(encodeURIComponent(input)))
  } else {
    const bytes = new Uint8Array(input)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    str = btoa(binary)
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Base64URL decode to string
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return decodeURIComponent(escape(atob(str)))
}

/**
 * Create HMAC-SHA256 signed JWT
 */
export async function createJWT(payload, secret = DEFAULT_SECRET, expiresInSeconds = 7 * 24 * 60 * 60) {
  const enc = new TextEncoder()
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)

  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))
  const dataToSign = `${encodedHeader}.${encodedPayload}`

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(dataToSign))
  const encodedSignature = base64UrlEncode(signature)

  return `${dataToSign}.${encodedSignature}`
}

/**
 * Verify and decode HMAC-SHA256 JWT
 */
export async function verifyJWT(token, secret = DEFAULT_SECRET) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const dataToSign = `${encodedHeader}.${encodedPayload}`
  const enc = new TextEncoder()

  try {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Decode signature
    const signatureStr = atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'))
    const signatureBytes = new Uint8Array(signatureStr.length)
    for (let i = 0; i < signatureStr.length; i++) {
      signatureBytes[i] = signatureStr.charCodeAt(i)
    }

    const isValid = await crypto.subtle.verify('HMAC', cryptoKey, signatureBytes, enc.encode(dataToSign))
    if (!isValid) return null

    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null // Expired
    }

    return payload
  } catch (err) {
    return null
  }
}

/**
 * Extract authenticated user from Authorization header
 */
export async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization') || ''
  if (!authHeader.startsWith('Bearer ')) return null

  const token = authHeader.substring(7).trim()
  const secret = env.JWT_SECRET || DEFAULT_SECRET
  const payload = await verifyJWT(token, secret)
  if (!payload || !payload.id) return null

  // If Cloudflare D1 DB is available, get the latest user record
  if (env && env.DB) {
    try {
      const user = await env.DB.prepare(
        'SELECT id, username, email, role, full_name, phone, avatar, balance, status FROM users WHERE id = ?'
      )
        .bind(payload.id)
        .first()

      if (!user || user.status === 'banned') return null
      return user
    } catch (e) {
      // Fall back to token payload if DB query fails
      return payload
    }
  }

  return payload
}
