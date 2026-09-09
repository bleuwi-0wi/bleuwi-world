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
import ProductCard from './ProductCard'

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
      'جاهزة لفتح الفاير باس والأحداث الحصرية فوراً'
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
    badgeColor: 'from-amber-400 to-orange-500',
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
      'VIP Support & Golden Guarantee'
    ],
    featuresAr: [
      '2420 جوهرة رسمية مباشرة على حسابك بالأيدي (ID)',
      'سعر رسمي: 1$ = 10 دراهم (25$ = 250 درهم)',
      'شحن فوري وسريع في أقل من 5 دقائق عبر واتساب',
      'دعم VIP مستمر مع الضمان الذهبي للأمان'
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
    badgeColor: 'from-purple-500 to-pink-500',
    image: imgFf19,
    publicUrl: 'https://bleuwiworld.shop/image_reference/19.jpeg',
    tagline: '6160 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 6160 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    platform: 'FREE FIRE ID (VIP)',
    platformAr: 'آيدي فري فاير (VIP)',
    features: [
      '6160 Official Diamonds directly to ID',
      '1$ = 10 DH Rate (60$ = 600 DH)',
      'Instant 5-Minute Delivery on WhatsApp',
      'Highest Diamond Tier at Wholesale Price'
    ],
    featuresAr: [
      '6160 جوهرة رسمية مباشرة على حسابك بالأيدي (ID)',
      'سعر رسمي: 1$ = 10 دراهم (60$ = 600 درهم)',
      'شحن فوري وسريع في أقل من 5 دقائق عبر واتساب',
      'أعلى باقة جواهر بأفضل سعر جملة مخفض'
    ],
    rating: '5.0',
    salesCount: '190+ sold',
    salesCountAr: '+190 شحنة',
  },
]

