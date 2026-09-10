// Cloudflare Pages Function: /api/admin/orders
// Enforces strict Master Admin security and tracks full order completion timeline
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  requireMasterAdmin,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

// GET /api/admin/orders - list all customer orders
export async function onRequestGet({ request, env }) {
  try {
    const authUser = await requireMasterAdmin(request, env)
    if (!authUser) {
      return errorResponse('Forbidden: Master Admin privileges required', 403)
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

// PATCH /api/admin/orders - update status, mark Done & Save, and record turnaround duration
export async function onRequestPatch({ request, env }) {
  try {
    const authUser = await requireMasterAdmin(request, env)
    if (!authUser) {
      return errorResponse('Forbidden: Master Admin privileges required', 403)
    }

    const body = await request.json()
    const { orderId, status, notes, fulfillmentNotes } = body

    if (!orderId) {
      return errorResponse('orderId is required', 400)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const updates = []
    const params = []

    if (status === 'completed') {
      updates.push("status = 'completed'")
      updates.push("completed_at = datetime('now')")
      updates.push("time_to_complete_minutes = CAST(ROUND((strftime('%s', 'now') - strftime('%s', created_at)) / 60.0) AS INTEGER)")
      updates.push("completed_by = ?")
      params.push(authUser.username || 'damimehdi')

      if (fulfillmentNotes !== undefined || notes !== undefined) {
        updates.push("fulfillment_notes = ?")
        params.push(String(fulfillmentNotes !== undefined ? fulfillmentNotes : notes))
      }
    } else if (status && ['pending', 'processing', 'cancelled'].includes(status)) {
      updates.push('status = ?')
      params.push(status)
      if (notes !== undefined) {
        updates.push('notes = ?')
        params.push(String(notes))
      }
    } else if (notes !== undefined) {
      updates.push('notes = ?')
      params.push(String(notes))
    }

    if (updates.length === 0) {
      return errorResponse('No valid fields to update', 400)
    }

    params.push(orderId)
    const sql = `UPDATE orders SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`

    await env.DB.prepare(sql).bind(...params).run()

    // Fetch the updated order record to return to caller
    const updatedOrder = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first()

    return jsonResponse({
      success: true,
      message: status === 'completed' ? 'Order marked as Done & Saved!' : 'Order updated successfully',
      order: updatedOrder,
    })
  } catch (err) {
    return errorResponse(err.message || 'Error updating order', 500)
  }
}

