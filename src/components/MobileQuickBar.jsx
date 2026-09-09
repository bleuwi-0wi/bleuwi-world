import { ShoppingBag, MessageCircle, Flame } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useShop } from '../context/ShopContext'
import { WHATSAPP_DIRECT_LINK } from '../data/links'

export default function MobileQuickBar({ onOpenOrder }) {
  const { lang, isRTL, t } = useLanguage()
  const { totalItemsCount, openCart } = useShop()

  const handleDealsClick = (e) => {
    e.preventDefault()
    const el = document.getElementById('hot-sellers')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <aside 
      aria-label="Mobile quick actions"
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-white/10 bg-[#070b14]/95 backdrop-blur-2xl p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Browse Deals Button */}
        <a
          href="#hot-sellers"
          onClick={handleDealsClick}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 px-2 text-xs font-bold text-slate-200 hover:bg-white/[0.1] active:scale-95 transition"
        >
          <Flame size={14} className="text-amber-400 animate-pulse" />
          <span>{lang === 'ar' ? 'العروض' : 'Deals'}</span>
        </a>

        {/* Cart Drawer Trigger Button */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex items-center justify-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/15 py-2.5 px-3 text-xs font-bold text-sky-200 active:scale-95 transition cursor-pointer"
          aria-label="Shopping Cart"
        >
          <ShoppingBag size={15} className="text-sky-300" />
          <span>{lang === 'ar' ? 'السلة' : 'Cart'}</span>
          {totalItemsCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950">
              {totalItemsCount}
            </span>
          )}
        </button>

        {/* WhatsApp Order Button */}
        <button
          type="button"
          onClick={() => onOpenOrder && onOpenOrder({})}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 py-2.5 px-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer"
        >
          {/* WhatsApp Icon */}
          <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.769.459 3.432 1.261 4.884l-1.341 4.896 5.031-1.319c1.408.767 3.018 1.201 4.729 1.201 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10z" />
          </svg>
          <span>{lang === 'ar' ? 'طلب فوري' : 'Order'}</span>
        </button>
      </div>
    </aside>
  )
}
