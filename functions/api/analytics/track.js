// Cloudflare Pages Function: /api/analytics/track
import { jsonResponse, handleOptions } from '../utils.js'

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

    const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // Hash IP for unique visitor privacy
    const enc = new TextEncoder()
    const ipHashBuf = await crypto.subtle.digest('SHA-256', enc.encode(`${clientIp}_${userAgent}`))
    const ipHash = Array.from(new Uint8Array(ipHashBuf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)

    const eventId = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    await env.DB.prepare(
      'INSERT INTO site_analytics (id, event_type, page_path, ip_hash) VALUES (?, ?, ?, ?)'
    )
      .bind(eventId, eventType, pagePath.slice(0, 100), ipHash)
      .run()

    return jsonResponse({ success: true })
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 200)
  }
}
