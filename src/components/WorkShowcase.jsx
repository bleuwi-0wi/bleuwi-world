import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Coins, CreditCard, Eye, Gamepad2, MessageCircle, ShieldCheck, Sparkles, X, Zap, ZoomIn } from 'lucide-react'
import { digitalServices, cheatPanels } from '../data/links'
import { useLanguage } from '../context/LanguageContext'
import designOne from '../assets/design-1.webp'
import designTwo from '../assets/design-2.webp'
import designThree from '../assets/design-3.webp'
import designFour from '../assets/design-4.webp'
import designFive from '../assets/design-5.webp'
import editOne from '../assets/editing-sample-1.mp4'
import editTwo from '../assets/editing-sample-2.mp4'
import refCoins from '../assets/1.webp'
import refAbonnements from '../assets/2.webp'
import refGames from '../assets/3.webp'
import refPayment from '../assets/4.webp'

const designSamples = [designOne, designTwo, designThree, designFour, designFive]
const videoSamples = [editOne, editTwo]

function LazyShowcaseVideo({ sample, index }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <figure className="portfolio-card video-card">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={`BLEUWI video editing example ${index + 1}`}
      >
        <source src={sample} type="video/mp4" />
      </video>
      <figcaption>VIDEO SAMPLE {String(index + 1).padStart(2, '0')}</figcaption>
    </figure>
  )
}

const serviceImages = {
  'game-coins': {
    src: refCoins,
    alt: 'Game Coins & Currencies Official Reference Picture',
    label: 'Coins & Points Reference',
  },
  'abonnements': {
    src: refAbonnements,
    alt: 'Subscriptions & Abonnements Official Reference Picture',
    label: 'Abonnements Reference',
  },
  'sell-games': {
    src: refGames,
    alt: 'Sell Games & Digital Keys Official Reference Picture',
    label: 'Games & Keys Reference',
  },
  'payment-methods': {
    src: refPayment,
    alt: 'BLEUWI Official Accepted Payment Methods Reference Picture',
    label: 'Payment Methods Reference',
  },
}

