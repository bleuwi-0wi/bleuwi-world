// Anti-Spam & Rate Limiter for WhatsApp Order Submissions
// Limits max orders to 10 per day per user/device and enforces a 15-second cooldown

const STORAGE_KEY = 'bleuwi_order_rate_limit'
export const MAX_ORDERS_PER_DAY = 10
export const COOLDOWN_SECONDS = 15

export function getTodayDateKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Returns current rate limit status
 */
export function getOrderRateLimitStatus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const today = getTodayDateKey()

    if (!raw) {
      return {
        allowed: true,
        count: 0,
        max: MAX_ORDERS_PER_DAY,
        remaining: MAX_ORDERS_PER_DAY,
        cooldownRemaining: 0,
        isDailyLimitReached: false,
      }
    }

    const data = JSON.parse(raw)

    // Reset if it's a new day
    if (data.date !== today) {
      return {
        allowed: true,
        count: 0,
        max: MAX_ORDERS_PER_DAY,
        remaining: MAX_ORDERS_PER_DAY,
        cooldownRemaining: 0,
        isDailyLimitReached: false,
      }
    }

    const count = typeof data.count === 'number' ? data.count : 0
    const now = Date.now()
    const lastOrder = typeof data.lastOrderTimestamp === 'number' ? data.lastOrderTimestamp : 0
    const diffSec = Math.floor((now - lastOrder) / 1000)
    const cooldownRemaining = diffSec < COOLDOWN_SECONDS ? COOLDOWN_SECONDS - diffSec : 0

    const isDailyLimitReached = count >= MAX_ORDERS_PER_DAY
    const remaining = Math.max(0, MAX_ORDERS_PER_DAY - count)
    const allowed = !isDailyLimitReached && cooldownRemaining === 0

    return {
      allowed,
      count,
      max: MAX_ORDERS_PER_DAY,
      remaining,
      cooldownRemaining,
      isDailyLimitReached,
    }
  } catch (err) {
    return {
      allowed: true,
      count: 0,
      max: MAX_ORDERS_PER_DAY,
      remaining: MAX_ORDERS_PER_DAY,
      cooldownRemaining: 0,
      isDailyLimitReached: false,
    }
  }
}

/**
 * Records an order submission to prevent spamming
 */
export function recordOrderSubmission() {
  try {
    const today = getTodayDateKey()
    const current = getOrderRateLimitStatus()
    const updated = {
      date: today,
      count: current.count + 1,
      lastOrderTimestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (err) {
    console.warn('Could not save order rate limit:', err)
  }
}
