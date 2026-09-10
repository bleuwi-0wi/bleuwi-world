import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Check,
  Copy,
  Download,
  Eye,
  Image as ImageIcon,
  MessageCircle,
  User,
  X,
  Sparkles,
  Gamepad2,
  Coins,
  Clapperboard,
  Palette,
  ShieldCheck,
  ArrowUpRight,
  Shield,
  Zap,
  Tag,
  Monitor,
  Crown,
  Gem,
  AlertCircle,
  Loader2,
  Maximize2,
  Phone,
} from 'lucide-react'
import { orderPresets, getSecureWhatsAppUrl, openWhatsAppChat, WHATSAPP_DIRECT_LINK } from '../data/links'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { getOrderRateLimitStatus, recordOrderSubmission, MAX_ORDERS_PER_DAY } from '../utils/orderAntiSpam'
import { api } from '../services/api'

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
import cardVideo from '../assets/card-video-5.jpg'
import cardPanels from '../assets/card-panels-7.jpg'
import cardDesign from '../assets/card-design-8.jpg'
import refCoins from '../assets/1.webp'
import refAbonnements from '../assets/2.webp'
import refGames from '../assets/3.webp'
import cardAi20 from '../assets/card-ai-20.png'
import cardAi21 from '../assets/card-ai-21.png'
import cardAi22 from '../assets/card-ai-22.png'
import cardAi23 from '../assets/card-ai-23.png'
import cardWin24 from '../assets/card-win-24.png'
import cardWin25 from '../assets/card-win-25.png'
import cardWin26 from '../assets/card-win-26.png'

