import { useState, useMemo, useRef } from 'react'
import { Gem, Zap, ShieldCheck, Sparkles, Copy, Check, MessageCircle, Gift, ClipboardPaste, AlertCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useShop } from '../context/ShopContext'
import { FF_PRESET_PACKAGES, UNLOCK_TIERS } from '../data/calculatorData'
import { getSecureWhatsAppUrl } from '../data/links'

export default function FreeFireCalculator() {
  const { lang, isRTL } = useLanguage()
  const { formatPrice } = useShop()

  const [diamonds, setDiamonds] = useState(1080)
  const [playerId, setPlayerId] = useState('')
  const [copiedId, setCopiedId] = useState(false)
  const [idError, setIdError] = useState(false)

  const idInputRef = useRef(null)

  // Calculations
  const calculatedPriceMad = useMemo(() => {
    const preset = FF_PRESET_PACKAGES.find((p) => p.diamonds === diamonds)
    if (preset) return preset.priceMad
    return Math.max(10, Math.round((diamonds / 100) * 10))
  }, [diamonds])

  const currentUnlockTier = useMemo(() => {
    return [...UNLOCK_TIERS].reverse().find((t) => diamonds >= t.minDiamonds) || UNLOCK_TIERS[0]
  }, [diamonds])

  const unlockInfo = currentUnlockTier[lang] || currentUnlockTier.en

  const bonusDiamonds = useMemo(() => {
    const preset = FF_PRESET_PACKAGES.find((p) => p.diamonds === diamonds)
    return preset ? preset.bonus : Math.round(diamonds * 0.05)
  }, [diamonds])

  const handleCopyId = () => {
    if (!playerId) return
    navigator.clipboard.writeText(playerId)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handlePasteId = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText()
        if (text && text.trim()) {
          setPlayerId(text.trim())
          setIdError(false)
          return
        }
      }
    } catch {
      // Clipboard access denied, fallback to manual focus
    }
    idInputRef.current?.focus()
  }

  const handleOrderWhatsApp = () => {
    const trimmedId = playerId.trim()

    // Enforce Player ID requirement before redirecting to WhatsApp
    if (!trimmedId) {
      setIdError(true)
      if (idInputRef.current) {
        idInputRef.current.focus()
        idInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIdError(false)

    const totalDiamonds = diamonds + bonusDiamonds
    const formattedCost = formatPrice(calculatedPriceMad)

    // Language-tailored official WhatsApp message
    let messageText = ''

    if (lang === 'ar') {
      messageText =
        `👋 السلام عليكم متجر BLEUWI WORLD!\n` +
        `🎮 أرغب بشحن باقة جواهر فري فاير فورياً عبر الآيدي:\n\n` +
        `• معرف الحساب (Player ID): ${trimmedId}\n` +
        `• كمية الجواهر: ${diamonds} جوهرة\n` +
        `• بونص مجاني هدية: +${bonusDiamonds} جوهرة\n` +
        `• مجموع الجواهر الصافي: ${totalDiamonds} جوهرة 💎\n` +
        `• السعر الإجمالي: ${formattedCost} (${calculatedPriceMad} DH)\n` +
        `• طريقة الدفع: (CIH Bank / Cash Plus / Attijari / Wafacash / USDT)\n\n` +
        `⚡ أنا جاهز للدفع الآن، يرجى تزويدي برقم الحساب لتنفيذ الشحن في 5 دقائق.`
    } else if (lang === 'fr') {
      messageText =
        `👋 Bonjour BLEUWI WORLD !\n` +
        `🎮 Je souhaite recharger un pack de diamants Free Fire par ID :\n\n` +
        `• ID Joueur (Player ID) : ${trimmedId}\n` +
        `• Pack de diamants : ${diamonds} Diamants\n` +
        `• Bonus offert : +${bonusDiamonds} Diamants\n` +
        `• Total livré : ${totalDiamonds} Diamants 💎\n` +
        `• Prix total : ${formattedCost} (${calculatedPriceMad} DH)\n` +
        `• Mode de paiement : (CIH Bank / Cash Plus / Attijari / Wafacash / USDT / PayPal)\n\n` +
        `⚡ Je suis prêt à payer, merci d'envoyer les coordonnées pour la livraison en 5 min.`
    } else if (lang === 'es') {
      messageText =
        `👋 ¡Hola BLEUWI WORLD!\n` +
        `🎮 Quiero recargar diamantes de Free Fire directamente por ID:\n\n` +
        `• ID de Jugador: ${trimmedId}\n` +
        `• Paquete: ${diamonds} Diamantes\n` +
        `• Bono de regalo: +${bonusDiamonds} Diamantes\n` +
        `• Total recibido: ${totalDiamonds} Diamantes 💎\n` +
        `• Precio total : ${formattedCost} (${calculatedPriceMad} DH)\n` +
        `• Método de pago: (CIH Bank / Cash Plus / Attijari / Wafacash / USDT / PayPal)\n\n` +
        `⚡ Estoy listo para pagar, por favor envíame los datos para entrega en 5 minutos.`
    } else {
      messageText =
        `👋 Hello BLEUWI WORLD Store!\n` +
        `🎮 I want to top-up Free Fire Diamonds directly to my account:\n\n` +
        `• Player ID: ${trimmedId}\n` +
        `• Diamond Package: ${diamonds} Diamonds\n` +
        `• Free Bonus Gift: +${bonusDiamonds} Diamonds\n` +
        `• Total Delivered: ${totalDiamonds} Diamonds 💎\n` +
        `• Total Price: ${formattedCost} (${calculatedPriceMad} DH)\n` +
        `• Payment Method: (CIH Bank / Cash Plus / Attijari / Wafacash / USDT / PayPal)\n\n` +
        `⚡ I am ready to pay, please send account details for 5-minute instant delivery.`
    }

    const targetUrl = getSecureWhatsAppUrl(messageText)
    window.open(targetUrl, '_blank')
  }

  // Multi-lingual UI strings
  const labels = {
    ar: {
      badge: '🇲🇦 حاسبة جواهر فري فاير الرسمية بالدرهم المغربي',
      title: 'حاسبة شحن فري فاير الرسمية (1$ = 10 DH)',
      subtitle: 'اختر كمية الجواهر أو حرك المؤشر لحساب السعر فوراً بالدرهم المغربي ومعرفة الهدايا والجوائز التي يمكنك فتحها في حسابك.',
      sliderLabel: 'حدد كمية الجواهر المطلوبة:',
      bonusBadge: 'بونص إضافي هدية',
      totalEarned: 'مجموع الجواهر التي ستصلك:',
      priceSummary: 'السعر الإجمالي المباشر:',
      guarantee: 'تسليم فوري في 5 دقائق مع الضمان الذهبي 100%',
      idLabel: 'أدخل أو الصق معرف اللاعب (Player ID) للشحن المباشر:',
      idPlaceholder: 'اكتب أو الصق آيدي الحساب هنا (مثال: 2948104820)...',
      pasteBtn: 'لصق الآيدي',
      copyId: 'نسخ الآيدي',
      orderBtn: 'شحن فوري على واتساب',
      unlockHeading: 'ماذا يمكنك أن تفتح بهذه الجواهر داخل اللعبة؟',
      noBanText: 'شحن رسمي 100% بدون كلمة سر وبدون أي خطر باند',
      idRequiredError: '⚠️ يرجى لصق أو كتابة آيدي الحساب (Player ID) أولاً لإتمام الشحن المباشر على واتساب!',
    },
    en: {
      badge: '🇲🇦 Official Free Fire Diamond & Currency Calculator',
      title: 'Free Fire Diamonds Rate Calculator (1$ = 10 DH)',
      subtitle: 'Select diamond package or drag the slider to calculate instant price in MAD & global currencies, with preview of in-game unlocks.',
      sliderLabel: 'Choose Required Diamond Amount:',
      bonusBadge: 'Free Gift Bonus',
      totalEarned: 'Total Diamonds Delivered:',
      priceSummary: 'Total Direct Price:',
      guarantee: 'Instant 5-minute delivery with 100% Golden Guarantee',
      idLabel: 'Enter or Paste Player ID for Direct Top-up:',
      idPlaceholder: 'Type or paste Player ID here (e.g. 2948104820)...',
      pasteBtn: 'Paste ID',
      copyId: 'Copy ID',
      orderBtn: 'Direct WhatsApp Top-Up',
      unlockHeading: 'What can you unlock in Free Fire with this package?',
      noBanText: '100% Official ID Top-up · No password required · Zero ban risk',
      idRequiredError: '⚠️ Please paste or enter your Free Fire Player ID first to top-up directly on WhatsApp!',
    },
    fr: {
      badge: '🇲🇦 Calculateur Officiel de Diamants Free Fire en Dirham',
      title: 'Calculateur Free Fire Diamants (1$ = 10 DH)',
      subtitle: 'Sélectionnez votre pack ou glissez le curseur pour calculer le prix en Dirham et voir ce que vous pouvez débloquer dans le jeu.',
      sliderLabel: 'Choisissez la quantité de diamants :',
      bonusBadge: 'Bonus Gratuit Offert',
      totalEarned: 'Total des diamants livrés :',
      priceSummary: 'Prix total direct :',
      guarantee: 'Livraison express en 5 minutes avec Garantie Or 100%',
      idLabel: 'Entrez ou collez votre ID Joueur pour la recharge directe :',
      idPlaceholder: 'Écrivez ou collez l’ID Joueur ici (ex : 2948104820)...',
      pasteBtn: 'Coller ID',
      copyId: 'Copier ID',
      orderBtn: 'Recharge Directe WhatsApp',
      unlockHeading: 'Que pouvez-vous débloquer avec ces diamants ?',
      noBanText: 'Recharge 100% officielle par ID · Sans mot de passe · Zéro risque de ban',
      idRequiredError: '⚠️ Veuillez coller votre ID Joueur (Player ID) avant de valider sur WhatsApp !',
    },
    es: {
      badge: '🇲🇦 Calculadora Oficial de Diamantes Free Fire en Dirhams',
      title: 'Calculadora de Diamantes Free Fire (1$ = 10 DH)',
      subtitle: 'Elige tu paquete o desliza el control para calcular el precio en Dirhams y ver qué desbloqueas dentro del juego.',
      sliderLabel: 'Selecciona la cantidad de diamantes:',
      bonusBadge: 'Bono de Regalo Gratis',
      totalEarned: 'Total de diamantes que recibirás:',
      priceSummary: 'Precio total directo:',
      guarantee: 'Entrega en 5 minutos con Garantía Dorada del 100%',
      idLabel: 'Ingresa o pega tu ID de Jugador para recarga directa:',
      idPlaceholder: 'Escribe o pega tu ID aquí (ej: 2948104820)...',
      pasteBtn: 'Pegar ID',
      copyId: 'Copiar ID',
      orderBtn: 'Recarga Directa en WhatsApp',
      unlockHeading: '¿Qué puedes desbloquear con estos diamantes en Free Fire?',
      noBanText: 'Recarga 100% oficial por ID · Sin contraseñas · Cero riesgo de baneo',
      idRequiredError: '⚠️ ¡Por favor pega o ingresa tu ID de Jugador primero para recargar por WhatsApp!',
    },
  }

  const t = labels[lang] || labels.en

  return (
    <section id="diamond-calculator" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-gradient-to-tr from-amber-500/10 via-sky-500/10 to-emerald-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/10 mb-4">
          <Gem size={14} className="text-amber-400 animate-bounce" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {t.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Main Interactive Tool Card */}
      <div className="rounded-3xl border border-sky-400/20 bg-gradient-to-b from-[#091122]/95 via-[#060b18]/95 to-[#040812]/95 p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
        {/* Preset Packages Quick Pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span>{t.sliderLabel}</span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              ⚡ 1$ = 10 DH Fixed Rate
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {FF_PRESET_PACKAGES.map((pkg) => {
              const isSelected = diamonds === pkg.diamonds
              return (
                <button
                  key={pkg.diamonds}
                  type="button"
                  onClick={() => {
                    setDiamonds(pkg.diamonds)
                    setIdError(false)
                  }}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3 transition duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/15 shadow-lg shadow-amber-500/20 text-white scale-[1.02]'
                      : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-base sm:text-lg font-black text-amber-300">
                    <Gem size={16} className={isSelected ? 'text-amber-300' : 'text-slate-400'} />
                    <span>{pkg.diamonds.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-xs font-extrabold text-white">
                    {formatPrice(pkg.priceMad)}
                  </div>
                  {pkg.tag && (
                    <span className={`mt-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-white/10 text-slate-400'
                    }`}>
                      {pkg.tag}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Range Slider */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-sm font-bold text-slate-200">
              💎 {diamonds.toLocaleString()} Diamonds
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <Gift size={12} />
              <span>+{bonusDiamonds.toLocaleString()} {t.bonusBadge}</span>
            </span>
          </div>

          <input
            type="range"
            min="100"
            max="6160"
            step="10"
            value={diamonds}
            onChange={(e) => {
              setDiamonds(Number(e.target.value))
              setIdError(false)
            }}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            aria-label="Diamond Amount Slider"
          />

          <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>100 💎 (10 DH)</span>
            <span>1,080 💎 (120 DH)</span>
            <span>2,420 💎 (250 DH)</span>
            <span>6,160 💎 (600 DH)</span>
          </div>
        </div>

        {/* Result & Value Output Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Price & Delivery Card */}
          <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 sm:p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              {t.priceSummary}
            </div>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatPrice(calculatedPriceMad)}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                (≈ ${(calculatedPriceMad / 10).toFixed(1)} USD)
              </span>
            </div>

            <div className="mt-4 space-y-2 border-t border-amber-400/20 pt-4 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>{t.totalEarned}</span>
                <span className="font-extrabold text-amber-300">
                  {(diamonds + bonusDiamonds).toLocaleString()} 💎
                </span>
              </div>
              <div className="flex items-center justify-between text-emerald-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Zap size={14} />
                  <span>{t.guarantee}</span>
                </span>
              </div>
            </div>
          </div>

          {/* In-Game Unlock Insights Card */}
          <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent p-5 sm:p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-1 flex items-center gap-1.5">
              <span>{currentUnlockTier.icon}</span>
              <span>{t.unlockHeading}</span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-2">
              {unlockInfo.title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {unlockInfo.desc}
            </p>

            <div className="mt-4 border-t border-sky-400/20 pt-3 flex items-center gap-2 text-xs font-semibold text-sky-300">
              <ShieldCheck size={16} className="text-sky-400 flex-shrink-0" />
              <span>{t.noBanText}</span>
            </div>
          </div>
        </div>

        {/* Player ID Field & DIRECT WhatsApp Order Action */}
        <div className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
          idError
            ? 'border-amber-400/80 bg-amber-500/10 shadow-lg shadow-amber-500/20'
            : 'border-white/10 bg-white/[0.03]'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <label htmlFor="ff-player-id-input" className="block text-xs sm:text-sm font-bold text-slate-200">
              {t.idLabel}
            </label>
            <button
              type="button"
              onClick={handlePasteId}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-400/20 hover:text-white transition cursor-pointer"
            >
              <ClipboardPaste size={13} />
              <span>{t.pasteBtn}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="ff-player-id-input"
                ref={idInputRef}
                type="text"
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.target.value)
                  if (e.target.value.trim()) setIdError(false)
                }}
                placeholder={t.idPlaceholder}
                className={`w-full rounded-xl border bg-black/50 px-4 py-3 text-sm sm:text-base font-mono text-white placeholder:text-slate-500 transition focus:outline-none ${
                  idError
                    ? 'border-amber-400 ring-2 ring-amber-400/50 text-amber-200'
                    : 'border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                }`}
              />
              {playerId && (
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 p-1.5 text-slate-300 hover:text-white"
                  title={t.copyId}
                >
                  {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 px-7 py-3 text-sm sm:text-base font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-white hover:scale-[1.02] cursor-pointer flex-shrink-0"
            >
              <MessageCircle size={18} className="fill-slate-950" />
              <span>{t.orderBtn}</span>
            </button>
          </div>

          {/* Validation Warning Alert */}
          {idError && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/15 p-3 text-xs sm:text-sm font-bold text-amber-300 animate-pulse">
              <AlertCircle size={16} className="flex-shrink-0 text-amber-400" />
              <span>{t.idRequiredError}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
