import { Crown, ShieldCheck, Sparkles, ArrowRight, RotateCcw, Headphones } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function WarrantyBanner({ onOpenWarranty }) {
  const { lang, isRTL } = useLanguage()

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-6">
      <div
        onClick={onOpenWarranty}
        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 p-4 sm:p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(251,191,36,0.15)] transition-all duration-300 hover:scale-[1.01] hover:border-amber-400 hover:shadow-[0_15px_45px_rgba(251,191,36,0.25)] cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Golden Warranty Details"
      >
        {/* Shiny animated shimmer line */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Crown Badge & Text */}
          <div className="flex items-center gap-3.5">
            <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-400/60 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/40 group-hover:scale-105 transition-transform">
              <Crown size={24} className="fill-slate-950 text-slate-950" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {lang === 'ar' ? 'الضمان الذهبي الرسمي 100%' : '100% Golden Warranty Guarantee'}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>{lang === 'ar' ? 'استبدال فوري' : 'Instant Replacement'}</span>
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-300 leading-snug">
                {lang === 'ar'
                  ? 'كل طلبية مشمولة بضمان استبدال فوري عند أي مشكلة + دعم فني متواصل 24/7 عبر واتساب.'
                  : 'Every order is backed by instant replacement guarantee & 24/7 direct WhatsApp technical support.'}
              </p>
            </div>
          </div>

          {/* Right: Guarantee highlights & CTA button */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-3 text-xs text-amber-200/90 font-medium mr-2">
              <span className="inline-flex items-center gap-1">
                <RotateCcw size={13} className="text-amber-400" />
                <span>{lang === 'ar' ? 'تعويض سريع' : 'Quick Swap'}</span>
              </span>
              <span className="text-amber-400/40">·</span>
              <span className="inline-flex items-center gap-1">
                <Headphones size={13} className="text-amber-400" />
                <span>{lang === 'ar' ? 'دعم 24/7' : '24/7 Help'}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenWarranty()
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-amber-500/30 transition hover:from-white hover:to-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'اكتشف الشروط والحماية' : 'View Warranty Terms'}</span>
              <ArrowRight size={13} className={isRTL ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
