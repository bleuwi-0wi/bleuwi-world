import { useEffect } from 'react'
import { Check, Globe, MousePointer, Sparkles, X, Settings as SettingsIcon } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function SettingsModal({ isOpen, onClose }) {
  const {
    lang,
    setLang,
    t,
    isRTL,
    particlesEnabled,
    setParticlesEnabled,
    customCursorEnabled,
    setCustomCursorEnabled,
  } = useLanguage()

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-sky-400/30 bg-[#070b14] p-6 text-white shadow-2xl shadow-sky-950 sm:p-7 z-10 my-auto animate-fade-up"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
              <SettingsIcon size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {t('settingsTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('settingsSubtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Options */}
        <div className="relative mt-5 space-y-5">
          {/* 1. Language Switcher */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <Globe size={15} className="text-sky-400" />
              <span>{t('langSectionTitle')}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              {t('langAutoDetected')}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {/* English */}
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center justify-between gap-2 rounded-xl border p-3 text-left transition cursor-pointer ${
                  lang === 'en'
                    ? 'border-sky-400 bg-sky-400/15 text-white font-semibold shadow-md shadow-sky-500/15'
                    : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🇬🇧</span>
                  <div>
                    <p className="text-xs font-bold text-white">English</p>
                    <p className="text-[10px] text-slate-400">Default (LTR)</p>
                  </div>
                </div>
                {lang === 'en' && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-sky-400 text-slate-950">
                    <Check size={12} />
                  </span>
                )}
              </button>

              {/* Arabic */}
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`flex items-center justify-between gap-2 rounded-xl border p-3 text-left transition cursor-pointer ${
                  lang === 'ar'
                    ? 'border-emerald-400 bg-emerald-400/15 text-white font-semibold shadow-md shadow-emerald-500/15'
                    : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🇲🇦</span>
                  <div>
                    <p className="text-xs font-bold text-white">العربية</p>
                    <p className="text-[10px] text-slate-400">Arabic (RTL)</p>
                  </div>
                </div>
                {lang === 'ar' && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400 text-slate-950">
                    <Check size={12} />
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 2. Visual Effects: Particles */}
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-400">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {t('particlesToggleTitle')}
                </h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t('particlesToggleDesc')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setParticlesEnabled(!particlesEnabled)}
              className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                particlesEnabled ? 'bg-sky-400' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={particlesEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition duration-200 ease-in-out ${
                  particlesEnabled
                    ? (isRTL ? '-translate-x-6' : 'translate-x-6')
                    : (isRTL ? '-translate-x-1' : 'translate-x-1')
                }`}
              />
            </button>
          </div>

          {/* 3. Visual Effects: Smooth Mouse Cursor */}
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-400">
                <MousePointer size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {t('cursorToggleTitle')}
                </h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t('cursorToggleDesc')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCustomCursorEnabled(!customCursorEnabled)}
              className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                customCursorEnabled ? 'bg-sky-400' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={customCursorEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition duration-200 ease-in-out ${
                  customCursorEnabled
                    ? (isRTL ? '-translate-x-6' : 'translate-x-6')
                    : (isRTL ? '-translate-x-1' : 'translate-x-1')
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative mt-6 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-sky-300 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-400/20 transition hover:from-sky-300 hover:to-white cursor-pointer"
          >
            {t('settingsSaveBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
