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
    // Strict Guard: ONLY role=admin is allowed into admin dashboard
    if (!authUser || authUser.role !== 'admin') {
      return errorResponse('Forbidden: Unauthorized administrator access', 403)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    // 1. Real Unique Visitors, Unique IPs & Clicks from site_analytics
    const uniqueVisitors = await env.DB.prepare(
      'SELECT COUNT(DISTINCT ip_hash) as count FROM site_analytics WHERE event_type = "pageview"'
    ).first()

    const uniqueIps = await env.DB.prepare(
      'SELECT COUNT(DISTINCT COALESCE(ip_address, ip_hash)) as count FROM site_analytics'
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
      'SELECT id, order_number, customer_name, customer_phone, customer_email, customer_ip, country, total_price, currency, status, created_at FROM orders ORDER BY created_at DESC LIMIT 15'
    ).all()

    const totalUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first()

    // 3. Pro Real-Time Visitor Logs (with IP, Country, User Name, Device)
    const recentVisitors = await env.DB.prepare(
      `SELECT id, event_type, page_path, ip_address, country, city, user_name, user_agent, created_at 
       FROM site_analytics 
       ORDER BY created_at DESC 
       LIMIT 50`
    ).all()

    // 4. Country distribution breakdown
    const topCountries = await env.DB.prepare(
      `SELECT country, COUNT(*) as count 
       FROM site_analytics 
       WHERE country IS NOT NULL AND country != '' 
       GROUP BY country 
       ORDER BY count DESC 
       LIMIT 8`
    ).all()

    return jsonResponse({
      success: true,
      stats: {
        totalVisitors: uniqueVisitors?.count || 0,
        totalUniqueIps: uniqueIps?.count || 0,
        totalClicks: totalClicks?.count || 0,
        totalPageviews: totalPageviews?.count || 0,
        totalOrders: totalOrders?.count || 0,
        pendingOrders: pendingOrders?.count || 0,
        completedRevenueMad: revenueMad?.sum || 0,
        totalUsers: totalUsers?.count || 1,
      },
      recentOrders: recentOrders?.results || [],
      recentVisitors: recentVisitors?.results || [],
      topCountries: topCountries?.results || [],
    })
  } catch (err) {
    return errorResponse(err.message || 'Error fetching real admin stats', 500)
  }
}