// Comprehensive Product Registry for exact product image & WhatsApp message matching
export const productRegistry = [
  {
    matches: (name) => /free fire.*530/i.test(name) || /530.*diamond/i.test(name) || (/530/i.test(name) && /free fire|diamond|جواهر/i.test(name)),
    title: 'Free Fire 530 Diamonds (60 DH / 6$)',
    shortName: '530 Diamonds',
    price: '60 DH',
    platform: 'FREE FIRE ID',
    badge: 'STARTER PACK',
    badgeAr: 'باقة المبتدئين',
    image: imgFf16,
    publicUrl: 'https://bleuwiworld.shop/image_reference/16.jpeg',
    tagline: '530 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 530 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    filename: 'BLEUWI-FreeFire-530.jpeg',
  },
  {
    matches: (name) => /free fire.*1080/i.test(name) || /1080.*diamond/i.test(name) || (/1080/i.test(name) && /free fire|diamond|جواهر/i.test(name)),
    title: 'Free Fire 1080 Diamonds (120 DH / 12$)',
    shortName: '1080 Diamonds',
    price: '120 DH',
    platform: 'FREE FIRE ID',
    badge: 'MOST POPULAR',
    badgeAr: 'الأكثر طلباً',
    image: imgFf17,
    publicUrl: 'https://bleuwiworld.shop/image_reference/17.jpeg',
    tagline: '1080 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 1080 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    filename: 'BLEUWI-FreeFire-1080.jpeg',
  },
  {
    matches: (name) => /free fire.*2420/i.test(name) || /2420.*diamond/i.test(name) || (/2420/i.test(name) && /free fire|diamond|جواهر/i.test(name)),
    title: 'Free Fire 2420 Diamonds (250 DH / 25$)',
    shortName: '2420 Diamonds',
    price: '250 DH',
    platform: 'FREE FIRE ID',
    badge: 'BEST VALUE',
    badgeAr: 'أفضل توفير',
    image: imgFf18,
    publicUrl: 'https://bleuwiworld.shop/image_reference/18.jpeg',
    tagline: '2420 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 2420 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    filename: 'BLEUWI-FreeFire-2420.jpeg',
  },
  {
    matches: (name) => /free fire.*6160/i.test(name) || /6160.*diamond/i.test(name) || (/6160/i.test(name) && /free fire|diamond|جواهر/i.test(name)),
    title: 'Free Fire 6160 Diamonds (600 DH / 60$)',
    shortName: '6160 Diamonds',
    price: '600 DH',
    platform: 'FREE FIRE ID (VIP)',
    badge: 'VIP MEGA PACK',
    badgeAr: 'الباقة الملكية VIP',
    image: imgFf19,
    publicUrl: 'https://bleuwiworld.shop/image_reference/19.jpeg',
    tagline: '6160 Diamonds instant recharge by Player ID (1$ = 10 DH)',
    taglineAr: 'شحن فوري 6160 جوهرة عبر الآيدي (1 دولار = 10 دراهم)',
    filename: 'BLEUWI-FreeFire-6160.jpeg',
  },
  {
    matches: (name) => /free fire/i.test(name) || /diamond/i.test(name) || /جواهر/i.test(name),
    title: 'Free Fire Diamonds (Game Coins)',
    shortName: 'Free Fire Diamonds',
    price: '1$ = 10 DH',
    platform: 'FREE FIRE ID',
    badge: '1$ = 10 DH',
    badgeAr: '1$ = 10 دراهم',
    image: imgFf19,
    publicUrl: 'https://bleuwiworld.shop/image_reference/19.jpeg',
    tagline: 'Official Free Fire Diamonds instant recharge (1$ = 10 DH)',
    taglineAr: 'شحن فوري لجواهر فري فاير بالآيدي بسعر 1 دولار = 10 دراهم',
    filename: 'BLEUWI-FreeFire-Diamonds.jpeg',
  },
  {
    matches: (name) => /gta/i.test(name) || /grand theft auto/i.test(name),
    title: 'Grand Theft Auto V (PC ONLY)',
    shortName: 'GTA V (PC ONLY)',
    price: '200 DH',
    platform: 'PC ONLY',
    badge: 'HOT SELLER',
    badgeAr: 'الأكثر مبيعاً',
    image: imgGta,
    publicUrl: 'https://bleuwiworld.shop/image_reference/gta-v.jpeg',
    tagline: 'PC Edition + GTA Online Criminal Starter Pack (FiveM Ready)',
    taglineAr: 'نسخة الكمبيوتر PC + باقة البداية أونلاين وجاهز لسيرفرات فايف إم',
    filename: 'BLEUWI-GTA-V.jpeg',
  },
  {
    matches: (name) => /red dead/i.test(name) || /rdr2/i.test(name),
    title: 'Red Dead Redemption 2 (PC ONLY)',
    shortName: 'RED DEAD 2 (PC ONLY)',
    price: '250 DH',
    platform: 'PC ONLY',
    badge: 'TOP RATED',
    badgeAr: 'الأعلى تقييماً',
    image: imgRedDead,
    publicUrl: 'https://bleuwiworld.shop/image_reference/red-dead-2.jpeg',
    tagline: 'Complete Story Mode + Red Dead Online (PC Masterpiece)',
    taglineAr: 'طور القصة الكامل + ريد ديد أونلاين بجرافيكس 4K أسطوري',
    filename: 'BLEUWI-RedDead2.jpeg',
  },
  {
    matches: (name) => /fifa/i.test(name) || /ea sports fc/i.test(name) || /fc coins/i.test(name),
    title: 'EA SPORTS FC / FIFA (PC ONLY)',
    shortName: 'FIFA (PC ONLY)',
    price: '200 DH',
    platform: 'PC ONLY',
    badge: 'BEST VALUE',
    badgeAr: 'أفضل عرض',
    image: imgFifa,
    publicUrl: 'https://bleuwiworld.shop/image_reference/fifa-26.jpg',
    tagline: 'Ultimate Team & Online Clubs PC Global Key',
    taglineAr: 'لعبة كرة القدم العالمية للكمبيوتر مع ألتميت تيم والأندية',
    filename: 'BLEUWI-FIFA.jpg',
  },
  {
    matches: (name) => /discord/i.test(name) || /nitro/i.test(name),
    title: 'Discord Nitro (Full + 2 Boosts)',
    shortName: 'Discord Nitro',
    price: '70 DH',
    platform: 'NITRO FULL',
    badge: 'HOT OFFER',
    badgeAr: 'عرض حصري',
    image: imgDiscord,
    publicUrl: 'https://bleuwiworld.shop/image_reference/offer-discord.webp',
    tagline: 'Full Nitro with 2 Server Boosts, 500MB Uploads & 4K 60FPS Streaming',
    taglineAr: 'دسكورد نيترو كامل مع 2 بوست سيرفر وبث 4K فائق الدقة',
    filename: 'BLEUWI-DiscordNitro.webp',
  },
  {
    matches: (name) => /capcut/i.test(name),
    title: 'CapCut Pro (1 Month VIP)',
    shortName: 'CapCut Pro 1M',
    price: '90 DH',
    platform: 'VIP ACCESS',
    badge: 'CREATOR VIP',
    badgeAr: 'اختيار المونتير',
    image: imgCapcut,
    publicUrl: 'https://bleuwiworld.shop/image_reference/offer-capcut.jpg',
    tagline: 'VIP Video Editing with AI Auto-Captions, 4K 60FPS Export & Cloud Assets',
    taglineAr: 'مونتاج فيديو VIP مع كتابة نصوص تلقائية وتصدير 4K بدون علامة مائية',
    filename: 'BLEUWI-CapCutPro.jpg',
  },
  {
    matches: (name) => /spotify.*3/i.test(name) || /spotify.*three/i.test(name),
    title: 'Spotify Premium (3 Months)',
    shortName: 'Spotify 3 Months',
    price: '150 DH',
    platform: 'PREMIUM',
    badge: 'BEST VALUE',
    badgeAr: 'أفضل توفير',
    image: imgSpotify3M,
    publicUrl: 'https://bleuwiworld.shop/image_reference/offer-spotify-3m.jpg',
    tagline: '3 Months Ad-Free Music with Offline Downloads & Highest Audio Quality',
    taglineAr: '3 أشهر بريميوم بدون إعلانات مع تحميل وتشغيل أوفلاين',
    filename: 'BLEUWI-Spotify3M.jpg',
  },
  {
    matches: (name) => /spotify/i.test(name),
    title: 'Spotify Premium (1 Month)',
    shortName: 'Spotify 1 Month',
    price: '70 DH',
    platform: 'PREMIUM',
    badge: 'SPECIAL PRICE',
    badgeAr: 'سعر خاص',
    image: imgSpotify1M,
    publicUrl: 'https://bleuwiworld.shop/image_reference/offer-spotify-1m.jpg',
    tagline: '1 Month Individual / Family Ad-Free Audio Stream',
    taglineAr: 'اشتراك شهر سبوتيفاي بريميوم بدون إعلانات وبجودة استماع عالية',
    filename: 'BLEUWI-Spotify1M.jpg',
  },
  {
    matches: (name) => /chatgpt|gpt.*4|o1.*pro/i.test(name),
    title: 'ChatGPT Plus (GPT-4o / o1 PRO)',
    shortName: 'ChatGPT Plus',
    price: '110 DH - 550 DH',
    platform: 'AI PRO',
    badge: 'GPT-4o / o1 PRO',
    badgeAr: 'الأكثر طلباً عالمياً',
    image: cardAi20,
    publicUrl: 'https://bleuwiworld.shop/image_reference/20.png',
    tagline: 'GPT-4o, o1 Reasoning, DALL-E 3, Voice Mode & Web Search',
    taglineAr: 'أحدث نماذج GPT-4o وo1، توليد صور DALL-E 3، الصوت المتقدم، والبحث',
    filename: 'BLEUWI-ChatGPT-Plus.png',
  },
  {
    matches: (name) => /gemini/i.test(name),
    title: 'Google Gemini Advanced (2TB Cloud)',
    shortName: 'Gemini Advanced',
    price: '100 DH - 480 DH',
    platform: 'AI PRO',
    badge: 'Gemini 1.5 Pro + 2TB',
    badgeAr: 'سعة 2TB سحابية',
    image: cardAi21,
    publicUrl: 'https://bleuwiworld.shop/image_reference/21.png',
    tagline: 'Gemini 1.5 Pro, 2TB Google One Cloud, 1M Context & Docs',
    taglineAr: 'نموذج Gemini 1.5 Pro، مساحة 2 تيرابايت سحابية، وسياق ضخم مليون توكن',
    filename: 'BLEUWI-Gemini-Advanced.png',
  },
  {
    matches: (name) => /claude/i.test(name),
    title: 'Claude AI (Claude Pro)',
    shortName: 'Claude AI Pro',
    price: '120 DH - 550 DH',
    platform: 'AI PRO',
    badge: 'Claude 3.5 Sonnet',
    badgeAr: 'الرقم 1 في البرمجة',
    image: cardAi22,
    publicUrl: 'https://bleuwiworld.shop/image_reference/22.png',
    tagline: 'Claude 3.5 Sonnet, Artifacts Canvas, 5x More Usage & Coding',
    taglineAr: 'أقوى نموذج برمجي Claude 3.5 Sonnet، بيئة Artifacts التفاعلية',
    filename: 'BLEUWI-Claude-Pro.png',
  },
  {
    matches: (name) => /canva/i.test(name),
    title: 'Canva Pro (Magic AI)',
    shortName: 'Canva Pro AI',
    price: '50 DH - 210 DH',
    platform: 'AI PRO',
    badge: 'Canva Pro + Magic AI',
    badgeAr: 'شامل كل الميزات VIP',
    image: cardAi23,
    publicUrl: 'https://bleuwiworld.shop/image_reference/23.png',
    tagline: 'Magic AI Tools, 100M+ Stock Assets, Brand Kit & 1TB Storage',
    taglineAr: 'أدوات الذكاء الاصطناعي السحرية، 100 مليون ملحق وتصميم، ومساحة 1TB',
    filename: 'BLEUWI-Canva-Pro.png',
  },
  {
    matches: (name) => /windows.*10|win.*10|ويندوز.*10/i.test(name),
    title: 'Windows 10 Genuine Lifetime Retail Key',
    shortName: 'Windows 10 Key',
    price: '95 DH - 140 DH',
    platform: 'MICROSOFT KEY',
    badge: 'LIFETIME KEY',
    badgeAr: 'تفعيل دائم مدى الحياة',
    image: cardWin24,
    publicUrl: 'https://bleuwiworld.shop/image_reference/24.png',
    tagline: '100% Genuine Retail Key for Windows 10 (Home, Pro, Enterprise) with Direct Online Activation',
    taglineAr: 'مفتاح أصلي دائم مدى الحياة لويندوز 10 (هوم، برو، شركات) مع تفعيل فوري ومباشر',
    filename: 'BLEUWI-Windows10-Key.png',
  },
  {
    matches: (name) => /windows.*11|win.*11|ويندوز.*11/i.test(name),
    title: 'Windows 11 Genuine Lifetime Retail Key',
    shortName: 'Windows 11 Key',
    price: '120 DH - 170 DH',
    platform: 'MICROSOFT KEY',
    badge: 'WINDOWS 11 GENUINE',
    badgeAr: 'الأحدث والأكثر مبيعاً',
    image: cardWin25,
    publicUrl: 'https://bleuwiworld.shop/image_reference/25.png',
    tagline: 'Direct Retail Key for Windows 11 (Home, Pro, Enterprise) with TPM 2.0 & Auto HDR Support',
    taglineAr: 'مفتاح أصلي دائم لويندوز 11 مع دعم كامل للتحديثات وأحدث تقنيات الأمان والألعاب',
    filename: 'BLEUWI-Windows11-Key.png',
  },
  {
    matches: (name) => /office|أوفيس|365|ltsc|word|excel/i.test(name),
    title: 'Microsoft Office Genuine Suite (365 / 2021 / 2024 LTSC)',
    shortName: 'Microsoft Office',
    price: '150 DH - 250 DH',
    platform: 'MICROSOFT KEY',
    badge: 'OFFICE SUITE PRO',
    badgeAr: 'شامل كل برامج الأوفيس',
    image: cardWin26,
    publicUrl: 'https://bleuwiworld.shop/image_reference/26.png',
    tagline: 'Word, Excel, PowerPoint, Outlook, OneNote, Access with Direct Download from setup.office.com',
    taglineAr: 'الحزمة الكاملة وورد وإكسل وباوربوينت مع تفعيل رسمي مدى الحياة وضمان 100%',
    filename: 'BLEUWI-Microsoft-Office.png',
  },
]

