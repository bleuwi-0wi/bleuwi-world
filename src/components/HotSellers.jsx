import { useState, useEffect } from 'react'
import { 
  Flame, 
  Sparkles, 
  Check, 
  ArrowRight, 
  MessageCircle, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Zap,
  Monitor,
  Headphones,
  Video,
  Music,
  Disc3,
  Crown,
  Gem,
  Coins,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Key
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { getSecureWhatsAppUrl, openWhatsAppChat, WHATSAPP_DIRECT_LINK, aiSubscriptions, windowsOfficeKeys } from '../data/links'

import imgGta from '../assets/game-gta-v.jpeg'
import imgRedDead from '../assets/game-red-dead-2.jpeg'
import imgFifa from '../assets/game-fifa.jpg'
import imgDiscord from '../assets/offer-discord.webp'
import imgCapcut from '../assets/offer-capcut.jpg'
import imgSpotify3M from '../assets/offer-spotify-3m.jpg'
import imgSpotify1M from '../assets/offer-spotify-1m.jpg'

import imgFf16 from '../assets/freefire-16.jpeg'
import imgFf17 from '../assets/freefire-17.jpeg'
import imgFf18 from '../assets/freefire-18.jpeg'
import imgFf19 from '../assets/freefire-19.jpeg'

export const freeFirePacks = [
  {
    id: 'ff-530',
    name: 'Free Fire 530 Diamonds',
    shortName: '530 Diamonds',
    categoryKey: 'Free Fire Diamond',
    price: '60 DH',
    priceUsd: '6$',
    diamonds: '530',
    priceNum: 60,
    badge: 'STARTER PACK',
    badgeAr: 'باقة المبتدئين',
    badgeColor: 'from-amber-500 to-yellow-500',
    image: imgFf16,
    publicUrl: 'https://bleuwiworld.shop/image_reference/16.jpeg',
    tagline: '530 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 530 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    platform: 'FREE FIRE ID',
    platformAr: 'آيدي فري فاير (ID)',
    features: [
      '530 Official Diamonds directly to ID',
      '1$ = 10 DH Rate (6$ = 60 DH)',
      'Instant 5-Minute Delivery on WhatsApp',
      '100% Safe with Golden Guarantee'
    ],
    featuresAr: [
      '530 جوهرة رسمية مباشرة على حسابك بالأيدي (ID)',
      'سعر رسمي: 1$ = 10 دراهم (6$ = 60 درهم)',
      'شحن فوري وسريع في أقل من 5 دقائق عبر واتساب',
      'آمن 100% ومشمول بالضمان الذهبي للدعم والاستبدال'
    ],
    rating: '5.0',
    salesCount: '450+ sold',
    salesCountAr: '+450 شحنة',
  },
  {
    id: 'ff-1080',
    name: 'Free Fire 1080 Diamonds',
    shortName: '1080 Diamonds',
    categoryKey: 'Free Fire Diamond',
    price: '120 DH',
    priceUsd: '12$',
    diamonds: '1080',
    priceNum: 120,
    badge: 'MOST POPULAR',
    badgeAr: 'الأكثر طلباً',
    badgeColor: 'from-cyan-500 to-blue-600',
    image: imgFf17,
    publicUrl: 'https://bleuwiworld.shop/image_reference/17.jpeg',
    tagline: '1080 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 1080 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    platform: 'FREE FIRE ID',
    platformAr: 'آيدي فري فاير (ID)',
    features: [
      '1080 Official Diamonds directly to ID',
      '1$ = 10 DH Rate (12$ = 120 DH)',
      'Instant 5-Minute Delivery on WhatsApp',
      'Ready for Elite Pass & Events'
    ],
    featuresAr: [
      '1080 جوهرة رسمية مباشرة على حسابك بالأيدي (ID)',
      'سعر رسمي: 1$ = 10 دراهم (12$ = 120 درهم)',
      'شحن فوري وسريع في أقل من 5 دقائق عبر واتساب',
      'جاهز للفاير باس والفعاليات وسكنات الحظ'
    ],
    rating: '5.0',
    salesCount: '620+ sold',
    salesCountAr: '+620 شحنة',
  },
  {
    id: 'ff-2420',
    name: 'Free Fire 2420 Diamonds',
    shortName: '2420 Diamonds',
    categoryKey: 'Free Fire Diamond',
    price: '250 DH',
    priceUsd: '25$',
    diamonds: '2420',
    priceNum: 250,
    badge: 'BEST VALUE',
    badgeAr: 'أفضل توفير',
    badgeColor: 'from-emerald-500 to-teal-500',
    image: imgFf18,
    publicUrl: 'https://bleuwiworld.shop/image_reference/18.jpeg',
    tagline: '2420 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 2420 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    platform: 'FREE FIRE ID',
    platformAr: 'آيدي فري فاير (ID)',
    features: [
      '2420 Official Diamonds directly to ID',
      '1$ = 10 DH Rate (25$ = 250 DH)',
      'Instant 5-Minute Delivery on WhatsApp',
      'Top-up Bonus Rewards Included'
    ],
    featuresAr: [
      '2420 جوهرة رسمية مباشرة على حسابك بالأيدي (ID)',
      'سعر رسمي: 1$ = 10 دراهم (25$ = 250 درهم)',
      'شحن فوري وسريع في أقل من 5 دقائق عبر واتساب',
      'تفعيل مكافآت وجوائز فعاليات الشحن الإضافية'
    ],
    rating: '5.0',
    salesCount: '380+ sold',
    salesCountAr: '+380 شحنة',
  },
  {
    id: 'ff-6160',
    name: 'Free Fire 6160 Diamonds',
    shortName: '6160 Diamonds',
    categoryKey: 'Free Fire Diamond',
    price: '600 DH',
    priceUsd: '60$',
    diamonds: '6160',
    priceNum: 600,
    badge: 'VIP MEGA PACK',
    badgeAr: 'الباقة الملكية VIP',
    badgeColor: 'from-amber-400 via-orange-500 to-red-600',
    image: imgFf19,
    publicUrl: 'https://bleuwiworld.shop/image_reference/19.jpeg',
    tagline: '6160 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 6160 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    platform: 'FREE FIRE ID (VIP)',
    platformAr: 'آيدي فري فاير (VIP)',
    features: [
      '6160 Official Diamonds directly to ID',
      '1$ = 10 DH Rate (60$ = 600 DH)',
      'Instant VIP Priority 5-Min Delivery',
      'Max Evolution Guns & Rare Bundles'
    ],
    featuresAr: [
      '6160 جوهرة رسمية مباشرة على حسابك بالأيدي (ID)',
      'سعر رسمي: 1$ = 10 دراهم (60$ = 600 درهم)',
      'أولوية تسليم VIP فورية وسريعة خلال دقائق',
      'تطوير الأسلحة التطورية إلى الماكس والسكنات النادرة'
    ],
    rating: '5.0',
    salesCount: '290+ sold',
    salesCountAr: '+290 شحنة',
  },
]

export const hotSellerGames = [
  {
    id: 'gta-v',
    name: 'Grand Theft Auto V',
    shortName: 'GTA V (PC)',
    categoryKey: 'Sell Games',
    price: '200 DH',
    priceNum: 200,
    badge: 'HOT SELLER',
    badgeAr: 'الأكثر مبيعاً',
    badgeColor: 'from-amber-500 to-orange-500',
    image: imgGta,
    tagline: 'PC Edition + GTA Online Criminal Starter Pack',
    taglineAr: 'نسخة الكمبيوتر (PC) + باقة بداية المشاريع الإجرامية أونلاين',
    platform: 'PC ONLY',
    platformAr: 'كمبيوتر فقط (PC ONLY)',
    features: [
      'Full Game + GTA Online (PC)',
      'Rockstar / Steam / Epic Games (PC)',
      'FiveM Roleplay Compatible (PC)',
      'Instant Official Key Delivery'
    ],
    featuresAr: [
      'اللعبة كاملة + GTA أونلاين للكمبيوتر (PC)',
      'مفتاح رسمي روكستار / ستيم / إبيك (PC)',
      'جاهز لسيرفرات فايف إم رول بلاي (FiveM RP)',
      'تسليم فوري ومباشر مع ضمان كامل'
    ],
    rating: '5.0',
    salesCount: '180+ sold',
    salesCountAr: '+180 مبيعة',
  },
  {
    id: 'red-dead-2',
    name: 'Red Dead Redemption 2',
    shortName: 'RED DEAD 2 (PC)',
    categoryKey: 'Sell Games',
    price: '250 DH',
    priceNum: 250,
    badge: 'TOP RATED',
    badgeAr: 'الأعلى تقييماً',
    badgeColor: 'from-red-500 to-rose-600',
    image: imgRedDead,
    tagline: 'The masterpiece Western story on PC & Red Dead Online',
    taglineAr: 'القصة الأسطورية للغرب الأمريكي على الكمبيوتر + ريد ديد أونلاين',
    platform: 'PC ONLY',
    platformAr: 'كمبيوتر فقط (PC ONLY)',
    features: [
      'Complete Story Mode + Red Dead Online (PC)',
      'Rockstar / Steam Official Key (PC)',
      'Ultra Realistic 4K Graphics on PC',
      'Instant WhatsApp Delivery'
    ],
    featuresAr: [
      'طور القصة الكامل + ريد ديد أونلاين (PC)',
      'مفتاح رسمي روكستار / ستيم للكمبيوتر',
      'جرافيكس واقعي مذهل بدقة 4K على PC',
      'تسليم فوري وسريع عبر واتساب'
    ],
    rating: '5.0',
    salesCount: '140+ sold',
    salesCountAr: '+140 مبيعة',
  },
  {
    id: 'fifa',
    name: 'EA SPORTS FC / FIFA',
    shortName: 'FIFA (PC)',
    categoryKey: 'Sell Games',
    price: '200 DH',
    priceNum: 200,
    badge: 'BEST VALUE',
    badgeAr: 'أفضل عرض',
    badgeColor: 'from-emerald-500 to-teal-500',
    image: imgFifa,
    tagline: 'The world\'s game on PC with Ultimate Team & Clubs',
    taglineAr: 'لعبة كرة القدم العالمية على الكمبيوتر مع ألتميت تيم',
    platform: 'PC ONLY',
    platformAr: 'كمبيوتر فقط (PC ONLY)',
    features: [
      'EA App / Steam Official Global Key (PC)',
      'Ultimate Team & Online Clubs (PC)',
      'Full PC Controller & Keyboard Support',
      'Instant Step-by-Step Activation'
    ],
    featuresAr: [
      'مفتاح رسمي عالمي لمنصة EA App / ستيم (PC)',
      'جاهز لألتميت تيم والأندية أونلاين على PC',
      'دعم كامل لأي يد تحكم (Controller) والكيبورد',
      'تفعيل فوري مع دعم وتوجيه خطوة بخطوة'
    ],
    rating: '4.9',
    salesCount: '210+ sold',
    salesCountAr: '+210 مبيعة',
  },
]

export const hotSubscriptionOffers = [
  {
    id: 'discord-nitro',
    name: 'Discord Nitro',
    shortName: 'Discord Nitro',
    categoryKey: 'Abonnements',
    price: '70 DH',
    priceNum: 70,
    badge: 'HOT OFFER',
    badgeAr: 'عرض حصري',
    badgeColor: 'from-indigo-500 to-purple-600',
    image: imgDiscord,
    tagline: 'Full Discord Nitro with 2 Server Boosts & HD Streaming',
    taglineAr: 'دسكورد نيترو كامل مع 2 بوست سيرفر وبث فائق الدقة',
    typeTag: 'NITRO FULL',
    typeTagAr: 'نيترو كامل',
    icon: Disc3,
    features: [
      '2 Free Server Boosts included',
      'Global Emojis, 500MB Uploads & HD 4K 60FPS Streaming',
      'Custom Animated Profile Avatar & Profile Banner',
      'Instant Activation on your account'
    ],
    featuresAr: [
      'يشمل 2 بوست مجاني لأي سيرفر (Server Boosts)',
      'إيموجيات مخصصة، رفع ملفات حتى 500MB وبث 4K 60FPS',
      'صورة متحركة للبروفايل وبانر مخصص وشارات خاصة',
      'تفعيل فوري ومباشر على حسابك مع ضمان كامل'
    ],
    rating: '5.0',
    salesCount: '290+ sold',
    salesCountAr: '+290 مبيعة',
  },
  {
    id: 'capcut-pro',
    name: 'CapCut Pro (1 Month)',
    shortName: 'CapCut Pro 1M',
    categoryKey: 'Abonnements',
    price: '90 DH',
    priceNum: 90,
    badge: 'CREATOR VIP',
    badgeAr: 'اختيار المونتير',
    badgeColor: 'from-sky-500 to-blue-600',
    image: imgCapcut,
    tagline: 'VIP Video Editing with AI tools, 4K export & Cloud Assets',
    taglineAr: 'مونتاج فيديو احترافي VIP مع أدوات الذكاء الاصطناعي وتصدير 4K',
    typeTag: 'CAPCUT PRO',
    typeTagAr: 'كاب كات برو',
    icon: Video,
    features: [
      'Unlock all VIP Transitions, Effects & AI Auto-Cut',
      'Automated Captions & Subtitles in all languages',
      'Export in 4K 60FPS without watermarks',
      'Works on PC, Mac, iOS & Android'
    ],
    featuresAr: [
      'فتح جميع الانتقالات والمؤثرات وفلاتر الـ VIP',
      'كتابة نصوص تلقائية (Auto Subtitles) بجميع اللغات',
      'تصدير الفيديوهات بدقة 4K 60FPS بدون علامة مائية',
      'يعمل على الكمبيوتر، الماك، والآيفون والأندرويد'
    ],
    rating: '5.0',
    salesCount: '175+ sold',
    salesCountAr: '+175 مبيعة',
  },
  {
    id: 'spotify-3m',
    name: 'Spotify Premium (3 Months)',
    shortName: 'Spotify 3 Months',
    categoryKey: 'Abonnements',
    price: '150 DH',
    priceNum: 150,
    badge: 'BEST VALUE',
    badgeAr: 'أفضل توفير',
    badgeColor: 'from-emerald-500 to-green-600',
    image: imgSpotify3M,
    tagline: '3 Full Months of Ad-Free Music streaming & Offline downloads',
    taglineAr: '3 أشهر كاملة من الموسيقى بدون إعلانات مع التحميل أوفلاين',
    typeTag: '3 MONTHS',
    typeTagAr: '3 أشهر كاملة',
    icon: Headphones,
    features: [
      '3 Months Continuous Ad-Free Listening',
      'High-Quality Offline Music Downloads',
      'Unlimited Skips on all mobile & desktop apps',
      'Full 90-Day Replacement Guarantee'
    ],
    featuresAr: [
      '3 أشهر متواصلة من الاستماع بدون أي إعلانات',
      'تحميل الأغاني بجودة عالية للاستماع بدون إنترنت',
      'تخطي غير محدود على تطبيق الهاتف والكمبيوتر',
      'ضمان شامل واستبدال فوري طوال فترة 90 يوم'
    ],
    rating: '5.0',
    salesCount: '240+ sold',
    salesCountAr: '+240 مبيعة',
  },
  {
    id: 'spotify-1m',
    name: 'Spotify Premium (1 Month)',
    shortName: 'Spotify 1 Month',
    categoryKey: 'Abonnements',
    price: '70 DH',
    priceNum: 70,
    badge: 'POPULAR',
    badgeAr: 'الأكثر طلباً',
    badgeColor: 'from-green-500 to-emerald-600',
    image: imgSpotify1M,
    tagline: '1 Month uninterrupted Spotify Premium music experience',
    taglineAr: 'شهر كامل من تجربة سبوتيفاي بريميوم بدون أي توقف',
    typeTag: '1 MONTH',
    typeTagAr: 'شهر كامل',
    icon: Music,
    features: [
      '30 Days Unlimited Ad-Free Music',
      'Offline Playback & On-Demand Tracks',
      'Upgraded on your personal account',
      'Instant Setup & 24/7 Support'
    ],
    featuresAr: [
      '30 يوماً من الموسيقى بدون إعلانات نهائياً',
      'تحميل وتشغيل الأغاني أوفلاين في أي وقت',
      'ترقية مباشرة على حسابك الشخصي',
      'تسليم فوري ومباشر مع دعم فني مستمر'
    ],
    rating: '4.9',
    salesCount: '310+ sold',
    salesCountAr: '+310 مبيعة',
  },
]

export default function HotSellers({ onOpenOrder }) {
  const { lang, isRTL } = useLanguage()
  const [filter, setFilter] = useState('all') // 'all' | 'freefire' | 'ai' | 'games' | 'subscriptions'
  const [hoveredItem, setHoveredItem] = useState(null)
  const [selectedBigOffer, setSelectedBigOffer] = useState(null)
  const [aiPlanIndices, setAiPlanIndices] = useState({
    'chatgpt-plus': 1,
    'gemini-advanced': 1,
    'claude-ai': 1,
    'canva-pro': 1,
  })
  const [winVersionIndices, setWinVersionIndices] = useState({
    'win-10': 1,
    'win-11': 1,
    'ms-office': 2,
  })

  const allOffers = [
    ...freeFirePacks,
    ...aiSubscriptions.map(item => {
      const plan = item.plans[aiPlanIndices[item.id] ?? 1] || item.plans[0]
      return {
        ...item,
        price: plan.price,
        shortName: `${item.name} (${plan.duration})`,
        platform: 'AI SUBSCRIPTION',
        platformAr: 'اشتراك ذكاء اصطناعي (AI)',
      }
    }),
    ...windowsOfficeKeys.map(item => {
      const version = item.versions[winVersionIndices[item.id] ?? 1] || item.versions[0]
      return {
        ...item,
        price: version.price,
        shortName: `${item.name} (${version.name})`,
        platform: 'MICROSOFT KEY',
        platformAr: 'مفتاح مايكروسوفت أصلي',
      }
    }),
    ...hotSellerGames,
    ...hotSubscriptionOffers,
  ]

  const currentBigIndex = selectedBigOffer 
    ? allOffers.findIndex((o) => o.id === selectedBigOffer.id) 
    : -1

  const handlePrevBigOffer = () => {
    if (currentBigIndex === -1) return
    const prevIdx = (currentBigIndex - 1 + allOffers.length) % allOffers.length
    setSelectedBigOffer(allOffers[prevIdx])
  }

  const handleNextBigOffer = () => {
    if (currentBigIndex === -1) return
    const nextIdx = (currentBigIndex + 1) % allOffers.length
    setSelectedBigOffer(allOffers[nextIdx])
  }

  useEffect(() => {
    if (!selectedBigOffer) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedBigOffer(null)
      if (e.key === 'ArrowLeft') handlePrevBigOffer()
      if (e.key === 'ArrowRight') handleNextBigOffer()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedBigOffer, currentBigIndex])

  const handleOrder = (item) => {
    if (onOpenOrder) {
      onOpenOrder({
        categoryKey: item.categoryKey || 'Sell Games',
        specificItem: item.shortName || item.name,
        productName: item.name,
        productPrice: item.price,
        productImage: item.image,
        productPlatform: item.platform || item.typeTag || (item.categoryKey === 'Sell Games' ? 'PC ONLY' : ''),
        defaultNotes: `Hello BLEUWI, I want to order ${item.name} (${item.price}).`,
      })
    } else {
      const text = `Hello BLEUWI, I would like to order ${item.name} (${item.price}).`
      openWhatsAppChat(text)
    }
  }

  const showFreeFire = filter === 'all' || filter === 'freefire'
  const showAi = filter === 'all' || filter === 'ai'
  const showWindows = filter === 'all' || filter === 'windows'
  const showGames = filter === 'all' || filter === 'games'
  const showSubs = filter === 'all' || filter === 'subscriptions'

  return (
    <section id="hot-sellers" className="relative z-10 scroll-mt-24 pt-2 sm:pt-4 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/[0.08] pb-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>{lang === 'ar' ? 'أقوى العروض الحصرية' : 'HOT EXCLUSIVE DEALS'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-white/80">{lang === 'ar' ? 'ألعاب، جواهر واشتراكات بأفضل الأسعار' : 'GAMES, DIAMONDS & SUBSCRIPTIONS'}</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {lang === 'ar' ? 'الأكثر مبيعاً وطلباً' : 'Top Trending Offers'}
              <span className="text-gradient ml-2">
                {lang === 'ar' ? 'تسليم فوري وضمان كامل' : 'Instant Delivery'}
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl">
              {lang === 'ar'
                ? 'شحن جواهر فري فاير (1$ = 10 دراهم)، ألعاب كمبيوتر أصلية (PC)، واشتراكات بريميوم رقمية (Discord, Spotify, CapCut) مع تسليم فوري عبر واتساب.'
                : 'Free Fire Diamonds (1$ = 10 DH), Official PC Games & Premium Subscriptions (Discord, Spotify, CapCut) with instant WhatsApp delivery.'}
            </p>
          </div>

          {/* Category Filter Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 backdrop-blur-xl shadow-lg">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Flame size={13} className={filter === 'all' ? 'text-amber-400' : 'text-slate-500'} />
              <span>{lang === 'ar' ? 'جميع العروض (18)' : 'All Deals (18)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('windows')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filter === 'windows'
                  ? 'bg-blue-500/25 text-blue-300 border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Key size={13} className={filter === 'windows' ? 'text-blue-300 animate-pulse' : 'text-blue-400/80'} />
              <span>{lang === 'ar' ? 'ويندوز وأوفيس (3)' : 'Windows & Office (3)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('ai')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filter === 'ai'
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles size={13} className={filter === 'ai' ? 'text-purple-300 animate-pulse' : 'text-purple-400/80'} />
              <span>{lang === 'ar' ? 'اشتراكات AI (4)' : 'AI Subscriptions (4)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('freefire')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filter === 'freefire'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Gem size={13} className={filter === 'freefire' ? 'text-amber-400 animate-bounce' : 'text-amber-400/70'} />
              <span>{lang === 'ar' ? 'جواهر فري فاير (Free Fire Diamond)' : 'Free Fire Diamond'}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('games')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filter === 'games'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Monitor size={13} className={filter === 'games' ? 'text-sky-300' : 'text-slate-500'} />
              <span>{lang === 'ar' ? 'ألعاب PC (3)' : 'PC Games (3)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('subscriptions')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                filter === 'subscriptions'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Disc3 size={13} className={filter === 'subscriptions' ? 'text-purple-300' : 'text-slate-500'} />
              <span>{lang === 'ar' ? 'اشتراكات وبرامج (4)' : 'Subscriptions (4)'}</span>
            </button>
          </div>
        </div>

        {/* Annonce alert for Free Fire Diamond category when browsing other tabs */}
        {filter !== 'all' && filter !== 'freefire' && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 p-3 px-4 shadow-md backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Gem size={15} className="text-amber-400 animate-bounce" />
              <span>
                {lang === 'ar' 
                  ? 'إعلان: فئة جواهر فري فاير (Free Fire Diamond) متوفرة الآن مع أقوى العروض بـ 1$ = 10 دراهم!' 
                  : 'Annonce: Free Fire Diamond category is now live with top trending offers at 1$ = 10 DH!'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFilter('freefire')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/60 bg-amber-400 px-3 py-1 text-xs font-black text-slate-950 shadow transition hover:scale-105 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'الانتقال لفئة Free Fire Diamond' : 'Switch to Free Fire Diamond'}</span>
              <ArrowRight size={12} className={isRTL ? 'rotate-180' : ''} />
            </button>
          </div>
        )}

        {/* 1. FREE FIRE DIAMONDS SECTION (1$ = 10 DH) */}
        {showFreeFire && (
          <div className="mt-8">
            {/* Free Fire Diamond Official Announcement / Annonce Card */}
            <div className="mb-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 p-4 sm:p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(251,191,36,0.15)]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="relative grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl border border-amber-400/60 bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30">
                    <Gem size={26} className="fill-slate-950 text-slate-950 animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400" />
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-black text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                        <Sparkles size={11} className="text-amber-400" />
                        <span>{lang === 'ar' ? 'إعلان فئة: Free Fire Diamond' : 'OFFICIAL ANNONCE: Free Fire Diamond'}</span>
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {lang === 'ar' ? 'سعر الصرف: 1$ = 10 دراهم (6$ = 60 DH)' : 'Exchange Rate: 1$ = 10 DH (6$ = 60 DH)'}
                      </span>
                    </div>

                    <h4 className="mt-1 text-base sm:text-lg font-black text-white">
                      {lang === 'ar' 
                        ? 'إعلان فئة Free Fire Diamond — شحن فوري لجواهر فري فاير عبر الآيدي (Player ID)' 
                        : 'Free Fire Diamond Annonce — Instant Player ID Top-Up with Top Trending Offers'}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {lang === 'ar'
                        ? 'فئة جديدة ضمن العروض الأكثر طلباً! باقات 530، 1080، 2420 و 6160 جوهرة (6$ = 60 درهم) مع تسليم فوري في 5 دقائق والضمان الذهبي 100%.'
                        : 'New category alongside top trending offers! Packs of 530, 1080, 2420 & 6160 Diamonds (6$ = 60 DH) with instant 5-minute delivery & 100% Golden Warranty.'}
                    </p>
                  </div>
                </div>

                {/* Annonce Quick Rates Summary */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 text-center text-xs">
                    <button 
                      type="button"
                      onClick={() => setSelectedBigOffer(freeFirePacks[0])}
                      className="group rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 hover:border-amber-400/60 hover:bg-amber-500/15 transition cursor-pointer"
                      title={lang === 'ar' ? 'عرض تفاصيل باقة 530 جوهرة مكبّرة' : 'Click to view 530 Diamonds offer big'}
                    >
                      <div className="text-[10px] text-slate-400 group-hover:text-amber-300 flex items-center justify-center gap-1">
                        <span>530 💎</span>
                        <Maximize2 size={10} className="text-amber-400 opacity-70 group-hover:opacity-100" />
                      </div>
                      <div className="font-bold text-amber-300">60 DH (6$)</div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedBigOffer(freeFirePacks[1])}
                      className="group rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 hover:border-amber-400/60 hover:bg-amber-500/15 transition cursor-pointer"
                      title={lang === 'ar' ? 'عرض تفاصيل باقة 1080 جوهرة مكبّرة' : 'Click to view 1080 Diamonds offer big'}
                    >
                      <div className="text-[10px] text-slate-400 group-hover:text-amber-300 flex items-center justify-center gap-1">
                        <span>1080 💎</span>
                        <Maximize2 size={10} className="text-amber-400 opacity-70 group-hover:opacity-100" />
                      </div>
                      <div className="font-bold text-amber-300">120 DH (12$)</div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedBigOffer(freeFirePacks[2])}
                      className="group rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 hover:border-amber-400/60 hover:bg-amber-500/15 transition cursor-pointer"
                      title={lang === 'ar' ? 'عرض تفاصيل باقة 2420 جوهرة مكبّرة' : 'Click to view 2420 Diamonds offer big'}
                    >
                      <div className="text-[10px] text-slate-400 group-hover:text-amber-300 flex items-center justify-center gap-1">
                        <span>2420 💎</span>
                        <Maximize2 size={10} className="text-amber-400 opacity-70 group-hover:opacity-100" />
                      </div>
                      <div className="font-bold text-amber-300">250 DH (25$)</div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedBigOffer(freeFirePacks[3])}
                      className="group rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 hover:border-amber-400/60 hover:bg-amber-500/15 transition cursor-pointer"
                      title={lang === 'ar' ? 'عرض تفاصيل باقة 6160 جوهرة مكبّرة' : 'Click to view 6160 Diamonds offer big'}
                    >
                      <div className="text-[10px] text-slate-400 group-hover:text-amber-300 flex items-center justify-center gap-1">
                        <span>6160 💎</span>
                        <Maximize2 size={10} className="text-amber-400 opacity-70 group-hover:opacity-100" />
                      </div>
                      <div className="font-bold text-amber-300">600 DH (60$)</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-500/15 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                  <Gem size={15} />
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{lang === 'ar' ? 'باقات فئة Free Fire Diamond' : 'Free Fire Diamond Category Packs'}</span>
                </h3>
              </div>

              {/* Exchange Rate Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-300 shadow-sm">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{lang === 'ar' ? 'سعر الصرف الرسمي: 1$ = 10 دراهم (6$ = 60 DH)' : 'Official Rate: 1$ = 10 DH (6$ = 60 DH)'}</span>
                </span>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                  {lang === 'ar' ? 'شحن آيدي فوري (5 دقائق)' : 'Instant ID Delivery (5 min)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {freeFirePacks.map((pack) => (
                <div
                  key={pack.id}
                  onMouseEnter={() => setHoveredItem(pack.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] via-slate-950/80 to-[#05070d] p-4 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(251,191,36,0.3)]"
                >
                  {/* Top Image Container with Click to View Big */}
                  <div 
                    onClick={() => setSelectedBigOffer(pack)}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 cursor-pointer group/img"
                    title={lang === 'ar' ? 'انقر لتكبير العرض وقراءة التفاصيل' : 'Click to view full offer big'}
                  >
                    <img
                      src={pack.image}
                      alt={pack.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-108"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Badge */}
                    <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-gradient-to-r ${pack.badgeColor} px-2.5 py-0.5 text-[10px] font-black tracking-wider text-slate-950 shadow-lg`}>
                      <Gem size={11} className="fill-slate-950" />
                      <span>{lang === 'ar' ? pack.badgeAr : pack.badge}</span>
                    </div>

                    {/* Diamonds Pill */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-amber-400/40 bg-black/80 px-2.5 py-0.5 text-[11px] font-black text-amber-300 backdrop-blur-md">
                      <Gem size={12} className="text-amber-400 animate-pulse" />
                      <span>{pack.diamonds} 💎</span>
                    </div>

                    {/* USD Tag pill bottom left */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-slate-950/90 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300 backdrop-blur-md shadow-md">
                      <span className="text-white/70">USD:</span>
                      <span>{pack.priceUsd}</span>
                    </div>

                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 border border-amber-400/60 px-3 py-1.5 text-xs font-black text-amber-300 shadow-xl backdrop-blur-md">
                        <Maximize2 size={13} className="text-amber-400" />
                        <span>{lang === 'ar' ? 'عرض مكبّر وكامل' : 'View Full Offer Big'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content & Features */}
                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 
                            onClick={() => setSelectedBigOffer(pack)}
                            className="text-base font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer"
                          >
                            {pack.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                            {lang === 'ar' ? pack.taglineAr : pack.tagline}
                          </p>
                        </div>

                        {/* Price Tag in DH */}
                        <div className="flex flex-col items-end flex-none">
                          <span className="rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-base sm:text-lg font-black text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
                            {pack.price}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {pack.priceUsd} = {pack.price}
                          </span>
                        </div>
                      </div>

                      {/* Features List */}
                      <ul className="mt-3.5 space-y-1.5 border-t border-white/[0.08] pt-3 text-[11px] text-slate-300">
                        {(lang === 'ar' ? pack.featuresAr : pack.features).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check size={11} className="text-amber-400 flex-none" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons with View Big Option */}
                    <div className="mt-4 flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBigOffer(pack)}
                        className="flex h-9 items-center justify-center gap-1 rounded-xl border border-amber-400/30 bg-amber-500/10 px-2.5 text-xs font-bold text-amber-300 transition hover:border-amber-400 hover:bg-amber-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'تكبير العرض لقراءة أسهل' : 'View full offer big for easy reading'}
                      >
                        <Maximize2 size={13} />
                        <span className="hidden sm:inline">{lang === 'ar' ? 'تكبير' : 'Big'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrder(pack)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-3 py-2 text-xs font-black text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.35)] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart size={13} />
                        <span>{lang === 'ar' ? `اطلب الآن (${pack.price})` : `Order Now (${pack.price})`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrder(pack)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
                        aria-label="Order on WhatsApp"
                      >
                        <MessageCircle size={15} className="text-emerald-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI SUBSCRIPTION SECTION (#20 TO #23 - 1M / 1Y / 18M) */}
        {showAi && (
          <div className={showFreeFire ? 'mt-12 pt-10 border-t border-white/[0.08]' : 'mt-8'}>
            {/* AI Announcement Banner */}
            <div className="mb-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-500/40 bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-purple-500/15 p-4 sm:p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(168,85,247,0.15)]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="relative grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl border border-purple-400/60 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
                    <Sparkles size={26} className="text-white animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-400" />
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-400/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-black text-purple-300 border border-purple-400/30 uppercase tracking-wider">
                        <Sparkles size={11} className="text-purple-400" />
                        <span>{lang === 'ar' ? 'إعلان رسمي: اشتراكات AI (الذكاء الاصطناعي)' : 'OFFICIAL ANNONCE: AI SUBSCRIPTIONS'}</span>
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {lang === 'ar' ? 'خطط مرنة: 1 شهر · 1 سنة · 18 شهراً' : 'Flexible Plans: 1 Month · 1 Year · 18 Months'}
                      </span>
                    </div>

                    <h4 className="mt-1 text-base sm:text-lg font-black text-white">
                      {lang === 'ar' 
                        ? 'اشتراكات الذكاء الاصطناعي (#20 إلى #23) — شات جي بي تي بلس، جيميني، كلود وكانفا برو' 
                        : 'AI Subscriptions (#20 to #23) — ChatGPT Plus, Gemini, Claude & Canva Pro'}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-300 max-w-2xl">
                      {lang === 'ar'
                        ? 'اختر المدة المناسبة لك لكل اشتراك (شهر، سنة، أو 18 شهراً) مع تفعيل فوري وضمان كامل ودعم مستمر.'
                        : 'Choose your desired duration for each subscription (1 Month, 1 Year, or 18 Months) with instant setup & full warranty.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={WHATSAPP_DIRECT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-400/60 bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-purple-500/25 transition hover:scale-105 cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>{lang === 'ar' ? 'استفسار AI على واتساب' : 'Inquire on WhatsApp'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* AI Grid Cards (From 20 to 23 with 1M, 1Y, 18M duration selector) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {aiSubscriptions.map((item) => {
                const activePlanIndex = aiPlanIndices[item.id] ?? 1
                const activePlan = item.plans[activePlanIndex] || item.plans[0]

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group relative flex flex-col justify-between rounded-3xl border border-purple-500/20 bg-gradient-to-b from-purple-500/[0.08] via-slate-950/80 to-[#05070d] p-4 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(168,85,247,0.25)]"
                  >
                    <div>
                      {/* Image Reference with Zoom */}
                      <div
                        onClick={() => setSelectedBigOffer({
                          ...item,
                          price: activePlan.price,
                          shortName: `${item.name} (${activePlan.duration})`,
                          platform: 'AI SUBSCRIPTION',
                          platformAr: 'اشتراك ذكاء اصطناعي (AI)',
                        })}
                        className="group/img relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-purple-400/30 bg-black/80 cursor-pointer shadow-lg transition-transform duration-300 hover:border-purple-400"
                        title={lang === 'ar' ? 'انقر لتكبير صورة المرجع' : 'Click to zoom reference picture'}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Top Left Badge #20 - #23 */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md">
                          <Sparkles size={10} className="text-purple-200" />
                          <span>#{item.num}</span>
                        </div>

                        {/* Top Right Live Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-400/30 backdrop-blur-md">
                            {lang === 'ar' ? item.badgeAr : item.badge}
                          </span>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg border border-purple-400/35 bg-slate-950/90 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300 backdrop-blur-md shadow-md">
                          <Sparkles size={11} className="text-purple-400" />
                          <span>{activePlan.duration}</span>
                        </div>

                        {/* Zoom Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 border border-purple-400/60 px-3 py-1.5 text-xs font-black text-purple-300 shadow-xl backdrop-blur-md">
                            <Maximize2 size={13} className="text-purple-400" />
                            <span>{lang === 'ar' ? 'عرض مكبّر' : 'View Big'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title & Price */}
                      <div className="mt-3.5 flex items-start justify-between gap-2">
                        <div>
                          <h4
                            onClick={() => setSelectedBigOffer({
                              ...item,
                              price: activePlan.price,
                              shortName: `${item.name} (${activePlan.duration})`,
                              platform: 'AI SUBSCRIPTION',
                              platformAr: 'اشتراك ذكاء اصطناعي (AI)',
                            })}
                            className="text-base font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer"
                          >
                            {lang === 'ar' ? item.nameAr : item.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                            {lang === 'ar' ? item.taglineAr : item.tagline}
                          </p>
                        </div>
                        <div className="flex flex-col items-end flex-none">
                          <span className="rounded-xl border border-purple-400/40 bg-purple-500/15 px-2.5 py-1 text-sm sm:text-base font-black text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                            {activePlan.price}
                          </span>
                        </div>
                      </div>

                      {/* PLAN SELECTOR (1 MONTH / 1 YEAR / 18 MONTHS) */}
                      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-2 backdrop-blur-sm">
                        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>{lang === 'ar' ? 'اختر المدة:' : 'Duration:'}</span>
                          <span className="text-purple-300 font-semibold">{lang === 'ar' ? activePlan.durationAr : activePlan.duration}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {item.plans.map((p, pIdx) => {
                            const isSelected = activePlanIndex === pIdx
                            return (
                              <button
                                key={p.duration}
                                type="button"
                                onClick={() => setAiPlanIndices(prev => ({ ...prev, [item.id]: pIdx }))}
                                className={`relative flex flex-col items-center justify-center rounded-lg py-1 px-1 text-center transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border border-purple-400 bg-gradient-to-b from-purple-500/30 to-indigo-600/30 text-white shadow-[0_0_10px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/50'
                                    : 'border border-white/5 bg-white/[0.02] text-slate-400 hover:border-purple-300/30 hover:bg-white/[0.06] hover:text-slate-200'
                                }`}
                              >
                                {p.isPopular && (
                                  <span className="absolute -top-1.5 right-1 rounded-full bg-amber-400 px-1 py-[1px] text-[7px] font-black text-slate-950 shadow-sm leading-none">
                                    ★
                                  </span>
                                )}
                                <span className="text-[10px] font-bold leading-tight">
                                  {p.duration === '1 Month' ? '1M' : p.duration === '1 Year' ? '1Y' : '18M'}
                                </span>
                                <span className={`text-[9px] font-extrabold leading-tight ${isSelected ? 'text-purple-300' : 'text-slate-400'}`}>
                                  {p.price}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="mt-3 space-y-1 border-t border-white/[0.08] pt-2.5 text-[11px] text-slate-300">
                        {(lang === 'ar' ? item.featuresAr : item.features).slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check size={11} className="text-purple-400 flex-none" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBigOffer({
                          ...item,
                          price: activePlan.price,
                          shortName: `${item.name} (${activePlan.duration})`,
                          platform: 'AI SUBSCRIPTION',
                          platformAr: 'اشتراك ذكاء اصطناعي (AI)',
                        })}
                        className="flex h-9 items-center justify-center gap-1 rounded-xl border border-purple-400/30 bg-purple-500/10 px-2.5 text-xs font-bold text-purple-300 transition hover:border-purple-400 hover:bg-purple-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'تكبير العرض لقراءة أسهل' : 'View full offer big for easy reading'}
                      >
                        <Maximize2 size={13} />
                        <span className="hidden sm:inline">{lang === 'ar' ? 'تكبير' : 'Big'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenOrder ? onOpenOrder({
                          categoryKey: 'AI Subscriptions',
                          specificItem: `${item.name} - ${activePlan.duration} (${activePlan.price})`,
                          productName: `${item.name} (${activePlan.duration})`,
                          productPrice: activePlan.price,
                          productImage: item.image,
                          productPlatform: 'AI SUBSCRIPTION',
                          defaultNotes: `AI Subscription: ${item.name} (#${item.num}), Plan: ${activePlan.duration} (${activePlan.price} / ${activePlan.priceUsd})`,
                        }) : handleOrder({
                          name: `${item.name} (${activePlan.duration})`,
                          price: activePlan.price,
                        })}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-400 to-indigo-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-[0_0_18px_rgba(168,85,247,0.3)] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart size={13} />
                        <span>{lang === 'ar' ? `اطلب (${activePlan.price})` : `Order (${activePlan.price})`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenOrder ? onOpenOrder({
                          categoryKey: 'AI Subscriptions',
                          specificItem: `${item.name} - ${activePlan.duration} (${activePlan.price})`,
                          productName: `${item.name} (${activePlan.duration})`,
                          productPrice: activePlan.price,
                          productImage: item.image,
                          productPlatform: 'AI SUBSCRIPTION',
                          defaultNotes: `AI Subscription: ${item.name} (#${item.num}), Plan: ${activePlan.duration} (${activePlan.price} / ${activePlan.priceUsd})`,
                        }) : handleOrder({
                          name: `${item.name} (${activePlan.duration})`,
                          price: activePlan.price,
                        })}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
                        aria-label="Order on WhatsApp"
                      >
                        <MessageCircle size={15} className="text-emerald-400" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 2. WINDOWS & MICROSOFT OFFICE SECTION (#24, #25, #26) */}
        {showWindows && (
          <div className={(showFreeFire || showAi) ? 'mt-12 pt-10 border-t border-white/[0.08]' : 'mt-8'}>
            {/* Windows & Office Annonce Banner */}
            <div className="mb-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-400/40 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-sky-500/15 p-4 sm:p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(59,130,246,0.15)]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="relative grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl border border-blue-400/60 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                    <Key size={26} className="text-white animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-400" />
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-400/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-black text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                        <Key size={11} className="text-blue-400" />
                        <span>{lang === 'ar' ? 'إعلان فئة: ويندوز وأوفيس' : 'OFFICIAL ANNONCE: Windows & Office Keys'}</span>
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {lang === 'ar' ? 'تفعيل أصلي دائم مدى الحياة' : '100% Genuine Lifetime Retail'}
                      </span>
                    </div>

                    <h4 className="mt-1 text-base sm:text-lg font-black text-white">
                      {lang === 'ar' 
                        ? 'مفاتيح وسيريالات ويندوز 10 و 11 وأوفيس الأصلية (#24 إلى #26) مع تفعيل أونلاين مباشر' 
                        : 'Windows 10, Windows 11 & Office Suite Genuine Keys (#24 to #26) with Direct Activation'}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {lang === 'ar'
                        ? 'تراخيص رقمية رسمية لجميع النسخ (Home / Pro / Enterprise و Office 365 / 2021 / 2024 LTSC) مع تسليم فوري عبر واتساب وضمان الاستبدال 100%.'
                        : 'Official retail digital keys for all editions (Home / Pro / Enterprise & Office 365 / 2021 / 2024 LTSC) with instant WhatsApp delivery & 100% guarantee.'}
                    </p>
                  </div>
                </div>

                {/* Direct WhatsApp Quick Help */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={getSecureWhatsAppUrl('Hello BLEUWI, I would like to inquire about Windows & Microsoft Office genuine keys (#24 - #26).')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-400/50 bg-blue-500/20 px-3.5 py-2 text-xs font-bold text-blue-200 transition hover:bg-blue-500/30 hover:text-white cursor-pointer"
                  >
                    <MessageCircle size={14} className="text-blue-400" />
                    <span>{lang === 'ar' ? 'استفسار ويندوز/أوفيس على واتساب' : 'Inquire on WhatsApp'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Windows & Office 3 Cards Grid (#24, #25, #26) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {windowsOfficeKeys.map((item) => {
                const activeVersionIndex = winVersionIndices[item.id] ?? 1
                const activeVersion = item.versions[activeVersionIndex] || item.versions[0]

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group relative flex flex-col justify-between rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-500/[0.08] via-slate-950/80 to-[#05070d] p-4 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.25)]"
                  >
                    <div>
                      {/* Image Reference with Zoom */}
                      <div
                        onClick={() => setSelectedBigOffer({
                          ...item,
                          price: activeVersion.price,
                          shortName: `${item.name} (${activeVersion.name})`,
                          platform: 'MICROSOFT KEY',
                          platformAr: 'مفتاح مايكروسوفت أصلي',
                        })}
                        className="group/img relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-blue-400/30 bg-black/80 cursor-pointer shadow-lg transition-transform duration-300 hover:border-blue-400"
                        title={lang === 'ar' ? 'انقر لتكبير صورة المرجع' : 'Click to zoom reference picture'}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Top Left Badge #24 - #26 */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md">
                          <Key size={10} className="text-blue-200" />
                          <span>#{item.num}</span>
                        </div>

                        {/* Top Right Live Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30 backdrop-blur-md">
                            {lang === 'ar' ? item.badgeAr : item.badge}
                          </span>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg border border-blue-400/35 bg-slate-950/90 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-300 backdrop-blur-md shadow-md">
                          <Key size={11} className="text-blue-400" />
                          <span>{activeVersion.name}</span>
                        </div>

                        {/* Zoom Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 border border-blue-400/60 px-3 py-1.5 text-xs font-black text-blue-300 shadow-xl backdrop-blur-md">
                            <Maximize2 size={13} className="text-blue-400" />
                            <span>{lang === 'ar' ? 'عرض مكبّر' : 'View Big'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title & Price */}
                      <div className="mt-3.5 flex items-start justify-between gap-2">
                        <div>
                          <h4
                            onClick={() => setSelectedBigOffer({
                              ...item,
                              price: activeVersion.price,
                              shortName: `${item.name} (${activeVersion.name})`,
                              platform: 'MICROSOFT KEY',
                              platformAr: 'مفتاح مايكروسوفت أصلي',
                            })}
                            className="text-base font-bold text-white group-hover:text-blue-300 transition-colors cursor-pointer"
                          >
                            {lang === 'ar' ? item.nameAr : item.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                            {lang === 'ar' ? item.taglineAr : item.tagline}
                          </p>
                        </div>
                        <div className="flex flex-col items-end flex-none">
                          <span className="rounded-xl border border-blue-400/40 bg-blue-500/15 px-2.5 py-1 text-sm sm:text-base font-black text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                            {activeVersion.price}
                          </span>
                        </div>
                      </div>

                      {/* VERSION SELECTOR (Home / Pro / Enterprise OR 365 / 2021 / 2024) */}
                      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-2 backdrop-blur-sm">
                        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>{lang === 'ar' ? 'اختر الإصدار:' : 'Edition / Version:'}</span>
                          <span className="text-blue-300 font-semibold">{lang === 'ar' ? activeVersion.nameAr : activeVersion.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {item.versions.map((ver, vIdx) => {
                            const isSelected = activeVersionIndex === vIdx
                            return (
                              <button
                                key={ver.name}
                                type="button"
                                onClick={() => setWinVersionIndices(prev => ({ ...prev, [item.id]: vIdx }))}
                                className={`relative flex flex-col items-center justify-center rounded-lg py-1 px-1 text-center transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border border-blue-400 bg-gradient-to-b from-blue-500/30 to-indigo-600/30 text-white shadow-[0_0_10px_rgba(59,130,246,0.35)] ring-1 ring-blue-400/50'
                                    : 'border border-white/5 bg-white/[0.02] text-slate-400 hover:border-blue-300/30 hover:bg-white/[0.06] hover:text-slate-200'
                                }`}
                              >
                                {ver.isPopular && (
                                  <span className="absolute -top-1.5 right-1 rounded-full bg-amber-400 px-1 py-[1px] text-[7px] font-black text-slate-950 shadow-sm leading-none">
                                    ★
                                  </span>
                                )}
                                <span className="text-[10px] font-bold leading-tight truncate w-full">
                                  {ver.name}
                                </span>
                                <span className={`text-[9px] font-extrabold leading-tight ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                                  {ver.price}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="mt-3 space-y-1 border-t border-white/[0.08] pt-2.5 text-[11px] text-slate-300">
                        {(lang === 'ar' ? item.featuresAr : item.features).slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check size={11} className="text-blue-400 flex-none" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBigOffer({
                          ...item,
                          price: activeVersion.price,
                          shortName: `${item.name} (${activeVersion.name})`,
                          platform: 'MICROSOFT KEY',
                          platformAr: 'مفتاح مايكروسوفت أصلي',
                        })}
                        className="flex h-9 items-center justify-center gap-1 rounded-xl border border-blue-400/30 bg-blue-500/10 px-2.5 text-xs font-bold text-blue-300 transition hover:border-blue-400 hover:bg-blue-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'تكبير العرض لقراءة أسهل' : 'View full offer big for easy reading'}
                      >
                        <Maximize2 size={13} />
                        <span className="hidden sm:inline">{lang === 'ar' ? 'تكبير' : 'Big'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenOrder ? onOpenOrder({
                          categoryKey: 'Windows & Office',
                          specificItem: `${item.name} - ${activeVersion.name} (${activeVersion.price})`,
                          productName: `${item.name} (${activeVersion.name})`,
                          productPrice: activeVersion.price,
                          productImage: item.image,
                          productPlatform: 'MICROSOFT KEY',
                          defaultNotes: `Microsoft Key: ${item.name} (#${item.num}), Edition: ${activeVersion.name} (${activeVersion.price} / ${activeVersion.priceUsd})`,
                        }) : handleOrder({
                          name: `${item.name} (${activeVersion.name})`,
                          price: activeVersion.price,
                        })}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-400 to-sky-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-[0_0_18px_rgba(59,130,246,0.3)] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart size={13} />
                        <span>{lang === 'ar' ? `اطلب (${activeVersion.price})` : `Order (${activeVersion.price})`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenOrder ? onOpenOrder({
                          categoryKey: 'Windows & Office',
                          specificItem: `${item.name} - ${activeVersion.name} (${activeVersion.price})`,
                          productName: `${item.name} (${activeVersion.name})`,
                          productPrice: activeVersion.price,
                          productImage: item.image,
                          productPlatform: 'MICROSOFT KEY',
                          defaultNotes: `Microsoft Key: ${item.name} (#${item.num}), Edition: ${activeVersion.name} (${activeVersion.price} / ${activeVersion.priceUsd})`,
                        }) : handleOrder({
                          name: `${item.name} (${activeVersion.name})`,
                          price: activeVersion.price,
                        })}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
                        aria-label="Order on WhatsApp"
                      >
                        <MessageCircle size={15} className="text-emerald-400" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 3. PC GAMES SECTION */}
        {showGames && (
          <div className={(showFreeFire || showAi || showWindows) ? 'mt-12 pt-10 border-t border-white/[0.08]' : 'mt-8'}>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 text-sky-400">
                <Monitor size={15} />
              </span>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'ألعاب الكمبيوتر الأكثر مبيعاً (PC Only)' : 'Hot Seller PC Games (PC ONLY)'}
              </h3>
              <span className="rounded-md border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-300">
                200DH - 250DH
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotSellerGames.map((game) => (
                <div
                  key={game.id}
                  onMouseEnter={() => setHoveredItem(game.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] via-slate-950/80 to-[#05070d] p-4 sm:p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.25)]"
                >
                  {/* Top Image Container with Click to View Big */}
                  <div 
                    onClick={() => setSelectedBigOffer(game)}
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 cursor-pointer group/img"
                    title={lang === 'ar' ? 'انقر لتكبير العرض وقراءة التفاصيل' : 'Click to view full offer big'}
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-108"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Hot Seller Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 text-[11px] font-black tracking-wider text-white shadow-lg">
                      <Flame size={12} className="fill-white" />
                      <span>{lang === 'ar' ? game.badgeAr : game.badge}</span>
                    </div>

                    {/* Rating / Sales Tag */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{game.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({lang === 'ar' ? game.salesCountAr : game.salesCount})
                      </span>
                    </div>

                    {/* Platform pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-sky-400/35 bg-slate-950/90 px-2.5 py-1 text-[10px] font-mono font-bold text-sky-300 backdrop-blur-md shadow-md">
                      <Monitor size={12} className="text-sky-400" />
                      <span>{lang === 'ar' ? game.platformAr : game.platform}</span>
                    </div>

                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 border border-sky-400/60 px-3 py-1.5 text-xs font-black text-sky-300 shadow-xl backdrop-blur-md">
                        <Maximize2 size={13} className="text-sky-400" />
                        <span>{lang === 'ar' ? 'عرض مكبّر وكامل' : 'View Full Offer Big'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content & Features */}
                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 
                            onClick={() => setSelectedBigOffer(game)}
                            className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors cursor-pointer"
                          >
                            {game.name}
                          </h4>
                          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                            {lang === 'ar' ? game.taglineAr : game.tagline}
                          </p>
                        </div>

                        {/* Price Tag */}
                        <div className="flex flex-col items-end flex-none">
                          <span className="rounded-xl border border-sky-400/40 bg-sky-500/15 px-3 py-1 text-base sm:text-lg font-black text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                            {game.price}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {lang === 'ar' ? 'سعر خاص' : 'Special Deal'}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="mt-4 space-y-1.5 border-t border-white/[0.08] pt-3 text-xs text-slate-300">
                        {(lang === 'ar' ? game.featuresAr : game.features).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check size={12} className="text-sky-400 flex-none" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Order Action Buttons with View Big Option */}
                    <div className="mt-5 flex items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBigOffer(game)}
                        className="flex h-10 items-center justify-center gap-1 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 text-xs font-bold text-sky-300 transition hover:border-sky-400 hover:bg-sky-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'تكبير العرض لقراءة أسهل' : 'View full offer big for easy reading'}
                      >
                        <Maximize2 size={14} />
                        <span className="hidden sm:inline">{lang === 'ar' ? 'تكبير' : 'Big'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrder(game)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-300 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart size={15} />
                        <span>{lang === 'ar' ? `اطلب الآن (${game.price})` : `Order Now (${game.price})`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrder(game)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                        title={lang === 'ar' ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
                        aria-label="Order on WhatsApp"
                      >
                        <MessageCircle size={17} className="text-emerald-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SUBSCRIPTIONS & APPS SECTION */}
        {showSubs && (
          <div className={(showGames || showFreeFire) ? 'mt-12 pt-10 border-t border-white/[0.08]' : 'mt-8'}>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-400/30 bg-purple-500/10 text-purple-400">
                <Sparkles size={15} />
              </span>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'أقوى عروض الاشتراكات والبرامج (Discord · CapCut · Spotify)' : 'Hot Subscriptions & App Deals (Discord · CapCut · Spotify)'}
              </h3>
              <span className="rounded-md border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300">
                70DH - 150DH
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {hotSubscriptionOffers.map((offer) => {
                const Icon = offer.icon

                return (
                  <div
                    key={offer.id}
                    onMouseEnter={() => setHoveredItem(offer.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] via-slate-950/80 to-[#05070d] p-4 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(168,85,247,0.25)]"
                  >
                    {/* Top Image Container with Click to View Big */}
                    <div 
                      onClick={() => setSelectedBigOffer(offer)}
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60 cursor-pointer group/img"
                      title={lang === 'ar' ? 'انقر لتكبير العرض وقراءة التفاصيل' : 'Click to view full offer big'}
                    >
                      <img
                        src={offer.image}
                        alt={offer.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-108"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Badge */}
                      <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-gradient-to-r ${offer.badgeColor} px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white shadow-lg`}>
                        <Sparkles size={11} className="fill-white" />
                        <span>{lang === 'ar' ? offer.badgeAr : offer.badge}</span>
                      </div>

                      {/* Tag pill bottom left */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg border border-purple-400/35 bg-slate-950/90 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300 backdrop-blur-md shadow-md">
                        <Icon size={11} className="text-purple-400" />
                        <span>{lang === 'ar' ? offer.typeTagAr : offer.typeTag}</span>
                      </div>

                      {/* Hover Zoom Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 border border-purple-400/60 px-3 py-1.5 text-xs font-black text-purple-300 shadow-xl backdrop-blur-md">
                          <Maximize2 size={13} className="text-purple-400" />
                          <span>{lang === 'ar' ? 'عرض مكبّر وكامل' : 'View Full Offer Big'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content & Features */}
                    <div className="mt-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 
                              onClick={() => setSelectedBigOffer(offer)}
                              className="text-base font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer"
                            >
                              {offer.name}
                            </h4>
                            <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                              {lang === 'ar' ? offer.taglineAr : offer.tagline}
                            </p>
                          </div>

                          {/* Price Tag */}
                          <div className="flex flex-col items-end flex-none">
                            <span className="rounded-xl border border-purple-400/40 bg-purple-500/15 px-2.5 py-1 text-sm sm:text-base font-black text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                              {offer.price}
                            </span>
                          </div>
                        </div>

                        {/* Features List */}
                        <ul className="mt-3.5 space-y-1.5 border-t border-white/[0.08] pt-3 text-[11px] text-slate-300">
                          {(lang === 'ar' ? offer.featuresAr : offer.features).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check size={11} className="text-purple-400 flex-none" />
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons with View Big Option */}
                      <div className="mt-4 flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBigOffer(offer)}
                          className="flex h-9 items-center justify-center gap-1 rounded-xl border border-purple-400/30 bg-purple-500/10 px-2.5 text-xs font-bold text-purple-300 transition hover:border-purple-400 hover:bg-purple-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                          title={lang === 'ar' ? 'تكبير العرض لقراءة أسهل' : 'View full offer big for easy reading'}
                        >
                          <Maximize2 size={13} />
                          <span className="hidden sm:inline">{lang === 'ar' ? 'تكبير' : 'Big'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOrder(offer)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-400 to-sky-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-[0_0_18px_rgba(168,85,247,0.3)] transition-all duration-200 hover:from-white hover:to-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <ShoppingCart size={13} />
                          <span>{lang === 'ar' ? `اطلب (${offer.price})` : `Order (${offer.price})`}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOrder(offer)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 cursor-pointer flex-none"
                          title={lang === 'ar' ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
                          aria-label="Order on WhatsApp"
                        >
                          <MessageCircle size={15} className="text-emerald-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BIG OFFER DETAIL MODAL (FULL OFFER BIG FOR EASY READING)                  */}
      {/* ========================================================================= */}
      {selectedBigOffer && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={() => setSelectedBigOffer(null)}
        >
          <div 
            className="relative max-w-2xl sm:max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-3xl border border-amber-400/40 bg-gradient-to-b from-slate-900 via-slate-950 to-[#05070d] p-5 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Controls: Badges, Navigation Counter & Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5 gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <Sparkles size={12} className="text-amber-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'تفاصيل العرض بالكامل (عرض مكبّر)' : 'Full Big Offer Details'}</span>
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs text-slate-300 font-mono">
                  {currentBigIndex + 1} / {allOffers.length}
                </span>
              </div>

              {/* Navigation & Close */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevBigOffer}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] transition cursor-pointer"
                  title={lang === 'ar' ? 'العرض السابق' : 'Previous Offer'}
                >
                  <ChevronLeft size={16} className={isRTL ? 'rotate-180' : ''} />
                </button>
                <button
                  type="button"
                  onClick={handleNextBigOffer}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] transition cursor-pointer"
                  title={lang === 'ar' ? 'العرض التالي' : 'Next Offer'}
                >
                  <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBigOffer(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/[0.08] text-white hover:bg-red-500 hover:border-red-500 transition cursor-pointer ml-1"
                  title={lang === 'ar' ? 'إغلاق' : 'Close'}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Content Grid: Big Image & Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Big Image Container (5 cols on md) */}
              <div className="md:col-span-5 relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl border-2 border-white/20 bg-black/80 shadow-xl">
                <img
                  src={selectedBigOffer.image}
                  alt={selectedBigOffer.name}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Top Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-xs font-black text-slate-950 shadow-md">
                  <span>{lang === 'ar' ? (selectedBigOffer.badgeAr || selectedBigOffer.badge) : selectedBigOffer.badge}</span>
                </div>

                {/* Diamonds / Platform Pill */}
                {selectedBigOffer.diamonds && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-black/85 px-3 py-1 text-xs font-black text-amber-300 backdrop-blur-md">
                    <Gem size={13} className="text-amber-400 animate-pulse" />
                    <span>{selectedBigOffer.diamonds} 💎</span>
                  </div>
                )}

                {/* Exchange Rate / Platform bottom pill */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="rounded-lg border border-white/20 bg-slate-950/90 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300 backdrop-blur-md">
                    {selectedBigOffer.priceUsd ? `1$ = 10 DH (${selectedBigOffer.priceUsd})` : (selectedBigOffer.platform || 'OFFICIAL DEAL')}
                  </span>
                  <span className="rounded-lg border border-amber-400/40 bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
                    ⭐ {selectedBigOffer.rating || '5.0'}
                  </span>
                </div>
              </div>

              {/* Big Details & Features (7 cols on md) */}
              <div className="md:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {selectedBigOffer.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="rounded-2xl border border-amber-400/60 bg-gradient-to-r from-amber-500/25 to-yellow-500/20 px-4 py-1.5 text-2xl sm:text-3xl font-black text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                        {selectedBigOffer.price}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                    {lang === 'ar' ? selectedBigOffer.taglineAr : selectedBigOffer.tagline}
                  </p>

                  {/* Guarantees & Speed Banner */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-300">
                      <Zap size={16} className="text-emerald-400 flex-none" />
                      <div>
                        <div className="font-bold">{lang === 'ar' ? 'تسليم فوري (5 دقائق)' : 'Instant 5-Min Delivery'}</div>
                        <div className="text-[10px] text-emerald-400/80">{lang === 'ar' ? 'مباشرة عبر واتساب' : 'Direct on WhatsApp'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/10 p-2.5 text-amber-300">
                      <ShieldCheck size={16} className="text-amber-400 flex-none" />
                      <div>
                        <div className="font-bold">{lang === 'ar' ? 'ضمان رسمي 100%' : '100% Official Guarantee'}</div>
                        <div className="text-[10px] text-amber-400/80">{lang === 'ar' ? 'استبدال فوري ودعم متواصل' : 'Instant Swap & 24/7 Support'}</div>
                      </div>
                    </div>
                  </div>

                  {/* FULL FEATURES LIST IN BIG CLEAR COMFORTABLE FONT */}
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-sky-400" />
                      <span>{lang === 'ar' ? 'مميزات وتفاصيل العرض بالكامل:' : 'Full Offer Features & Benefits:'}</span>
                    </h4>

                    <ul className="space-y-2.5">
                      {(lang === 'ar' ? selectedBigOffer.featuresAr : selectedBigOffer.features).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 sm:p-3 text-sm sm:text-base font-semibold text-slate-100 shadow-sm">
                          <CheckCircle2 size={18} className="text-amber-400 flex-none mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleOrder(selectedBigOffer)
                      setSelectedBigOffer(null)
                    }}
                    className="flex-1 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 py-3.5 px-6 text-sm sm:text-base font-black text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.4)] transition hover:from-white hover:to-white hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart size={18} />
                    <span>{lang === 'ar' ? `اطلب هذا العرض الآن (${selectedBigOffer.price})` : `Order This Offer Now (${selectedBigOffer.price})`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const text = `Hello BLEUWI, I want to order ${selectedBigOffer.name} (${selectedBigOffer.price}).`
                      openWhatsAppChat(text)
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 py-3.5 px-5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/25 transition cursor-pointer"
                  >
                    <MessageCircle size={18} className="text-emerald-400" />
                    <span>{lang === 'ar' ? 'واتساب مباشر' : 'WhatsApp'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
