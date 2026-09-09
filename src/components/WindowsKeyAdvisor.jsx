import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useShop } from '../context/ShopContext'

const ERROR_CODES_DB = [
  {
    code: '0x803FA067',
    titleAr: 'فشل الترقية من Windows 10/11 Home إلى Pro',
    titleEn: 'Windows Home to Pro In-Place Upgrade Failure',
    causeAr: 'يحدث هذا الخطأ عند محاولة الترقية المباشرة من الإصدار Home إلى Pro باستخدام مفتاح عام (Generic Key) أو عندما تكون أجهزة خوادم مايكروسوفت متصلة بشبكة محلية مفصولة أو مفتاح مستخدم من قبل.',
    fixCommand: 'slmgr.vbs /ipk [RETAIL-KEY]\nslmgr.vbs /ato',
    explanationAr: 'الحل النهائي: إدخال مفتاح ريتيل أصلي مخصص للترقية (Retail Upgrade Key)، ثم تشغيل موجه الأوامر كمسؤول وتنفيذ أمر التفعيل الفوري.',
    productRecommended: 'Windows 11 Pro Genuine Lifetime Key',
    priceMAD: 120,
  },
  {
    code: '0xC004C008',
    titleAr: 'تجاوز المفتاح الحد الأقصى للتفعيل (Exceeded Activation Limit)',
    titleEn: 'Product Key Exceeded Allowed Activation Limit',
    causeAr: 'يحدث لأن المفتاح السابق كان من نوع OEM تم تثبيته على أكثر من جهاز، أو مفتاح منسوخ تم بيعه لعدة أشخاص وحظرته مايكروسوفت على خوادمها المركزية.',
    fixCommand: 'slmgr.vbs /upk\nslmgr.vbs /cpky\nslmgr.vbs /ipk [RETAIL-KEY]\nslmgr.vbs /ato',
    explanationAr: 'الحل النهائي: حذف المفتاح المكرر نهائياً وتثبيت مفتاح ريتيل أصلي فردي مخصص لجهازك فقط مدى الحياة مع ربطه باللوحة الأم.',
    productRecommended: 'Windows 11 Pro Genuine Lifetime Key',
    priceMAD: 120,
  },
  {
    code: '0x8007007B',
    titleAr: 'خادم تفعيل KMS غير موجود (KMS Host Name Does Not Exist)',
    titleEn: 'KMS Host Name Does Not Exist / Corporate Volume Expiry',
    causeAr: 'أشهر خطأ في المغرب؛ يحدث عند شراء جهاز مفعل ببرامج كراك غير رسمية (KMS Pico / KMS Auto) أو ترخيص شركات مؤقت انتهت صلاحيته ولم يعد قادراً على الاتصال بالخادم.',
    fixCommand: 'slmgr.vbs /ckms\nslmgr.vbs /upk\nslmgr.vbs /ipk [RETAIL-KEY]\nslmgr.vbs /ato\nslmgr.vbs /xpr',
    explanationAr: 'الحل النهائي: مسح مسار خادم KMS الوهمي عبر أمر ckms، ثم إدخال مفتاح ريتيل أصلي دائم للتفعيل المباشر من سيرفرات مايكروسوفت الرسمية.',
    productRecommended: 'Windows 10 / 11 Pro Retail Key',
    priceMAD: 120,
  },
  {
    code: '0xC004F074',
    titleAr: 'تعذر الاتصال بخادم خدمة إدارة المفاتيح (KMS Server Unavailable)',
    titleEn: 'No Key Management Service (KMS) Could Be Contacted',
    causeAr: 'نظام التشغيل يحاول البحث عن خادم ترخيص تابع لمؤسسة أو شركة على شبكتك المحلية ولكن الخادم غير متوفر، مما يؤدي إلى ظهور علامة مائية "قم بتفعيل ويندوز".',
    fixCommand: 'slmgr.vbs /ckms\nslmgr.vbs /ipk [RETAIL-KEY]\nslmgr.vbs /ato',
    explanationAr: 'الحل النهائي: التخلص التام من رخص الشركات المؤقتة واستبدالها بترخيص رقمي دائم للأفراد (Digital Retail License) لا يحتاج لأي خوادم وسيطة.',
    productRecommended: 'Windows 11 Pro Genuine Lifetime Key',
    priceMAD: 120,
  },
  {
    code: '0xC004F213',
    titleAr: 'لم يتم العثور على أي مفتاح منتج في اللوحة الأم (No Product Key Found)',
    titleEn: 'Windows Reported No Product Key Was Found On Your Device',
    causeAr: 'يظهر عند تجميع جهاز كمبيوتر جديد كلياً، أو عند تغيير اللوحة الأم (Motherboard)، أو تثبيت ويندوز على قرص SSD جديد فارغ.',
    fixCommand: 'slmgr.vbs /ipk [RETAIL-KEY]\nslmgr.vbs /ato\nslmgr.vbs /xpr',
    explanationAr: 'الحل النهائي: شراء وتثبيت مفتاح ريتيل أصلي يولد ترخيصاً رقمياً دائماً يُحفظ مباشرة في حساب مايكروسوفت وسجلات جهازك مدى الحياة.',
    productRecommended: 'Windows 11 Pro Genuine Lifetime Key',
    priceMAD: 120,
  },
  {
    code: '0x803F7001',
    titleAr: 'تعذر العثور على ترخيص رقمي صالح (Valid Digital License Not Found)',
    titleEn: 'No Valid Digital License Found for Windows',
    causeAr: 'يحدث عند ترقية قطع الهاردوير الرئيسية (مثل المعالج أو المذربورد) أو تنزيل نسخة ويندوز تختلف عن النسخة التي كان الجهاز يمتلكها سابقاً.',
    fixCommand: 'slmgr.vbs /ipk [RETAIL-KEY]\nslmgr.vbs /ato',
    explanationAr: 'الحل النهائي: تفعيل مباشر أونلاين بمفتاح ريتيل جديد معتمد من الشريك الرسمي مع دعم فني 24/7 حتى يظهر لك "Windows is activated with a digital license".',
    productRecommended: 'Windows 11 Pro Genuine Lifetime Key',
    priceMAD: 120,
  },
]