const categoryFallbacks = {
  'Windows & Office': {
    title: 'Windows & Office Genuine Keys (Win 10, Win 11, Office 2024)',
    badge: '100% Genuine Retail',
    badgeAr: 'تراخيص رسمية أصلية',
    image: cardWin25,
    publicUrl: 'https://bleuwiworld.shop/image_reference/25.png',
    tagline: 'Official Microsoft lifetime activation retail keys with direct online activation and 100% replacement warranty',
    taglineAr: 'سيريالات ومفاتيح مايكروسوفت الأصلية مدى الحياة مع تفعيل فوري أونلاين وضمان كامل 100%',
    filename: 'BLEUWI-Windows-Office-Keys.png',
  },
  'Windows & Office Keys': {
    title: 'Windows & Office Genuine Keys (Win 10, Win 11, Office 2024)',
    badge: '100% Genuine Retail',
    badgeAr: 'تراخيص رسمية أصلية',
    image: cardWin25,
    publicUrl: 'https://bleuwiworld.shop/image_reference/25.png',
    tagline: 'Official Microsoft lifetime activation retail keys with direct online activation and 100% replacement warranty',
    taglineAr: 'سيريالات ومفاتيح مايكروسوفت الأصلية مدى الحياة مع تفعيل فوري أونلاين وضمان كامل 100%',
    filename: 'BLEUWI-Windows-Office-Keys.png',
  },
  'AI Subscriptions': {
    title: 'AI Subscriptions (GPT, Gemini, Claude, Canva)',
    badge: '1M / 1Y / 18M Plans',
    badgeAr: 'خطط شهر · سنة · 18 شهر',
    image: cardAi20,
    publicUrl: 'https://bleuwiworld.shop/image_reference/20.png',
    tagline: 'Official AI VIP subscriptions with flexible 1M, 1Y, and 18M durations',
    taglineAr: 'تراخيص واشتراكات الذكاء الاصطناعي الرسمية بمدد مرنة (شهر / سنة / 18 شهراً)',
    filename: 'BLEUWI-AI-Subscriptions.png',
  },
  'Free Fire Diamond': {
    title: 'Free Fire Diamond (Game Coins)',
    badge: '1$ = 10 DH',
    badgeAr: '1$ = 10 دراهم',
    image: imgFf19,
    publicUrl: 'https://bleuwiworld.shop/image_reference/19.jpeg',
    tagline: 'Official Free Fire Diamonds instant ID top-up (1$ = 10 DH)',
    taglineAr: 'شحن فوري لجواهر فري فاير بالأيدي بمعدل صرف 1$ = 10 دراهم',
    filename: 'BLEUWI-FreeFire-Diamonds.jpeg',
  },
  'Free Fire Diamonds': {
    title: 'Free Fire Diamonds (Game Coins)',
    badge: '1$ = 10 DH',
    badgeAr: '1$ = 10 دراهم',
    image: imgFf19,
    publicUrl: 'https://bleuwiworld.shop/image_reference/19.jpeg',
    tagline: 'Official Free Fire Diamonds instant ID top-up (1$ = 10 DH)',
    taglineAr: 'شحن فوري لجواهر فري فاير بالأيدي بمعدل صرف 1$ = 10 دراهم',
    filename: 'BLEUWI-FreeFire-Diamonds.jpeg',
  },
  'Game Coins': {
    title: 'Game Coins & Currencies',
    badge: 'Instant Delivery',
    badgeAr: 'تسليم فوري',
    image: refCoins,
    publicUrl: 'https://bleuwiworld.shop/image_reference/1.png',
    tagline: 'Safe & fast in-game currency packages (Robux, V-Bucks, GTA, VP)',
    taglineAr: 'باقات شحن ألعاب آمنة وسريعة بأفضل الأسعار الرسمية',
    filename: 'BLEUWI-Coins-Catalog.png',
  },
  'Abonnements': {
    title: 'Subscriptions & Abonnements',
    badge: 'Best Rates',
    badgeAr: 'أفضل الأسعار',
    image: refAbonnements,
    publicUrl: 'https://bleuwiworld.shop/image_reference/2.png',
    tagline: 'Premium community, streaming, and gaming passes',
    taglineAr: 'اشتراكات بريميوم للألعاب، البث، والمجتمعات الرقمية',
    filename: 'BLEUWI-Abonnements-Catalog.png',
  },
  'Sell Games': {
    title: 'Sell Games & Digital Keys',
    badge: 'Global Keys',
    badgeAr: 'مفاتيح عالمية',
    image: refGames,
    publicUrl: 'https://bleuwiworld.shop/image_reference/3.png',
    tagline: 'Official AAA game keys & activations for PC, Steam & Epic',
    taglineAr: 'مفاتيح ألعاب أصلية لمنصات الكمبيوتر وستيم وإبيك',
    filename: 'BLEUWI-GameKeys-Catalog.png',
  },
  'Video Editing': {
    title: 'Video Editing Session',
    badge: '4K Retention',
    badgeAr: 'مونتاج 4K',
    image: cardVideo,
    publicUrl: 'https://bleuwiworld.shop/image_reference/5.jpeg',
    tagline: 'High retention pacing, sound design & cinematic color grading',
    taglineAr: 'مونتاج احترافي لزيادة المشاهدات مع تلوين ومؤثرات سينمائية',
    filename: 'BLEUWI-Video-Editing.jpg',
  },
  'Cheat Panels': {
    title: 'Private Cheat Panels Session',
    badge: 'Kernel Protected',
    badgeAr: 'حماية كيرنل',
    image: cardPanels,
    publicUrl: 'https://bleuwiworld.shop/image_reference/6.jpeg',
    tagline: 'Kernel-level private tools, stream-proof overlay & HWID spoofers',
    taglineAr: 'أدوات وأوفرلاي خاص مخفي عن البث مع حماية سيريال القطع',
    filename: 'BLEUWI-Cheat-Panels.jpg',
  },
  'Design / Dev': {
    title: 'Design & Dev Session',
    badge: 'Visual Identity',
    badgeAr: 'هوية بصرية',
    image: cardDesign,
    publicUrl: 'https://bleuwiworld.shop/image_reference/8.jpeg',
    tagline: 'Custom creator websites, logos, brand marks & high-CTR thumbnails',
    taglineAr: 'تصميم مواقع عصرية، لوغوهات خاصة وصور مصغرة عالية النقر',
    filename: 'BLEUWI-Design-Dev.jpg',
  },
}

