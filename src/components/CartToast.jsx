import { useEffect } from 'react'
import { ShoppingBag, ArrowRight, ArrowLeft, X } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { useLanguage } from '../context/LanguageContext'

export default function CartToast() {
  const { cartToast, setCartToast, openCart } = useShop()
  const { lang, isRTL } = useLanguage()

  useEffect(() => {
    if (!cartToast) return
    const timer = setTimeout(() => {
      setCartToast(null)
    }, 4500)
    return () => clearTimeout(timer)
  }, [cartToast, setCartToast])

  if (!cartToast) return null

  return (
    <div className="fixed bottom-20 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto z-50 max-w-sm w-full transition-all duration-300 animate-slideUp">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-[#070b14]/95 p-3.5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <ShoppingBag size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {lang === 'ar' ? 'تمت الإضافة إلى السلة 🛒' : 'Added to Cart 🛒'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {lang === 'ar' ? cartToast.nameAr : cartToast.name}
              {cartToast.variant ? ` (${cartToast.variant})` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setCartToast(null)
              openCart()
            }}
            className="flex items-center gap-1 rounded-xl bg-sky-500/20 border border-sky-400/40 px-2.5 py-1.5 text-xs font-bold text-sky-200 hover:bg-sky-500/30 hover:text-white transition cursor-pointer"
          >
            <span>{lang === 'ar' ? 'عرض السلة' : 'View'}</span>
            {isRTL ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
          </button>
          <button
            type="button"
            onClick={() => setCartToast(null)}
            className="rounded-lg p-1 text-slate-500 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
