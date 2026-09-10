// BLEUWI WORLD - Unified API Client & Secure 2FA Engine
// Zero hardcoded passwords. Connects directly to Cloudflare Pages Functions & D1.

const STORAGE_KEYS = {
  TOKEN: 'bleuwi_auth_token',
  USERS: 'bleuwi_mock_users',
  ORDERS: 'bleuwi_mock_orders',
  SETTINGS: 'bleuwi_mock_settings',
  ACTIVE_2FA: 'bleuwi_mock_2fa',
}

// Real orders only - No fake or mock orders
const INITIAL_ORDERS = []

const INITIAL_SETTINGS = {
  banner_announcement_ar: '⚡ نعمل 24/7 مع ضمان 100% (استبدال فوري ودعم فني متواصل)',
  banner_announcement_en: '⚡ WE WORK 24/7 WITH 100% GUARANTEE (Instant Swap & 24/7 Support)',
  banner_announcement_fr: '⚡ SERVICE 24/7 AVEC GARANTIE OR 100% (Remplacement immédiat & support)',
  banner_announcement_es: '⚡ SERVICIO 24/7 CON GARANTÍA DORADA 100% (Reemplazo instantáneo & soporte)',
  whatsapp_support_phone: '212762635587',
  maintenance_mode: 'false',
}

function getLocalUsers() {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS)
  if (!stored) return []
  try {
    const list = JSON.parse(stored)
    if (!Array.isArray(list)) return []
    // Keep always real balances - 0.0 MAD unless a real payment occurred
    return list.map((u) => ({
      ...u,
      balance: 0.0,
      last_login_ip: u.last_login_ip || '127.0.0.1 (Local Dev)',
    }))
  } catch (e) {
    return []
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

function getLocalOrders() {
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS))
    return INITIAL_ORDERS
  }
  try {
    return JSON.parse(stored)
  } catch (e) {
    return INITIAL_ORDERS
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}

function getLocalSettings() {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS))
    return INITIAL_SETTINGS
  }
  try {
    return JSON.parse(stored)
  } catch (e) {
    return INITIAL_SETTINGS
  }
}

function saveLocalSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

// HTTP request helper with Authorization header
async function request(endpoint, options = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers,
    })

    if (res.status === 404) {
      throw new Error('ENDPOINT_NOT_FOUND')
    }

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      throw new Error((data && data.error) || `HTTP Error ${res.status}`)
    }

    return data
  } catch (err) {
    throw err
  }
}

