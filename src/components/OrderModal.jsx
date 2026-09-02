import { useState, useEffect } from 'react'
import { Check, Copy, Download, ExternalLink, Eye, Image as ImageIcon, MessageCircle, Send, User, X, Sparkles, Gamepad2, Coins, CreditCard, Clapperboard, Palette, ShieldAlert } from 'lucide-react'
import { orderPresets, WHATSAPP_NUMBER } from '../data/links'
import { useLanguage } from '../context/LanguageContext'
import refCoins from '../assets/1.png'
import refAbonnements from '../assets/2.png'
import refGames from '../assets/3.png'

const referenceImages = {
  'Game Coins': {
    src: refCoins,
    publicUrl: 'https://files.catbox.moe/1oxjsy.png',
    name: 'Game Coins & Currencies Reference Sheet',
    badge: 'Official Sheet #01 (Coins)',
    filename: 'BLEUWI-Coins-Reference.png',
  },
  'Abonnements': {
    src: refAbonnements,
    publicUrl: 'https://files.catbox.moe/b8belo.png',
    name: 'Subscriptions & Abonnements Reference Sheet',
    badge: 'Official Sheet #02 (Abonnements)',
    filename: 'BLEUWI-Abonnements-Reference.png',
  },
  'Sell Games': {
    src: refGames,
    publicUrl: 'https://files.catbox.moe/tv824s.png',
    name: 'Sell Games & Digital Keys Reference Sheet',
    badge: 'Official Sheet #03 (Game Keys)',
    filename: 'BLEUWI-GameKeys-Reference.png',
  },
}

