import { useState, useEffect, useMemo } from 'react'
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
} from 'lucide-react'
import { orderPresets, WHATSAPP_NUMBER } from '../data/links'
import { useLanguage } from '../context/LanguageContext'

import imgGta from '../assets/game-gta-v.jpeg'
import imgRedDead from '../assets/game-red-dead-2.jpeg'
import imgFifa from '../assets/game-fifa.jpg'
import imgDiscord from '../assets/offer-discord.webp'
import imgCapcut from '../assets/offer-capcut.jpg'
import imgSpotify3M from '../assets/offer-spotify-3m.jpg'
import imgSpotify1M from '../assets/offer-spotify-1m.jpg'
import cardVideo from '../assets/card-video-5.jpg'
import cardPanels from '../assets/card-panels-7.jpg'
import cardDesign from '../assets/card-design-8.jpg'
import refCoins from '../assets/1.webp'
import refAbonnements from '../assets/2.webp'
import refGames from '../assets/3.webp'

// Comprehensive Product Registry for exact product image & WhatsApp message matching
export const productRegistry = [
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
]

const categoryFallbacks = {
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
  'Game Coins': Coins,
  'Abonnements': Sparkles,
  'Sell Games': Gamepad2,
  'Cheat Panels': ShieldCheck,
  'Video Editing': Clapperboard,
  'Design / Dev': Palette,
}

