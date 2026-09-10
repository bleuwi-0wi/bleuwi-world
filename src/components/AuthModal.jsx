// BLEUWI WORLD - Ultra-Secure Authentication Modal with Two-Factor Authentication (+2FA)
import { useState, useEffect, useRef } from 'react'
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  Smartphone,
  QrCode,
  Copy,
  Settings,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, loginWithGoogle, verify2FA, resend2FA, signup } = useAuth()
  const { lang, isRTL } = useLanguage()

  const [activeTab, setActiveTab] = useState(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showGoogleConfig, setShowGoogleConfig] = useState(false)
  const [customClientId, setCustomClientId] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('bleuwi_google_client_id') || '' : ''
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // 2FA Challenge State (Admins Only)
  const [is2FAMode, setIs2FAMode] = useState(false)
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false)
  const [preAuthToken, setPreAuthToken] = useState('')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [totpSecret, setTotpSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [backupCodes, setBackupCodes] = useState([])
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false)
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [backupCodeInput, setBackupCodeInput] = useState('')


  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup Form State
  const [signupFullName, setSignupFullName] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const inputRefs = useRef([])

  useEffect(() => {
    setActiveTab(initialTab)
    setErrorMsg('')
    setSuccessMsg('')
    setIs2FAMode(false)
    setIsFirstTimeSetup(false)
    setDigits(['', '', '', '', '', ''])
  }, [initialTab, isOpen])

  // Countdown timer for 2FA expiration
  useEffect(() => {
    let timer
    if (is2FAMode && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [is2FAMode, countdown])

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Format seconds to MM:SS
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await login(loginIdentifier, loginPassword)
      if (res && res.requires2FA) {
        setIs2FAMode(true)
        setPreAuthToken(res.preAuthToken)
        setIsFirstTimeSetup(!!res.isFirstTimeSetup)
        setTotpSecret(res.secret || '')
        setQrCodeUrl(res.qrCodeUrl || '')
        setBackupCodes(res.backupCodes || [])
        setCountdown(300)
        setDigits(['', '', '', '', '', ''])
        setUseBackupCode(false)
        setBackupCodeInput('')
        setSuccessMsg(
          res.isFirstTimeSetup
            ? (lang === 'ar'
                ? 'إعداد المصادقة الثنائية (Google Authenticator) لأول مرة.'
                : 'First-time setup: Scan QR code with Google Authenticator to confirm.')
            : (lang === 'ar'
                ? 'أدخل الرمز المكون من 6 أرقام من تطبيق Google Authenticator.'
                : 'Enter the 6-digit code from Google Authenticator.')
        )
      } else {
        setSuccessMsg(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Handle individual 2FA digit entry
  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    setErrorMsg('')

    // Auto-advance to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }

    // Auto-submit when all 6 digits entered
    const fullCode = newDigits.join('')
    if (fullCode.length === 6) {
      submit2FACode(fullCode)
    }
  }

  // Handle paste in 2FA inputs
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const newDigits = [...digits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setDigits(newDigits)
    setErrorMsg('')

    if (pasted.length === 6) {
      submit2FACode(pasted)
    } else if (inputRefs.current[pasted.length]) {
      inputRefs.current[pasted.length].focus()
    }
  }

  // Handle backspace in 2FA inputs
  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Submit 2FA verification code (TOTP or backup recovery code)
  const submit2FACode = async (codeToSubmit) => {
    let finalCode = codeToSubmit
    if (useBackupCode) {
      finalCode = backupCodeInput.trim()
      if (!finalCode) {
        setErrorMsg(lang === 'ar' ? 'يرجى إدخال رمز الاسترداد الاحتياطي.' : 'Please enter your backup recovery code.')
        return
      }
    } else {
      finalCode = finalCode || digits.join('')
      if (finalCode.length !== 6) {
        setErrorMsg(lang === 'ar' ? 'يرجى إدخال كافة أرقام الرمز الستة.' : 'Please enter all 6 digits.')
        return
      }
    }

    setLoading(true)
    setErrorMsg('')
    try {
      await verify2FA(preAuthToken, finalCode)
      setSuccessMsg(lang === 'ar' ? 'تم تأكيد الرمز بنجاح! جاري تحويلك...' : '2FA Verified! Logging you in...')
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired verification code.')
    } finally {
      setLoading(false)
    }
  }


  // Signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      await signup({
        fullName: signupFullName,
        username: signupUsername,
        email: signupEmail,
        phone: '',
        password: signupPassword,
      })
      setSuccessMsg(lang === 'ar' ? 'تم إنشاء الحساب بنجاح! مرحباً بك.' : 'Account created successfully! Welcome.')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Dynamic async loader for Google Identity Services SDK
  const ensureGoogleSDK = (timeoutMs = 5000) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false)
      if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) {
        return resolve(true)
      }

      let script = document.getElementById('google-identity-services-script')
      if (!script) {
        script = document.createElement('script')
        script.id = 'google-identity-services-script'
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        document.head.appendChild(script)
      }

      let elapsed = 0
      const interval = setInterval(() => {
        elapsed += 100
        if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) {
          clearInterval(interval)
          resolve(true)
        } else if (elapsed >= timeoutMs) {
          clearInterval(interval)
          resolve(false)
        }
      }, 100)
    })
  }

  // Pre-warm Google Identity Services when AuthModal opens
  useEffect(() => {
    if (isOpen) {
      ensureGoogleSDK(3500).catch(() => {})
    }
  }, [isOpen])

  // Google OAuth / Google Identity Services Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    setGoogleLoading(true)

    // Ensure Google Identity Services SDK is ready (waits up to 5s if still loading)
    const isReady = await ensureGoogleSDK(5000)
    if (!isReady) {
      setGoogleLoading(false)
      setErrorMsg(
        lang === 'ar'
          ? 'تعذر الاتصال بخدمة Google. إذا كنت تستخدم مانع إعلانات (AdBlocker أو Brave Shields) يرجى تعطيله مؤقتاً أو تسجيل الدخول بالبريد مباشرة.'
          : 'Could not connect to Google service. If using an AdBlocker or Brave Shields, please disable it or sign in with email.'
      )
      return
    }

    const storedClientId = typeof window !== 'undefined' ? localStorage.getItem('bleuwi_google_client_id') : null
    const clientId =
      (storedClientId && storedClientId.trim()) ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '160522009330-aqq1p9dailjapo0hn41iujgocmvmhamd.apps.googleusercontent.com'

    // 1. Try Google Identity Services (GIS) OAuth2 Token Client (Opens Account Chooser Popup)
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await loginWithGoogle({ accessToken: tokenResponse.access_token })
                if (res?.requires2FA) {
                  setPreAuthToken(res.preAuthToken)
                  setIs2FAMode(true)
                  if (res.isFirstTimeSetup) {
                    setIsFirstTimeSetup(true)
                    setTotpSecret(res.totpSecret || res.secret || '')
                    let qr = res.qrCodeUrl || ''
                    if (qr && qr.startsWith('otpauth://')) {
                      qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qr)}`
                    }
                    setQrCodeUrl(qr)
                    setBackupCodes(res.backupCodes || [])
                  }
                } else {
                  setSuccessMsg(
                    lang === 'ar'
                      ? 'تم تسجيل الدخول بحساب Google بنجاح!'
                      : 'Signed in with Google successfully!'
                  )
                }
              } catch (apiErr) {
                setErrorMsg(apiErr.message || 'Google authentication failed.')
              } finally {
                setGoogleLoading(false)
              }
            } else {
              setGoogleLoading(false)
            }
          },
          error_callback: (err) => {
            setGoogleLoading(false)
            if (err?.type === 'popup_closed') {
              return
            }
            if (
              err?.type === 'unknown_client_id' ||
              err?.error === 'invalid_client' ||
              err?.type === 'invalid_client' ||
              String(err).includes('client')
            ) {
              setShowGoogleConfig(true)
              setErrorMsg(
                lang === 'ar'
                  ? 'يرجى ربط معرف OAuth Client ID الخاص بموقعك من Google Cloud Console لتفعيل الدخول بحساب Google.'
                  : 'Please configure your OAuth Client ID from Google Cloud Console to enable Google Sign-In.'
              )
              return
            }
            setErrorMsg(
              lang === 'ar'
                ? 'تم إلغاء نافذة Google أو حدث خطأ أثناء التحقق.'
                : 'Google Sign-In was cancelled or encountered an error.'
            )
          },
        })
        tokenClient.requestAccessToken({ prompt: 'select_account' })
        return
      } catch (err) {
        console.warn('GIS TokenClient initialization error:', err)
      }
    }

    // 2. Fallback: Google One-Tap / ID Token
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response && response.credential) {
              try {
                const res = await loginWithGoogle({ credential: response.credential })
                if (res?.requires2FA) {
                  setPreAuthToken(res.preAuthToken)
                  setIs2FAMode(true)
                  if (res.isFirstTimeSetup) {
                    setIsFirstTimeSetup(true)
                    setTotpSecret(res.totpSecret || res.secret || '')
                    let qr = res.qrCodeUrl || ''
                    if (qr && qr.startsWith('otpauth://')) {
                      qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qr)}`
                    }
                    setQrCodeUrl(qr)
                    setBackupCodes(res.backupCodes || [])
                  }
                } else {
                  setSuccessMsg(
                    lang === 'ar'
                      ? 'تم تسجيل الدخول بحساب Google بنجاح!'
                      : 'Signed in with Google successfully!'
                  )
                }
              } catch (apiErr) {
                setErrorMsg(apiErr.message || 'Google authentication failed.')
              } finally {
                setGoogleLoading(false)
              }
            }
          },
        })
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setGoogleLoading(false)
          }
        })
        return
      } catch (err) {
        console.warn('GIS ID initialization error:', err)
      }
    }

    setGoogleLoading(false)
    setErrorMsg(
      lang === 'ar'
        ? 'تعذر بدء خدمة Google. يرجى تسجيل الدخول بالبريد الإلكتروني.'
        : 'Could not initialize Google service. Please sign in with email.'
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-md rounded-3xl border border-sky-400/30 bg-[#0a0f1d]/95 p-6 sm:p-8 shadow-[0_0_60px_rgba(56,189,248,0.22)] backdrop-blur-2xl transition-all duration-300 z-10 my-auto"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Glow Accent Line */}
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-sky-400/30 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            {is2FAMode ? <KeyRound size={24} className="text-emerald-400" /> : <ShieldCheck size={26} className="text-sky-400" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            BLEUWI <span className="text-sky-400">WORLD</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {is2FAMode
              ? (lang === 'ar' ? 'التحقق بخطوتين (+2FA) لحماية الحساب' : 'Two-Factor Authentication (+2FA)')
              : (lang === 'ar' ? 'تسجيل دخول مشفر وآمن 100%' : 'Encrypted & Secure Access')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-shake">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: TWO-FACTOR (+2FA) CODE ENTRY SCREEN              */}
        {/* ======================================================== */}
        {is2FAMode ? (
          <div className="space-y-4 animate-scaleIn">
            {/* FIRST-TIME SETUP FLOW */}
            {isFirstTimeSetup ? (
              <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-b from-sky-950/40 to-slate-900/90 p-4 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                      <QrCode size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white">Google Authenticator Setup</h3>
                      <p className="text-[10px] text-sky-300">Scan QR to connect admin account</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    Setup Required
                  </span>
                </div>

                {/* QR Code */}
                {qrCodeUrl && (
                  <div className="flex flex-col items-center justify-center my-3">
                    <div className="rounded-2xl bg-white p-2.5 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                      <img
                        src={qrCodeUrl}
                        alt="Google Authenticator QR Code"
                        className="h-36 w-36 sm:h-40 sm:w-40 object-contain"
                      />
                    </div>
                    <span className="mt-2 text-[10px] font-semibold text-slate-300">
                      {lang === 'ar'
                        ? 'امسح هذا الرمز بكاميرا تطبيق Google Authenticator'
                        : 'Scan this QR code with Google Authenticator'}
                    </span>
                  </div>
                )}

                {/* Manual Key Section: "Can't scan? Enter this key manually" */}
                <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/80 p-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>
                      {lang === 'ar' ? 'تعذر المسح؟ أدخل المفتاح يدوياً:' : "Can't scan? Enter this key manually:"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(totpSecret)
                        }
                        setCopiedKey(true)
                        setTimeout(() => setCopiedKey(false), 2000)
                      }}
                      className="flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 cursor-pointer"
                    >
                      <Copy size={11} />
                      <span>{copiedKey ? (lang === 'ar' ? 'تم النسخ ✓' : 'Copied ✓') : (lang === 'ar' ? 'نسخ' : 'Copy Key')}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs font-black tracking-widest text-sky-200 select-all text-center bg-black/40 py-1.5 rounded">
                    {totpSecret}
                  </div>
                </div>

              </div>
            ) : (
              /* RETURNING ADMIN LOGIN FLOW (No QR code, no secret exposed) */
              <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-b from-sky-950/40 to-slate-900/90 p-4 shadow-inner text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                  <Smartphone size={20} />
                </div>
                <h3 className="text-sm font-black text-white">Google Authenticator (2FA)</h3>
                <p className="mt-1 text-xs text-slate-300">
                  {useBackupCode
                    ? (lang === 'ar'
                        ? 'أدخل أحد رموز الاسترداد الاحتياطية المكونة من 8 خانات التي تم حفظها مسبقاً.'
                        : 'Enter one of your 8-character backup recovery codes saved during initial setup.')
                    : (lang === 'ar'
                        ? 'أدخل الرمز المكون من 6 أرقام الظاهر حالياً في تطبيق Google Authenticator على هاتفك.'
                        : 'Enter the 6-digit code currently shown in your Google Authenticator app.')}
                </p>
              </div>
            )}

            {/* Verification Inputs: 6-Digit TOTP OR Backup Code */}
            {useBackupCode ? (
              <div className="space-y-2 pt-1">
                <div className="text-center">
                  <label className="text-xs font-medium text-slate-300">
                    {lang === 'ar' ? 'رمز الاسترداد الاحتياطي (8 خانات):' : 'Backup Recovery Code (8 chars):'}
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="XXXX-XXXX"
                  value={backupCodeInput}
                  onChange={(e) => {
                    setBackupCodeInput(e.target.value.toUpperCase())
                    setErrorMsg('')
                  }}
                  autoFocus
                  className="w-full h-12 rounded-xl border border-amber-400/40 bg-slate-900/90 px-4 text-center font-mono text-lg font-black text-amber-300 tracking-widest uppercase focus:border-amber-400 focus:outline-none shadow-inner"
                  maxLength={12}
                />
              </div>
            ) : (
              <>
                {/* Instruction prompt above inputs */}
                <div className="text-center pt-1">
                  <p className="text-xs font-medium text-slate-300">
                    {isFirstTimeSetup
                      ? (lang === 'ar'
                          ? 'أدخل الرمز المكون من 6 أرقام لتأكيد التفعيل وحفظ المفتاح:'
                          : 'Enter the 6-digit code from Authenticator to confirm setup:')
                      : (lang === 'ar'
                          ? 'رمز الأمان (6 أرقام):'
                          : 'Security Code (6 digits):')}
                  </p>
                </div>

                {/* 6 Digit Numeric Inputs */}
                <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste} dir="ltr">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className={`h-12 w-11 sm:h-14 sm:w-12 rounded-xl border text-center text-lg sm:text-xl font-mono font-black transition ${
                        digit
                          ? 'border-sky-400 bg-sky-950/50 text-white shadow-md shadow-sky-500/20'
                          : 'border-white/15 bg-slate-900/80 text-slate-200 focus:border-sky-400 focus:outline-none'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Toggle between TOTP and Backup Code (For returning admins) */}
            {!isFirstTimeSetup && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode)
                    setErrorMsg('')
                  }}
                  className="text-[11px] text-sky-400 hover:text-sky-300 underline underline-offset-2 transition cursor-pointer"
                >
                  {useBackupCode
                    ? (lang === 'ar' ? 'الرجوع لاستخدام رمز Google Authenticator' : 'Use Google Authenticator code instead')
                    : (lang === 'ar' ? 'فقدت هاتفك؟ استخدام رمز استرداد احتياطي' : 'Lost your phone? Use a backup recovery code')}
                </button>
              </div>
            )}

            {/* Expiration Timer */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                {lang === 'ar' ? 'تنتهي صلاحية الجلسة خلال:' : 'Session expires in:'}{' '}
                <span className="font-mono font-bold text-amber-400">{formatTimer(countdown)}</span>
              </span>
              <span className="text-[10px] text-slate-500">Max 5 attempts</span>
            </div>

            {/* Submit 2FA Button */}
            <button
              type="button"
              onClick={() => submit2FACode()}
              disabled={loading || (useBackupCode ? !backupCodeInput.trim() : digits.join('').length !== 6)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{lang === 'ar' ? 'جارٍ التحقق...' : 'Verifying...'}</span>
                </span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>
                    {isFirstTimeSetup
                      ? (lang === 'ar' ? 'تأكيد التفعيل والدخول' : 'Confirm & Enable 2FA')
                      : (lang === 'ar' ? 'تأكيد الرمز والدخول' : 'Verify & Sign In')}
                  </span>
                </>
              )}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => {
                setIs2FAMode(false)
                setErrorMsg('')
                setSuccessMsg('')
              }}
              className="flex w-full items-center justify-center gap-1 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft size={13} className={isRTL ? 'rotate-180' : ''} />
              <span>{lang === 'ar' ? 'الرجوع إلى صفحة تسجيل الدخول' : 'Back to Login'}</span>
            </button>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: STANDARD LOGIN & SIGNUP TABS                     */
          /* ======================================================== */
          <>
            {/* Tab Switcher */}
            <div className="mb-6 flex rounded-xl bg-slate-900/80 p-1 border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login')
                  setErrorMsg('')
                }}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup')
                  setErrorMsg('')
                }}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'حساب جديد' : 'Sign Up'}
              </button>
            </div>

            {/* GOOGLE SIGN IN BUTTON */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white py-3 px-4 text-xs sm:text-sm font-black text-slate-950 shadow-md transition hover:bg-slate-100 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {googleLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>
                  {googleLoading
                    ? lang === 'ar'
                      ? 'جارٍ الاتصال بـ Google...'
                      : 'Connecting to Google...'
                    : activeTab === 'signup'
                    ? lang === 'ar'
                      ? 'التسجيل السريع بحساب Google'
                      : 'Sign up with Google'
                    : lang === 'ar'
                      ? 'الدخول المباشر بحساب Google'
                      : 'Sign in with Google'}
                </span>
              </button>

              {/* Optional Config Box for Admin/Owner Google OAuth Client ID */}
              {/* Subtle Setup Link for Site Owner */}
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowGoogleConfig(!showGoogleConfig)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-sky-400 transition cursor-pointer"
                >
                  <Settings size={12} className="text-sky-400" />
                  <span>
                    {lang === 'ar'
                      ? '⚙️ إعداد Google Client ID الخاص بك'
                      : '⚙️ Configure Your Google Client ID'}
                  </span>
                </button>
              </div>

              {showGoogleConfig && (
                <div className="mt-3 rounded-2xl border border-sky-500/30 bg-sky-950/60 p-4 text-xs animate-fadeIn shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sky-300 flex items-center gap-1.5">
                      <Settings size={13} className="text-sky-400" />
                      <span>{lang === 'ar' ? 'إعداد Google OAuth 2.0 Client ID' : 'Google OAuth 2.0 Client ID Setup'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGoogleConfig(false)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
                    {lang === 'ar'
                      ? 'لحل خطأ (Error 401: invalid_client)، أنشئ معرف مجاني من Google Cloud Console والصقه هنا:'
                      : 'To fix (Error 401: invalid_client), create a free client ID in Google Cloud Console and paste it here:'}
                  </p>

                  <div className="mb-2.5 rounded-lg bg-black/50 border border-white/10 p-2 text-[10px] text-slate-400 leading-normal space-y-1">
                    <div>
                      <span className="text-sky-400 font-bold">1. </span>
                      {lang === 'ar' ? 'افتح:' : 'Open:'}{' '}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300 underline font-mono"
                      >
                        console.cloud.google.com/apis/credentials
                      </a>
                    </div>
                    <div>
                      <span className="text-sky-400 font-bold">2. </span>
                      {lang === 'ar' ? 'أضف في Authorized JavaScript origins:' : 'Add to Authorized JavaScript origins:'}
                      <span className="block font-mono text-amber-300 font-bold bg-black/60 px-1.5 py-0.5 rounded mt-0.5 select-all">
                        https://bleuwi-world.pages.dev
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="xxxx.apps.googleusercontent.com"
                      value={customClientId}
                      onChange={(e) => setCustomClientId(e.target.value)}
                      className="flex-1 rounded-lg bg-black/70 border border-sky-500/40 px-2.5 py-2 text-[11px] text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          if (customClientId.trim()) {
                            localStorage.setItem('bleuwi_google_client_id', customClientId.trim())
                            setSuccessMsg(
                              lang === 'ar'
                                ? 'تم حفظ Client ID بنجاح! اضغط على زر Google للتسجيل الآن.'
                                : 'Client ID saved! Click Google button to sign in now.'
                            )
                          } else {
                            localStorage.removeItem('bleuwi_google_client_id')
                            setSuccessMsg(lang === 'ar' ? 'تمت استعادة الإعداد الافتراضي.' : 'Reset to default.')
                          }
                        }
                        setShowGoogleConfig(false)
                      }}
                      className="rounded-lg bg-sky-500 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-sky-400 transition cursor-pointer shrink-0"
                    >
                      {lang === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="grow border-t border-white/10" />
              <span className="shrink px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {lang === 'ar' ? 'أو عبر البريد الإلكتروني' : 'OR WITH EMAIL'}
              </span>
              <div className="grow border-t border-white/10" />
            </div>

            {/* LOGIN FORM */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or Username'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={lang === 'ar' ? 'اسم المستخدم أو البريد الإلكتروني' : 'name@example.com'}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-10 text-xs sm:text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:bg-slate-900 focus:outline-none"
                    />
                    <Mail
                      size={16}
                      className={`absolute top-3 text-slate-400 ${isRTL ? 'right-3.5' : 'left-3.5'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-10 text-xs sm:text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:bg-slate-900 focus:outline-none"
                    />
                    <Lock
                      size={16}
                      className={`absolute top-3 text-slate-400 ${isRTL ? 'right-3.5' : 'left-3.5'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-3 text-slate-400 transition hover:text-white cursor-pointer ${
                        isRTL ? 'left-3.5' : 'right-3.5'
                      }`}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-[11px] text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-400" />
                  <span>
                    {lang === 'ar'
                      ? 'محمي بنظام المصادقة الثنائية (+2FA). سيصلك رمز أمان بعد كلمة المرور.'
                      : 'Protected with Two-Factor Authentication (+2FA). One-time code requested upon login.'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>{lang === 'ar' ? 'جارٍ التحقق...' : 'Signing in...'}</span>
                    </span>
                  ) : (
                    <>
                      <span>{lang === 'ar' ? 'متابعة والدخول' : 'Continue'}</span>
                      <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      placeholder={lang === 'ar' ? 'الاسم واللقب' : 'Full Name'}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-9 text-xs sm:text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                    />
                    <User
                      size={15}
                      className={`absolute top-2.5 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      {lang === 'ar' ? 'اسم المستخدم' : 'Username'}
                    </label>
                    <input
                      type="text"
                      required
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="username"
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-xs sm:text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-3 text-xs sm:text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2 px-9 text-xs sm:text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none"
                    />
                    <Lock
                      size={15}
                      className={`absolute top-2.5 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-2.5 text-slate-400 transition hover:text-white cursor-pointer ${
                        isRTL ? 'left-3' : 'right-3'
                      }`}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 py-2.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>{lang === 'ar' ? 'جارٍ الإنشاء...' : 'Creating...'}</span>
                    </span>
                  ) : (
                    <>
                      <span>{lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}</span>
                      <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* Footer Guarantee */}
        <div className="mt-6 border-t border-white/5 pt-4 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>
              {lang === 'ar'
                ? 'تشفير PBKDF2 عالي الأمان ومصادقة ثنائية (+2FA)'
                : 'High-Entropy PBKDF2 & Two-Factor Authentication (+2FA)'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
