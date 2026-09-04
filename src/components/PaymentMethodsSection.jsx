import { useState } from 'react'
import { CheckCircle2, CreditCard, MessageCircle, ShieldCheck, ZoomIn, X, ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_NUMBER } from '../data/links'
import refPayment from '../assets/4.webp'

export default function PaymentMethodsSection({ onOpenOrder }) {
  const { lang, isRTL } = useLanguage()
  const [zoomOpen, setZoomOpen] = useState(false)

  const paymentList = [
    { name: 'CIH Bank', type: lang === 'ar' ? 'تحويل بنكي فوري (RIB)' : 'Instant RIB Transfer (Morocco)' },
    { name: 'Attijariwafa bank', type: lang === 'ar' ? 'إيداع وحساب بنكي' : 'Bank Account Deposit' },
    { name: 'Barid Bank', type: lang === 'ar' ? 'البريد بنك المغرب' : 'Poste Maroc / Barid' },
    { name: 'Cash Plus & Wafacash', type: lang === 'ar' ? 'دفع نقدي عبر الوكالات' : 'Cash Across Agencies' },
    { name: 'PayPal (Global)', type: lang === 'ar' ? 'دولي (Friends & Family)' : 'Global International USD/EUR' },
    { name: 'Binance USDT', type: lang === 'ar' ? 'دفع كريبتو بدون عمولة' : 'Zero-Fee Crypto Pay (USDT)' },
    { name: 'Visa & Mastercard', type: lang === 'ar' ? 'بطاقات بنكية دولية' : 'International Online Cards' },
  ]

  const getWhatsAppPaymentLink = () => {
    const msg = encodeURIComponent(
      lang === 'ar'
        ? 'السلام عليكم BLEUWI! أود تأكيد الدفع لطلبي:\n- طريقة الدفع المختارة: \n- المبلغ: \n- الخدمة المطلوبة: \nيرجى تزويدي بمعلومات الحساب / RIB لإتمام الدفع.'
        : 'Hello BLEUWI! I would like to confirm payment for my order:\n- Chosen Payment Method: \n- Amount: \n- Service: \nPlease send me account details / RIB to complete payment.'
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
  }

  return (
    <section id="payments" className="section-shell scroll-mt-24">
      <div className="section-heading flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="eyebrow">
            <CreditCard size={14} className="text-sky-400" />
            <span>{lang === 'ar' ? 'طرق الدفع الرسمية (اللوحة #04)' : 'Official Payment Methods (Sheet #04)'}</span>
          </p>
          <h2>
            {lang === 'ar' ? 'طرق دفع آمنة وسريعة،' : 'Fast & secure payments,'}<br />
            <span className="text-gradient">
              {lang === 'ar' ? 'محلية في المغرب وعالمياً.' : 'local & global support.'}
            </span>
          </h2>
          <p>
            {lang === 'ar'
              ? 'ندعم جميع البنوك المغربية الرئيسية ووكالات الكاش، بالإضافة لبوابات الدفع العالمية والكريبتو بدون رسوم إضافية.'
              : 'Supporting all major Moroccan banks, cash agencies, and international gateways with zero extra fees.'}
          </p>
        </div>

      </div>

      {/* Main Payment Banner Display */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-b from-sky-400/[0.08] to-white/[0.02] p-5 shadow-2xl backdrop-blur-md sm:p-7">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] items-center">
          {/* Reference Image #04 with Zoom effect */}
          <div
            className="group relative overflow-hidden rounded-xl border border-white/15 bg-black/80 shadow-2xl cursor-pointer transition hover:border-sky-400"
            onClick={() => setZoomOpen(true)}
            title={lang === 'ar' ? 'انقر لتكبير اللوحة المرجعية رقم 4' : 'Click to inspect Official Sheet #04'}
          >
            <img
              src={refPayment}
              alt="BLEUWI Accepted Payment Methods Official Sheet #04"
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/80 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                <ZoomIn size={15} className="text-sky-400" />
                <span>{lang === 'ar' ? 'انقر لتكبير اللوحة' : 'Click to zoom Sheet #04'}</span>
              </span>
            </div>
            <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-sky-300 backdrop-blur-md">
              Official Sheet #04
            </div>
          </div>

          {/* Payment Methods List */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-sky-400 uppercase">
              <ShieldCheck size={16} />
              <span>{lang === 'ar' ? 'طرق الدفع المتاحة والمعتمدة' : 'Accepted Payment Gateways'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paymentList.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs transition hover:border-sky-400/30 hover:bg-sky-400/[0.06]"
                >
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white">{p.name}</h4>
                    <p className="text-[11px] text-slate-400">{p.type}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5 text-xs text-emerald-200">
              <p className="font-medium">
                {lang === 'ar'
                  ? '⚡ تسليم فوري وتأكيد بعد إرسال الوصل أو لقطة الشاشة على واتساب.'
                  : '⚡ Instant activation & safe delivery upon sending payment receipt on WhatsApp.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-up cursor-pointer"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute -top-12 right-0 rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 cursor-pointer"
            >
              <X size={20} />
            </button>
            <img
              src={refPayment}
              alt="BLEUWI Accepted Payment Methods Full Sheet #04"
              className="max-h-[85vh] w-auto rounded-2xl border border-white/20 shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
