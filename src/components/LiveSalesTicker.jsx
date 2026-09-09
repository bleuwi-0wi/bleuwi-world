import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useShop } from '../context/ShopContext'
import { LIVE_SALES_POOL } from '../data/liveSalesData'

export default function LiveSalesTicker({ onOpenOrder }) {
  const { lang, isRTL } = useLanguage()
  const { formatPrice } = useShop()

  // Start with a randomized initial index from the 1,000-sales pool for authentic variety
  const [currentIndex, setCurrentIndex] = useState(() => {
    return Math.floor(Math.random() * LIVE_SALES_POOL.length)
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (isDismissed) return

    // Initial delay before showing first notification (3.2 seconds after page load)
    const initialTimer = setTimeout(() => {
      setIsVisible(true)
    }, 3200)

    // Interval to cycle through the 1,000 sales pool:
    // Visible for 6.5 seconds, hidden for 8 seconds, then shows the next one
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LIVE_SALES_POOL.length)
        setIsVisible(true)
      }, 7500)
    }, 14000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [isDismissed])

  if (isDismissed) return null

  const sale = LIVE_SALES_POOL[currentIndex] || LIVE_SALES_POOL[0]
  const buyerName = lang === 'ar' ? sale.buyerNameAr : sale.buyerNameEn
  const cityName = lang === 'ar' ? sale.cityAr : sale.cityEn
  const productName = lang === 'ar' ? sale.productNameAr : sale.productNameEn
  const timeAgo = lang === 'ar' ? sale.timeAgoAr : sale.timeAgoEn
  const badgeText = lang === 'ar' ? sale.badgeAr : sale.badgeEn

  const handleClickOrder = () => {
    if (onOpenOrder) {
      onOpenOrder({
        productName: sale.productNameAr,
        priceMAD: sale.priceMAD,
        category: sale.category,
      })
    }
  }

  return (
    <aside
      aria-label={lang === 'ar' ? 'إشعارات المبيعات الحية' : 'Live Recent Orders'}
      className={`fixed z-40 transition-all duration-500 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
      } ${
        isRTL
          ? 'left-4 sm:left-6 bottom-20 sm:bottom-6'
          : 'right-4 sm:right-6 bottom-20 sm:bottom-6'
      } max-w-[340px] sm:max-w-[390px] w-[calc(100vw-2rem)]`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-[#090f1d]/95 backdrop-blur-xl p-3.5 shadow-2xl shadow-sky-950/60 ring-1 ring-white/10 group hover:border-sky-400/50 transition-colors">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-emerald-400 animate-pulse" />

        <div className="flex items-start gap-3">
          {/* Pulsing Status Dot with Method Icon */}
          <div className="relative shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-400/30 flex items-center justify-center text-lg shadow-inner">
              {sale.methodIcon}
            </div>
            {/* Live Green Pulsing Indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#090f1d]" />
            </span>
          </div>

          {/* Content Body */}
          <div className="flex-1 min-w-0">
            {/* Header: Buyer Name + Flag & City + Time */}
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white tracking-wide">
                  {buyerName}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-sky-950/80 text-sky-300 border border-sky-800/50">
                  <span>{sale.flag}</span>
                  <span>{cityName}</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                {timeAgo}
              </span>
            </div>

            {/* Product Name */}
            <p className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1.5">
              {productName}
            </p>

            {/* Footer row: Price + Method / Badge + Quick Order Link */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-extrabold text-amber-400 font-mono">
                  {formatPrice(sale.priceMAD)}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  {badgeText}
                </span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">
                  • {sale.method}
                </span>
              </div>

              {/* Action Trigger */}
              <button
                type="button"
                onClick={handleClickOrder}
                className="text-[11px] font-bold text-sky-400 hover:text-sky-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <span>{lang === 'ar' ? 'طلب الآن' : 'Order'}</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          </div>

          {/* Subtle Dismiss Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsVisible(false)
              setTimeout(() => setIsDismissed(true), 300)
            }}
            aria-label={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss notification'}
            className="shrink-0 -mr-1 -mt-1 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
