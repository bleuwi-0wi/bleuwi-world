import { useState } from 'react'
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
  Disc3
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_NUMBER } from '../data/links'

import imgGta from '../assets/game-gta-v.jpeg'
import imgRedDead from '../assets/game-red-dead-2.jpeg'
import imgFifa from '../assets/game-fifa.jpg'
import imgDiscord from '../assets/offer-discord.webp'
import imgCapcut from '../assets/offer-capcut.jpg'
import imgSpotify3M from '../assets/offer-spotify-3m.jpg'
import imgSpotify1M from '../assets/offer-spotify-1m.jpg'

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
  const [filter, setFilter] = useState('all') // 'all' | 'games' | 'subscriptions'
  const [hoveredItem, setHoveredItem] = useState(null)

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
      const text = encodeURIComponent(`Hello BLEUWI, I would like to order ${item.name} (${item.price}).`)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
    }
  }

  const showGames = filter === 'all' || filter === 'games'
  const showSubs = filter === 'all' || filter === 'subscriptions'

  return (
    <section id="hot-sellers" className="relative z-10 scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/[0.08] pb-6 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>{lang === 'ar' ? 'أقوى العروض الحصرية' : 'HOT EXCLUSIVE DEALS'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-white/80">{lang === 'ar' ? 'ألعاب واشتراكات بأفضل الأسعار' : 'GAMES & SUBSCRIPTIONS'}</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {lang === 'ar' ? 'الأكثر مبيعاً وطلباً' : 'Top Trending Offers'}
              <span className="text-gradient ml-2">
                {lang === 'ar' ? 'تسليم فوري وضمان كامل' : 'Instant Delivery'}
              </span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              {lang === 'ar'
                ? 'ألعاب كمبيوتر أصلية (PC) واشتراكات بريميوم رقمية (Discord, Spotify, CapCut) بأسعار خاصة مع تسليم فوري عبر واتساب.'
                : 'Official PC Games & Premium Subscriptions (Discord, Spotify, CapCut) at special rates with instant WhatsApp delivery.'}
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
              <span>{lang === 'ar' ? 'جميع العروض (7)' : 'All Deals (7)'}</span>
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
              <Sparkles size={13} className={filter === 'subscriptions' ? 'text-purple-300' : 'text-slate-500'} />
              <span>{lang === 'ar' ? 'اشتراكات وبرامج (4)' : 'Subscriptions (4)'}</span>
            </button>
          </div>
        </div>

        {/* 1. PC GAMES SECTION */}
        {showGames && (
          <div className="mt-8">
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
                  {/* Top Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  </div>

                  {/* Content & Features */}
                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
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

                    {/* Order Action Buttons */}
                    <div className="mt-5 flex items-center gap-2.5 pt-2">
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

        {/* 2. SUBSCRIPTIONS & APPS SECTION */}
        {showSubs && (
          <div className={showGames ? 'mt-12 pt-10 border-t border-white/[0.08]' : 'mt-8'}>
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
                    {/* Top Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/60">
                      <img
                        src={offer.image}
                        alt={offer.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    </div>

                    {/* Content & Features */}
                    <div className="mt-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
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

                      {/* Action Buttons */}
                      <div className="mt-4 flex items-center gap-2 pt-2">
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
    </section>
  )
}
