// Cloudflare Pages Function: /api/admin/orders
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  getAuthUser,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

// GET /api/admin/orders - list all customer orders
export async function onRequestGet({ request, env }) {
  try {
    const authUser = await getAuthUser(request, env)
    if (!authUser || authUser.email.toLowerCase() !== 'damimehdi20@gmail.com') {
      return errorResponse('Forbidden: Unauthorized admin access', 403)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || ''

    let query = 'SELECT * FROM orders'
    let results

    if (status && ['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      query += ' WHERE status = ? ORDER BY created_at DESC'
      results = await env.DB.prepare(query).bind(status).all()
    } else {
      query += ' ORDER BY created_at DESC'
      results = await env.DB.prepare(query).all()
    }

    return jsonResponse({
      success: true,
      orders: results?.results || [],
    })
  } catch (err) {
    return errorResponse(err.message || 'Error listing orders', 500)
  }
}

// PATCH /api/admin/orders - update status or notes
export async function onRequestPatch({ request, env }) {
  try {
    const authUser = await getAuthUser(request, env)
    if (!authUser || authUser.email.toLowerCase() !== 'damimehdi20@gmail.com') {
      return errorResponse('Forbidden: Unauthorized admin access', 403)
    }

    const body = await request.json()
    const { orderId, status, notes } = body

    if (!orderId) {
      return errorResponse('orderId is required', 400)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const updates = []
    const params = []

    if (status && ['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      updates.push('status = ?')
      params.push(status)
    }
    if (notes !== undefined) {
      updates.push('notes = ?')
      params.push(String(notes))
    }

    if (updates.length === 0) {
      return errorResponse('No valid fields to update', 400)
    }

    params.push(orderId)
    const sql = `UPDATE orders SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`

    await env.DB.prepare(sql).bind(...params).run()

    return jsonResponse({
      success: true,
      message: 'Order updated successfully',
    })
  } catch (err) {
    return errorResponse(err.message || 'Error updating order', 500)
  }
}
