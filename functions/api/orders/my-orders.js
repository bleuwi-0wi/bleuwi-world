// Cloudflare Pages Function: /api/orders/my-orders
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
    if (!authUser) {
      return errorResponse('Authentication required to view order history.', 401)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const results = await env.DB.prepare(
      'SELECT id, order_number, items_json, total_price, currency, status, notes, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    )
      .bind(authUser.id)
      .all()

    return jsonResponse({
      success: true,
      orders: results?.results || [],
    })
  } catch (err) {
    return errorResponse(err.message || 'Error fetching user orders', 500)
  }
}
