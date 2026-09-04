import { Camera, Clapperboard, Coins, Disc3, Gamepad2, Globe2, Mail, MessageCircle, Music2, Palette, Video, ShoppingBag, ShieldCheck, Sparkles, Key, CreditCard } from 'lucide-react'

import cardVideo from '../assets/card-video-5.jpg'
import cardDigital from '../assets/card-digital-6.jpg'
import cardPanels from '../assets/card-panels-7.jpg'
import cardDesign from '../assets/card-design-8.jpg'
import cardFf19 from '../assets/freefire-19.jpeg'

import iconWhatsApp from '../assets/icon-whatsapp.png'
import iconYouTube from '../assets/icon-youtube.png'
import iconInstagram from '../assets/icon-instagram.png'
import iconTikTok from '../assets/icon-tiktok.png'
import iconDiscord from '../assets/icon-discord.png'
import iconKick from '../assets/icon-kick.jpeg'

// Default WhatsApp Number for BLEUWI
export const WHATSAPP_NUMBER = '212762635587'

export const links = [
  { name: 'WhatsApp', description: 'Direct message BLEUWI (+212 762-635587).', icon: MessageCircle, image: iconWhatsApp, href: 'https://wa.me/212762635587' },
  { name: 'YouTube', description: 'Watch the latest videos and streams.', icon: Video, image: iconYouTube, href: 'https://www.youtube.com/@blue_bleuwi' },
  { name: 'Instagram', description: 'Behind the scenes, captured daily.', icon: Camera, image: iconInstagram, href: 'https://www.instagram.com/blue.bluewi/' },
  { name: 'TikTok', description: 'Short-form moments from the world.', icon: Music2, image: iconTikTok, href: 'https://www.tiktok.com/@bleuwi_wizi0' },
  { name: 'Discord', description: 'Join the community and stay connected.', icon: Disc3, image: iconDiscord, href: 'https://discord.gg/t9szNkjgh7' },
  { name: 'KICK LIVE STREAM', description: 'Watch BLEUWI live on Kick.', icon: Globe2, image: iconKick, href: 'https://kick.com/bleuwi-wizi' },
]

export const featuredLinks = [
  {
    name: 'FREE FIRE DIAMONDS',
    detail: 'Official Free Fire Diamonds instant ID recharge at 1$ = 10 DH rate.',
    icon: Coins,
    href: '/?showcase=freefire',
    showcaseType: 'freefire',
    cardImage: cardFf19,
    cardNum: 19,
    cardRank: 'B',
    suit: '♦',
    badge: '1$ = 10 DH (Best Rate)',
    badgeAr: '1 دولار = 10 دراهم (أفضل سعر)',
    categoryKey: 'Free Fire Diamonds',
    features: ['530 Diamonds - 60 DH (6$)', '1080 Diamonds - 120 DH (12$)', '2420 Diamonds - 250 DH (25$)', '6160 Diamonds - 600 DH (60$)'],
    featuresAr: ['530 جوهرة - 60 درهم (6$)', '1080 جوهرة - 120 درهم (12$)', '2420 جوهرة - 250 درهم (25$)', '6160 جوهرة - 600 درهم (60$)'],
  },
  {
    name: 'VIDEO EDITING SESSION',
    detail: 'Edits built for standout content.',
    icon: Clapperboard,
    href: '/?showcase=video',
    showcaseType: 'video',
    cardImage: cardVideo,
    cardNum: 5,
    cardRank: 'B',
    suit: '♦',
    badge: '4K Retention Edits',
    badgeAr: 'مونتاج احترافي 4K',
    categoryKey: 'Video Editing',
    features: ['YouTube & Shorts Pacings', 'Motion Sound Design', 'Cinematic Color Grade', 'Engaging Retention Hooks'],
    featuresAr: ['قص وسرعة احترافية لليوتيوب والشورتس', 'مؤثرات صوتية محيطية', 'تلوين سينمائي احترافي', 'مقدمات جاذبة لزيادة المشاهدات'],
  },
  {
    name: 'CHEAT PANELS SESSION',
    detail: 'Private panel session & game tool requests.',
    icon: Gamepad2,
    href: '/?showcase=panels',
    showcaseType: 'panels',
    cardImage: cardPanels,
    cardNum: 7,
    cardRank: 'B',
    suit: '♦',
    badge: 'Kernel Protected',
    badgeAr: 'حماية كيرنل متقدمة',
    categoryKey: 'Cheat Panels',
    features: ['Stream-Proof Overlay (OBS)', 'Smooth Humanized Aimbot', 'Configurable Visual ESP', 'HWID Spoofer & Trace Cleaner'],
    featuresAr: ['واجهة مخفية عن البث وOBS', 'إيمبوت واقعي وغير قابل للاكتشاف', 'كشف مواقع ورؤية عبر الجدران (ESP)', 'سبوفر وحامي سيريال القطع (HWID)'],
  },
  {
    name: 'DESIGN / DEV SESSION',
    detail: 'Creative design and web support.',
    icon: Palette,
    href: '/?showcase=design',
    showcaseType: 'design',
    cardImage: cardDesign,
    cardNum: 8,
    cardRank: 'B',
    suit: '♦',
    badge: 'Visual Identity & Web',
    badgeAr: 'هوية بصرية ومواقع ويب',
    categoryKey: 'Design / Dev',
    features: ['Custom Brand Mark & Logos', 'High-CTR YouTube Thumbnails', 'Stream Overlays & Badges', 'Modern Responsive Websites'],
    featuresAr: ['لوغوهات وعلامات تجارية خاصة', 'صور مصغرة عالية النقر (High CTR)', 'أوفرلايز وشارات للبث المباشر', 'مواقع ويب عصرية ومتجاوبة'],
  },
  {
    name: 'DIGITAL SERVICES',
    detail: 'Online services: Sell games, coins & subscriptions.',
    icon: Coins,
    href: '/?showcase=digital',
    showcaseType: 'digital',
    cardImage: cardDigital,
    cardNum: 6,
    cardRank: 'B',
    suit: '♦',
    badge: 'Instant Delivery & Best Rates',
    badgeAr: 'تسليم فوري وأفضل الأسعار',
    categoryKey: 'Game Coins',
    features: ['Robux, FC Coins, V-Bucks, GTA', 'Discord Nitro & Spotify Premium', 'Xbox Game Pass & PS Plus Codes', 'Steam & Epic Global Game Keys'],
    featuresAr: ['روبوكس، كوينز فيفا، في بوكس، قراند', 'دسكورد نيترو وسبوتيفاي بريميوم', 'بطاقات إكس بوكس وبلايستيشن بلس', 'مفاتيح ألعاب ستيم وإبيك أصلية'],
  },
]

