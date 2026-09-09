import { useState } from 'react'
import { 
  Check, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Maximize2, 
  Gem, 
  Key, 
  Sparkles, 
  Monitor, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useShop } from '../context/ShopContext'

export default function ProductCard({
  product,
  onOrder,
  onInspect,
  variantIndex = 0,
  onVariantChange,
  variantType = null // 'plan' | 'version' | null
}) {
  const { lang, isRTL, t } = useLanguage()
  const { formatPrice, addToCart, currency } = useShop()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Determine current active variant data if applicable
  let currentPrice = product.price
  let currentShortName = product.shortName || product.name
  let currentFeatures = (lang === 'ar' ? product.featuresAr : product.features) || []
  let activeVariantObj = {}

  if (variantType === 'plan' && product.plans && product.plans[variantIndex]) {
    const activePlan = product.plans[variantIndex]
    currentPrice = activePlan.price
    currentShortName = `${product.name} (${activePlan.duration})`
    activeVariantObj = { duration: activePlan.duration, price: currentPrice }
    if (activePlan.features) {
      currentFeatures = lang === 'ar' ? (activePlan.featuresAr || activePlan.features) : activePlan.features
    }
  } else if (variantType === 'version' && product.versions && product.versions[variantIndex]) {
    const activeVersion = product.versions[variantIndex]
    currentPrice = activeVersion.price
    currentShortName = `${product.name} (${activeVersion.name})`
    activeVariantObj = { name: activeVersion.name, price: currentPrice }
  } else {
    activeVariantObj = { price: currentPrice }
  }

  const formattedDisplayPrice = formatPrice(currentPrice)

  const handleOrderClick = (e) => {
    e.stopPropagation()
    setIsOrdering(true)
    setTimeout(() => {
      setIsOrdering(false)
      if (onOrder) {
        onOrder({
          ...product,
          price: currentPrice,
          formattedPrice: formattedDisplayPrice,
          shortName: currentShortName,
          selectedVariantIndex: variantIndex,
        })
      }
    }, 280)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, activeVariantObj, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const isOutOfStock = product.isOutOfStock || false

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] via-[#0b101d]/90 to-[#070b14] p-3.5 sm:p-4 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(56,189,248,0.15)]">
      
      {/* 1. TOP IMAGE CONTAINER */}
      <div 
        onClick={() => onInspect && onInspect(product)}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black/60 cursor-pointer select-none group/img"
        title={lang === 'ar' ? 'انقر لمعاينة وتكبير تفاصيل العرض' : 'Click to inspect full product specs'}
      >
        {/* Shimmer skeleton while image loads */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}

        {/* Fallback icon if image fails */}
        {imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 text-slate-500 gap-2">
            <Monitor size={32} className="text-slate-600" />
            <span className="text-[11px] font-medium">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover/img:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Gradient dark overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Top-Left: Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-slate-950/85 border border-sky-400/40 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-sky-300 backdrop-blur-md shadow-md">
            {product.categoryKey === 'Free Fire Diamond' && <Gem size={11} className="text-amber-400" />}
            {product.categoryKey === 'Windows & Office' && <Key size={11} className="text-sky-400" />}
            {product.categoryKey === 'AI Subscriptions' && <Sparkles size={11} className="text-purple-400" />}
            <span>{lang === 'ar' ? (product.badgeAr || product.badge) : product.badge}</span>
          </div>
        )}

        {/* Top-Right: In-Stock / Availability Status Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/85 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-md shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>{isOutOfStock ? (lang === 'ar' ? 'غير متوفر مؤقتاً' : 'Out of Stock') : (lang === 'ar' ? 'متوفر فوراً' : 'In Stock')}</span>
        </div>

        {/* Bottom Specs / USD pill on image */}
        {product.priceUsd && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md border border-white/15 bg-slate-950/90 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300 backdrop-blur-md">
            <span className="text-slate-400">USD:</span>
            <span className="text-amber-300">{product.priceUsd}</span>
          </div>
        )}

        {/* Hover Inspect Indicator */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[1.5px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/90 border border-sky-400/60 px-3 py-1.5 text-xs font-bold text-sky-200 shadow-xl backdrop-blur-md">
            <Maximize2 size={13} className="text-sky-400" />
            <span>{t('inspectDetails')}</span>
          </span>
        </div>
      </div>

      {/* 2. CARD CONTENT & TYPOGRAPHY HIERARCHY */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Platform & Sales Badge */}
          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-sky-400/90">
              {lang === 'ar' ? (product.platformAr || product.platform) : product.platform}
            </span>
            {product.salesCount && (
              <span className="font-mono text-slate-400">
                {lang === 'ar' ? (product.salesCountAr || product.salesCount) : product.salesCount}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onInspect && onInspect(product)}
            className="mt-1 text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="mt-1 text-xs text-slate-400 line-clamp-1 leading-relaxed">
            {lang === 'ar' ? (product.taglineAr || product.tagline) : product.tagline}
          </p>

          {/* VARIANT SELECTORS (AI Plans or Windows Versions) */}
          {variantType === 'plan' && product.plans && (
            <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1.5">
              <div className="text-[10px] text-slate-400 mb-1 font-semibold flex items-center justify-between">
                <span>{t('selectPlan')}</span>
                <span className="text-purple-300 font-bold">{product.plans[variantIndex]?.duration}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {product.plans.map((p, idx) => (
                  <button
                    key={p.duration}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onVariantChange && onVariantChange(idx)
                    }}
                    className={`rounded-lg py-1 px-1.5 text-[10px] font-bold transition cursor-pointer text-center ${
                      variantIndex === idx
                        ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {p.duration}
                  </button>
                ))}
              </div>
            </div>
          )}

          {variantType === 'version' && product.versions && (
            <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1.5">
              <div className="text-[10px] text-slate-400 mb-1 font-semibold flex items-center justify-between">
                <span>{t('selectVersion')}</span>
                <span className="text-sky-300 font-bold">{product.versions[variantIndex]?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {product.versions.map((v, idx) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onVariantChange && onVariantChange(idx)
                    }}
                    className={`flex-1 rounded-lg py-1 px-1.5 text-[10px] font-bold transition cursor-pointer text-center ${
                      variantIndex === idx
                        ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features / Benefits Bullets (Standardized) */}
          {currentFeatures.length > 0 && (
            <ul className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-2.5 text-[11px] text-slate-300">
              {currentFeatures.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. CARD FOOTER: UNIFIED PRICING & DUAL ACTIONS */}
        <div className="mt-4 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            {/* Price block */}
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium">
                {lang === 'ar' ? 'السعر' : 'Price'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-sky-300 tracking-tight">
                  {formattedDisplayPrice}
                </span>
                {currency !== 'MAD' && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({currentPrice})
                  </span>
                )}
              </div>
            </div>

            {/* Guaranteed Trust Micro-Badge */}
            <div className="flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
              <Zap size={12} />
              <span>{lang === 'ar' ? 'تسليم 5 د' : '5-Min Drop'}</span>
            </div>
          </div>

          {/* DUAL ACTION BUTTONS: ADD TO CART + INSTANT WHATSAPP CTA */}
          <div className="flex items-center gap-2">
            {/* Add to Cart Secondary Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm ${
                justAdded
                  ? 'border-emerald-400/70 bg-emerald-500/30 text-emerald-200'
                  : 'border-white/15 bg-white/[0.05] hover:bg-sky-500/20 hover:border-sky-400/50 text-slate-200 hover:text-white'
              }`}
              title={lang === 'ar' ? 'إضافة إلى سلة المشتريات' : 'Add to Shopping Cart'}
              aria-label={lang === 'ar' ? `إضافة ${product.name} إلى السلة` : `Add ${product.name} to cart`}
            >
              <ShoppingBag size={15} className={justAdded ? 'text-emerald-300 animate-bounce' : 'text-sky-400'} />
              <span className="hidden min-[380px]:inline">
                {justAdded ? (lang === 'ar' ? 'تمت!' : 'Added!') : (lang === 'ar' ? '+ السلة' : '+ Cart')}
              </span>
            </button>

            {/* Primary Order Now WhatsApp CTA */}
            <button
              type="button"
              onClick={handleOrderClick}
              disabled={isOutOfStock || isOrdering}
              className="btn-cta-primary flex-1 shadow-emerald-500/25 hover:shadow-emerald-500/40 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
              aria-label={`${t('buyNowCTA')} ${product.name}`}
            >
              {isOrdering ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{t('loadingRedirect')}</span>
                </>
              ) : (
                <>
                  {/* Official WhatsApp Logo SVG for instant familiarity */}
                  <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.769.459 3.432 1.261 4.884l-1.341 4.896 5.031-1.319c1.408.767 3.018 1.201 4.729 1.201 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>{lang === 'ar' ? `شراء الآن (${formattedDisplayPrice})` : `Order Now (${formattedDisplayPrice})`}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
