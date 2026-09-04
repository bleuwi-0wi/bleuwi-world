import { ArrowDownRight, ArrowRight, MessageCircle, Play, CreditCard, Flame } from 'lucide-react'
import HeroVideo from './HeroVideo'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t, isRTL, lang } = useLanguage()

  const heroPayments = [
    'CIH Bank',
    'Attijariwafa',
    'Cash Plus',
    'PayPal',
    'Binance USDT',
    'Visa / MC',
  ]

  return (
    <section id="home" className="relative isolate overflow-hidden pt-32 sm:pt-40">
      <div className="hero-glow" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-32">
        <div className="animate-enter relative z-10">
          <div className="eyebrow">
            <span className="pulse-dot" />
            <span>{t('heroEyebrow')}</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl min-[400px]:text-5xl sm:text-7xl lg:text-[5.35rem] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
            {t('heroTitlePrefix')}<br />
            <span className="text-gradient">{t('heroTitleGradient')}</span>
          </h1>
          <p className="mt-7 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-8 text-slate-400">
            {t('heroSubtitle')}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a className="button-primary" href="#preview">
              <span>{t('heroCtaExplore')}</span>
              <ArrowRight size={17} className={isRTL ? 'rotate-180' : ''} />
            </a>
            <a
              className="button-secondary"
              href="https://wa.me/212762635587"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} className="text-emerald-400" />
              <span>{t('heroCtaWhatsApp')}</span>
            </a>
          </div>

          {/* Top Hot Sellers Quick Banner */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a
              href="#hot-sellers"
              className="group inline-flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.15)] transition hover:scale-[1.02] hover:border-amber-400/80 hover:bg-amber-500/25 hover:text-white"
            >
              <Flame size={14} className="text-amber-400 animate-pulse flex-none" />
              <span>{lang === 'ar' ? '🔥 عروض حصرية:' : '🔥 Hot Offers:'}</span>
              <span className="text-white font-semibold">GTA (200DH) · RDR2 (250DH) · FIFA (200DH) · Discord (70DH) · CapCut (90DH) · Spotify (70DH)</span>
              <ArrowRight size={13} className={`text-amber-400 transition-transform group-hover:translate-x-0.5 flex-none ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
            </a>
          </div>

          {/* Top Payment Methods Banner (NUM 4) */}
          <div className="mt-7 flex flex-wrap items-center gap-2 pt-1 text-xs">
            <a
              href="#payments"
              className="group flex items-center gap-1.5 font-medium text-slate-400 transition hover:text-sky-300"
              title={lang === 'ar' ? 'عرض تفاصيل طرق الدفع' : 'View Payment Methods'}
            >
              <CreditCard size={14} className="text-sky-400 transition group-hover:scale-110" />
              <span>{lang === 'ar' ? 'طرق الدفع المعتمدة:' : 'Accepted Payments:'}</span>
            </a>
            <div className="flex flex-wrap items-center gap-1.5">
              {heroPayments.map((method) => (
                <a
                  key={method}
                  href="#payments"
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
                >
                  {method}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-9 flex items-center gap-4 text-sm text-slate-500">
            <span className="h-px w-12 bg-slate-700" />
            <span>{t('sessionsHeadingEyebrow')}</span>
            <ArrowDownRight size={15} className={isRTL ? 'rotate-90' : ''} />
          </div>
        </div>

        <div className="animate-enter-delay relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-8 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.09] to-white/[0.025] p-5 shadow-2xl shadow-black/50 backdrop-blur-sm sm:p-8">
            <HeroVideo />
          </div>
        </div>
      </div>
    </section>
  )
}
