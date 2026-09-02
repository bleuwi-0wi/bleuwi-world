import { Camera, Clapperboard, Coins, Disc3, Gamepad2, Globe2, Mail, MessageCircle, Music2, Palette, Video, ShoppingBag, ShieldCheck, Sparkles, Key, CreditCard } from 'lucide-react'

// Default WhatsApp Number for BLEUWI
export const WHATSAPP_NUMBER = '212762635587'

export const links = [
  { name: 'WhatsApp', description: 'Direct message BLEUWI (+212 762-635587).', icon: MessageCircle, href: 'https://wa.me/212762635587' },
  { name: 'YouTube', description: 'Watch the latest videos and streams.', icon: Video, href: 'https://www.youtube.com/@blue_bleuwi' },
  { name: 'Instagram', description: 'Behind the scenes, captured daily.', icon: Camera, href: 'https://www.instagram.com/blue.bluewi/' },
  { name: 'TikTok', description: 'Short-form moments from the world.', icon: Music2, href: 'https://www.tiktok.com/@bleuwi_wizi0' },
  { name: 'Discord', description: 'Join the community and stay connected.', icon: Disc3, href: 'https://discord.gg/t9szNkjgh7' },
  { name: 'KICK LIVE STREAM', description: 'Watch BLEUWI live on Kick.', icon: Globe2, href: 'https://kick.com/bleuwi-wizi' },
]

export const featuredLinks = [
  { name: 'VIDEO EDITING SESSION', detail: 'Edits built for standout content.', icon: Clapperboard, href: '/?showcase=video' },
  { name: 'CHEAT PANELS SESSION', detail: 'Private panel session & game tool requests.', icon: Gamepad2, href: '/?showcase=panels' },
  { name: 'DESIGN / DEV SESSION', detail: 'Creative design and web support.', icon: Palette, href: '/?showcase=design' },
  { name: 'DEGITAL SERVISES', detail: 'Online services: Sell games, coin, abonnement & keys.', icon: Coins, href: '/?showcase=digital' },
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
  'Game Coins': {
    category: 'Game Coins & Currencies',
    sessionName: 'DEGITAL SERVISES',
    games: [
      'Robux Packs (Roblox)',
      'FC / FIFA Coins (EA FC)',
      'Fortnite V-Bucks',
      'GTA Online Cash Drop',
      'Valorant Points (VP)',
      'Brawl Stars Gems',
      'Free Fire Diamonds',
      'Other Game Coin / Points',
    ],
  },
  'Abonnements': {
    category: 'Subscriptions & Abonnements',
    sessionName: 'DEGITAL SERVISES',
    games: [
      'Discord Nitro (1 Month + 2 Boosts)',
      'Discord Nitro (1 Year + 2 Boosts)',
      'Spotify Premium (Individual/Family)',
      'Xbox Game Pass Ultimate',
      'PlayStation Plus (Essential / Extra / Premium)',
      'Netflix 4K UHD Private Screen',
      'Crunchyroll Mega Fan',
      'Other Subscription / Abonnement',
    ],
  },
  'Sell Games': {
    category: 'Sell Games & Digital Keys',
    sessionName: 'DEGITAL SERVISES',
    games: [
      'Steam Digital Game Key',
      'Epic Games Key / Activation',
      'Rockstar Games / GTA Key',
      'PlayStation / Xbox Store Code',
      'Fresh Ranked-Ready Aged Account',
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