export default function WorkShowcase({ type = 'all', onBack, onSelectType, onOpenOrder }) {
  const [lightboxImage, setLightboxImage] = useState(null)
  const { t, lang, isRTL } = useLanguage()

  const showVideo = type === 'all' || type === 'video'
  const showPanels = type === 'all' || type === 'panels'
  const showDesign = type === 'all' || type === 'design'
  const showDigital = type === 'all' || type === 'digital' || type === 'services'

  const getDigitalCategoryKey = (id) => {
    if (id === 'game-coins') return 'Game Coins'
    if (id === 'abonnements') return 'Abonnements'
    if (id === 'sell-games') return 'Sell Games'
    return 'Payment Methods'
  }

  const getCardTitle = (service) => {
    if (lang !== 'ar') return service.title
    if (service.id === 'game-coins') return t('digitalCoinsTitle')
    if (service.id === 'abonnements') return t('digitalAbonnementsTitle')
    if (service.id === 'sell-games') return t('digitalSellGamesTitle')
    if (service.id === 'payment-methods') return 'طرق الدفع المقبولة'
    return service.title
  }

  const getCardTagline = (service) => {
    if (lang !== 'ar') return service.tagline
    if (service.id === 'game-coins') return t('digitalCoinsTagline')
    if (service.id === 'abonnements') return t('digitalAbonnementsTagline')
    if (service.id === 'sell-games') return t('digitalSellGamesTagline')
    if (service.id === 'payment-methods') return 'البنوك المغربية وبوابات الدفع العالمية المعتمدة مع تسليم وتأكيد فوري.'
    return service.tagline
  }

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImage(null)
    }
    if (lightboxImage) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxImage])

  return (
    <section className="section-shell portfolio-section" aria-labelledby="portfolio-heading">
      {onBack && (
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300/40 hover:bg-sky-300/[0.14] cursor-pointer"
          >
            <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
            <span>{t('navBack')}</span>
          </button>
        </div>
      )}

      <div className="section-heading">
        <p className="eyebrow">{t('sessionsHeadingEyebrow')}</p>
        <h2 id="portfolio-heading">
          {type === 'video'
            ? (lang === 'ar' ? 'مونتاج الفيديو ' : 'Video editing ')
            : type === 'panels'
            ? (lang === 'ar' ? 'بانيل الألعاب ' : 'Cheat panels ')
            : type === 'design'
            ? (lang === 'ar' ? 'التصميم والتطوير ' : 'Design / dev ')
            : type === 'digital' || type === 'services'
            ? (lang === 'ar' ? 'الخدمات ' : 'Degital ')
            : (lang === 'ar' ? 'استكشف ' : 'Explore all ')}
          <span className="text-gradient">
            {type === 'video'
              ? (lang === 'ar' ? 'والإنتاج.' : 'session.')
              : type === 'panels'
              ? (lang === 'ar' ? 'والحماية.' : 'session.')
              : type === 'design'
              ? (lang === 'ar' ? 'الإبداعي.' : 'session.')
              : type === 'digital' || type === 'services'
              ? (lang === 'ar' ? 'الرقمية.' : 'servises.')
              : (lang === 'ar' ? 'جميع الأقسام.' : 'sessions.')}
          </span>
        </h2>
        <p>
          {type === 'video'
            ? t('sessionVideoDesc')
            : type === 'panels'
            ? t('sessionPanelsDesc')
            : type === 'design'
            ? t('sessionDesignDesc')
            : type === 'digital' || type === 'services'
            ? t('digitalCoinsTagline') + ' ' + (lang === 'ar' ? 'انقر على الصور المرجعية لمعاينة التفاصيل، أو اطلب مباشرة عبر واتساب!' : 'Click the picture references to inspect details, or order directly via WhatsApp!')
            : t('sessionsHeadingDesc')}
        </p>

        {onSelectType && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectType('video')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                type === 'video'
                  ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-sky-300/30 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'مونتاج الفيديو' : 'Video Editing'}
            </button>
            <button
              type="button"
              onClick={() => onSelectType('panels')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                type === 'panels'
                  ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-sky-300/30 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'بانيل الألعاب' : 'Cheat Panels'}
            </button>
            <button
              type="button"
              onClick={() => onSelectType('design')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                type === 'design'
                  ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-sky-300/30 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'التصميم والتطوير' : 'Design / Dev'}
            </button>
            <button
              type="button"
              onClick={() => onSelectType('digital')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                type === 'digital' || type === 'services'
                  ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-sky-300/30 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'الخدمات وطرق الدفع' : 'Digital Services & Payments'}
            </button>
            <button
              type="button"
              onClick={() => onSelectType('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                type === 'all'
                  ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:border-sky-300/30 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'جميع الأقسام' : 'All Sessions'}
            </button>
          </div>
        )}
      </div>

      {/* SESSION 1: VIDEO EDITING */}
      {showVideo && (
        <div className="portfolio-group">
          <div className="portfolio-label">
            <span>01</span>
            <h3>{lang === 'ar' ? 'قسم مونتاج الفيديو' : 'Video Editing Session'}</h3>
          </div>
          <div className="video-grid">
            {videoSamples.map((sample, index) => (
              <LazyShowcaseVideo key={sample} sample={sample} index={index} />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/20 via-sky-950/10 to-black/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {lang === 'ar' ? 'هل تريد طلب مونتاج لفيديوهاتك؟' : 'Ready to Order Video Editing?'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar' ? 'أرسل تفاصيل مقطعك، يوتيوب أو تيك توك، وسنناقش العمل مباشرة عبر واتساب.' : 'Send your footage specs, YouTube or TikTok requirements directly on WhatsApp.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenOrder && onOpenOrder({ categoryKey: 'Video Editing', specificItem: 'YouTube Long-Form Video Edit' })}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-emerald-300 cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>{lang === 'ar' ? 'اطلب المونتاج عبر واتساب' : 'Order Video Edit on WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SESSION 2: CHEAT PANELS */}
      {showPanels && (
        <div className="portfolio-group">
          <div className="portfolio-label">
            <span>02</span>
            <h3>{lang === 'ar' ? 'قسم بانيل الألعاب والهاكات' : 'Cheat Panels Session'}</h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {cheatPanels.map((panel, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-xl hover:shadow-sky-500/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-sky-200 uppercase">
                      <Zap size={12} className="text-sky-300" />
                      {panel.badge}
                    </span>
                  </div>

                  <h4 className="mt-4 text-lg font-semibold text-white group-hover:text-sky-100">
                    {panel.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {panel.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-white/[0.08] pt-4">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{t('availableItemsLabel')}</p>
                    {panel.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={14} className="mt-0.5 flex-none text-sky-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    type="button"
                    onClick={() => onOpenOrder && onOpenOrder({
                      categoryKey: 'Cheat Panels',
                      specificItem: panel.title,
                      defaultNotes: panel.description,
                    })}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-emerald-300 cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>{t('orderOnWhatsApp')}</span>
                    <ArrowRight size={13} className={isRTL ? 'rotate-180' : ''} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SESSION 3: DESIGN / DEV */}
      {showDesign && (
        <div className="portfolio-group">
          <div className="portfolio-label">
            <span>03</span>
            <h3>{lang === 'ar' ? 'قسم التصميم والتطوير' : 'Design / Dev Session'}</h3>
          </div>
          <div className="design-grid">
            {designSamples.map((sample, index) => (
              <figure className="portfolio-card" key={sample}>
                <img src={sample} alt={`BLEUWI design example ${index + 1}`} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/20 via-sky-950/10 to-black/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {lang === 'ar' ? 'هل تريد تصميم هوية بصرية أو موقع ويب؟' : 'Want Custom Branding or Web Development?'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar' ? 'لوغوهات، صور مصغرة، تصاميم ستريم، أو تطبيقات ويب لصناع المحتوى مع نقاش فوري عبر واتساب.' : 'Logos, thumbnails, stream packs, or full creator web apps with instant WhatsApp discussion.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenOrder && onOpenOrder({ categoryKey: 'Design / Dev', specificItem: 'Custom Creator Website / Web App' })}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-emerald-300 cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>{lang === 'ar' ? 'اطلب التصميم عبر واتساب' : 'Order Design / Web on WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SESSION 4: DEGITAL SERVISES (ONLINE SERVICES) */}
      {showDigital && (
        <div className="portfolio-group">
          <div className="portfolio-label">
            <span>04</span>
            <h3>{t('digitalHeadingLabel')}</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {digitalServices.map((service) => {
              const ServiceIcon = service.icon
              const categoryKey = getDigitalCategoryKey(service.id)
              const refImg = serviceImages[service.id]

              const cardTitle = getCardTitle(service)
              const cardTagline = getCardTagline(service)

              return (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/10"
                >
                  <div>
                    {/* Visual Image Reference Header Card */}
                    {refImg && (
                      <div
                        className="group/img relative mb-4 h-48 w-full overflow-hidden rounded-xl border border-white/15 bg-black/80 cursor-pointer shadow-lg transition-transform duration-300 hover:border-sky-400/60"
                        onClick={() => setLightboxImage({
                          src: refImg.src,
                          title: cardTitle,
                          categoryKey,
                          subtitle: cardTagline,
                          alt: refImg.alt,
                        })}
                        title="Click to zoom & inspect full reference sheet"
                      >
                        <img
                          src={refImg.src}
                          alt={refImg.alt}
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080d18] via-black/20 to-black/30 opacity-70 group-hover/img:opacity-40 transition-opacity" />

                        {/* Top-right Zoom Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-semibold text-sky-200 backdrop-blur-md border border-sky-400/30 shadow-md">
                            <ZoomIn size={12} className="text-sky-400" />
                            <span>{t('clickToZoom')}</span>
                          </span>
                        </div>

                        {/* Bottom Info Bar */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="text-[10px] font-medium tracking-wide text-white bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                            {lang === 'ar' ? 'صورة مرجعية' : 'Reference Picture'}
                          </span>
                          <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                            {t('officialSheetBadge')}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-emerald-200 uppercase">
                        <ServiceIcon size={12} className="text-emerald-300" />
                        {service.badge}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{service.category}</span>
                    </div>

                    <h4 className="mt-3.5 text-xl font-semibold text-white group-hover:text-emerald-100">
                      {cardTitle}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      {cardTagline}
                    </p>

                    <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-3.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{t('availableItemsLabel')}</p>
                        <span className="text-[10px] text-emerald-400 font-medium">{t('clickItemToOrder')}</span>
                      </div>
                      {service.items.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => onOpenOrder && onOpenOrder({
                            categoryKey,
                            specificItem: item.name,
                            defaultNotes: item.desc,
                          })}
                          className="flex items-center justify-between gap-2 text-xs p-1.5 rounded-lg transition hover:bg-white/[0.06] cursor-pointer group/item"
                          title="Click to customize this item on WhatsApp"
                        >
                          <div className="flex items-center gap-2 text-slate-200 font-medium group-hover/item:text-emerald-300">
                            <CheckCircle2 size={14} className="flex-none text-emerald-400" />
                            <span>{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400 group-hover/item:text-slate-200">{item.desc}</span>
                            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/20">
                              {t('orderAction')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2">
                    <button
                      type="button"
                      onClick={() => onOpenOrder && onOpenOrder({
                        categoryKey,
                        specificItem: service.items[0]?.name || '',
                        defaultNotes: cardTagline,
                      })}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-emerald-300 hover:shadow-emerald-500/40 cursor-pointer"
                    >
                      <MessageCircle size={16} />
                      <span>{t('orderOnWhatsApp')}</span>
                      <ArrowRight size={15} className={isRTL ? 'rotate-180' : ''} />
                    </button>

                    {refImg && (
                      <button
                        type="button"
                        onClick={() => setLightboxImage({
                          src: refImg.src,
                          title: cardTitle,
                          categoryKey,
                          subtitle: cardTagline,
                          alt: refImg.alt,
                        })}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                      >
                        <Eye size={13} className="text-sky-300" />
                        <span>{t('viewReferenceSheet')}</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL TO ZOOM & EXAMINE IMAGE REFERENCES */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={() => setLightboxImage(null)}
            aria-hidden="true"
          />

          {/* Lightbox Dialog Container */}
          <div className="relative z-10 my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-sky-400/30 bg-[#070b14] p-4 sm:p-6 shadow-2xl shadow-sky-950 text-white animate-fade-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t('officialSheetBadge')}
                </span>
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  {lightboxImage.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                aria-label="Close image preview"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="relative my-3 flex flex-1 items-center justify-center overflow-auto rounded-xl bg-black/90 p-2 sm:p-3 border border-white/5">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt || lightboxImage.title}
                className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-3">
              <p className="text-xs text-slate-400 text-center sm:text-left">
                {lightboxImage.subtitle}
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const cat = lightboxImage.categoryKey
                    setLightboxImage(null)
                    if (onOpenOrder) onOpenOrder({ categoryKey: cat })
                  }}
                  className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-emerald-300 cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>{t('orderOnWhatsApp')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
