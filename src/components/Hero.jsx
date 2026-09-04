import { ArrowDownRight, ArrowRight, MessageCircle, Play, CreditCard, Flame, Gem, Sparkles } from 'lucide-react'
import HeroVideo from './HeroVideo'
import { useLanguage } from '../context/LanguageContext'

export default function Hero({ onOpenWarranty, onOpenOrder }) {
  const { t, isRTL, lang } = useLanguage()

  const heroPayments = [
    'CIH Bank',
    'Attijariwafa',
    'Cash Plus',
    'PayPal',
    'Binance USDT',
    'Visa / MC',
  ]

  const topOffers = [
    {
      id: 'freefire',
      name: 'Free Fire 💎',
      nameAr: 'جواهر فري فاير 💎',
      price: '60 DH',
      sub: '1$=10DH',
      color: 'border-amber-400/50 bg-amber-500/15 text-amber-300 hover:border-amber-400 hover:bg-amber-500/25',
      categoryKey: 'Free Fire Diamonds',
      productName: 'Free Fire 530 Diamonds',
      productPrice: '60 DH',
    },
    {
      id: 'gta-v',
      name: 'GTA V (PC)',
      nameAr: 'قراند GTA V',
      price: '200 DH',
      sub: 'PC ONLY',
      color: 'border-sky-400/40 bg-sky-500/15 text-sky-300 hover:border-sky-400 hover:bg-sky-500/25',
      categoryKey: 'Sell Games',
      productName: 'Grand Theft Auto V',
      productPrice: '200 DH',
    },
    {
      id: 'red-dead-2',
      name: 'Red Dead 2',
      nameAr: 'ريد ديد 2',
      price: '250 DH',
      sub: 'PC ONLY',
      color: 'border-rose-400/40 bg-rose-500/15 text-rose-300 hover:border-rose-400 hover:bg-rose-500/25',
      categoryKey: 'Sell Games',
      productName: 'Red Dead Redemption 2',
      productPrice: '250 DH',
    },
    {
      id: 'fifa',
      name: 'FIFA (PC)',
      nameAr: 'فيفا FIFA',
      price: '200 DH',
      sub: 'PC ONLY',
      color: 'border-teal-400/40 bg-teal-500/15 text-teal-300 hover:border-teal-400 hover:bg-teal-500/25',
      categoryKey: 'Sell Games',
      productName: 'EA SPORTS FC / FIFA',
      productPrice: '200 DH',
    },
    {
      id: 'discord-nitro',
      name: 'Discord Nitro',
      nameAr: 'دسكورد نيترو',
      price: '70 DH',
      sub: 'Full Nitro',
      color: 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300 hover:border-indigo-400 hover:bg-indigo-500/25',
      categoryKey: 'Abonnements',
      productName: 'Discord Nitro',
      productPrice: '70 DH',
    },
    {
      id: 'capcut-pro',
      name: 'CapCut Pro',
      nameAr: 'كاب كات برو',
      price: '90 DH',
      sub: '1M VIP',
      color: 'border-blue-400/40 bg-blue-500/15 text-blue-300 hover:border-blue-400 hover:bg-blue-500/25',
      categoryKey: 'Abonnements',
      productName: 'CapCut Pro (1 Month)',
      productPrice: '90 DH',
    },
    {
      id: 'spotify-1m',
      name: 'Spotify Premium',
      nameAr: 'سبوتيفاي بريميوم',
      price: '70 DH',
      sub: '1M Ad-Free',
      color: 'border-green-400/40 bg-green-500/15 text-green-300 hover:border-green-400 hover:bg-green-500/25',
      categoryKey: 'Abonnements',
      productName: 'Spotify Premium (1 Month)',
      productPrice: '70 DH',
    },
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

          {/* Top Hot Sellers Quick Banner with Free Fire & GTA */}
          <div className="mt-6 flex flex-col gap-2.5">
            <a
              href="#hot-sellers"
              className="group inline-flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.15)] transition hover:scale-[1.01] hover:border-amber-400/80 hover:bg-amber-500/25 hover:text-white"
            >
              <Flame size={14} className="text-amber-400 animate-pulse flex-none" />
              <span>{lang === 'ar' ? '🔥 أقوى العروض في الأعلى:' : '🔥 Hot Offers at Top:'}</span>
              <span className="text-white font-semibold">
                {lang === 'ar'
                  ? 'جواهر فري فاير (60DH / 1$=10DH) · قراند GTA V (200DH) · ريد ديد (250DH) · فيفا (200DH) · دسكورد (70DH) · كاب كات (90DH) · سبوتيفاي (70DH)'
                  : 'Free Fire 💎 (60DH / 1$=10DH) · GTA V (200DH) · RDR2 (250DH) · FIFA (200DH) · Discord (70DH) · CapCut (90DH) · Spotify (70DH)'}
              </span>
              <ArrowRight size={13} className={`text-amber-400 transition-transform group-hover:translate-x-0.5 flex-none ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
            </a>

            {/* Quick Interactive Offer Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {topOffers.map((offer) => (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => {
                    if (onOpenOrder) {
                      onOpenOrder({
                        categoryKey: offer.categoryKey,
                        specificItem: offer.productName,
                        productName: offer.productName,
                        productPrice: offer.productPrice,
                      })
                    } else {
                      const el = document.getElementById('hot-sellers')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className={`group/chip flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all hover:scale-105 shadow-sm cursor-pointer ${offer.color}`}
                  title={`${offer.name} - ${offer.price}`}
                >
                  {offer.id === 'freefire' ? (
                    <Gem size={12} className="text-amber-400 animate-bounce" />
                  ) : offer.id === 'gta-v' ? (
                    <Flame size={12} className="text-sky-300" />
                  ) : (
                    <Sparkles size={11} className="opacity-80" />
                  )}
                  <span>{lang === 'ar' ? offer.nameAr : offer.name}</span>
                  <span className="rounded bg-black/40 px-1.5 py-0.2 text-[10px] font-mono text-white">
                    {offer.price}
                  </span>
                </button>
              ))}
            </div>
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
