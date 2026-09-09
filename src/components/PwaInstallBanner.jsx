import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const { lang, isRTL } = useLanguage()

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    // Show native install prompt
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  if (!deferredPrompt || isDismissed) return null

  return (
    <div 
      className="fixed top-20 inset-x-3 sm:inset-x-auto sm:right-6 sm:left-auto z-40 max-w-md w-full transition-all duration-300 animate-slideDown"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-400/40 bg-[#080d1a]/95 p-3.5 shadow-2xl backdrop-blur-xl shadow-sky-950/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-slate-950 shadow-md">
            <Smartphone size={20} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-white truncate">
                {lang === 'ar' ? 'تثبيت تطبيق BLEUWI WORLD' : 'Install BLEUWI WORLD App'}
              </p>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {lang === 'ar' ? 'تصفح أسرع وشاشة كاملة بدون متصفح' : 'Fast standalone experience on your device'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-sky-400 to-sky-300 px-3 py-1.5 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-white transition cursor-pointer shadow-md shadow-sky-400/20"
          >
            <Download size={13} className="stroke-[2.5]" />
            <span>{lang === 'ar' ? 'تثبيت' : 'Install'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="rounded-lg p-1 text-slate-500 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
            aria-label="Dismiss install banner"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
