// Cloudflare Pages Function: /api/admin/settings
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  getAuthUser,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

// GET /api/admin/settings - public/admin read settings
export async function onRequestGet({ env }) {
  try {
    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const rows = await env.DB.prepare('SELECT key, value FROM site_settings').all()
    const settings = {}
    if (rows && rows.results) {
      for (const row of rows.results) {
        settings[row.key] = row.value
      }
    }

    return jsonResponse({
      success: true,
      settings,
    })
  } catch (err) {
    return errorResponse(err.message || 'Error fetching site settings', 500)
  }
}

// POST /api/admin/settings - update settings (admin only)
export async function onRequestPost({ request, env }) {
  try {
    const authUser = await getAuthUser(request, env)
    if (!authUser || authUser.role !== 'admin') {
      return errorResponse('Forbidden: Admin access required', 403)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return errorResponse('settings object is required', 400)
    }

    for (const [key, value] of Object.entries(settings)) {
      await env.DB.prepare(
        'INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
      )
        .bind(key, String(value))
        .run()
    }

    return jsonResponse({
      success: true,
      message: 'Settings updated successfully',
    })
  } catch (err) {
    return errorResponse(err.message || 'Error updating settings', 500)
  }
}
