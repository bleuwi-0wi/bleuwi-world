import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

const detectInitialLanguage = () => {
  try {
    const saved = localStorage.getItem('bleuwi_language')
    if (saved === 'ar' || saved === 'en') return saved

    const navLangs = navigator.languages || [navigator.language || '']
    const hasArabic = navLangs.some((l) => l && l.toLowerCase().startsWith('ar'))
    if (hasArabic) return 'ar'
  } catch {
    // fallback
  }
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLanguage)

  const [particlesEnabled, setParticlesEnabledState] = useState(() => {
    try {
      const val = localStorage.getItem('bleuwi_particles')
      return val !== null ? val === 'true' : true
    } catch {
      return true
    }
  })

  const [customCursorEnabled, setCustomCursorEnabledState] = useState(() => {
    try {
      const val = localStorage.getItem('bleuwi_cursor')
      return val !== null ? val === 'true' : true
    } catch {
      return true
    }
  })

  const setLang = (newLang) => {
    if (newLang !== 'ar' && newLang !== 'en') return
    setLangState(newLang)
    try {
      localStorage.setItem('bleuwi_language', newLang)
    } catch {
      // ignore
    }
  }

  const setParticlesEnabled = (enabled) => {
    setParticlesEnabledState(enabled)
    try {
      localStorage.setItem('bleuwi_particles', String(enabled))
    } catch {
      // ignore
    }
  }

  const setCustomCursorEnabled = (enabled) => {
    setCustomCursorEnabledState(enabled)
    try {
      localStorage.setItem('bleuwi_cursor', String(enabled))
    } catch {
      // ignore
    }
  }

  // Sync RTL and lang attribute on document
  useEffect(() => {
    const isRTL = lang === 'ar'
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    if (isRTL) {
      document.body.classList.add('font-arabic')
    } else {
      document.body.classList.remove('font-arabic')
    }
  }, [lang])

  const t = (key) => {
    const dict = translations[lang] || translations.en
    return dict[key] || translations.en[key] || key
  }

  const value = {
    lang,
    setLang,
    t,
    isRTL: lang === 'ar',
    particlesEnabled,
    setParticlesEnabled,
    customCursorEnabled,
    setCustomCursorEnabled,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
