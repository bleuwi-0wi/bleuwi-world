import { useEffect } from 'react'
import {
  ShieldCheck,
  RotateCcw,
  Headphones,
  Sparkles,
  Lock,
  Clock,
  X,
  MessageCircle,
  ArrowRight,
  Crown,
  Check
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_NUMBER } from '../data/links'

export default function WarrantyModal({ isOpen, onClose, onOpenOrder }) {
  const { lang, isRTL } = useLanguage()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const pillars = [
    {
      icon: RotateCcw,
      titleAr: 'ضمان الاستبدال الفوري (Instant Replacement)',
      titleEn: 'Instant Replacement Guarantee',
      descAr: 'إذا واجهت أي مشكلة فنية أو عدم توافق في المفتاح أو الحساب، يتم تعويضك فوراً بكود أو حساب بديل جديد في غضون دقائق معدودة دون تعقيدات.',
      descEn: 'If you encounter any technical glitch or activation issue, we provide an immediate fresh replacement code or account within minutes—no hassle.',
      badgeAr: 'استبدال 100%',
      badgeEn: '100% Replacement',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      icon: Headphones,
      titleAr: 'دعم فني مباشر 24/7 (Live Support)',
      titleEn: '24/7 Dedicated WhatsApp Support',
      descAr: 'خدمة عملاء حقيقية متواصلة عبر واتساب لمساعدتك خطوة بخطوة في التحميل، التثبيت، وتفعيل الحساب على جهازك وضمان تشغيله بسلاسة.',
      descEn: 'Direct personal support on WhatsApp guiding you step-by-step through download, installation, and activation on your PC or mobile.',
      badgeAr: 'رد فوري سريع',
      badgeEn: 'Instant Reply',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: ShieldCheck,
      titleAr: 'منتجات ومفاتيح رسمية 100% (Official & Legit)',
      titleEn: '100% Authentic & Licensed Products',
      descAr: 'جميع الحسابات والاشتراكات والمفاتيح مرخصة ورسمية 100%، تعمل بشكل أصلي على منصات Steam، Epic Games، Rockstar، EA App، Discord، و Spotify.',
      descEn: 'Every digital key, subscription, and account is 100% authentic, verified, and officially supported across Steam, Epic, Rockstar, EA, Discord & Spotify.',
      badgeAr: 'مرخص رسمي',
      badgeEn: 'Official License',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: Lock,
      titleAr: 'دفع آمن ومحمي بوصل رسمي (Secure Payments)',
      titleEn: 'Secure Moroccan & Global Payments',
      descAr: 'تعاملات مالية موثقة عبر الحسابات البنكية المغربية (CIH، التجاري، البريد بنك، كاش بلوس) أو بوابات الدفع العالمية (PayPal، Binance USDT) مع تسليم فوري بعد إرسال الوصل.',
      descEn: 'Transparent and safe transfers via major Moroccan banks (CIH, Attijariwafa, Cash Plus, Barid) or global options (PayPal, Binance USDT) with receipt verification.',
      badgeAr: 'حماية كاملة',
      badgeEn: 'Fully Protected',
      color: 'from-purple-500 to-indigo-600',
    },
  ]

  const handleContactSupport = () => {
    const text = encodeURIComponent(
      lang === 'ar'
        ? 'السلام عليكم BLEUWI! أريد الاستفسار عن الضمان الذهبي لطلبات الألعاب والاشتراكات.'
        : 'Hello BLEUWI! I would like to inquire about the Golden Warranty Guarantee for my order.'
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleOrderWithWarranty = () => {
    onClose()
    if (onOpenOrder) {
      onOpenOrder({
        defaultNotes: lang === 'ar' ? 'طلب مشمول بالضمان الذهبي 100%' : 'Order with 100% Golden Warranty',
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-b from-[#0e121e] via-[#080c16] to-[#04060b] p-5 sm:p-7 shadow-2xl shadow-amber-500/20 z-10 my-auto text-white animate-fade-up backdrop-blur-2xl"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Golden Ambient Glows */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between border-b border-amber-400/20 pb-4 flex-none">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-400/50 bg-gradient-to-br from-amber-500/25 to-yellow-500/10 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] flex-none">
              <Crown size={22} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {lang === 'ar' ? 'الضمان الذهبي الرسمي' : 'BLEUWI Golden Warranty'}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-black text-amber-300 shadow-sm">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>100% GUARANTEE</span>
                </span>
              </div>
              <p className="mt-0.5 text-xs text-amber-200/70">
                {lang === 'ar' 
                  ? 'تسوق براحة بال تامة — كل طلبية مشمولة بالحماية الشاملة' 
                  : 'Shop with full peace of mind — every order is fully protected'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-white cursor-pointer flex-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="relative mt-4 space-y-3.5 flex-1 overflow-y-auto pr-1">
          {/* Top Trust Summary Box */}
          <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-amber-500/10 p-4 text-xs text-amber-100/90 leading-relaxed shadow-inner">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-sm block mb-1">
                  {lang === 'ar' ? 'عهد وميثاق الثقة من BLEUWI WORLD:' : 'The BLEUWI Commitment to You:'}
                </span>
                <p>
                  {lang === 'ar'
                    ? 'نحن لا نبيع مجرد ألعاب أو اشتراكات، بل نقدم تجربة متكاملة تبدأ من لحظة استفسارك وحتى تشغيلك للعبة أو الخدمة بنجاح 100%. في حال واجهت أي عائق، فنحن ملتزمون بحله فوراً أو استبدال المنتج دون أي تردد.'
                    : 'We do not just provide game keys and subscriptions; we deliver a complete experience backed by our promise to resolve any hurdle or immediately replace your item without friction.'}
                </p>
              </div>
            </div>
          </div>

          {/* The 4 Trust Pillars */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.06] hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
                        <Icon size={17} />
                      </div>
                      <span className="rounded-md border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {lang === 'ar' ? pillar.badgeAr : pillar.badgeEn}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {lang === 'ar' ? pillar.titleAr : pillar.titleEn}
                    </h4>
                    <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
                      {lang === 'ar' ? pillar.descAr : pillar.descEn}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/[0.05] flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                    <Check size={12} />
                    <span>{lang === 'ar' ? 'مشمول ومفعل تلقائياً' : 'Active on all orders'}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Delivery & Speed Promise */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-3 flex items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-sky-400 shrink-0" />
              <span>{lang === 'ar' ? 'متوسط سرعة التسليم عبر واتساب:' : 'Average delivery speed on WhatsApp:'}</span>
            </div>
            <span className="font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md text-[11px]">
              5 - 15 Min ⚡
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center gap-3 flex-none">
          <button
            type="button"
            onClick={handleOrderWithWarranty}
            className="flex-1 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 py-3 px-5 text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Crown size={16} className="fill-slate-950" />
            <span>{lang === 'ar' ? 'اطلب الآن تحت الضمان الذهبي' : 'Order Now with Golden Warranty'}</span>
            <ArrowRight size={15} className={isRTL ? 'rotate-180' : ''} />
          </button>

          <button
            type="button"
            onClick={handleContactSupport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 px-4 text-xs font-bold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <MessageCircle size={16} className="text-emerald-400" />
            <span>{lang === 'ar' ? 'تحدث مع الدعم الفني 24/7' : 'WhatsApp Support'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
