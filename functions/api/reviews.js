// Cloudflare Pages Function: /api/reviews
// Directly reads & writes verified customer reviews in Cloudflare D1 database
import {
  jsonResponse,
  errorResponse,
  handleOptions,
} from './utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

// GET /api/reviews - returns all approved customer reviews
export async function onRequestGet({ env }) {
  try {
    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const { results } = await env.DB.prepare(
      "SELECT id, name, service, rating, comment, date, verified, likes, replies_json, ip, country, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC"
    ).all()

    const parsedReviews = (results || []).map((row) => {
      let replies = []
      try {
        replies = JSON.parse(row.replies_json || '[]')
      } catch (e) {}
      return {
        id: row.id,
        name: row.name,
        service: row.service,
        rating: Number(row.rating) || 5,
        comment: row.comment,
        date: row.date,
        verified: Boolean(row.verified),
        likes: Number(row.likes) || 0,
        replies,
        ip: row.ip,
        country: row.country,
      }
    })

    return jsonResponse({
      success: true,
      reviews: parsedReviews,
    })
  } catch (err) {
    return errorResponse(err.message || 'Error fetching reviews', 500)
  }
}

// POST /api/reviews - submit a new verified customer review
export async function onRequestPost({ request, env }) {
  try {
    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const body = await request.json()
    const { name, service = 'General', rating = 5, comment } = body

    const cleanName = String(name || '').trim().slice(0, 50)
    const cleanComment = String(comment || '').trim().slice(0, 1000)
    const cleanService = String(service || 'General').trim().slice(0, 50)
    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5))

    if (!cleanName || cleanName.length < 2) {
      return errorResponse('Please provide a valid name (at least 2 characters).', 400)
    }

    if (!cleanComment || cleanComment.length < 3) {
      return errorResponse('Review comment must be at least 3 characters long.', 400)
    }

    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-pseudo-ipv4') ||
      '127.0.0.1'
    const country = request.headers.get('cf-ipcountry') || 'MA'

    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    await env.DB.prepare(
      `INSERT INTO reviews (id, name, service, rating, comment, date, verified, likes, replies_json, ip, country, status)
       VALUES (?, ?, ?, ?, ?, ?, 1, 0, '[]', ?, ?, 'approved')`
    )
      .bind(reviewId, cleanName, cleanService, numericRating, cleanComment, formattedDate, clientIp, country)
      .run()

    const newReview = {
      id: reviewId,
      name: cleanName,
      service: cleanService,
      rating: numericRating,
      comment: cleanComment,
      date: formattedDate,
      verified: true,
      likes: 0,
      replies: [],
      ip: clientIp,
      country,
    }

    return jsonResponse(
      {
        success: true,
        message: 'Review submitted successfully!',
        review: newReview,
      },
      201
    )
  } catch (err) {
    return errorResponse(err.message || 'Error submitting review', 500)
  }
}

// PATCH /api/reviews - like or reply to a review
export async function onRequestPatch({ request, env }) {
  try {
    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const body = await request.json()
    const { reviewId, action, reply } = body

    if (!reviewId) {
      return errorResponse('reviewId is required.', 400)
    }

    const existing = await env.DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(reviewId).first()
    if (!existing) {
      return errorResponse('Review not found.', 404)
    }

    if (action === 'like') {
      const delta = body.delta !== undefined ? Number(body.delta) : 1
      await env.DB.prepare('UPDATE reviews SET likes = MAX(0, likes + ?) WHERE id = ?').bind(delta, reviewId).run()
      return jsonResponse({ success: true, message: 'Like updated' })
    }

    if (action === 'reply' && reply && reply.text) {
      let currentReplies = []
      try {
        currentReplies = JSON.parse(existing.replies_json || '[]')
      } catch (e) {}

      const newReply = {
        id: Date.now(),
        author: String(reply.author || 'User').trim().slice(0, 40),
        text: String(reply.text).trim().slice(0, 500),
        isCreator: Boolean(reply.isCreator),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }

      currentReplies.push(newReply)

      await env.DB.prepare('UPDATE reviews SET replies_json = ? WHERE id = ?')
        .bind(JSON.stringify(currentReplies), reviewId)
        .run()

      return jsonResponse({ success: true, reply: newReply })
    }

    return errorResponse('Invalid action.', 400)
  } catch (err) {
    return errorResponse(err.message || 'Error updating review', 500)
  }
}
