import { useState } from 'react'
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  ChevronDown,
  Sparkles
} from 'lucide-react'
import { useShop, CURRENCY_RATES } from '../context/ShopContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export default function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItemsCount, 
    totalPriceMAD, 
    totalFormatted,
    currency,
    setCurrency,
    formatPrice,
    checkoutViaWhatsApp 
  } = useShop()

  const { user, openAuthModal } = useAuth()
  const { lang, isRTL, t } = useLanguage()
  const [customerNote, setCustomerNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isCartOpen) return null

  const handleCheckout = () => {
    // Mandatory Login Check
    if (!user) {
      closeCart()
      openAuthModal(
        'login',
        lang === 'ar'
          ? 'يرجى تسجيل الدخول أو إنشاء حساب لإتمام عملية الشراء ومتابعة طلبك عبر واتساب.'
          : 'Please sign in or create an account to complete your purchase and track your order.'
      )
      return
    }

    setIsSubmitting(true)

    // Ingest order directly into Cloudflare D1
    try {
      api.createOrder({
        customerName: user.fullName || user.username,
        customerPhone: user.phone || 'WhatsApp Client',
        customerEmail: user.email,
        items: cart.map((item) => ({
          id: item.id,
          title: `${item.name}${item.variantName ? ` (${item.variantName})` : ''}`,
          price: item.priceMAD,
          quantity: item.quantity,
        })),
        totalPrice: totalPriceMAD,
        currency: 'MAD',
        notes: customerNote.trim(),
      }).catch(() => {})
    } catch (e) {}

    setTimeout(() => {
      checkoutViaWhatsApp(customerNote)
      setIsSubmitting(false)
    }, 250)
  }


  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex max-w-full`}>
        <div className="w-screen max-w-md border-l border-white/[0.08] bg-[#070b14]/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between text-white animate-slideIn">
          
          {/* 1. DRAWER HEADER */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <ShoppingBag size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold tracking-wide">
                    {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
                  </h2>
                  <span className="rounded-full bg-sky-400/20 border border-sky-400/30 px-2 py-0.5 text-xs font-black text-sky-300">
                    {totalItemsCount}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'طلب موحد بضغطة واحدة عبر واتساب' : 'Unified 1-Click WhatsApp Order'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-lg p-2 text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition cursor-pointer text-xs flex items-center gap-1"
                  title={lang === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
                >
                  <Trash2 size={15} />
                  <span className="hidden sm:inline text-[11px]">{lang === 'ar' ? 'مسح' : 'Clear'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={closeCart}
                className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 2. DRAWER BODY / ITEMS LIST */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 divide-y divide-white/[0.05]">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-16 px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-slate-500 mb-4 shadow-inner">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? 'سلتك فارغة حالياً' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
                  {lang === 'ar' 
                    ? 'اختر من عروض شحن فري فاير، مفاتيح ويندوز الأصلية أو اشتراكات الذكاء الاصطناعي واجمعها في طلب واحد.'
                    : 'Add Free Fire diamonds, genuine Windows keys, or AI subscriptions to build your custom order.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart()
                    const elem = document.getElementById('hot-sellers')
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500/20 border border-sky-400/40 px-4 py-2.5 text-xs font-bold text-sky-200 hover:bg-sky-500/30 hover:text-white transition cursor-pointer"
                >
                  <Sparkles size={14} className="text-sky-300" />
                  <span>{lang === 'ar' ? 'تصفح الأكثر مبيعاً' : 'Explore Hot Sellers'}</span>
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 group">
                  {/* Thumbnail */}
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                      loading="lazy"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                      {lang === 'ar' ? item.nameAr : item.name}
                    </h4>
                    {item.variantName && (
                      <div className="mt-0.5 inline-flex items-center rounded-md bg-purple-500/20 border border-purple-400/30 px-1.5 py-0.5 text-[10px] font-bold text-purple-200">
                        {item.variantName}
                      </div>
                    )}
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-black text-sky-300">
                        {formatPrice(item.priceMAD * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-slate-500">
                          ({formatPrice(item.priceMAD)} / {lang === 'ar' ? 'قطعة' : 'unit'})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="rounded p-1 text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="rounded p-1 text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-[10px] text-slate-500 hover:text-red-400 transition cursor-pointer flex items-center gap-0.5"
                    >
                      <Trash2 size={11} />
                      <span>{lang === 'ar' ? 'حذف' : 'Remove'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 3. DRAWER FOOTER (CHECKOUT & SUMMARY) */}
          {cart.length > 0 && (
            <div className="border-t border-white/[0.08] bg-[#05070d]/90 p-5 space-y-3.5">
              
              {/* Currency Selector Pill */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  {lang === 'ar' ? 'عملة الحساب:' : 'Display Currency:'}
                </span>
                <div className="flex items-center gap-1">
                  {Object.keys(CURRENCY_RATES).map((currKey) => (
                    <button
                      key={currKey}
                      type="button"
                      onClick={() => setCurrency(currKey)}
                      className={`rounded-lg px-2 py-0.5 text-xs font-bold transition cursor-pointer ${
                        currency === currKey
                          ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{CURRENCY_RATES[currKey].flag} {currKey}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Customer Note / ID input */}
              <div>
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder={lang === 'ar' ? 'اسمك أو رقم ID للعبة أو إيميلك (اختياري)...' : 'Your name, Player ID, or email (optional)...'}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/40"
                />
              </div>

              {/* Total & Guarantee Bar */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    {lang === 'ar' ? 'المجموع النهائي:' : 'Subtotal:'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-sky-300 tracking-tight">
                      {totalFormatted}
                    </span>
                    {currency !== 'MAD' && (
                      <span className="text-xs text-slate-500 font-mono">
                        ({totalPriceMAD} DH)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5 text-[10px] text-emerald-300 font-bold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5">
                    <Zap size={11} className="text-emerald-400" />
                    <span>{lang === 'ar' ? 'تسليم 5 دقائق' : '5-Min Instant Delivery'}</span>
                  </span>
                  <span className="text-slate-400 text-[9px]">
                    {lang === 'ar' ? '🛡️ ضمان استبدال 100%' : '🛡️ 100% Golden Guarantee'}
                  </span>
                </div>
              </div>

              {/* UNIFIED WHATSAPP CHECKOUT BUTTON */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="btn-cta-primary w-full shadow-emerald-500/25 hover:shadow-emerald-500/40 text-center flex items-center justify-center gap-2 py-3.5 text-sm sm:text-base font-extrabold"
              >
                {/* Official WhatsApp Logo SVG */}
                <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.769.459 3.432 1.261 4.884l-1.341 4.896 5.031-1.319c1.408.767 3.018 1.201 4.729 1.201 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10z" />
                </svg>
                <span>
                  {lang === 'ar' ? `إتمام الطلب عبر واتساب (${totalFormatted})` : `Order via WhatsApp (${totalFormatted})`}
                </span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