export const digitalServices = [
  {
    id: 'game-coins',
    title: 'Game Coins & Currencies',
    category: 'Game Coins',
    badge: 'Instant Delivery',
    tagline: 'Discounted in-game currencies delivered safely & quickly.',
    icon: Coins,
    items: [
      { name: 'Free Fire Diamonds (530 - 6160)', desc: 'Instant ID top-up (60 DH - 600 DH / 1$ = 10 DH)' },
      { name: 'Robux Packs', desc: 'Fast & clean transfer with zero delays' },
      { name: 'FC / FIFA Coins', desc: 'Comfort trade & safe player auction' },
      { name: 'Fortnite V-Bucks', desc: 'Direct account gift / store top-up' },
      { name: 'GTA Online Cash', desc: 'Safe bank drops & custom money packages' },
      { name: 'Valorant Points', desc: 'Global redeemable codes & top-ups' },
    ],
    cta: 'Order Game Coins',
  },
  {
    id: 'abonnements',
    title: 'Subscriptions & Abonnements',
    category: 'Abonnements',
    badge: 'Best Rates',
    tagline: 'Premium gaming, music, streaming & community memberships.',
    icon: Sparkles,
    items: [
      { name: 'Discord Nitro', desc: '1 Month & 1 Year (with 2 server boosts)' },
      { name: 'Spotify Premium', desc: 'Individual & family renewal plans' },
      { name: 'Xbox Game Pass Ultimate', desc: 'Multi-month PC & Console game library' },
      { name: 'PlayStation Plus (PS+)', desc: 'Essential, Extra & Premium codes' },
      { name: 'Netflix 4K UHD', desc: 'Private profiles & private screens' },
    ],
    cta: 'Get Subscription',
  },
  {
    id: 'sell-games',
    title: 'Sell Games & Digital Keys',
    category: 'Sell Games',
    badge: 'Global Keys',
    tagline: 'Official game keys and accounts for Steam, Epic, Console & PC.',
    icon: Gamepad2,
    items: [
      { name: 'Steam Game Keys', desc: 'AAA and indie titles at discounted prices' },
      { name: 'Epic & Rockstar Games', desc: 'Direct game keys & account activations' },
      { name: 'PlayStation & Xbox Keys', desc: 'Digital store wallet codes & full titles' },
      { name: 'Fresh Aged Accounts', desc: 'Ranked-ready, unbanned & verified' },
    ],
    cta: 'Buy Game Keys',
  },
]


