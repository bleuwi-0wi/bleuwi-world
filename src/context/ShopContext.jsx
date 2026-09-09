import { createContext, useContext, useState, useEffect } from 'react'
import { getSecureWhatsAppUrl, openWhatsAppChat } from '../data/links'

const ShopContext = createContext(null)

// Standard exchange rates relative to Moroccan Dirham (MAD)
// Consistent with Free Fire standard ($1 = 10 DH)
export const CURRENCY_RATES = {
  MAD: { symbol: 'DH', label: 'MAD (الدرهم)', flag: '🇲🇦', rate: 1.0, isPrefix: false },
  USD: { symbol: '$', label: 'USD (Dollar)', flag: '💵', rate: 0.10, isPrefix: true },
  EUR: { symbol: '€', label: 'EUR (Euro)', flag: '💶', rate: 0.0926, isPrefix: true },
}

// Helper to extract a numeric price from strings like "110 DH", "$11", "60 DH"
export const parseNumericMAD = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr
  if (!priceStr) return 0
  const cleaned = String(priceStr).replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function ShopProvider({ children }) {
  // 1. Currency State
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('bleuwi_currency')
      if (saved && CURRENCY_RATES[saved]) return saved
    } catch {
      // ignore
    }
    return 'MAD'
  })

  const setCurrency = (newCurr) => {
    if (!CURRENCY_RATES[newCurr]) return
    setCurrencyState(newCurr)
    try {
      localStorage.setItem('bleuwi_currency', newCurr)
    } catch {
      // ignore
    }
  }

  // Format any price into the active or target currency
  const formatPrice = (madAmount, targetCurrency = currency, lang = 'ar') => {
    const numMAD = parseNumericMAD(madAmount)
    const conf = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.MAD
    const converted = numMAD * conf.rate

    let formattedVal
    if (targetCurrency === 'MAD') {
      formattedVal = Math.round(converted)
      return lang === 'ar' ? `${formattedVal} د.م` : `${formattedVal} DH`
    } else {
      // For USD and EUR, show 2 decimals if not a whole number, or clean integers
      formattedVal = Number.isInteger(converted) ? converted.toFixed(0) : converted.toFixed(2)
      return conf.isPrefix ? `${conf.symbol}${formattedVal}` : `${formattedVal} ${conf.symbol}`
    }
  }

  // 2. Multi-Item Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('bleuwi_cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // fallback
    }
    return []
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartToast, setCartToast] = useState(null)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('bleuwi_cart', JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart])

  // Add Item to Cart
  const addToCart = (product, variant = {}, quantity = 1) => {
    const priceMAD = parseNumericMAD(variant.price || product.price)
    const variantKey = variant.duration || variant.name || variant.plan || 'default'
    const cartItemId = `${product.id || product.name}-${variantKey}`

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.cartItemId === cartItemId)
      if (existingIdx > -1) {
        const updated = [...prevCart]
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        }
        return updated
      } else {
        const newItem = {
          cartItemId,
          productId: product.id || product.name,
          name: product.name,
          nameAr: product.nameAr || product.name,
          variantName: variantKey !== 'default' ? variantKey : null,
          priceMAD,
          image: product.image,
          categoryKey: product.categoryKey || 'General',
          quantity,
        }
        return [...prevCart, newItem]
      }
    })

    // Trigger feedback Toast
    setCartToast({
      name: product.name,
      nameAr: product.nameAr || product.name,
      variant: variantKey !== 'default' ? variantKey : null,
      priceFormatted: formatPrice(priceMAD),
      timestamp: Date.now(),
    })
  }

  // Remove Item
  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
  }

  // Update Quantity
  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  // Clear Cart
  const clearCart = () => {
    setCart([])
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  // Aggregations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPriceMAD = cart.reduce((sum, item) => sum + item.priceMAD * item.quantity, 0)
  const totalFormatted = formatPrice(totalPriceMAD)

  // Generate unified WhatsApp Order Message & Launch Chat
  const checkoutViaWhatsApp = (customerNote = '') => {
    if (cart.length === 0) return

    const lines = [
      '🎮 *طلب شراء جديد من متجر BLEUWI WORLD*',
      '━━━━━━━━━━━━━━━━━━━━━━',
      '📦 *تفاصيل المنتجات المطلوبة:*',
    ]

    cart.forEach((item, idx) => {
      const itemSubtotalMAD = item.priceMAD * item.quantity
      const subtotalFormatted = formatPrice(itemSubtotalMAD, currency)
      const variantStr = item.variantName ? ` (${item.variantName})` : ''
      lines.push(`${idx + 1}. *${item.name}${variantStr}* × ${item.quantity} = ${subtotalFormatted}`)
    })

    lines.push('━━━━━━━━━━━━━━━━━━━━━━')
    lines.push(`💰 *المجموع الكلي:* ${totalFormatted} (${formatPrice(totalPriceMAD, 'USD')} / ${formatPrice(totalPriceMAD, 'EUR')})`)
    lines.push('⚡ *طرق الدفع المفضلة:* [CIH Bank / Attijariwafa / Cash Plus / PayPal / Binance USDT]')

    if (customerNote && customerNote.trim()) {
      lines.push(`📝 *ملاحظات العميل / رقم ID:* ${customerNote.trim()}`)
    }

    lines.push('━━━━━━━━━━━━━━━━━━━━━━')
    lines.push('🛡️ *مشمول بالضمان الذهبي 100% والتسليم الفوري.* يرجى إرسال تفاصيل الدفع لتأكيد الطلب.')

    const finalMessage = lines.join('\n')
    openWhatsAppChat(finalMessage)
  }

  const value = {
    currency,
    setCurrency,
    formatPrice,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItemsCount,
    totalPriceMAD,
    totalFormatted,
    isCartOpen,
    openCart,
    closeCart,
    cartToast,
    setCartToast,
    checkoutViaWhatsApp,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return ctx
}
