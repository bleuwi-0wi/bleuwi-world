import { MoreHorizontal, Play } from 'lucide-react'
import BrandMark from './BrandMark'
import { featuredLinks } from '../data/links'
import { useLanguage } from '../context/LanguageContext'

export default function PreviewCard({ onSelectShowcase, onOpenOrder }) {
  const { t, isRTL, lang } = useLanguage()

  const getTranslatedSessionName = (name) => {
    if (lang !== 'ar') return name
    if (name.includes('VIDEO EDITING')) return t('sessionVideo')
    if (name.includes('CHEAT PANELS')) return t('sessionPanels')
    if (name.includes('DESIGN')) return t('sessionDesign')
    if (name.includes('DEGITAL') || name.includes('DIGITAL')) return t('sessionDigital')
    return name
  }

  const getTranslatedSessionDetail = (name, defaultDetail) => {
    if (lang !== 'ar') return defaultDetail
    if (name.includes('VIDEO EDITING')) return t('sessionVideoDesc')
    if (name.includes('CHEAT PANELS')) return t('sessionPanelsDesc')
    if (name.includes('DESIGN')) return t('sessionDesignDesc')
    if (name.includes('DEGITAL') || name.includes('DIGITAL')) return t('sessionDigitalDesc')
    return defaultDetail
  }

  return (
    <section id="preview" className="section-shell scroll-mt-20">
      <div className="section-heading">
        <p className="eyebrow">{t('sessionsHeadingEyebrow')}</p>
        <h2>
          {lang === 'ar' ? 'عالمك الخاص،' : 'Your world,'}<br />
          <span className="text-gradient">
            {lang === 'ar' ? 'في مكان واحد متكامل.' : 'all in one place.'}
          </span>
        </h2>
        <p>{t('sessionsHeadingDesc')}</p>
      </div>

      <div className="preview-frame animate-fade-up">
        <div className="preview-bar">
          <div className="flex gap-1.5"><i /><i /><i /></div>
          <span>bleuwi.world</span>
          <MoreHorizontal size={18} />
        </div>

        <div className="preview-surface">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,.14),transparent_37%)]" />
          <div className="relative mx-auto max-w-sm py-10 text-center sm:py-14">
            <BrandMark />
            <h3 className="mt-4 text-lg font-semibold text-white">BLEUWI WORLD</h3>
            <p className="mt-1 text-sm text-slate-400">
              {lang === 'ar' ? 'خدمات رقمية وجلسات خاصة' : 'Services & private sessions'}
            </p>

            <div className="mt-7 space-y-3 text-left">
              {featuredLinks.map(({ name, detail, icon: Icon, href }) => {
                const isShowcase = href.includes('?showcase=')
                const showcaseType = isShowcase ? href.split('?showcase=')[1] : null

                const handleClick = (e) => {
                  if (isShowcase && onSelectShowcase) {
                    e.preventDefault()
                    onSelectShowcase(showcaseType)
                  }
                }

                return (
                  <a
                    href={href}
                    className="preview-link cursor-pointer"
                    key={name}
                    onClick={handleClick}
                    title={t('clickToOpenSameTab')}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-300/10 text-sky-200">
                      <Icon size={17} />
                    </span>
                    <span className="flex-1">
                      <b>{getTranslatedSessionName(name)}</b>
                      <small>{getTranslatedSessionDetail(name, detail)}</small>
                    </span>
                    <Play size={13} className={`text-slate-500 flex-none ${isRTL ? 'rotate-180 mr-auto ml-0' : 'ml-auto'}`} fill="currentColor" />
                  </a>
                )
              })}
            </div>

            <div className="mt-8 flex flex-col items-center gap-2.5">
              <p className="text-[10px] font-medium tracking-[0.2em] text-slate-600">
                {lang === 'ar' ? 'اختر قسماً للانتقال إليه مباشرة' : 'CHOOSE A SESSION TO START'}
              </p>
              {onOpenOrder && (
                <button
                  type="button"
                  onClick={() => onOpenOrder({ categoryKey: 'Game Coins' })}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 hover:border-emerald-500/50 cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('quickOrderBtn')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
