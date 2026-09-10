// Cloudflare Pages Function: /api/auth/me
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
      return errorResponse('Unauthorized or session expired', 401)
    }

    const sanitizedUser = {
      id: authUser.id,
      username: authUser.username,
      email: authUser.email,
      role: authUser.role,
      fullName: authUser.full_name || authUser.fullName || authUser.username,
      phone: authUser.phone || '',
      avatar: authUser.avatar || '',
      balance: authUser.balance || 0,
      status: authUser.status || 'active',
    }

    return jsonResponse({
      success: true,
      user: sanitizedUser,
    })
  } catch (err) {
    return errorResponse(err.message || 'Error fetching user session', 500)
  }
}