export default function OrderModal({ isOpen, onClose, initialData = {}, onOpenWarranty }) {
  const { t, lang, isRTL } = useLanguage()

  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('bleuwi_customer_name') || ''
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

  // Sync initialData when modal opens
  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen, initialData])

  // Save name when changed
  const handleNameChange = (val) => {
    setName(val)
    try {
      localStorage.setItem('bleuwi_customer_name', val)
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

  // Helper to convert any image blob (jpeg, webp) into PNG blob so Windows/Mac clipboard accepts it
  const convertBlobToPng = (blob) => {
    return new Promise((resolve) => {
      try {
        const img = new Image()
        const url = URL.createObjectURL(blob)
        img.onload = () => {
          URL.revokeObjectURL(url)
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth || img.width || 800
          canvas.height = img.naturalHeight || img.height || 600
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((pngBlob) => {
            resolve(pngBlob || blob)
          }, 'image/png')
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          resolve(blob)
        }
        img.src = url
      } catch {
        resolve(blob)
      }
    })
  }

  const [copiedImageToast, setCopiedImageToast] = useState(false)
  const [copiedImageBtn, setCopiedImageBtn] = useState(false)

  // Build the clean WhatsApp message with exact product details (NO ugly raw link!)
  const chosenProductTitle = activeProduct.title || chosenItem
  const productPriceTag = activeProduct.price ? ` (${activeProduct.price})` : ''
  const platformTag = activeProduct.platform ? `\n*• المنصة / النوع:* ${activeProduct.platform}` : ''
  const platformTagEn = activeProduct.platform ? `\n*• Platform / Type:* ${activeProduct.platform}` : ''

  const generatedMessage = lang === 'ar'
    ? `*السلام عليكم BLEUWI!*

*• المنتج المطلوب:* ${chosenProductTitle}${productPriceTag}
*• المنصة:* ${activeProduct.platform || 'PC / Digital'}
*• القسم:* ${currentPreset.sessionName} (${currentPreset.category})
*• اسم العميل:* ${cleanName}${details.trim() ? `\n*• الملاحظات:* ${details.trim()}` : ''}

يرجى تزويدي بمعلومات الدفع (CIH / التجاري وفا / كاش بلوس / بايبال / كريبتو) لتأكيد وتفعيل الطلب فوراً!

${activeProduct.publicUrl ? activeProduct.publicUrl : ''}`
    : `*Hello BLEUWI!*

*• Product Ordered:* ${chosenProductTitle}${productPriceTag}
*• Platform:* ${activeProduct.platform || 'PC / Digital'}
*• Service Category:* ${currentPreset.sessionName} (${currentPreset.category})
*• Customer Name:* ${cleanName}${details.trim() ? `\n*• Notes:* ${details.trim()}` : ''}

Please send me the payment instructions (CIH Bank / Attijari / Cash Plus / PayPal / Crypto) to confirm and activate my order now!

${activeProduct.publicUrl ? activeProduct.publicUrl : ''}`

  // Download real product image file
  const handleDownloadImage = async () => {
    if (!activeProduct?.image) return
    try {
      const res = await fetch(activeProduct.image)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = activeProduct.filename || 'BLEUWI-Product.jpg'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      if (activeProduct.publicUrl) {
        window.open(activeProduct.publicUrl, '_blank')
      }
    }
  }

  // Copy real image to clipboard
  const handleManualCopyImage = async () => {
    if (!activeProduct?.image) return
    try {
      const response = await fetch(activeProduct.image)
      const rawBlob = await response.blob()
      const pngBlob = await convertBlobToPng(rawBlob)
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ])
      setCopiedImageBtn(true)
      setTimeout(() => setCopiedImageBtn(false), 2500)
    } catch (e) {
      console.warn('Clipboard write failed:', e)
    }
  }

  // Send to WhatsApp: Native file sharing on mobile / PNG clipboard copy on desktop
  const handleSendWhatsApp = async () => {
    // 1. Mobile Web Share API: attaches REAL photo file directly into WhatsApp
    if (activeProduct?.image && typeof navigator !== 'undefined' && navigator.canShare) {
      try {
        const res = await fetch(activeProduct.image)
        const blob = await res.blob()
        const ext = blob.type?.includes('jpeg') ? 'jpg' : (blob.type?.includes('webp') ? 'webp' : 'png')
        const safeName = (activeProduct.shortName || activeProduct.title || 'BLEUWI-Order').replace(/[^a-zA-Z0-9]/g, '_')
        const file = new File([blob], `${safeName}.${ext}`, { type: blob.type || 'image/png' })

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `BLEUWI Order - ${activeProduct.title}`,
            text: generatedMessage,
            files: [file],
          })
          return
        }
      } catch (err) {
        // Fallback to desktop workflow if cancelled
      }
    }

    // 2. Desktop Workflow: Copy real image as PNG to OS clipboard
    if (activeProduct?.image) {
      try {
        const response = await fetch(activeProduct.image)
        const rawBlob = await response.blob()
        const pngBlob = await convertBlobToPng(rawBlob)
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': pngBlob })
        ])
        setCopiedImageToast(true)
      } catch (e) {
        console.warn('Clipboard write failed:', e)
      }
    }

    // 3. Open WhatsApp chat with clean text
    const cleanPhone = WHATSAPP_NUMBER.replace(/[^0-9]/g, '')
    const encoded = encodeURIComponent(generatedMessage)
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`
    window.open(waUrl, '_blank')
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
            {/* 1. Category Selection Pills */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t('categoryLabel')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(orderPresets).map((key) => {
                  const Icon = categoryIcons[key] || Sparkles
                  const isSelected = selectedCategoryKey === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCategorySelect(key)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border border-sky-400/80 bg-sky-400/15 text-sky-200 shadow-md shadow-sky-500/20 font-semibold ring-1 ring-sky-400/30'
                          : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      <Icon size={13} className={isSelected ? 'text-sky-300' : 'text-slate-400'} />
                      <span>{key}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Choose Item / Package Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {t('itemLabel')} <span className="text-sky-400">*</span>
                </label>
                {activeProduct?.image && (
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>{t('zoomBtn')} {lang === 'ar' ? 'صورة المنتج' : 'Picture'}</span>
                  </button>
                )}
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
              </div>

              {selectedGame === 'Other' && (
                <div className="mt-2.5 animate-fade-in">
                  <input
                    type="text"
                    value={customGame}
                    onChange={(e) => setCustomGame(e.target.value)}
                    placeholder={t('otherItemPlaceholder')}
                    className="w-full rounded-xl border border-sky-400/40 bg-white/[0.05] py-2 px-3.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* 3. Customer Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('nameLabel')} <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center text-slate-400`}>
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder={t('namePlaceholder')}
                    className={`w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 ${isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'} text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-sky-400`}
                  />
                </div>
              </div>

              <div>
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
                  className="relative aspect-[16/9] w-full overflow-hidden bg-black/60 cursor-pointer"
                  onClick={() => setPreviewZoom(true)}
                  title={lang === 'ar' ? 'انقر لتكبير صورة المنتج' : 'Click to zoom product image'}
                >
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
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
                    <div className="absolute top-2.5 right-2.5">
                      <span className="rounded-xl border border-sky-400/50 bg-sky-500/25 px-2.5 py-0.5 text-xs font-black text-sky-200 backdrop-blur-md shadow-lg">
                        {activeProduct.price}
                      </span>
                    </div>
                  )}

                  {/* Hover Hint */}
                  <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                      <Eye size={13} />
                      <span>{lang === 'ar' ? 'معاينة الصورة' : 'View Full Image'}</span>
                    </span>
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

                {/* Real Picture Actions Bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-t border-white/[0.05] text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleManualCopyImage}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white transition cursor-pointer"
                      title={lang === 'ar' ? 'نسخ الصورة إلى الحافظة للصقها في واتساب' : 'Copy real photo to clipboard for WhatsApp'}
                    >
                      {copiedImageBtn ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedImageBtn ? (lang === 'ar' ? 'تم نسخ الصورة!' : 'Photo Copied!') : (lang === 'ar' ? 'نسخ الصورة (Ctrl+V)' : 'Copy Photo')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-white transition cursor-pointer"
                      title={lang === 'ar' ? 'تحميل الصورة كملف حقيقي' : 'Save picture as real file'}
                    >
                      <Download size={12} />
                      <span>{lang === 'ar' ? 'تحميل الصورة' : 'Save Photo'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewZoom(true)}
                    className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>{lang === 'ar' ? 'تكبير' : 'Zoom'}</span>
                  </button>
                </div>
              </div>

              {/* Real Picture Clipboard Notice Toast */}
              {copiedImageToast && (
                <div className="rounded-xl border border-emerald-400/40 bg-gradient-to-r from-emerald-950/90 to-slate-900/95 p-3 text-emerald-100 shadow-xl animate-fade-in">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📸</span>
                      <div>
                        <h5 className="text-xs font-bold text-white">
                          {lang === 'ar' ? 'تم نسخ صورة المنتج الحقيقية!' : 'Real Product Photo Copied!'}
                        </h5>
                        <p className="mt-0.5 text-[10px] text-emerald-200/90 leading-relaxed">
                          {lang === 'ar'
                            ? 'في محادثة واتساب، اضغط Ctrl + V (أو لصق) لإرسال الصورة الحقيقية مع طلبك!'
                            : 'In your WhatsApp chat, press Ctrl + V (or Paste) to send the actual photo with your order!'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCopiedImageToast(false)}
                      className="text-emerald-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

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

                {/* Golden Warranty Interactive Seal */}
                {onOpenWarranty && (
                  <button
                    type="button"
                    onClick={onOpenWarranty}
                    className="group mt-1 flex w-full items-center justify-between gap-2 rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-500/15 via-yellow-500/5 to-amber-500/10 p-2 text-xs font-bold text-amber-300 transition hover:border-amber-400 hover:bg-amber-500/25 hover:scale-[1.01] cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <Crown size={14} className="text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                      <span>{lang === 'ar' ? 'مشمول بالضمان الذهبي 100%' : '100% Golden Warranty'}</span>
                    </span>
                    <span className="text-[10px] text-amber-300/80 underline font-normal">
                      {lang === 'ar' ? 'عرض الشروط' : 'View Terms'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* CTA Buttons & Note */}
            <div className="mt-4 pt-3.5 border-t border-white/[0.08] space-y-2.5">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 bg-[length:200%_auto] py-3.5 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-right hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {/* Official WhatsApp Logo SVG */}
                <svg className="h-5 w-5 fill-slate-950" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.769.459 3.432 1.261 4.884l-1.341 4.896 5.031-1.319c1.408.767 3.018 1.201 4.729 1.201 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10z" />
                </svg>
                <span>{t('sendWhatsAppBtn')}</span>
                <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

              {/* Mobile & PC Safe Photo Link Guarantee */}
              <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2 text-[11px] text-sky-200">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span>📸</span>
                  <span>{lang === 'ar' ? 'رابط الصورة الرسمي مدمج في الرسالة' : 'Official Photo Link Attached'}</span>
                </div>
                <p className="mt-0.5 text-[10px] text-sky-300/80 leading-snug">
                  {lang === 'ar'
                    ? 'رابط صورة المنتج من bleuwiworld.shop مدمج تلقائياً في رسالتك ليظهر فوراً في واتساب.'
                    : 'The direct bleuwiworld.shop image link is attached so the product appears immediately in WhatsApp.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PRODUCT IMAGE ZOOM MODAL */}
      {previewZoom && activeProduct?.image && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-lg animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="relative flex max-h-[92vh] max-w-5xl flex-col rounded-2xl border border-sky-400/30 bg-[#070b14] p-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-200 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-emerald-400" />
                  {activeProduct.title}
                </span>
                {activeProduct.price && (
                  <span className="rounded-md border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    {activeProduct.price}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewZoom(false)}
                className="rounded-full bg-white/10 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="my-3 flex flex-1 items-center justify-center overflow-auto">
              <img
                src={activeProduct.image}
                alt={activeProduct.title}
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
              <span className="text-slate-400">
                {lang === 'ar' ? 'صورة المنتج الرسمية مرفقة تلقائياً مع رسالة واتساب' : 'Official product picture sent automatically with your WhatsApp message'}
              </span>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 border border-sky-500/30 px-3 py-1 font-semibold text-sky-300 hover:bg-sky-500/30 transition cursor-pointer"
              >
                <Download size={12} />
                <span>{t('savePictureBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
