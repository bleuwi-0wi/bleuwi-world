// Cloudflare Pages Function: /api/orders/create
import {
  jsonResponse,
  errorResponse,
  handleOptions,
  getAuthUser,
} from '../utils.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequestPost({ request, env }) {
  try {
    const authUser = await getAuthUser(request, env)
    const body = await request.json()

    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      totalPrice,
      currency = 'MAD',
      notes = '',
    } = body

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return errorResponse('Customer Name, Phone number, and order items are required.', 400)
    }

    if (!env || !env.DB) {
      return errorResponse('Cloudflare D1 Database binding "DB" is not configured.', 500)
    }

    const orderId = `ord_${Date.now()}`
    const orderNumber = `BW-${Math.floor(10000 + Math.random() * 90000)}`
    const userId = authUser ? authUser.id : null
    const itemsJson = JSON.stringify(items)
    const numericTotal = Number(totalPrice) || 0

    const customerIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-pseudo-ipv4') ||
      '127.0.0.1'
    const country = request.headers.get('cf-ipcountry') || 'MA'

    await env.DB.prepare(
      `INSERT INTO orders (id, order_number, user_id, customer_name, customer_phone, customer_email, items_json, total_price, currency, status, notes, customer_ip, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`
    )
      .bind(
        orderId,
        orderNumber,
        userId,
        String(customerName).trim(),
        String(customerPhone).trim(),
        customerEmail ? String(customerEmail).trim() : null,
        itemsJson,
        numericTotal,
        String(currency).toUpperCase(),
        String(notes).trim(),
        customerIp,
        country
      )
      .run()

    return jsonResponse({
      success: true,
      message: 'Order recorded successfully!',
      order: {
        id: orderId,
        orderNumber,
        totalPrice: numericTotal,
        currency,
        status: 'pending',
      },
    }, 201)
  } catch (err) {
    return errorResponse(err.message || 'Error creating order', 500)
  }
}