export default function WindowsKeyAdvisor({ onOpenOrder }) {
  const { lang, isRTL } = useLanguage()
  const { formatPrice } = useShop()

  const [activeTab, setActiveTab] = useState('advisor') // 'advisor' | 'errors'

  // Advisor State
  const [goal, setGoal] = useState('gaming') // 'gaming' | 'study' | 'office' | 'design'
  const [currentOS, setCurrentOS] = useState('win10') // 'win10' | 'win11' | 'fresh' | 'expired'
  const [hardwareTier, setHardwareTier] = useState('tpm_yes') // 'tpm_yes' | 'tpm_no' | 'laptop'

  // Error Code Search State
  const [searchErrorCode, setSearchErrorCode] = useState('')
  const [selectedError, setSelectedError] = useState(ERROR_CODES_DB[0])
  const [copiedCode, setCopiedCode] = useState(false)

  // Recommendation logic
  const getRecommendation = () => {
    if (goal === 'gaming') {
      return {
        titleAr: 'ويندوز 11 برو 64-بت الأصلي (Windows 11 Pro Retail Lifetime)',
        titleEn: 'Windows 11 Pro 64-bit Genuine Retail Lifetime',
        reasonAr: 'يدعم معمارية DirectStorage لتسريع تحميل ألعابك بنسبة 70%، وAuto HDR، مع فريمات ثابتة في Free Fire و GTA V و Valorant دون أدنى تأخير في الإدخال (Input Lag).',
        priceMAD: 120,
        badgeAr: 'الخيار الملكي للاعبين 🎮',
        badgeEn: 'Ultimate Gamer Pick 🎮',
        category: 'windows',
      }
    } else if (goal === 'office') {
      return {
        titleAr: 'حزمة أوفيس 2024 LTSC Pro Plus + ويندوز 11 برو (The Professional Suite)',
        titleEn: 'Microsoft Office 2024 LTSC Pro Plus + Windows 11 Pro Combo',
        reasonAr: 'الحل المتكامل للشركات والمحاسبة والعمل اليومي؛ تفعيل أصلي دائم مدى الحياة لبرامج Word و Excel و PowerPoint من موقع مايكروسوفت الرسمي setup.office.com.',
        priceMAD: 250,
        badgeAr: 'حزمة العمل الشاملة 🏢',
        badgeEn: 'All-in-One Office Bundle 🏢',
        category: 'windows',
      }
    } else if (goal === 'design') {
      return {
        titleAr: 'ويندوز 11 برو + حزمة أوفيس 2024 LTSC للمصممين والمونتيرات',
        titleEn: 'Windows 11 Pro + Office 2024 Suite for Creators',
        reasonAr: 'استغلال أقصى طاقة لكروت الشاشة RTX، وتسريع عمليات الرندر في Premiere Pro و Blender، وتوفير استقرار تام ضد الشاشات الزرقاء أثناء العمل المكثف.',
        priceMAD: 250,
        badgeAr: 'أقوى أداء للإنتاج والتصميم 🎨',
        badgeEn: 'Maximum Creative Power 🎨',
        category: 'windows',
      }
    } else {
      // study
      return {
        titleAr: 'حزمة مايكروسوفت أوفيس 2024 LTSC Pro Plus الأصلية الدائمة',
        titleEn: 'Microsoft Office 2024 LTSC Pro Plus Genuine Lifetime Suite',
        reasonAr: 'مثالية للطلبة والبحوث الجامعية؛ تثبيت رسمي مع تحديثات الأمان الدائمة دون اشتراكات شهرية أو فواتير متكررة.',
        priceMAD: 150,
        badgeAr: 'الأفضل للدراسة والبحوث 🎓',
        badgeEn: 'Best for Study & Students 🎓',
        category: 'windows',
      }
    }
  }

  const recommendation = getRecommendation()

  const handleCopyCommand = (cmd) => {
    navigator.clipboard?.writeText(cmd)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2200)
  }

  const filteredErrors = ERROR_CODES_DB.filter(
    (err) =>
      err.code.toLowerCase().includes(searchErrorCode.toLowerCase().trim()) ||
      err.titleAr.toLowerCase().includes(searchErrorCode.toLowerCase().trim()) ||
      err.titleEn.toLowerCase().includes(searchErrorCode.toLowerCase().trim())
  )

  return (
    <section
      id="windows-advisor"
      aria-label={lang === 'ar' ? 'مستشار تراخيص ويندوز وأوفيس وفاحص الأخطاء' : 'Windows & Office Key Advisor'}
      className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Glow Backdrop */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[600px] h-[350px] bg-gradient-to-r from-sky-500/10 via-blue-600/10 to-indigo-500/10 blur-3xl rounded-full" />
      </div>

      {/* Main Container */}
      <div className="rounded-3xl border border-sky-500/25 bg-gradient-to-b from-[#090e1c]/95 via-[#060a14]/98 to-[#04060c] p-6 sm:p-10 shadow-2xl shadow-sky-950/40 backdrop-blur-xl ring-1 ring-white/5">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-inner">
            <span>🛡️</span>
            <span>{lang === 'ar' ? 'المستشار التقني المعتمد من BLEUWI' : 'BLEUWI Smart Key & Diagnostics Advisor'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3">
            {lang === 'ar' ? (
              <>
                مستشار تراخيص <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-400">ويندوز وأوفيس</span> وفاحص أكواد الأخطاء
              </>
            ) : (
              <>
                Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-400">Windows & Office</span> Advisor & Error Solver
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'اختر مواصفات جهازك لتحديد المفتاح الأصلي الأنسب لك بالدرهم المغربي، أو ابحث عن كود الخطأ الذي يظهر في جهازك للحصول على أمر الحل الفوري من سطر الأوامر.'
              : 'Identify the exact genuine lifetime license for your PC specs, or enter your Windows activation error code to generate instant CMD diagnostic commands.'}
          </p>

          {/* Tab Switcher Buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab('advisor')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'advisor'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🧭</span>
              <span>{lang === 'ar' ? 'مستشار التوافق الذكي' : 'License Advisor'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('errors')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'errors'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>⚙️</span>
              <span>{lang === 'ar' ? 'حل أكواد أخطاء التفعيل' : 'Error Code Solver'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: SMART LICENSE ADVISOR
           ======================================================== */}
        {activeTab === 'advisor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Questionnaire */}
            <div className="lg:col-span-7 space-y-6">
              {/* Question 1: Goal */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="block text-xs sm:text-sm font-bold text-sky-300 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono">1</span>
                  <span>{lang === 'ar' ? 'ما هو استخدامك الأساسي للجهاز؟' : 'What is your primary use case?'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'gaming', icon: '🎮', labelAr: 'ألعاب وبثوث وفريمات عالية', labelEn: 'Gaming & High FPS' },
                    { id: 'office', icon: '🏢', labelAr: 'عمل مكتبي ومحاسبة وشركات', labelEn: 'Office & Business' },
                    { id: 'study', icon: '🎓', labelAr: 'دراسة وأبحاث وبرمجة', labelEn: 'Study & Coding' },
                    { id: 'design', icon: '🎨', labelAr: 'مونتاج وتصميم 4K وريندر', labelEn: '4K Editing & Design' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id)}
                      className={`p-3 rounded-xl text-right transition-all cursor-pointer border flex items-center gap-2.5 ${
                        goal === item.id
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-md shadow-sky-500/10'
                          : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <span className="text-xs font-semibold leading-tight">
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Current OS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="block text-xs sm:text-sm font-bold text-sky-300 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono">2</span>
                  <span>{lang === 'ar' ? 'نظام التشغيل المثبت حالياً في حاسوبك؟' : 'Current operating system installed?'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'win10', labelAr: 'Windows 10 (Home أو Pro)', labelEn: 'Windows 10 (Home/Pro)' },
                    { id: 'win11', labelAr: 'Windows 11 (غير مفعل / تجريبي)', labelEn: 'Windows 11 (Unactivated)' },
                    { id: 'fresh', labelAr: 'جهاز جديد فارغ / تم عمل فورمات', labelEn: 'Fresh PC / Newly Formatted' },
                    { id: 'expired', labelAr: 'نسخة كراك قديمة ظهر بها خطأ', labelEn: 'Expired KMS / Cracked Version' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentOS(item.id)}
                      className={`p-3 rounded-xl text-right transition-all cursor-pointer border flex items-center gap-2 ${
                        currentOS === item.id
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-md shadow-sky-500/10'
                          : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0 bg-sky-400" />
                      <span className="text-xs font-semibold leading-tight">
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Hardware Compatibility */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5">
                <label className="block text-xs sm:text-sm font-bold text-sky-300 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono">3</span>
                  <span>{lang === 'ar' ? 'هل اللوحة الأم والمعالج يدعمان TPM 2.0 والـ UEFI؟' : 'Hardware TPM 2.0 & UEFI support?'}</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'tpm_yes', labelAr: 'نعم، يدعم TPM 2.0', labelEn: 'Yes, TPM 2.0 Ready' },
                    { id: 'tpm_no', labelAr: 'لا، معالج أقدم', labelEn: 'No / Older CPU' },
                    { id: 'laptop', labelAr: 'لابتوب محمول حديث', labelEn: 'Modern Laptop' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setHardwareTier(item.id)}
                      className={`p-2.5 rounded-xl text-center transition-all cursor-pointer border ${
                        hardwareTier === item.id
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-md shadow-sky-500/10'
                          : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight block">
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Recommendation Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-3xl border border-sky-400/40 bg-gradient-to-b from-slate-900/95 to-[#080d1a] p-6 shadow-2xl shadow-sky-950/60 ring-1 ring-white/10 overflow-hidden relative">
                {/* Neon Top Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-4 shadow-sm">
                  <span>✨</span>
                  <span>{lang === 'ar' ? recommendation.badgeAr : recommendation.badgeEn}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white leading-snug mb-3">
                  {lang === 'ar' ? recommendation.titleAr : recommendation.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {lang === 'ar' ? recommendation.reasonAr : recommendation.titleEn}
                </p>

                {/* Key Benefits List */}
                <div className="space-y-2 mb-6 border-y border-white/10 py-4">
                  {[
                    lang === 'ar' ? 'تفعيل أصلي دائم مدى الحياة مرتبط باللوحة الأم (Motherboard)' : 'Lifetime digital license linked to motherboard',
                    lang === 'ar' ? 'يقبل التفعيل المباشر أونلاين عبر الإنترنت بنقرة واحدة' : 'Instant 1-click online activation via Microsoft servers',
                    lang === 'ar' ? 'دعم كامل للتحديثات الأمنية الرسمية وحماية Windows Defender' : 'Full security updates & Defender protection with zero flags',
                    lang === 'ar' ? 'تسليم فوري للمفتاح خلال 5 دقائق عبر واتساب مع الضمان' : 'Instant 5-min WhatsApp delivery with full golden guarantee',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-emerald-300 font-medium">
                      <span className="shrink-0 text-emerald-400 font-bold">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Price and Action CTA */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {lang === 'ar' ? 'السعر الرسمي المخفض:' : 'Official Special Price:'}
                    </span>
                    <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                      {formatPrice(recommendation.priceMAD)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenOrder) {
                        onOpenOrder({
                          productName: recommendation.titleAr,
                          priceMAD: recommendation.priceMAD,
                          category: 'windows',
                        })
                      }
                    }}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>💬</span>
                    <span>{lang === 'ar' ? 'طلب الترخيص الآن عبر واتساب' : 'Order License Now'}</span>
                  </button>
                </div>

                <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
                  <span>🔒 دفع آمن عبر CIH / كاش بلوس / وفاسكاش / USDT</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ERROR CODE SOLVER
           ======================================================== */}
        {activeTab === 'errors' && (
          <div className="space-y-6">
            {/* Search and Quick Code Selector */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchErrorCode}
                  onChange={(e) => setSearchErrorCode(e.target.value)}
                  placeholder={lang === 'ar' ? 'ابحث برقم كود الخطأ (مثال: 0x803FA067 أو KMS)...' : 'Search error code (e.g. 0x803FA067 or KMS)...'}
                  className="w-full py-3 px-4 pr-10 rounded-2xl bg-slate-900/90 border border-sky-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 text-sm font-mono shadow-inner"
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                  🔍
                </span>
              </div>

              {/* Quick Pills */}
              <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
                <span className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'أشهر الأكواد الشائعة:' : 'Common Errors:'}
                </span>
                {ERROR_CODES_DB.slice(0, 5).map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setSearchErrorCode(item.code)
                      setSelectedError(item)
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                      selectedError.code === item.code
                        ? 'bg-sky-500/25 border-sky-400 text-sky-300 font-bold'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Detail Display */}
            {selectedError && (
              <div className="rounded-3xl border border-sky-500/30 bg-[#080d1a] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                {/* Glow Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-400/30 mb-2">
                      <span>⚠️ Error Code:</span>
                      <span className="font-extrabold">{selectedError.code}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {lang === 'ar' ? selectedError.titleAr : selectedError.titleEn}
                    </h3>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {lang === 'ar' ? 'الحل معتمد 100%' : '100% Certified Fix'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      ✓ تفعيل دائم
                    </span>
                  </div>
                </div>

                {/* Body Explanation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
                  {/* Cause */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-800/30">
                    <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-2">
                      <span>🔍</span>
                      <span>{lang === 'ar' ? 'سبب حدوث المشكلة على جهازك:' : 'Root Cause of the Error:'}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedError.causeAr}
                    </p>
                  </div>

                  {/* Fix Summary */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-950/20 border border-sky-800/30">
                    <h4 className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-2">
                      <span>💡</span>
                      <span>{lang === 'ar' ? 'التشخيص والحل النهائي:' : 'Permanent Solution:'}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedError.explanationAr}
                    </p>
                  </div>
                </div>

                {/* Command Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#03060c] border border-white/10 mb-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Command Prompt (cmd.exe as Administrator)</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyCommand(selectedError.fixCommand)}
                      className="text-xs font-bold py-1.5 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{copiedCode ? '✓ تم النسخ!' : '📋 نسخ الأوامر'}</span>
                    </button>
                  </div>

                  <pre className="text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto p-3 bg-black/60 rounded-xl border border-white/5 selection:bg-emerald-500 selection:text-black">
                    {selectedError.fixCommand}
                  </pre>
                </div>

                {/* Footer Order CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-500/20">
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">
                      {lang === 'ar'
                        ? 'احصل على مفتاح ريتيل أصلي رسمي من BLEUWI ينهي كافة مشاكل التفعيل للأبد:'
                        : 'Get an official genuine Retail Key from BLEUWI to permanently eliminate all activation errors:'}
                    </span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {selectedError.productRecommended} ({formatPrice(selectedError.priceMAD)})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenOrder) {
                        onOpenOrder({
                          productName: selectedError.productRecommended,
                          priceMAD: selectedError.priceMAD,
                          category: 'windows',
                        })
                      }
                    }}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                  >
                    💬 {lang === 'ar' ? 'اطلب مفتاحك المعتمد الآن' : 'Order Genuine Key Now'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