export default function OrderModal({ isOpen, onClose, initialData = {} }) {
  const { t, lang, isRTL } = useLanguage()

  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('bleuwi_customer_name') || ''
    } catch {
      return ''
    }
  })

  const [selectedCategoryKey, setSelectedCategoryKey] = useState('Game Coins')
  const [selectedGame, setSelectedGame] = useState('')
  const [customGame, setCustomGame] = useState('')
  const [details, setDetails] = useState('')
  const [copiedText, setCopiedText] = useState(false)
  const [copiedImage, setCopiedImage] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(false)
  const [showPasteNotice, setShowPasteNotice] = useState(false)

  // Sync initialData when modal opens
  useEffect(() => {
    if (!isOpen) return

    let matchedCategoryKey = 'Game Coins'
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
    setCopiedImage(false)
    setPreviewZoom(false)
    setShowPasteNotice(false)
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
    setShowPasteNotice(false)
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

  if (!isOpen) return null

  const currentPreset = orderPresets[selectedCategoryKey] || orderPresets['Game Coins']
  const cleanName = name.trim() || (lang === 'ar' ? 'عميل مهتم' : 'A Customer')
  const chosenItem = selectedGame === 'Other' && customGame.trim() ? customGame.trim() : (selectedGame || (lang === 'ar' ? 'طلب مخصص' : 'Custom Request'))

  // Reference Image handling (uses high-speed public HTTPS CDN for WhatsApp preview cards)
  const activeRef = referenceImages[selectedCategoryKey]

  // Build the clean WhatsApp message with bold formatting and public image link (zero broken characters)
  const generatedMessage = lang === 'ar'
    ? `*السلام عليكم BLEUWI!*

*• اسم العميل:* ${cleanName}
*• القسم المطلوب:* ${currentPreset.sessionName}
*• الفئة:* ${currentPreset.category}
*• العنصر / الباقة المختارة:* ${chosenItem}${details.trim() ? `\n*• التفاصيل والكمية:* ${details.trim()}` : ''}${activeRef ? `\n\n*• رابط الصورة المرجعية الرسمية:* ${activeRef.publicUrl}` : ''}

يرجى تزويدي بالسعر الحالي، التوفر، وطرق الدفع المتاحة!`
    : `*Hello BLEUWI!*

*• Customer Name:* ${cleanName}
*• Purchase Session:* ${currentPreset.sessionName}
*• Service Category:* ${currentPreset.category}
*• Selected Item:* ${chosenItem}${details.trim() ? `\n*• Details / Quantity:* ${details.trim()}` : ''}${activeRef ? `\n\n*• Reference Picture Sheet:* ${activeRef.publicUrl}` : ''}

Please send me the current price, availability, and payment methods!`

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!activeRef?.src) return
    try {
      const response = await fetch(activeRef.src)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopiedImage(true)
      setTimeout(() => setCopiedImage(false), 2500)
    } catch (e) {
      console.warn('Could not copy image to clipboard automatically:', e)
    }
  }

  // Download reference image
  const handleDownloadImage = async () => {
    if (!activeRef) return
    try {
      const res = await fetch(activeRef.src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = activeRef.filename || 'BLEUWI-Reference-Sheet.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      window.open(activeRef.publicUrl, '_blank')
    }
  }

  // Send to WhatsApp
  const handleSendWhatsApp = async () => {
    // 1. Proactively copy image to clipboard so user can press Ctrl+V in WhatsApp
    if (activeRef?.src) {
      try {
        const response = await fetch(activeRef.src)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        setCopiedImage(true)
      } catch (e) {
        // ignore
      }
    }

    // 2. Open WhatsApp with formatted text
    const cleanPhone = WHATSAPP_NUMBER.replace(/[^0-9]/g, '')
    const encoded = encodeURIComponent(generatedMessage)
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`
    window.open(waUrl, '_blank')

    // 3. Show paste helper banner in modal
    if (activeRef) {
      setShowPasteNotice(true)
    }
  }

  const handleCopyTextMessage = () => {
    navigator.clipboard.writeText(generatedMessage)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-sky-400/20 bg-[#080d18] p-6 shadow-2xl shadow-sky-950/50 sm:p-8 z-10 my-auto text-white animate-fade-up"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('quickOrderBtn')}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {lang === 'ar' ? 'مرفق الصورة المرجعية الرسمية' : 'Reference Image Included'}
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {lang === 'ar' ? 'تخصيص ' : 'Customize Your '}
              <span className="text-gradient">
                {lang === 'ar' ? 'الطلب' : 'Order'}
              </span>
            </h3>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              {t('orderModalSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="relative mt-5 space-y-4 text-left max-h-[60vh] overflow-y-auto pr-1">
          {/* 1. Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('nameLabel')} <span className="text-sky-400">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center text-slate-400`}>
                <User size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t('namePlaceholder')}
                className={`w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-sky-400`}
              />
            </div>
          </div>

          {/* 2. Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('categoryLabel')}
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Object.keys(orderPresets).map((key) => {
                const isSelected = selectedCategoryKey === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCategorySelect(key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'border border-sky-400 bg-sky-400/20 text-sky-200 shadow-md shadow-sky-500/10 font-semibold'
                        : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {key}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ATTACHED REFERENCE IMAGE BANNER */}
          {activeRef && (
            <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-950/30 via-slate-900/60 to-emerald-950/20 p-3.5 transition-all">
              <div className="flex items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-200">
                  <ImageIcon size={15} className="text-sky-400" />
                  <span>{t('attachedRefTitle')}</span>
                  <span className="text-emerald-400 font-bold">{activeRef.badge}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(true)}
                    className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[10px] text-sky-200 hover:bg-white/20 transition cursor-pointer"
                    title={t('clickToZoom')}
                  >
                    <Eye size={11} />
                    <span>{t('zoomBtn')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyImage}
                    className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
                    title="Copy image to paste with Ctrl+V"
                  >
                    {copiedImage ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedImage ? t('copiedImageBtn') : t('copyImageBtn')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="inline-flex items-center gap-1 rounded bg-sky-500/20 border border-sky-500/30 px-2 py-0.5 text-[10px] text-sky-300 hover:bg-sky-500/30 transition cursor-pointer"
                    title="Download picture file to your device"
                  >
                    <Download size={11} />
                    <span>{t('savePictureBtn')}</span>
                  </button>
                </div>
              </div>

              <div
                className="group/thumb relative h-28 w-full overflow-hidden rounded-xl border border-white/10 bg-black cursor-pointer shadow-inner"
                onClick={() => setPreviewZoom(true)}
                title={t('clickToZoom')}
              >
                <img
                  src={activeRef.src}
                  alt={activeRef.name}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="truncate">{activeRef.name}</span>
                  <span className="text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-400/30 font-semibold">
                    {lang === 'ar' ? 'رابط مباشر + منسوخة للحافظة' : 'Public Link & Clipboard Ready'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* POST-SEND PASTE INSTRUCTION NOTICE */}
          {showPasteNotice && (
            <div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-950/80 to-slate-900/90 p-4 text-emerald-100 shadow-xl animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl">📸</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t('pasteNoticeTitle')}</h4>
                    <p className="mt-1 text-xs text-emerald-200/90 leading-relaxed">
                      {t('pasteNoticeDesc')}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadImage}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-200 transition cursor-pointer"
                      >
                        <Download size={13} />
                        <span>{t('savePictureBtn')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasteNotice(false)}
                        className="text-xs text-emerald-400 hover:underline px-2 py-1 cursor-pointer"
                      >
                        {t('dismissNotice')}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasteNotice(false)}
                  className="text-emerald-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* 3. Game / Item Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('itemLabel')} <span className="text-sky-400">*</span>
            </label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPreset.games.map((g) => {
                const isChosen = selectedGame === g
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setSelectedGame(g)
                      setCustomGame('')
                    }}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition cursor-pointer ${
                      isChosen
                        ? 'border-sky-400 bg-sky-400/15 text-white font-medium shadow-sm'
                        : 'border-white/[0.08] bg-white/[0.025] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full border text-[10px] ${
                        isChosen ? 'border-sky-400 bg-sky-400 text-slate-950' : 'border-slate-600'
                      }`}
                    >
                      {isChosen ? '✓' : ''}
                    </span>
                    <span className="truncate">{g}</span>
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => setSelectedGame('Other')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition cursor-pointer ${
                  selectedGame === 'Other'
                    ? 'border-sky-400 bg-sky-400/15 text-white font-medium shadow-sm'
                    : 'border-white/[0.08] bg-white/[0.025] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border text-[10px] ${
                    selectedGame === 'Other' ? 'border-sky-400 bg-sky-400 text-slate-950' : 'border-slate-600'
                  }`}
                >
                  {selectedGame === 'Other' ? '✓' : ''}
                </span>
                <span>{t('otherItemOption')}</span>
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

          {/* 4. Notes / Quantity */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('notesLabel')}
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:bg-white/[0.07] focus:outline-none"
            />
          </div>

          {/* 5. Live WhatsApp Message Preview */}
          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-950/20 to-black/40 p-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-500/15">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <MessageCircle size={15} />
                <span>{t('messagePreviewTitle')}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyTextMessage}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white transition cursor-pointer"
              >
                {copiedText ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedText ? t('copiedTextBtn') : t('copyTextBtn')}</span>
              </button>
            </div>

            <pre className="mt-2.5 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200 select-all" dir="auto">
              {generatedMessage}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative mt-6 flex flex-col sm:flex-row items-center gap-3 border-t border-white/[0.08] pt-5">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="inline-flex w-full sm:flex-1 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-3.5 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-emerald-300 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {/* WhatsApp Speech Bubble Logo SVG */}
            <svg className="h-5 w-5 fill-slate-950" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.769.459 3.432 1.261 4.884l-1.341 4.896 5.031-1.319c1.408.767 3.018 1.201 4.729 1.201 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10z" />
            </svg>
            <span>{t('sendWhatsAppBtn')}</span>
            <ExternalLink size={15} />
          </button>

          {activeRef && (
            <button
              type="button"
              onClick={handleDownloadImage}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 py-3.5 px-4 text-xs font-semibold text-sky-200 hover:bg-sky-500/20 transition cursor-pointer"
              title="Download image file to manually attach"
            >
              <Download size={14} />
              <span>{t('savePictureBtn')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            {t('cancelBtn')}
          </button>
        </div>
      </div>

      {/* FULLSCREEN REFERENCE IMAGE PREVIEW MODAL */}
      {previewZoom && activeRef && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-lg animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="relative flex max-h-[92vh] max-w-5xl flex-col rounded-2xl border border-sky-400/30 bg-[#070b14] p-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-semibold text-sky-200 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-emerald-400" />
                {activeRef.name}
              </span>
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
                src={activeRef.src}
                alt={activeRef.name}
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
              <span className="text-slate-400">
                {lang === 'ar' ? 'صورة مرجعية رسمية مرفقة مع طلب واتساب' : 'Direct reference attached to your WhatsApp order'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 border border-sky-500/30 px-3 py-1 font-semibold text-sky-300 hover:bg-sky-500/30 transition cursor-pointer"
                >
                  <Download size={12} />
                  <span>{t('savePictureBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 font-semibold text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
                >
                  {copiedImage ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedImage ? t('copiedImageBtn') : t('copyImageBtn')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
