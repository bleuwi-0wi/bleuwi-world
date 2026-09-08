import { ArrowRight } from 'lucide-react'
import HeroVideo from './HeroVideo'
import { useLanguage } from '../context/LanguageContext'

export default function Hero({ onOpenOrder }) {
  const { t, isRTL } = useLanguage()

  return (
    <section id="home" className="relative isolate overflow-hidden pt-28 sm:pt-36">
      <div className="hero-glow" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-4 sm:pb-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-6">
        <div className="animate-enter relative z-10">
          <div className="eyebrow">
            <span className="pulse-dot" />
            <span>{t('heroEyebrow')}</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl min-[400px]:text-5xl sm:text-7xl lg:text-[5.35rem] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
            {t('heroTitlePrefix')}<br />
            <span className="text-gradient">{t('heroTitleGradient')}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-8 text-slate-400">
            {t('heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a className="button-primary" href="#preview">
              <span>{t('heroCtaExplore')}</span>
              <ArrowRight size={17} className={isRTL ? 'rotate-180' : ''} />
            </a>
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
