// Cloudflare Pages Function: /api/admin/users
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  getAuthUser,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

// GET /api/admin/users - list all users
export async function onRequestGet({ request, env }) {
  try {
    const authUser = await getAuthUser(request, env)
    if (!authUser || authUser.role !== 'admin') {
      return errorResponse('Forbidden: Unauthorized admin access', 403)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const url = new URL(request.url)
    const search = url.searchParams.get('q') || ''

    let query = 'SELECT id, username, email, role, full_name, phone, balance, status, created_at FROM users'
    let results

    if (search.trim()) {
      const param = `%${search.trim().toLowerCase()}%`
      query += ' WHERE LOWER(username) LIKE ? OR LOWER(email) LIKE ? OR LOWER(full_name) LIKE ? OR phone LIKE ?'
      results = await env.DB.prepare(query + ' ORDER BY created_at DESC').bind(param, param, param, param).all()
    } else {
      results = await env.DB.prepare(query + ' ORDER BY created_at DESC').all()
    }

    return jsonResponse({
      success: true,
      users: results?.results || [],
    })
  } catch (err) {
    return errorResponse(err.message || 'Error listing users', 500)
  }
}

// PATCH /api/admin/users - update role, status, or balance
export async function onRequestPatch({ request, env }) {
  try {
    const authUser = await getAuthUser(request, env)
    if (!authUser || authUser.role !== 'admin') {
      return errorResponse('Forbidden: Unauthorized admin access', 403)
    }

    const body = await request.json()
    const { userId, role, status, balance } = body

    if (!userId) {
      return errorResponse('userId is required', 400)
    }

    // Prevent admin from demoting or banning their own account
    if (userId === authUser.id && (role === 'user' || status === 'banned')) {
      return errorResponse('You cannot demote or ban your own administrator account.', 400)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const updates = []
    const params = []

    if (role && ['user', 'admin'].includes(role)) {
      updates.push('role = ?')
      params.push(role)
    }
    if (status && ['active', 'banned'].includes(status)) {
      updates.push('status = ?')
      params.push(status)
    }
    if (balance !== undefined && !isNaN(Number(balance))) {
      updates.push('balance = ?')
      params.push(Number(balance))
    }

    if (updates.length === 0) {
      return errorResponse('No valid fields to update', 400)
    }

    params.push(userId)
    const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`

    await env.DB.prepare(sql).bind(...params).run()

    return jsonResponse({
      success: true,
      message: 'User updated successfully',
    })
  } catch (err) {
    return errorResponse(err.message || 'Error updating user', 500)
  }
}
