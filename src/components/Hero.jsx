import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Star, 
  MessageCircle, 
  Gem, 
  Key, 
  Sparkles, 
  Flame, 
  CheckCircle2 
} from 'lucide-react'
import HeroVideo from './HeroVideo'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_DIRECT_LINK } from '../data/links'

export default function Hero({ onOpenOrder }) {
  const { t, isRTL, lang } = useLanguage()

  const trustPillars = [
    {
      icon: Zap,
      title: t('trustPillar1Title'),
      desc: t('trustPillar1Desc'),
      color: 'text-amber-400 bg-amber-500/10 border-amber-400/20'
    },
    {
      icon: ShieldCheck,
      title: t('trustPillar2Title'),
      desc: t('trustPillar2Desc'),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20'
    },
    {
      icon: CreditCard,
      title: t('trustPillar3Title'),
      desc: t('trustPillar3Desc'),
      color: 'text-sky-400 bg-sky-500/10 border-sky-400/20'
    },
    {
      icon: Star,
      title: t('trustPillar4Title'),
      desc: t('trustPillar4Desc'),
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-400/20'
    },
  ]

  const quickCategories = [
    { name: lang === 'ar' ? 'جواهر فري فاير (1$ = 10 DH)' : 'Free Fire (1$ = 10 DH)', href: '#hot-sellers', icon: Gem, color: 'hover:border-amber-400/50 hover:text-amber-300' },
    { name: lang === 'ar' ? 'ويندوز وأوفيس أصلي' : 'Windows & Office', href: '#hot-sellers', icon: Key, color: 'hover:border-sky-400/50 hover:text-sky-300' },
    { name: lang === 'ar' ? 'اشتراكات AI (GPT/Claude)' : 'AI Subscriptions', href: '#hot-sellers', icon: Sparkles, color: 'hover:border-purple-400/50 hover:text-purple-300' },
    { name: lang === 'ar' ? 'طرق الدفع (CIH/كاش بلوس)' : 'Payment Methods', href: '#payments', icon: CreditCard, color: 'hover:border-emerald-400/50 hover:text-emerald-300' },
  ]

  return (
    <section id="home" className="relative isolate overflow-hidden pt-28 sm:pt-36 pb-12 sm:pb-16">
      <div className="hero-glow" />

      {/* Main Hero Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          
          {/* Left Column: Clear Value Proposition */}
          <div className="animate-enter relative z-10 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* Store Identity Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.15)] backdrop-blur-md">
              <span className="pulse-dot" />
              <span>{t('heroEyebrow')}</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="mt-5 text-3xl min-[420px]:text-4xl sm:text-6xl lg:text-[4.25rem] font-black leading-[1.05] tracking-tight text-white">
              {t('heroTitlePrefix')}<br />
              <span className="text-gradient">{t('heroTitleGradient')}</span>
            </h1>

            {/* Clear Explanation of What the Store Sells */}
            <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300">
              {t('heroSubtitle')}
            </p>

            {/* Action Buttons: One Obvious Primary CTA + Direct WhatsApp */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a 
                href="#hot-sellers"
                className="btn-cta-primary text-sm sm:text-base py-3.5 px-6 shadow-emerald-500/30 hover:shadow-emerald-500/50"
              >
                <span>{t('heroCtaDeals')}</span>
                <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </a>

              <a
                href={WHATSAPP_DIRECT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-secondary text-sm sm:text-base py-3 px-5"
              >
                <MessageCircle size={18} className="text-emerald-400" />
                <span>{t('heroCtaWhatsAppOrder')}</span>
              </a>
            </div>

            {/* Quick Category Chips */}
            <div className="mt-8 pt-5 border-t border-white/[0.08]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                {t('quickJumpLabel')}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {quickCategories.map((cat, idx) => {
                  const Icon = cat.icon
                  return (
                    <a
                      key={idx}
                      href={cat.href}
                      className={`inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all ${cat.color} hover:bg-white/[0.08]`}
                    >
                      <Icon size={13} className="shrink-0" />
                      <span>{cat.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Video / Artwork */}
          <div className="animate-enter-delay relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-8 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.09] to-white/[0.025] p-4 sm:p-7 shadow-2xl shadow-black/50 backdrop-blur-md">
              <HeroVideo />

              {/* Status Guarantee Tag under video */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/40 px-3.5 py-2 text-xs backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="font-bold text-white">{t('heroStatusOnline')}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-sky-300">
                  <CheckCircle2 size={13} className="text-sky-400" />
                  <span>{t('heroStatusVerified')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTEGRATED TRUST BAR (Immediately Explains Why Customers Trust BLEUWI) */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 sm:p-4 backdrop-blur-xl transition-all duration-200 hover:border-sky-400/30 hover:bg-white/[0.05]"
              >
                <div className={`grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl border ${item.color} shrink-0 shadow-sm`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