const categoryIcons = {
  'Free Fire Diamond': Gem,
  'Free Fire Diamonds': Gem,
  'Game Coins': Coins,
  'Abonnements': Sparkles,
  'Sell Games': Gamepad2,
  'Cheat Panels': ShieldCheck,
  'Video Editing': Clapperboard,
  'Design / Dev': Palette,
  'AI Subscriptions': Sparkles,
  'AI Subscription': Sparkles,
  'Windows & Office': Monitor,
  'Windows & Office Keys': Monitor,
}

export default function OrderModal({ isOpen, onClose, initialData = {} }) {
  const { t, lang, isRTL } = useLanguage()
  const { user } = useAuth()

  const [name, setName] = useState(() => {
    try {
      return user?.fullName || user?.username || localStorage.getItem('bleuwi_customer_name') || ''
    } catch {
      return ''
    }
  })

  const [phone, setPhone] = useState(() => {
    try {
      return user?.phone || localStorage.getItem('bleuwi_customer_phone') || ''
    } catch {
      return ''
    }
  })

  const [selectedCategoryKey, setSelectedCategoryKey] = useState('Sell Games')
  const [selectedGame, setSelectedGame] = useState('')
  const [customGame, setCustomGame] = useState('')
  const [details, setDetails] = useState('')
  const [copiedText, setCopiedText] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(false)

  // Anti-Spam & Validation State
  const [nameError, setNameError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [itemError, setItemError] = useState(false)
  const [spamError, setSpamError] = useState('')
  const [rateLimitInfo, setRateLimitInfo] = useState(() => getOrderRateLimitStatus())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const nameInputRef = useRef(null)
  const phoneInputRef = useRef(null)

  // Sync initialData and user data when modal opens
  useEffect(() => {
    if (!isOpen) return

    if (user) {
      if (!name && (user.fullName || user.username)) {
        setName(user.fullName || user.username)
      }
      if (!phone && user.phone) {
        setPhone(user.phone)
      }
    }

    let matchedCategoryKey = 'Sell Games'
    if (initialData.categoryKey && orderPresets[initialData.categoryKey]) {
      matchedCategoryKey = initialData.categoryKey
    } else if (initialData.category) {
      const found = Object.keys(orderPresets).find((k) =>
        orderPresets[k].category.toLowerCase().includes(initialData.category.toLowerCase()) ||
        k.toLowerCase().includes(initialData.category.toLowerCase())
      )
      if (found) matchedCategoryKey = found
    }

    if (matchedCategoryKey === 'AI Subscription') matchedCategoryKey = 'AI Subscriptions'
    if (matchedCategoryKey === 'Windows & Office Keys') matchedCategoryKey = 'Windows & Office'
    if (matchedCategoryKey === 'Free Fire Diamonds') matchedCategoryKey = 'Free Fire Diamond'

    setSelectedCategoryKey(matchedCategoryKey)

    const preset = orderPresets[matchedCategoryKey]
    if (initialData.specificItem) {
      setSelectedGame(initialData.specificItem)
    } else if (preset && preset.games.length > 0) {
      setSelectedGame(preset.games[0])
    }

    if (initialData.defaultNotes) {
      setDetails(initialData.defaultNotes)
    } else {
      setDetails('')
    }
    setCustomGame('')
    setCopiedText(false)
    setPreviewZoom(false)
    setNameError(false)
    setPhoneError(false)
    setItemError(false)
    setSpamError('')
    setRateLimitInfo(getOrderRateLimitStatus())
  }, [isOpen, initialData, user])

  // Save name when changed (sanitized & length capped)
  const handleNameChange = (val) => {
    const clean = String(val || '').replace(/<[^>]*>?/gm, '').slice(0, 60)
    setName(clean)
    if (clean.trim().length >= 2) {
      setNameError(false)
    }
    try {
      localStorage.setItem('bleuwi_customer_name', clean)
    } catch {
      // ignore
    }
  }

  // Save phone when changed
  const handlePhoneChange = (val) => {
    const clean = String(val || '').slice(0, 30)
    setPhone(clean)
    if (clean.trim().length >= 6) {
      setPhoneError(false)
    }
    try {
      localStorage.setItem('bleuwi_customer_phone', clean)
    } catch {
      // ignore
    }
  }


  // Handle category change
  const handleCategorySelect = (key) => {
    setSelectedCategoryKey(key)
    const preset = orderPresets[key]
    if (preset && preset.games.length > 0) {
      setSelectedGame(preset.games[0])
    }
    setCustomGame('')
    setItemError(false)
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (previewZoom) {
          setPreviewZoom(false)
        } else {
          onClose()
        }
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, previewZoom])

  const currentPreset = orderPresets[selectedCategoryKey] || orderPresets['Sell Games']
  const cleanName = name.trim() || (lang === 'ar' ? 'عميل مهتم' : 'A Customer')
  const chosenItem = selectedGame === 'Other' && customGame.trim() ? customGame.trim() : (selectedGame || (lang === 'ar' ? 'طلب مخصص' : 'Custom Request'))

  // Dynamically resolve the EXACT product information & picture
  const activeProduct = useMemo(() => {
    const query = `${chosenItem} ${selectedCategoryKey}`.toLowerCase()
    
    // 1. Check productRegistry
    const matched = productRegistry.find((p) => p.matches(query))
    if (matched) return matched

    // 2. Check if initialData had explicit product info
    if (initialData.productImage) {
      return {
        title: initialData.productName || chosenItem,
        shortName: initialData.specificItem || chosenItem,
        price: initialData.productPrice || '',
        platform: initialData.productPlatform || '',
        badge: 'EXCLUSIVE DEAL',
        badgeAr: 'عرض خاص',
        image: initialData.productImage,
        publicUrl: initialData.publicUrl || 'https://bleuwiworld.shop/image_reference/3.png',
        tagline: initialData.productTagline || '',
        taglineAr: '',
        filename: 'BLEUWI-Product.jpg',
      }
    }

    // 3. Fallback to category defaults
    return categoryFallbacks[selectedCategoryKey] || categoryFallbacks['Sell Games']
  }, [chosenItem, selectedCategoryKey, initialData])

  // Build the clean WhatsApp message with exact product details and direct image link
  const chosenProductTitle = activeProduct.title || chosenItem
  const productPriceTag = activeProduct.price ? ` (${activeProduct.price})` : ''
  const platformTag = activeProduct.platform ? `\n*• المنصة / النوع:* ${activeProduct.platform}` : ''
  const platformTagEn = activeProduct.platform ? `\n*• Platform / Type:* ${activeProduct.platform}` : ''

  const generatedMessage = lang === 'ar'
    ? `*السلام عليكم BLEUWI!*

*• المنتج المطلوب:* ${chosenProductTitle}${productPriceTag}
*• المنصة:* ${activeProduct.platform || 'PC / Digital'}
*• القسم:* ${currentPreset.sessionName} (${currentPreset.category})
*• اسم العميل:* ${cleanName}
*• رقم الواتساب:* ${phone.trim() || 'مباشر'}${details.trim() ? `\n*• الملاحظات:* ${details.trim()}` : ''}

يرجى تزويدي بمعلومات الدفع (CIH / التجاري وفا / كاش بلوس / بايبال / كريبتو) لتأكيد وتفعيل الطلب فوراً!`
    : `*Hello BLEUWI!*

*• Product Ordered:* ${chosenProductTitle}${productPriceTag}
*• Platform:* ${activeProduct.platform || 'PC / Digital'}
*• Service Category:* ${currentPreset.sessionName} (${currentPreset.category})
*• Customer Name:* ${cleanName}
*• Customer WhatsApp:* ${phone.trim() || 'Direct'}${details.trim() ? `\n*• Notes:* ${details.trim()}` : ''}

Please send me the payment instructions (CIH Bank / Attijari / Cash Plus / PayPal / Crypto) to confirm and activate my order now!`

  // Send to WhatsApp: Open direct chat with order text + image link (WITHOUT sending/attaching the image file)
  const handleSendWhatsApp = () => {
    // 1. Strict Customer Name Validation (Mandatory)
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      setNameError(true)
      if (nameInputRef.current) {
        nameInputRef.current.focus()
        nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // 2. Strict Customer WhatsApp Phone Validation (Mandatory)
    const trimmedPhone = phone.trim()
    if (!trimmedPhone || trimmedPhone.length < 6) {
      setPhoneError(true)
      if (phoneInputRef.current) {
        phoneInputRef.current.focus()
        phoneInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // 3. Strict Product / Item Selection Validation (Mandatory)
    const effectiveItem = selectedGame === 'Other' && customGame.trim() ? customGame.trim() : (selectedGame || '')
    if (!effectiveItem || effectiveItem.trim().length < 2) {
      setItemError(true)
      return
    }

    // 4. Anti-Spam Rate Limiter (Max 10 orders per day + 15s cooldown)
    const rateStatus = getOrderRateLimitStatus()
    setRateLimitInfo(rateStatus)

    if (rateStatus.isDailyLimitReached) {
      setSpamError(
        lang === 'ar'
          ? '⚠️ تم استنفاد الحد الأقصى المسموح به للطلبات اليوم (10 طلبات في اليوم) لمنع الرسائل المزعجة (Anti-Spam). يمكنك مراسلتنا مباشرة على واتساب أو المحاولة غداً!'
          : '⚠️ Daily order limit reached (max 10 orders per day) to prevent spam. You can contact us directly on WhatsApp or try again tomorrow!'
      )
      return
    }

    if (rateStatus.cooldownRemaining > 0) {
      setSpamError(
        lang === 'ar'
          ? `⚠️ يرجى الانتظار ${rateStatus.cooldownRemaining} ثانية قبل إرسال طلب جديد (حماية Anti-Spam).`
          : `⚠️ Please wait ${rateStatus.cooldownRemaining}s before submitting another order (Anti-Spam protection).`
      )
      return
    }

    // Passed all checks: clear errors and record order
    setNameError(false)
    setPhoneError(false)
    setItemError(false)
    setSpamError('')
    recordOrderSubmission()
    setRateLimitInfo(getOrderRateLimitStatus())

    // Direct WhatsApp send with order template and image link (auto-prefills message in chat)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2500)
    setIsSubmitting(true)

    // Concurrently record order to Cloudflare D1 database for the Admin Dashboard
    try {
      const rawPrice = activeProduct?.price ? parseFloat(String(activeProduct.price).replace(/[^0-9.]/g, '')) || 50 : 50
      api.createOrder({
        customerName: cleanName,
        customerPhone: trimmedPhone,
        customerEmail: user?.email || null,
        items: [{
          id: activeProduct?.title || chosenItem,
          title: chosenProductTitle,
          price: rawPrice,
          quantity: 1,
          category: currentPreset.category,
        }],
        totalPrice: rawPrice,
        currency: 'MAD',
        notes: details.trim(),
      }).catch(() => {})
    } catch (e) {
      // Ignore background recording errors
    }

    setTimeout(() => {
      setIsSubmitting(false)
      openWhatsAppChat(generatedMessage)
    }, 350)
  }


  const handleCopyTextMessage = () => {
    navigator.clipboard.writeText(generatedMessage)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2200)
  }

  // Build the list of games to display
  const displayGames = useMemo(() => {
    const games = [...currentPreset.games]
    if (selectedGame && selectedGame !== 'Other' && !games.includes(selectedGame)) {
      games.unshift(selectedGame)
    }
    return games
  }, [currentPreset, selectedGame])

  const ActiveCategoryIcon = categoryIcons[selectedCategoryKey] || Sparkles

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#070b14]/95 p-3.5 sm:p-7 shadow-2xl shadow-cyan-950/40 z-10 my-auto text-white animate-fade-up backdrop-blur-2xl"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.08] pb-3 sm:pb-4 flex-none">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-inner flex-none">
              <ActiveCategoryIcon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-bold tracking-tight text-white">
                  {t('orderModalTitle')}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('quickOrderBtn')}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-400">
                {t('orderModalSubtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-1.5 sm:p-2 text-slate-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white hover:scale-105 cursor-pointer flex-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div className="relative mt-3.5 sm:mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 text-left flex-1 overflow-y-auto pr-1">
          {/* Left Column: Selection Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            {/* 1. Selected Session (Shows ONLY the session the customer is purchasing from) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t('categoryLabel')}
              </label>
              <div className="flex items-center justify-between rounded-xl border border-sky-400/40 bg-gradient-to-r from-sky-400/15 via-sky-500/10 to-emerald-400/10 p-2.5 sm:p-3 shadow-md shadow-sky-500/15 ring-1 ring-sky-400/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-400/50 bg-sky-400/20 text-sky-300 shadow-sm shadow-sky-500/20">
                    <ActiveCategoryIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                        {lang === 'ar'
                          ? (currentPreset.sessionNameAr || currentPreset.sessionName || selectedCategoryKey)
                          : (currentPreset.sessionName || selectedCategoryKey)}
                      </span>
                      <span className="inline-flex items-center rounded-md border border-sky-400/30 bg-sky-400/20 px-2 py-0.5 text-[10px] font-bold text-sky-200">
                        {selectedCategoryKey}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {lang === 'ar'
                        ? 'طلب مخصص ومباشر من هذا القسم'
                        : 'Active session for this order'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'مفعل' : 'Active'}</span>
                </div>
              </div>
            </div>

            {/* 2. Choose Item / Package Grid */}
            <div>
              <div className="mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t('itemLabel')} <span className="text-sky-400">*</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {displayGames.map((g) => {
                  const isChosen = selectedGame === g
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGame(g)
                        setCustomGame('')
                      }}
                      className={`group flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all duration-200 cursor-pointer ${
                        isChosen
                          ? 'border-sky-400/80 bg-gradient-to-r from-sky-400/15 to-emerald-400/10 text-white font-semibold shadow-sm ring-1 ring-sky-400/25'
                          : 'border-white/[0.08] bg-white/[0.025] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="truncate pr-2">{g}</span>
                      <span
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] transition-colors ${
                          isChosen
                            ? 'border-sky-400 bg-sky-400 text-slate-950 font-bold'
                            : 'border-slate-600 group-hover:border-slate-400'
                        }`}
                      >
                        {isChosen ? '✓' : ''}
                      </span>
                    </button>
                  )
                })}

                {selectedCategoryKey !== 'Free Fire Diamond' && selectedCategoryKey !== 'Free Fire Diamonds' && (
                  <button
                    type="button"
                    onClick={() => setSelectedGame('Other')}
                    className={`group flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all duration-200 cursor-pointer ${
                      selectedGame === 'Other'
                        ? 'border-sky-400/80 bg-gradient-to-r from-sky-400/15 to-emerald-400/10 text-white font-semibold shadow-sm ring-1 ring-sky-400/25'
                        : 'border-white/[0.08] bg-white/[0.025] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="truncate pr-2">{t('otherItemOption')}</span>
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] transition-colors ${
                        selectedGame === 'Other'
                          ? 'border-sky-400 bg-sky-400 text-slate-950 font-bold'
                          : 'border-slate-600 group-hover:border-slate-400'
                      }`}
                    >
                      {selectedGame === 'Other' ? '✓' : ''}
                    </span>
                  </button>
                )}
              </div>

              {selectedCategoryKey !== 'Free Fire Diamond' && selectedCategoryKey !== 'Free Fire Diamonds' && selectedGame === 'Other' && (
                <div className="mt-2.5 animate-fade-in">
                  <input
                    type="text"
                    value={customGame}
                    onChange={(e) => {
                      setCustomGame(e.target.value)
                      if (e.target.value.trim().length >= 2) setItemError(false)
                    }}
                    placeholder={t('otherItemPlaceholder')}
                    className={`w-full rounded-xl border py-2 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      itemError
                        ? 'border-rose-500 bg-rose-500/10 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-sky-400/40 bg-white/[0.05] focus:border-sky-400'
                    }`}
                    autoFocus
                  />
                </div>
              )}

              {itemError && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-rose-400 animate-fade-up rounded-lg bg-rose-500/10 border border-rose-500/20 p-2">
                  <AlertCircle size={14} className="shrink-0 text-rose-400" />
                  <span>{lang === 'ar' ? '⚠️ يرجى اختيار المنتج أو الخدمة التي ترغب بشرائها!' : '⚠️ Please select the product or service you want to buy!'}</span>
                </p>
              )}
            </div>

            {/* 3. Customer Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>
                    {t('nameLabel')} <span className="text-sky-400">*</span>
                  </span>
                  {nameError && (
                    <span className="text-[10px] font-bold text-rose-400 animate-pulse">
                      {lang === 'ar' ? 'مطلوب إجباري' : 'Required'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center ${nameError ? 'text-rose-400' : 'text-slate-400'}`}>
                    <User size={15} />
                  </div>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder={t('namePlaceholder')}
                    className={`w-full rounded-xl border py-2.5 ${isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'} text-xs text-white placeholder-slate-500 transition-all duration-200 ${
                      nameError
                        ? 'border-rose-500 bg-rose-500/10 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40 ring-1 ring-rose-500'
                        : 'border-white/10 bg-white/[0.04] focus:border-sky-400 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-sky-400'
                    }`}
                  />
                </div>
                {nameError && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-400 animate-fade-up">
                    <AlertCircle size={13} className="shrink-0 text-rose-400" />
                    <span>{lang === 'ar' ? '⚠️ يرجى كتابة اسمك للمتابعة وإرسال الطلب!' : '⚠️ Please enter your name to proceed with the order!'}</span>
                  </p>
                )}
              </div>

              {/* Customer WhatsApp Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">WhatsApp</span>
                    <span>{lang === 'ar' ? 'رقم هاتفك' : 'Phone Number'}</span>
                    <span className="text-sky-400">*</span>
                  </span>
                  {phoneError && (
                    <span className="text-[10px] font-bold text-rose-400 animate-pulse">
                      {lang === 'ar' ? 'مطلوب إجباري' : 'Required'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center ${phoneError ? 'text-rose-400' : 'text-emerald-400'}`}>
                    <Phone size={14} />
                  </div>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder={lang === 'ar' ? '+212 6XX-XXXXXX أو 06...' : '+212 6XX-XXXXXX'}
                    className={`w-full rounded-xl border py-2.5 ${isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'} text-xs text-white placeholder-slate-500 font-mono transition-all duration-200 ${
                      phoneError
                        ? 'border-rose-500 bg-rose-500/10 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40 ring-1 ring-rose-500'
                        : 'border-white/10 bg-white/[0.04] focus:border-emerald-400 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-emerald-400'
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-400 animate-fade-up">
                    <AlertCircle size={13} className="shrink-0 text-rose-400" />
                    <span>{lang === 'ar' ? '⚠️ يرجى إدخال رقم واتساب صالح للتواصل معك فوراً!' : '⚠️ Please enter a valid WhatsApp phone number!'}</span>
                  </p>
                )}
              </div>

              {/* Order Notes / In-game ID */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('notesLabel')}
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Exact Product Picture Showcase & WhatsApp Order Ticket (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-black/40 p-4 sm:p-5 shadow-inner">
            <div className="space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <Sparkles size={13} className="text-sky-400" />
                  <span>{t('orderSummaryTitle')}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('readyToSend')}
                </span>
              </div>

              {/* EXACT PRODUCT PICTURE SHOWCASE */}
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-lg group">
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden bg-black/80 cursor-pointer flex items-center justify-center group/orderimg"
                  onClick={() => setPreviewZoom(true)}
                  title={lang === 'ar' ? 'انقر لتكبير صورة المنتج بالحجم الكامل' : 'Click to zoom product image in full size'}
                >
                  {/* Ambient backdrop glow */}
                  <img
                    src={activeProduct.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                  />

                  {/* Complete uncropped foreground artwork */}
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.title}
                    className="relative z-10 max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover/orderimg:scale-105"
                  />

                  {/* Bottom fade only so top artwork is crystal clear */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950/90 to-transparent z-10 pointer-events-none" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                    <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md">
                      {lang === 'ar' ? (activeProduct.badgeAr || activeProduct.badge) : activeProduct.badge}
                    </span>
                    {activeProduct.platform && (
                      <span className="rounded-md border border-sky-400/40 bg-slate-950/90 px-2 py-0.5 text-[9px] font-mono font-bold text-sky-300 backdrop-blur-md">
                        {activeProduct.platform}
                      </span>
                    )}
                  </div>

                  {activeProduct.price && (
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <span className="rounded-xl border border-sky-400/50 bg-sky-500/25 px-2.5 py-0.5 text-xs font-black text-sky-200 backdrop-blur-md shadow-lg">
                        {activeProduct.price}
                      </span>
                    </div>
                  )}

                  {/* Full Size zoom button indicator */}
                  <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/20 shadow-md group-hover/orderimg:bg-sky-500 transition">
                    <Maximize2 size={12} />
                    <span>{lang === 'ar' ? 'تكبير كامل' : 'Full Size'}</span>
                  </div>
                </div>

                {/* Product Meta Info Bar */}
                <div className="p-3 bg-white/[0.03] border-t border-white/[0.06]">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate" title={activeProduct.title}>
                      {activeProduct.title}
                    </h4>
                    {activeProduct.price && (
                      <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                        {activeProduct.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                    {lang === 'ar' ? (activeProduct.taglineAr || activeProduct.tagline) : activeProduct.tagline}
                  </p>
                </div>
              </div>

              {/* Order Details Mini-Table */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] p-2 border border-white/[0.05]">
                  <span className="text-slate-400">{lang === 'ar' ? 'العميل' : 'Customer'}:</span>
                  <span className="font-medium text-slate-200">
                    {name.trim() ? name.trim() : <span className="text-slate-500 italic">{lang === 'ar' ? 'غير محدد' : 'Guest'}</span>}
                  </span>
                </div>

                {details.trim() && (
                  <div className="flex items-start justify-between gap-2 rounded-xl bg-white/[0.03] p-2 border border-white/[0.05]">
                    <span className="text-slate-400 shrink-0">{lang === 'ar' ? 'ملاحظة' : 'Note'}:</span>
                    <span className="text-slate-300 text-right truncate max-w-[180px]">
                      {details.trim()}
                    </span>
                  </div>
                )}
              </div>

              {/* Trust Perks */}
              <div className="space-y-1 pt-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-amber-400 shrink-0" />
                  <span>{t('instantDeliveryBadge')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={13} className="text-emerald-400 shrink-0" />
                  <span>{t('safePaymentsBadge')}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons & Note */}
            <div className="mt-4 pt-3.5 border-t border-white/[0.08] space-y-2.5">
              {/* Anti-Spam Warning Alert */}
              {spamError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200 animate-fade-up flex items-start gap-2.5 shadow-lg shadow-rose-950/40">
                  <AlertCircle size={17} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-rose-300">{lang === 'ar' ? 'تنبيه نظام الحماية (Anti-Spam)' : 'Anti-Spam Security Alert'}</p>
                    <p className="text-[11px] text-rose-200 leading-relaxed">{spamError}</p>
                  </div>
                </div>
              )}

              {/* Anti-Spam Quota Status Indicator */}
              <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-sky-400" />
                  <span>{lang === 'ar' ? 'نظام مكافحة السبام نشط' : 'Anti-Spam Active'}</span>
                </span>
                <span className={`font-semibold ${rateLimitInfo.remaining <= 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {lang === 'ar'
                    ? `الطلبات المتاحة اليوم: ${rateLimitInfo.remaining}/${rateLimitInfo.max}`
                    : `Orders remaining today: ${rateLimitInfo.remaining}/${rateLimitInfo.max}`}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={isSubmitting}
                className={`group relative flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 px-5 text-sm font-bold shadow-lg transition-all duration-300 cursor-pointer ${
                  rateLimitInfo.isDailyLimitReached
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                    : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 bg-[length:200%_auto] text-slate-950 shadow-emerald-500/25 hover:bg-right hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{lang === 'ar' ? 'جاري فتح محادثة واتساب...' : 'Opening WhatsApp Chat...'}</span>
                  </>
                ) : (
                  <>
                    {/* Official WhatsApp Logo SVG */}
                    <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.769.459 3.432 1.261 4.884l-1.341 4.896 5.031-1.319c1.408.767 3.018 1.201 4.729 1.201 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span>{rateLimitInfo.isDailyLimitReached ? (lang === 'ar' ? 'تم بلوغ حد الطلبات اليومي' : 'Daily Limit Reached') : t('sendWhatsAppBtn')}</span>
                    <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="truncate">{t('openInWhatsAppNote')}</span>
                <button
                  type="button"
                  onClick={handleCopyTextMessage}
                  className="text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                >
                  {copiedText ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedText ? t('copiedTextBtn') : t('copyTextBtn')}</span>
                </button>
              </div>

              {/* Image Link in WhatsApp Message Note */}
              <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2 text-[11px] text-sky-200">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span>🔗</span>
                  <span>{lang === 'ar' ? 'رابط الصورة مدمج في الرسالة' : 'Image Link Included in Message'}</span>
                </div>
                <p className="mt-0.5 text-[10px] text-sky-300/80 leading-snug">
                  {lang === 'ar'
                    ? 'يتم إرسال رابط الصورة الرسمي داخل نص الرسالة بدون إرسال أو إرفاق ملف الصورة.'
                    : 'The direct product image link is sent inside the message text without sending the image file.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PRODUCT IMAGE ZOOM MODAL */}
      {previewZoom && activeProduct?.image && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-fade-in cursor-zoom-out" 
          onClick={() => setPreviewZoom(false)}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div 
            className="relative flex max-h-[94vh] max-w-5xl w-full flex-col rounded-3xl border border-sky-400/30 bg-[#070b14] p-4 sm:p-6 text-white shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-sky-200 flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-emerald-400" />
                  {activeProduct.title}
                </span>
                {activeProduct.price && (
                  <span className="rounded-md border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                    {activeProduct.price}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewZoom(false)}
                className="rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white transition cursor-pointer"
                aria-label="Close full size view"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative my-2 flex flex-1 items-center justify-center overflow-hidden min-h-[50vh] max-h-[78vh] rounded-2xl bg-black/90 border border-white/10 p-2">
              <img
                src={activeProduct.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-35 scale-125 pointer-events-none"
              />
              <img
                src={activeProduct.image}
                alt={activeProduct.title}
                className="relative z-10 max-h-[74vh] w-auto max-w-full rounded-xl object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
              />
            </div>

            {activeProduct.tagline && (
              <div className="border-t border-white/10 pt-2 text-xs text-center text-slate-400">
                {lang === 'ar' ? (activeProduct.taglineAr || activeProduct.tagline) : activeProduct.tagline}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
