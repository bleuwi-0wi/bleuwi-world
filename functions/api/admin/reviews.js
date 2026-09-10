// Cloudflare Pages Function: /api/admin/reviews
// Master Admin review management & moderation backed by Cloudflare D1
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  requireMasterAdmin,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

// GET /api/admin/reviews - list all reviews
export async function onRequestGet({ request, env }) {
  try {
    const authUser = await requireMasterAdmin(request, env)
    if (!authUser) {
      return errorResponse('Forbidden: Master Admin privileges required', 403)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM reviews ORDER BY created_at DESC'
    ).all()

    const parsed = (results || []).map((row) => {
      let replies = []
      try {
        replies = JSON.parse(row.replies_json || '[]')
      } catch (e) {}
      return {
        ...row,
        rating: Number(row.rating) || 5,
        likes: Number(row.likes) || 0,
        replies,
      }
    })

    return jsonResponse({
      success: true,
      reviews: parsed,
    })
  } catch (err) {
    return errorResponse(err.message || 'Error fetching admin reviews', 500)
  }
}

// DELETE /api/admin/reviews - delete a review
export async function onRequestDelete({ request, env }) {
  try {
    const authUser = await requireMasterAdmin(request, env)
    if (!authUser) {
      return errorResponse('Forbidden: Master Admin privileges required', 403)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const url = new URL(request.url)
    const reviewId = url.searchParams.get('id')
    if (!reviewId) {
      return errorResponse('review id is required in query params (?id=...)', 400)
    }

    await env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(reviewId).run()

    return jsonResponse({
      success: true,
      message: `Review ${reviewId} deleted successfully.`,
    })
  } catch (err) {
    return errorResponse(err.message || 'Error deleting review', 500)
  }
}
