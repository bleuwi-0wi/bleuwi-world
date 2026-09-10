// RFC 6238 Standard TOTP (Google Authenticator) Engine with AES-GCM Encryption
// Built for Cloudflare V8 Workers / Pages Functions using WebCrypto API (zero third-party dependencies)

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Generate a cryptographically secure Base32 secret for Google Authenticator (default: 20 bytes -> 32 characters)
 */
export function generateSecretBase32(byteLength = 20) {
  const randomBytes = crypto.getRandomValues(new Uint8Array(byteLength))
  let bits = ''
  for (let i = 0; i < randomBytes.length; i++) {
    bits += randomBytes[i].toString(2).padStart(8, '0')
  }
  let base32 = ''
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5)
    if (chunk.length < 5) {
      base32 += BASE32_CHARS[parseInt(chunk.padEnd(5, '0'), 2)]
    } else {
      base32 += BASE32_CHARS[parseInt(chunk, 2)]
    }
  }
  return base32
}

/**
 * Decode Base32 string to Uint8Array bytes
 */
export function base32ToBytes(base32) {
  let bits = ''
  const clean = String(base32).toUpperCase().replace(/=+$/, '').replace(/\s+/g, '')
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_CHARS.indexOf(clean[i])
    if (val === -1) continue
    bits += val.toString(2).padStart(5, '0')
  }
  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2))
  }
  return new Uint8Array(bytes)
}

/**
 * Constant-time comparison between two strings to prevent timing attacks
 */
export function timingSafeEqualString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const enc = new TextEncoder()
  const bufA = enc.encode(a)
  const bufB = enc.encode(b)
  if (bufA.byteLength !== bufB.byteLength) return false
  let mismatch = 0
  for (let i = 0; i < bufA.byteLength; i++) {
    mismatch |= bufA[i] ^ bufB[i]
  }
  return mismatch === 0
}

/**
 * Encrypt plain TOTP secret using AES-GCM-256 before saving to database
 */
export async function encryptSecret(plainSecret, masterKey) {
  if (!plainSecret) return null
  const enc = new TextEncoder()
  const keyDigest = await crypto.subtle.digest('SHA-256', enc.encode(masterKey))
  const key = await crypto.subtle.importKey('raw', keyDigest, { name: 'AES-GCM' }, false, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plainSecret))

  const combined = new Uint8Array(iv.length + cipher.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(cipher), iv.length)

  // Encode to Base64
  let binary = ''
  for (let i = 0; i < combined.length; i++) {
    binary += String.fromCharCode(combined[i])
  }
  return btoa(binary)
}

/**
 * Decrypt stored AES-GCM-256 secret from database
 */
export async function decryptSecret(cipherBase64, masterKey) {
  if (!cipherBase64) return null
  try {
    const enc = new TextEncoder()
    const keyDigest = await crypto.subtle.digest('SHA-256', enc.encode(masterKey))
    const key = await crypto.subtle.importKey('raw', keyDigest, { name: 'AES-GCM' }, false, ['decrypt'])
    const binary = atob(cipherBase64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const iv = bytes.slice(0, 12)
    const cipher = bytes.slice(12)
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
    return new TextDecoder().decode(decrypted)
  } catch (err) {
    return null
  }
}

/**
 * Compute 6-digit TOTP code for a given 30-second time window (RFC 6238 HMAC-SHA1)
 */
export async function computeTOTP(secretBase32, timeStep = Math.floor(Date.now() / 1000 / 30)) {
  const keyBytes = base32ToBytes(secretBase32)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )

  const timeBuffer = new ArrayBuffer(8)
  const view = new DataView(timeBuffer)
  view.setUint32(0, Math.floor(timeStep / 0x100000000), false)
  view.setUint32(4, timeStep & 0xffffffff, false)

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, timeBuffer)
  const hmac = new Uint8Array(signature)
  const offset = hmac[hmac.length - 1] & 0x0f
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return (binary % 1000000).toString().padStart(6, '0')
}

/**
 * Verify Google Authenticator code against current timestamp with clock drift window (+/- 30s)
 * Uses constant-time comparison to prevent timing side-channel attacks.
 */
export async function verifyTOTP(secretBase32, userCode, window = 1) {
  const cleanCode = String(userCode).trim()
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) return false

  const currentStep = Math.floor(Date.now() / 1000 / 30)
  for (let i = -window; i <= window; i++) {
    const step = currentStep + i
    const validCode = await computeTOTP(secretBase32, step)
    if (timingSafeEqualString(validCode, cleanCode)) {
      return true
    }
  }
  return false
}

/**
 * Build standard otpauth:// URI for Google Authenticator QR Code
 */
export function getOTPAuthURI(email, secretBase32, issuer = 'BLEUWI WORLD') {
  const cleanIssuer = encodeURIComponent(issuer)
  const cleanEmail = encodeURIComponent(email)
  return `otpauth://totp/${cleanIssuer}:${cleanEmail}?secret=${secretBase32}&issuer=${cleanIssuer}&algorithm=SHA1&digits=6&period=30`
}

/**
 * Generate 8 one-time backup recovery codes formatted as XXXX-XXXX
 */
export function generateBackupCodes(count = 8) {
  const codes = []
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  for (let i = 0; i < count; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(8))
    let code = ''
    for (let j = 0; j < 8; j++) {
      code += alphabet[bytes[j] % alphabet.length]
    }
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}

/**
 * Hash a backup code using SHA-256 for secure database storage
 */
export async function hashBackupCode(code) {
  const enc = new TextEncoder()
  const clean = String(code).trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(clean))
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

