import { useState, useRef, useEffect } from 'react'
import { 
  ArrowRight, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  MessageCircle, 
  Sparkles, 
  X 
} from 'lucide-react'
import { featuredLinks } from '../data/links'
import { useLanguage } from '../context/LanguageContext'

export default function SessionCardsFan({ onSelectShowcase, onOpenOrder }) {
  const { t, isRTL, lang } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxCard, setLightboxCard] = useState(null)
  const stageRef = useRef(null)

  // Track responsive screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const activeSession = featuredLinks[activeIndex] || featuredLinks[0]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + featuredLinks.length) % featuredLinks.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featuredLinks.length)
  }

  // Keyboard navigation between cards
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxCard) {
        if (e.key === 'Escape') setLightboxCard(null)
        return
      }
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxCard])

  const getTranslatedName = (item) => {
    if (lang !== 'ar') return item.name
    if (item.showcaseType === 'video') return t('sessionVideo')
    if (item.showcaseType === 'panels') return t('sessionPanels')
    if (item.showcaseType === 'design') return t('sessionDesign')
    if (item.showcaseType === 'digital') return t('sessionDigital')
    return item.name
  }

  const getTranslatedDetail = (item) => {
    if (lang !== 'ar') return item.detail
    if (item.showcaseType === 'video') return t('sessionVideoDesc')
    if (item.showcaseType === 'panels') return t('sessionPanelsDesc')
    if (item.showcaseType === 'design') return t('sessionDesignDesc')
    if (item.showcaseType === 'digital') return t('sessionDigitalDesc')
    return item.detail
  }

  const getTranslatedBadge = (item) => {
    return lang === 'ar' && item.badgeAr ? item.badgeAr : item.badge
  }

  const getFeaturesList = (item) => {
    return lang === 'ar' && item.featuresAr ? item.featuresAr : item.features || []
  }

  const handleLaunchShowcase = (type) => {
    if (onSelectShowcase) {
      onSelectShowcase(type)
    }
  }

  const handleQuickOrder = (categoryKey) => {
    if (onOpenOrder) {
      onOpenOrder({ categoryKey })
    }
  }

  return (
    <div className="relative w-full">
      {/* Top Deck Info Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 text-sky-400 font-bold text-xs shadow-[0_0_12px_rgba(56,189,248,0.25)]">
            B♦
          </span>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              {t('cardDeckEyebrow')}
            </h4>
            <p className="text-xs text-slate-400">
              {lang === 'ar' 
                ? 'استخدم الأسهم للتنقل بسلاسة بين البطاقات · انقر لاختيار الجلسة' 
                : 'Use arrows to swap cards smoothly · Click any card to select'}
            </p>
          </div>
        </div>

        {/* Live Active Card Counter Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Card {activeIndex + 1} / {featuredLinks.length}</span>
          </span>
        </div>
      </div>

      {/* 3D INTERACTIVE FANNED DECK SECTION */}
      <div className="relative py-4 sm:py-6">
        {/* Ambient Stage Lighting & Card Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-[90%] max-w-2xl rounded-full bg-sky-500/10 blur-[90px]" />

        {/* SWAP ARROWS ON TOP OF CARDS (As shown in reference image) */}
        <div className="relative z-30 mb-3 sm:mb-5 flex items-center justify-center gap-4 sm:gap-6">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={isRTL ? handleNext : handlePrev}
            className="group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-slate-900/90 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-sky-400 hover:bg-sky-500/20 hover:text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] active:scale-95 cursor-pointer"
            aria-label="Previous card"
            title="Previous card"
          >
            <ChevronLeft size={24} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>

          {/* Center Card Pagination Dots */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
            {featuredLinks.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? 'w-7 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Select card ${idx + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={isRTL ? handlePrev : handleNext}
            className="group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-sky-400/30 bg-slate-900/90 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-sky-400 hover:bg-sky-500/20 hover:text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] active:scale-95 cursor-pointer"
            aria-label="Next card"
            title="Next card"
          >
            <ChevronRight size={24} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Card Fan Stage */}
        <div
          ref={stageRef}
          className="cards-stage relative mx-auto flex h-[390px] sm:h-[450px] w-full max-w-xl items-center justify-center select-none"
          style={{ perspective: '1200px' }}
        >
          {featuredLinks.map((item, index) => {
            const isActive = activeIndex === index

            // Fan transform parameters (responsive for mobile & desktop)
            const angles = isMobile ? [-12, -4, 4, 12] : [-16, -5.5, 5.5, 16]
            const baseX = isMobile ? [-85, -28, 28, 85] : [-135, -45, 45, 135]
            const baseY = isMobile ? [8, 0, 0, 8] : [12, 0, 0, 12]

            const rtl = isRTL ? -1 : 1

            let angle = angles[index] * rtl
            let x = baseX[index] * rtl
            let y = baseY[index]
            let scale = 0.98

            if (isActive) {
              // Active card is elevated, straightens upright and scales up in front
              y -= isMobile ? 32 : 44
              angle = angles[index] * 0.2 * rtl
              scale = isMobile ? 1.05 : 1.10
            } else {
              // Non-active cards fan smoothly to the sides
              if (index < activeIndex) {
                x -= (isMobile ? 16 : 28) * rtl
                angle -= 2.5 * rtl
                scale = 0.95
              } else if (index > activeIndex) {
                x += (isMobile ? 16 : 28) * rtl
                angle += 2.5 * rtl
                scale = 0.95
              }
            }

            // Active card is always on top (50), other cards step down gracefully
            const zIndex = isActive ? 50 : 35 - Math.abs(index - activeIndex) * 6

            return (
              <div
                key={item.name}
                onClick={() => setActiveIndex(index)}
                className="playing-card-wrapper absolute cursor-pointer select-none"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${scale})`,
                  zIndex,
                  transformOrigin: '50% 115%',
                  transition: 'transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                  willChange: 'transform',
                }}
                role="button"
                tabIndex={0}
                aria-label={`${item.name} card`}
              >
                <div
                  className={`playing-card relative w-[190px] sm:w-[230px] aspect-[1/1.42] rounded-2xl overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#05070d] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(56,189,248,0.4)]'
                      : 'shadow-xl border border-white/20 hover:border-sky-400/40'
                  }`}
                >
                  {/* The Reference Card Artwork Image */}
                  <img
                    src={item.cardImage}
                    alt={item.name}
                    className="h-full w-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />

                  {/* Specular Holographic Overlay on Active Card */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.18] to-transparent transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Card Rank & Suit Watermark Badge (B ♦) in Corners */}
                  <div className="pointer-events-none absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-md border border-white/20 text-[11px] font-black tracking-wider text-sky-300">
                    <span>B</span>
                    <span className="text-sky-400">♦</span>
                  </div>

                  {/* Zoom Artwork Quick Button on Card */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxCard(item)
                    }}
                    className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white/80 backdrop-blur-md border border-white/20 transition hover:scale-110 hover:bg-sky-500 hover:text-white cursor-pointer"
                    title={t('zoomCard')}
                    aria-label={t('zoomCard')}
                  >
                    <Maximize2 size={13} />
                  </button>

                  {/* Active Selected Card Indicator Pill */}
                  {isActive && (
                    <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-sky-950/90 px-2 py-1 text-[11px] font-bold text-sky-200 backdrop-blur-md border border-sky-400/50 shadow-lg">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                      <span className="truncate">{getTranslatedName(item)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Selection Selector Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {featuredLinks.map((item, idx) => {
            const isSelected = activeIndex === idx
            const Icon = item.icon
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'border border-sky-400/60 bg-sky-500/25 text-white shadow-[0_0_16px_rgba(56,189,248,0.3)] scale-105'
                    : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <Icon size={13} className={isSelected ? 'text-sky-300' : 'text-slate-500'} />
                <span>{getTranslatedName(item)}</span>
                <span className="text-[10px] text-sky-400 font-mono">#{item.cardNum}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ACTIVE CARD INSPECTION & ACTION PANEL */}
      <div className="mt-6 rounded-2xl border border-sky-400/25 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-sky-950/40 p-5 sm:p-6 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left info: Rank, Card title, badge & highlights */}
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-sky-400/40 bg-sky-500/10 px-2 py-0.5 text-xs font-bold text-sky-300">
                <span>BLEUWI CARD #{activeSession.cardNum}</span>
                <span>(B ♦)</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs font-medium text-slate-300">
                <Sparkles size={11} className="text-amber-400" />
                <span>{getTranslatedBadge(activeSession)}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {getTranslatedName(activeSession)}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {getTranslatedDetail(activeSession)}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {getFeaturesList(activeSession).map((feat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300"
                >
                  <Check size={11} className="text-sky-400 flex-none" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right actions: Enter Showcase & Quick WhatsApp Order */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-none lg:w-64">
            <button
              type="button"
              onClick={() => handleLaunchShowcase(activeSession.showcaseType)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:from-white hover:to-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer"
            >
              <span>{t('enterShowcase')}</span>
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </button>

            <button
              type="button"
              onClick={() => handleQuickOrder(activeSession.categoryKey)}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 cursor-pointer"
            >
              <MessageCircle size={15} className="text-emerald-400" />
              <span>{t('quickOrderBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setLightboxCard(activeSession)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-white/20 hover:text-white cursor-pointer"
            >
              <Maximize2 size={13} />
              <span>{t('zoomCard')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL: FULL RESOLUTION CARD ART VIEWER */}
      {lightboxCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-up"
          onClick={() => setLightboxCard(null)}
        >
          <div
            className="relative max-w-sm sm:max-w-md w-full rounded-2xl overflow-hidden border border-white/20 bg-slate-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxCard(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition hover:scale-110 hover:bg-red-500 cursor-pointer"
              aria-label="Close card viewer"
            >
              <X size={18} />
            </button>

            {/* High-res Image */}
            <div className="overflow-hidden rounded-xl">
              <img
                src={lightboxCard.cardImage}
                alt={lightboxCard.name}
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>

            {/* Bottom Modal Bar */}
            <div className="mt-3 flex items-center justify-between px-2 pb-1">
              <div>
                <h4 className="text-sm font-bold text-white">
                  {getTranslatedName(lightboxCard)}
                </h4>
                <p className="text-xs text-sky-400 font-mono">
                  Official BLEUWI Card #{lightboxCard.cardNum} (B ♦)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLightboxCard(null)
                  handleLaunchShowcase(lightboxCard.showcaseType)
                }}
                className="flex items-center gap-1.5 rounded-lg bg-sky-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-white cursor-pointer"
              >
                <span>{t('enterShowcase')}</span>
                <ArrowRight size={13} className={isRTL ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
