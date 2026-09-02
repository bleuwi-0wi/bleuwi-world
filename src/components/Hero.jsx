import { ArrowDownRight, ArrowRight, MessageCircle, Play } from 'lucide-react'
import HeroVideo from './HeroVideo'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t, isRTL } = useLanguage()

  return (
    <section id="home" className="relative isolate overflow-hidden pt-32 sm:pt-40">
      <div className="hero-glow" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-32">
        <div className="animate-enter relative z-10">
          <div className="eyebrow">
            <span className="pulse-dot" />
            <span>{t('heroEyebrow')}</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl lg:text-[5.35rem]">
            {t('heroTitlePrefix')}<br />
            <span className="text-gradient">{t('heroTitleGradient')}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl">
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
          <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
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