export const cheatPanels = [
  {
    title: 'Private Game Panel Access',
    badge: 'Kernel Protected',
    description: 'Private internal and external software engineered with clean overlays and high security.',
    features: [
      'Kernel-level driver with bypass technology',
      'Stream-proof / OBS-invisible overlay',
      'Configurable visual ESP (boxes, skeleton, distance, loot)',
      'Smooth vector aimbot & silent aim presets',
      'Cloud config saving and automated updates',
    ],
    cta: 'Request Panel Access',
  },
  {
    title: 'Supported Games & Launchers',
    badge: 'Multi-Game',
    description: 'Tested regularly on competitive multiplayer and private roleplay servers.',
    features: [
      'FiveM / GTA V Roleplay (custom menus & triggers)',
      'Call of Duty: Warzone & Modern Warfare',
      'Valorant & Apex Legends (low FOV legit configs)',
      'Counter-Strike 2 & Fortnite (performance optimized)',
    ],
    cta: 'View Supported Games',
  },
  {
    title: 'Hardware ID Spoofer & Trace Cleaner',
    badge: 'Machine Safe',
    description: 'Protect your hardware serial numbers and avoid bans on your main gaming rig.',
    features: [
      'One-click temp & permanent serial spoofing',
      'Disk, motherboard, NIC MAC address spoofing',
      'Trace file cleaner wiping all anti-cheat cache',
      'Compatible with BattlEye, Easy Anti-Cheat, Ricochet, Vanguard',
    ],
    cta: 'Get HWID Protection',
  },
]

export const orderPresets = {
  'Free Fire Diamond': {
    category: 'Free Fire Diamond (Game Coins)',
    sessionName: 'DIGITAL SERVICES',
    games: [
      'Free Fire 530 Diamonds - 60 DH (6$)',
      'Free Fire 1080 Diamonds - 120 DH (12$)',
      'Free Fire 2420 Diamonds - 250 DH (25$)',
      'Free Fire 6160 Diamonds - 600 DH (60$)',
      'Custom Free Fire Diamond Amount',
    ],
  },
  'Free Fire Diamonds': {
    category: 'Free Fire Diamonds (Game Coins)',
    sessionName: 'DIGITAL SERVICES',
    games: [
      'Free Fire 530 Diamonds - 60 DH (6$)',
      'Free Fire 1080 Diamonds - 120 DH (12$)',
      'Free Fire 2420 Diamonds - 250 DH (25$)',
      'Free Fire 6160 Diamonds - 600 DH (60$)',
      'Custom Free Fire Diamond Amount',
    ],
  },
  'Game Coins': {
    category: 'Game Coins & Currencies',
    sessionName: 'DIGITAL SERVICES',
    games: [
      'Free Fire 530 Diamonds - 60 DH (6$)',
      'Free Fire 1080 Diamonds - 120 DH (12$)',
      'Free Fire 2420 Diamonds - 250 DH (25$)',
      'Free Fire 6160 Diamonds - 600 DH (60$)',
      'Robux Packs (Roblox)',
      'FC / FIFA Coins (EA FC)',
      'Fortnite V-Bucks',
      'GTA Online Cash Drop',
      'Valorant Points (VP)',
      'Brawl Stars Gems',
      'Other Game Coin / Points',
    ],
  },
  'Abonnements': {
    category: 'Subscriptions & Abonnements',
    sessionName: 'DIGITAL SERVICES',
    games: [
      'Discord Nitro (Full + 2 Boosts) - 70 DH',
      'CapCut Pro (1 Month VIP) - 90 DH',
      'Spotify Premium (3 Months) - 150 DH',
      'Spotify Premium (1 Month) - 70 DH',
      'Xbox Game Pass Ultimate',
      'PlayStation Plus (Essential / Extra / Premium)',
      'Netflix 4K UHD Private Screen',
      'Other Subscription / Abonnement',
    ],
  },
  'Sell Games': {
    category: 'Sell Games & Digital Keys',
    sessionName: 'DIGITAL SERVICES',
    games: [
      'GTA V (PC ONLY) - 200 DH',
      'RED DEAD 2 (PC ONLY) - 250 DH',
      'FIFA (PC ONLY) - 200 DH',
      'Steam Digital Game Key',
      'Epic Games Key / Activation',
      'Rockstar Games / GTA Key',
      'PlayStation / Xbox Store Code',
      'Other Game Title / Platform Key',
    ],
  },
  'Cheat Panels': {
    category: 'Cheat Panels Session',
    sessionName: 'CHEAT PANELS SESSION',
    games: [
      'FiveM / GTA V Private Roleplay Panel',
      'Call of Duty: Warzone & MW3 Panel',
      'Valorant Private Legit Tool',
      'Apex Legends External Panel',
      'CS2 (Counter-Strike 2) Undetected Tool',
      'Fortnite Private Panel',
      'HWID Spoofer & Trace Cleaner',
    ],
  },
  'Video Editing': {
    category: 'Video Editing Session',
    sessionName: 'VIDEO EDITING SESSION',
    games: [
      'YouTube Long-Form Video Edit',
      'TikTok / Shorts / Reels Content Pack',
      'Gaming Highlights & Stream Montage',
      'Channel Cinematic Intro / Trailer',
      'Full Creator Post-Production Package',
    ],
  },
  'Design / Dev': {
    category: 'Design & Dev Session',
    sessionName: 'DESIGN / DEV SESSION',
    games: [
      'Channel Logo & Brand Mark Identity',
      'High-CTR YouTube Thumbnails Pack',
      'Custom Creator Website / Web App',
      'Twitch / Kick Stream Overlays & Badges',
      'Retro Pixel Art / Animation Asset',
    ],
  },
}