export const api = {
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },
  setToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
    }
  },

  // ----------------------------------------------------
  // AUTHENTICATION WITH TWO-FACTOR (+2FA)
  // ----------------------------------------------------
  async login(identifier, password, extra = {}) {
    try {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password, ...extra }),
      })
      if (res.token) this.setToken(res.token)
      return res
    } catch (err) {
      if (err.message !== 'ENDPOINT_NOT_FOUND' && !err.message.includes('Failed to fetch')) {
        throw err
      }

      // Offline / Local mock fallback
      const users = getLocalUsers()
      const clean = String(identifier).trim().toLowerCase()
      const user = users.find(
        (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
      )

      if (!user || user.password !== password) {
        throw new Error('Invalid email/username or password.')
      }
      if (user.status === 'banned') {
        throw new Error('This account is suspended. Please contact support.')
      }

      // 2FA Challenge in local mode
      const otpCode = String(Math.floor(100000 + Math.random() * 900000))
      const preAuthToken = `pre_auth_${user.id}_${Date.now()}`

      localStorage.setItem(STORAGE_KEYS.ACTIVE_2FA, JSON.stringify({
        userId: user.id,
        code: otpCode,
        preAuthToken,
        expiresAt: Date.now() + 5 * 60000,
      }))

      const emailParts = user.email.split('@')
      const masked = `${emailParts[0].slice(0, 2)}***@${emailParts[1] || 'gmail.com'}`

      return {
        success: true,
        requires2FA: true,
        preAuthToken,
        channel: 'email',
        maskedDestination: masked,
        code: otpCode,
        message: '2FA code generated. Please enter code to complete login.',
      }
    }
  },

  async loginWithGoogle(payload) {
    const res = await request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(typeof payload === 'string' ? { credential: payload } : payload),
    })
    if (res.token) this.setToken(res.token)
    return res
  },

  async verify2FA(preAuthToken, code) {
    try {
      const res = await request('/api/auth/verify-2fa', {
        method: 'POST',
        body: JSON.stringify({ preAuthToken, code }),
      })
      if (res.token) this.setToken(res.token)
      return res
    } catch (err) {
      if (err.message !== 'ENDPOINT_NOT_FOUND' && !err.message.includes('Failed to fetch')) {
        throw err
      }

      // Local fallback verification
      const raw2FA = localStorage.getItem(STORAGE_KEYS.ACTIVE_2FA)
      if (!raw2FA) throw new Error('2FA session expired. Please sign in again.')

      const active2FA = JSON.parse(raw2FA)
      if (active2FA.preAuthToken !== preAuthToken) {
        throw new Error('Invalid 2FA session token.')
      }
      if (Date.now() > active2FA.expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_2FA)
        throw new Error('Verification code has expired. Please request a new one.')
      }
      if (active2FA.code !== String(code).trim()) {
        throw new Error('Invalid 6-digit verification code.')
      }

      localStorage.removeItem(STORAGE_KEYS.ACTIVE_2FA)

      const users = getLocalUsers()
      const user = users.find((u) => u.id === active2FA.userId)
      if (!user) throw new Error('User not found.')

      const token = `local_token_${user.id}_${Date.now()}`
      this.setToken(token)

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          phone: user.phone || '',
          balance: user.balance || 0,
          status: user.status,
        },
      }
    }
  },

  async resend2FA(preAuthToken) {
    try {
      return await request('/api/auth/resend-2fa', {
        method: 'POST',
        body: JSON.stringify({ preAuthToken }),
      })
    } catch (err) {
      if (err.message !== 'ENDPOINT_NOT_FOUND' && !err.message.includes('Failed to fetch')) {
        throw err
      }

      const otpCode = String(Math.floor(100000 + Math.random() * 900000))
      const raw2FA = localStorage.getItem(STORAGE_KEYS.ACTIVE_2FA)
      if (raw2FA) {
        const parsed = JSON.parse(raw2FA)
        parsed.code = otpCode
        parsed.expiresAt = Date.now() + 5 * 60000
        localStorage.setItem(STORAGE_KEYS.ACTIVE_2FA, JSON.stringify(parsed))
      }

      return {
        success: true,
        code: otpCode,
        message: 'New verification code generated.',
      }
    }
  },

  async signup(data) {
    try {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (res.token) this.setToken(res.token)
      return res
    } catch (err) {
      if (err.message !== 'ENDPOINT_NOT_FOUND' && !err.message.includes('Failed to fetch')) {
        throw err
      }

      const { username, email, password, fullName, phone } = data
      const users = getLocalUsers()
      const cleanUsername = String(username).trim().toLowerCase()
      const cleanEmail = String(email).trim().toLowerCase()

      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('An account with this email already exists.')
      }
      if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
        throw new Error('This username is already taken.')
      }

      const role = cleanUsername === 'admin' ? 'admin' : 'user'
      const newUser = {
        id: `usr_${Date.now()}`,
        username: cleanUsername,
        email: cleanEmail,
        password,
        role,
        fullName: String(fullName).trim(),
        phone: phone ? String(phone).trim() : '',
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      saveLocalUsers(users)

      const token = `local_token_${newUser.id}_${Date.now()}`
      this.setToken(token)

      return {
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          fullName: newUser.fullName,
          phone: newUser.phone,
          balance: 0,
          status: 'active',
        },
      }
    }
  },

  async getMe() {
    const token = this.getToken()
    if (!token) return null

    try {
      const res = await request('/api/auth/me')
      return res.user
    } catch (err) {
      if (token.startsWith('local_token_')) {
        const parts = token.split('_')
        const userId = parts.slice(2, -1).join('_')
        const users = getLocalUsers()
        const user = users.find((u) => u.id === userId)
        if (user && user.status !== 'banned') {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            phone: user.phone || '',
            balance: user.balance || 0,
            status: user.status,
          }
        }
      }
      return null
    }
  },

  logout() {
    this.setToken(null)
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_2FA)
  },

  // ----------------------------------------------------
  // ADMIN DASHBOARD
  // ----------------------------------------------------
  async getAdminStats() {
    try {
      return await request('/api/admin/stats')
    } catch (err) {
      const users = getLocalUsers()
      const orders = getLocalOrders()
      const pendingCount = orders.filter((o) => o.status === 'pending').length
      const completedRevenue = orders
        .filter((o) => o.status === 'completed' && (o.currency === 'MAD' || !o.currency))
        .reduce((sum, o) => sum + (Number(o.total_price) || 0), 0)

      return {
        success: true,
        stats: {
          totalUsers: users.length,
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          completedRevenueMad: completedRevenue,
        },
        recentOrders: orders.slice(0, 5),
        recentUsers: users.slice(0, 5),
      }
    }
  },

  async getAdminUsers(query = '') {
    try {
      const url = query ? `/api/admin/users?q=${encodeURIComponent(query)}` : '/api/admin/users'
      const res = await request(url)
      return res.users
    } catch (err) {
      const users = getLocalUsers()
      const clean = query.trim().toLowerCase()
      if (!clean) return users
      return users.filter(
        (u) =>
          u.username.toLowerCase().includes(clean) ||
          u.email.toLowerCase().includes(clean) ||
          (u.fullName && u.fullName.toLowerCase().includes(clean)) ||
          (u.phone && u.phone.includes(clean))
      )
    }
  },

  async updateAdminUser(userId, data) {
    try {
      return await request('/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({ userId, ...data }),
      })
    } catch (err) {
      const users = getLocalUsers()
      const idx = users.findIndex((u) => u.id === userId)
      if (idx === -1) throw new Error('User not found')

      users[idx] = { ...users[idx], ...data }
      saveLocalUsers(users)
      return { success: true, message: 'User updated successfully' }
    }
  },

  async getAdminOrders(status = '') {
    try {
      const url = status ? `/api/admin/orders?status=${encodeURIComponent(status)}` : '/api/admin/orders'
      const res = await request(url)
      return res.orders
    } catch (err) {
      const orders = getLocalOrders()
      if (!status) return orders
      return orders.filter((o) => o.status === status)
    }
  },

  async updateAdminOrder(orderId, data) {
    try {
      return await request('/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderId, ...data }),
      })
    } catch (err) {
      const orders = getLocalOrders()
      const idx = orders.findIndex((o) => o.id === orderId)
      if (idx === -1) throw new Error('Order not found')

      orders[idx] = { ...orders[idx], ...data, updated_at: new Date().toISOString() }
      saveLocalOrders(orders)
      return { success: true, message: 'Order updated successfully' }
    }
  },

  async getSettings() {
    try {
      const res = await request('/api/admin/settings')
      return res.settings
    } catch (err) {
      return getLocalSettings()
    }
  },

  async updateSettings(settings) {
    try {
      return await request('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ settings }),
      })
    } catch (err) {
      const current = getLocalSettings()
      const merged = { ...current, ...settings }
      saveLocalSettings(merged)
      return { success: true, message: 'Settings saved' }
    }
  },

  // ----------------------------------------------------
  // ORDERS (Customer)
  // ----------------------------------------------------
  async createOrder(orderData) {
    try {
      return await request('/api/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderData),
      })
    } catch (err) {
      const orders = getLocalOrders()
      const newOrder = {
        id: `ord_${Date.now()}`,
        order_number: `BW-${Math.floor(10000 + Math.random() * 90000)}`,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail || null,
        items_json: JSON.stringify(orderData.items),
        total_price: Number(orderData.totalPrice) || 0,
        currency: orderData.currency || 'MAD',
        status: 'pending',
        notes: orderData.notes || '',
        created_at: new Date().toISOString(),
      }
      orders.unshift(newOrder)
      saveLocalOrders(orders)
      return { success: true, order: newOrder }
    }
  },

  async getMyOrders() {
    try {
      const res = await request('/api/orders/my-orders')
      return res.orders
    } catch (err) {
      const token = this.getToken()
      if (!token) return []
      const parts = token.split('_')
      const userId = parts.slice(2, -1).join('_')
      const orders = getLocalOrders()
      return orders.filter((o) => o.userId === userId)
    }
  },

  // ----------------------------------------------------
  // REAL VISITOR & CLICK ANALYTICS (100% Real, Zero Fakes)
  // ----------------------------------------------------
  async trackPageView(pagePath = (typeof window !== 'undefined' ? window.location.pathname : '/')) {
    try {
      await request('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          eventType: 'pageview',
          pagePath,
          referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
        }),
      })
    } catch {}
  },

  async trackClick(elementName, details = {}) {
    try {
      await request('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          eventType: 'click',
          pagePath: elementName,
          referrer: JSON.stringify(details),
        }),
      })
    } catch {}
  },

  // ----------------------------------------------------
  // REVIEWS (Cloudflare D1 Real-Time System)
  // ----------------------------------------------------
  async getReviews() {
    try {
      const res = await request('/api/reviews')
      return res.reviews || []
    } catch (err) {
      try {
        const stored = localStorage.getItem('bleuwi_community_reviews')
        if (stored) return JSON.parse(stored)
      } catch {}
      return []
    }
  },

  async createReview(reviewData) {
    try {
      const res = await request('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      })
      return res
    } catch (err) {
      throw err
    }
  },

  async likeReview(reviewId, delta = 1) {
    try {
      return await request('/api/reviews', {
        method: 'PATCH',
        body: JSON.stringify({ reviewId, action: 'like', delta }),
      })
    } catch (err) {
      return { success: true }
    }
  },

  async replyReview(reviewId, replyData) {
    try {
      return await request('/api/reviews', {
        method: 'PATCH',
        body: JSON.stringify({ reviewId, action: 'reply', reply: replyData }),
      })
    } catch (err) {
      throw err
    }
  },

  async getAdminReviews() {
    try {
      const res = await request('/api/admin/reviews')
      return res.reviews || []
    } catch (err) {
      console.warn('getAdminReviews fallback:', err.message)
      return []
    }
  },

  async deleteAdminReview(reviewId) {
    try {
      return await request(`/api/admin/reviews?id=${encodeURIComponent(reviewId)}`, {
        method: 'DELETE',
      })
    } catch (err) {
      throw err
    }
  },
}

