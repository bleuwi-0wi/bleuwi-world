// Cloudflare Pages Function: /api/analytics/track (Pro Real-Time Visitor & IP Analytics)
import { jsonResponse, handleOptions, getAuthUser } from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env || !env.DB) {
      return jsonResponse({ success: false }, 200)
    }

    const body = await request.json().catch(() => ({}))
    const { eventType = 'pageview', pagePath = '/', referrer = '' } = body

    // Real client IP and Geolocation from Cloudflare Edge headers
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1'

    const country = request.headers.get('cf-ipcountry') || 'MA'
    const city = request.headers.get('cf-ipcity') || ''
    const userAgent = request.headers.get('user-agent') || ''

    // Detect if user is authenticated
    let userName = body.userName || body.user_name || null
    if (!userName) {
      try {
        const authUser = await getAuthUser(request, env)
        if (authUser) {
          userName = authUser.username || authUser.full_name || authUser.email
        }
      } catch (e) {}
    }

    // IP hash for quick unique counts
    const enc = new TextEncoder()
    const ipHashBuf = await crypto.subtle.digest('SHA-256', enc.encode(`${clientIp}_${userAgent}`))
    const ipHash = Array.from(new Uint8Array(ipHashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16)

    const eventId = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    await env.DB.prepare(
      `INSERT INTO site_analytics 
       (id, event_type, page_path, ip_hash, ip_address, country, city, user_name, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        eventId,
        eventType,
        pagePath.slice(0, 100),
        ipHash,
        clientIp,
        country,
        city,
        userName ? String(userName).slice(0, 60) : null,
        userAgent.slice(0, 200)
      )
      .run()

    return jsonResponse({ success: true, ip: clientIp, country })
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 200)
  }
}