export const hotSellerGames = [
  {
    id: 'gta-v',
    name: 'Grand Theft Auto V: Premium Edition',
    shortName: 'GTA V (PC)',
    categoryKey: 'Sell Games',
    price: '150 DH',
    priceNum: 150,
    badge: 'TOP SELLER',
    badgeAr: 'الأكثر مبيعاً',
    badgeColor: 'from-amber-500 to-orange-600',
    image: imgGta,
    tagline: 'Complete Story Mode, GTA Online + $1,000,000 Bonus Cash on PC',
    taglineAr: 'اللعبة الكاملة + أونلاين + مكافأة مليون دولار كاش على الكمبيوتر',
    platform: 'PC ONLY',
    platformAr: 'كمبيوتر فقط (PC ONLY)',
    features: [
      'Full Story Mode + GTA Online (PC)',
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
  const { lang, isRTL, t } = useLanguage()
  const [filter, setFilter] = useState('all') // 'all' | 'freefire' | 'windows' | 'ai' | 'games' | 'subscriptions'
  const [isSwitching, setIsSwitching] = useState(false)
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

  const handleFilterChange = (newFilter) => {
    if (newFilter === filter) return
    setIsSwitching(true)
    setFilter(newFilter)
    setTimeout(() => {
      setIsSwitching(false)
    }, 150)
  }

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
  const showWindows = filter === 'all' || filter === 'windows'
  const showAi = filter === 'all' || filter === 'ai'
  const showGames = filter === 'all' || filter === 'games'
  const showSubs = filter === 'all' || filter === 'subscriptions'

  return (
    <section id="hot-sellers" className="relative z-10 scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/[0.08] pb-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>{lang === 'ar' ? 'أقوى العروض الحصرية' : 'HOT EXCLUSIVE DEALS'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-white/80">{lang === 'ar' ? 'ألعاب، جواهر واشتراكات بأفضل الأسعار' : 'GAMES, DIAMONDS & LICENSES'}</span>
            </div>
            
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-white">
              {lang === 'ar' ? 'الأكثر مبيعاً وطلباً' : 'Top Trending Offers'}
              <span className="text-gradient ml-2">
                {lang === 'ar' ? 'تسليم فوري وضمان كامل' : 'Instant Delivery'}
              </span>
            </h2>
            
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'شحن جواهر فري فاير (1$ = 10 دراهم)، تراخيص مايكروسوفت الرسمية مدى الحياة، اشتراكات الذكاء الاصطناعي وألعاب PC مع تسليم فوري عبر واتساب.'
                : 'Free Fire Diamonds (1$ = 10 DH), Official Windows & Office Keys, Premium AI Subscriptions & PC Games with 5-min WhatsApp delivery.'}
            </p>
          </div>

          {/* CATEGORY FILTER SWITCHER TABS (Horizontally scrollable on mobile) */}
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth">
            <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 backdrop-blur-xl shadow-lg whitespace-nowrap min-w-max">
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
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
                onClick={() => handleFilterChange('freefire')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  filter === 'freefire'
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Gem size={13} className={filter === 'freefire' ? 'text-amber-400 animate-bounce' : 'text-amber-400/70'} />
                <span>{lang === 'ar' ? 'جواهر فري فاير (4)' : 'Free Fire Diamond (4)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('windows')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  filter === 'windows'
                    ? 'bg-sky-500/25 text-sky-300 border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Key size={13} className={filter === 'windows' ? 'text-sky-300 animate-pulse' : 'text-sky-400/80'} />
                <span>{lang === 'ar' ? 'ويندوز وأوفيس (3)' : 'Windows & Office (3)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('ai')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
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
                onClick={() => handleFilterChange('games')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  filter === 'games'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Monitor size={13} className={filter === 'games' ? 'text-emerald-300' : 'text-slate-500'} />
                <span>{lang === 'ar' ? 'ألعاب PC (3)' : 'PC Games (3)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange('subscriptions')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  filter === 'subscriptions'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Disc3 size={13} className={filter === 'subscriptions' ? 'text-indigo-300' : 'text-slate-500'} />
                <span>{lang === 'ar' ? 'اشتراكات بريميوم (4)' : 'Subscriptions (4)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* LOADING SKELETON FEEDBACK WHEN SWITCHING CATEGORIES */}
        {isSwitching && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-3xl border border-white/10 bg-white/[0.02] p-4 skeleton-shimmer" />
            ))}
          </div>
        )}

        {/* 1. FREE FIRE DIAMONDS SECTION */}
        {!isSwitching && showFreeFire && (
          <div className="mt-10">
            {/* Announcement Card (1$ = 10 DH) */}
            <div className="mb-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-400/35 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 p-4 sm:p-5 backdrop-blur-xl shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-400/60 bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md">
                    <Gem size={24} className="fill-slate-950 text-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-black text-amber-300 border border-amber-400/30">
                        {lang === 'ar' ? 'سعر الصرف الرسمي: 1$ = 10 دراهم' : 'OFFICIAL RATE: 1$ = 10 DH'}
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {lang === 'ar' ? 'شحن فوري بالآيدي (ID)' : 'Instant ID Recharge'}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base sm:text-lg font-bold text-white">
                      {lang === 'ar' ? 'قسم جواهر فري فاير (Free Fire Diamond) بأفضل الأسعار الرسمية' : 'Free Fire Diamonds at Official Exchange Rates'}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-300 font-medium">
                    {lang === 'ar' ? '530 · 1080 · 2420 · 6160 جوهرة' : '530 · 1080 · 2420 · 6160 Diamonds'}
                  </span>
                </div>
              </div>
            </div>

            {/* Standardized Free Fire Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {freeFirePacks.map((pack) => (
                <ProductCard
                  key={pack.id}
                  product={{
                    ...pack,
                    categoryKey: 'Free Fire Diamond',
                  }}
                  onOrder={handleOrder}
                  onInspect={setSelectedBigOffer}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. WINDOWS & MICROSOFT OFFICE KEYS SECTION */}
        {!isSwitching && showWindows && (
          <div className="mt-12">
            <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-sky-400/30 bg-sky-500/10 text-sky-300">
                  <Key size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'ar' ? 'مفاتيح وتراخيص ويندوز وأوفيس الأصلية (مدى الحياة)' : 'Genuine Lifetime Windows & Office Retail Keys'}
                </h3>
              </div>
              <span className="text-xs text-sky-300 font-bold hidden sm:inline">
                {lang === 'ar' ? 'تفعيل فوري أونلاين 100%' : '100% Online Activation'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {windowsOfficeKeys.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    ...item,
                    categoryKey: 'Windows & Office',
                  }}
                  variantType="version"
                  variantIndex={winVersionIndices[item.id] ?? 1}
                  onVariantChange={(idx) => setWinVersionIndices((prev) => ({ ...prev, [item.id]: idx }))}
                  onOrder={handleOrder}
                  onInspect={setSelectedBigOffer}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. AI SUBSCRIPTIONS SECTION */}
        {!isSwitching && showAi && (
          <div className="mt-12">
            <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-purple-400/30 bg-purple-500/10 text-purple-300">
                  <Sparkles size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'ar' ? 'اشتراكات الذكاء الاصطناعي المميزة (ChatGPT, Claude, Gemini, Canva)' : 'Premium AI Subscriptions (ChatGPT Plus, Claude, Gemini, Canva)'}
                </h3>
              </div>
              <span className="text-xs text-purple-300 font-bold hidden sm:inline">
                {lang === 'ar' ? 'خطط شهر · سنة · 18 شهراً' : '1M / 1Y / 18M Plans'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {aiSubscriptions.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    ...item,
                    categoryKey: 'AI Subscriptions',
                  }}
                  variantType="plan"
                  variantIndex={aiPlanIndices[item.id] ?? 1}
                  onVariantChange={(idx) => setAiPlanIndices((prev) => ({ ...prev, [item.id]: idx }))}
                  onOrder={handleOrder}
                  onInspect={setSelectedBigOffer}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. PC GAMES SECTION */}
        {!isSwitching && showGames && (
          <div className="mt-12">
            <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                  <Monitor size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'ar' ? 'ألعاب الكمبيوتر الرسمية (PC Games & Keys)' : 'Official PC Games & Keys (Rockstar, Steam, EA)'}
                </h3>
              </div>
              <span className="text-xs text-emerald-300 font-bold hidden sm:inline">
                {lang === 'ar' ? 'مفاتيح رسمية أصلية' : '100% Genuine Retail'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {hotSellerGames.map((game) => (
                <ProductCard
                  key={game.id}
                  product={{
                    ...game,
                    categoryKey: 'Sell Games',
                  }}
                  onOrder={handleOrder}
                  onInspect={setSelectedBigOffer}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. PREMIUM SUBSCRIPTIONS SECTION */}
        {!isSwitching && showSubs && (
          <div className="mt-12">
            <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
                  <Disc3 size={15} />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'ar' ? 'الاشتراكات الشهرية والحسابات (Discord, CapCut, Spotify)' : 'Premium Subscriptions (Discord Nitro, CapCut Pro, Spotify)'}
                </h3>
              </div>
              <span className="text-xs text-indigo-300 font-bold hidden sm:inline">
                {lang === 'ar' ? 'تفعيل فوري وضمان مستمر' : 'Instant Setup & Full Support'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {hotSubscriptionOffers.map((sub) => (
                <ProductCard
                  key={sub.id}
                  product={{
                    ...sub,
                    categoryKey: 'Abonnements',
                  }}
                  onOrder={handleOrder}
                  onInspect={setSelectedBigOffer}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FULLSCREEN BIG OFFER INSPECTION MODAL */}
      {selectedBigOffer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedBigOffer(null)}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div 
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#070b14] p-5 sm:p-7 shadow-2xl text-white my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                  {lang === 'ar' ? 'تفاصيل العرض الكاملة' : 'Full Offer Specifications'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedBigOffer.platform}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBigOffer(null)}
                className="rounded-full bg-white/10 p-1.5 text-slate-300 hover:bg-white/20 hover:text-white transition cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid gap-6 md:grid-cols-12 items-center">
              <div className="md:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <img
                    src={selectedBigOffer.image}
                    alt={selectedBigOffer.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-black/80 px-3 py-1 text-xs font-black text-sky-300 border border-white/15">
                    {selectedBigOffer.price}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedBigOffer.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                    {lang === 'ar' ? (selectedBigOffer.taglineAr || selectedBigOffer.tagline) : selectedBigOffer.tagline}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-300">
                      <Zap size={16} className="shrink-0" />
                      <div>
                        <div className="font-bold">{lang === 'ar' ? 'تسليم فوري (5 دقائق)' : 'Instant 5-Min Delivery'}</div>
                        <div className="text-[10px] text-emerald-400/80">{lang === 'ar' ? 'عبر واتساب مباشرة' : 'Direct on WhatsApp'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/10 p-2.5 text-amber-300">
                      <ShieldCheck size={16} className="shrink-0" />
                      <div>
                        <div className="font-bold">{lang === 'ar' ? 'الضمان الذهبي 100%' : '100% Golden Guarantee'}</div>
                        <div className="text-[10px] text-amber-400/80">{lang === 'ar' ? 'استبدال ودعم متواصل' : 'Instant Replacement'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      {lang === 'ar' ? 'مميزات العرض:' : 'Features & Benefits:'}
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      {((lang === 'ar' ? selectedBigOffer.featuresAr : selectedBigOffer.features) || []).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary CTA Button in Modal */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleOrder(selectedBigOffer)
                      setSelectedBigOffer(null)
                    }}
                    className="btn-cta-primary w-full flex-1 py-3.5"
                  >
                    <ShoppingCart size={18} />
                    <span>{lang === 'ar' ? `شراء الآن (${selectedBigOffer.price})` : `Order Now (${selectedBigOffer.price})`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const text = `Hello BLEUWI, I want to order ${selectedBigOffer.name} (${selectedBigOffer.price}).`
                      openWhatsAppChat(text)
                    }}
                    className="btn-cta-secondary w-full sm:w-auto py-3.5 px-5"
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
