// Cloudflare Pages Function: /api/admin/stats (100% Real Analytics, No Fake Data)
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  getAuthUser,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestGet({ request, env }) {
  try {
    const authUser = await getAuthUser(request, env)
    // Strict Guard: ONLY damimehdi20@gmail.com is allowed into admin dashboard
    if (!authUser || authUser.email.toLowerCase() !== 'damimehdi20@gmail.com') {
      return errorResponse('Forbidden: Unauthorized administrator access', 403)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    // 1. Real Unique Visitors & Real Clicks from site_analytics
    const uniqueVisitors = await env.DB.prepare(
      'SELECT COUNT(DISTINCT ip_hash) as count FROM site_analytics WHERE event_type = "pageview"'
    ).first()

    const totalClicks = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM site_analytics WHERE event_type = "click"'
    ).first()

    const totalPageviews = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM site_analytics WHERE event_type = "pageview"'
    ).first()

    // 2. Real Orders from actual customers
    const totalOrders = await env.DB.prepare('SELECT COUNT(*) as count FROM orders').first()
    const pendingOrders = await env.DB.prepare('SELECT COUNT(*) as count FROM orders WHERE status = "pending"').first()
    const revenueMad = await env.DB.prepare('SELECT SUM(total_price) as sum FROM orders WHERE status = "completed" AND currency = "MAD"').first()

    const recentOrders = await env.DB.prepare(
      'SELECT id, order_number, customer_name, customer_phone, total_price, currency, status, created_at FROM orders ORDER BY created_at DESC LIMIT 10'
    ).all()

    const totalUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first()

    return jsonResponse({
      success: true,
      stats: {
        totalVisitors: uniqueVisitors?.count || 0,
        totalClicks: totalClicks?.count || 0,
        totalPageviews: totalPageviews?.count || 0,
        totalOrders: totalOrders?.count || 0,
        pendingOrders: pendingOrders?.count || 0,
        completedRevenueMad: revenueMad?.sum || 0,
        totalUsers: totalUsers?.count || 1,
      },
      recentOrders: recentOrders?.results || [],
    })
  } catch (err) {
    return errorResponse(err.message || 'Error fetching real admin stats', 500)
  }
}
