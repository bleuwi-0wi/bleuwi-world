import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

const SUPPORTED_LANGS = ['ar', 'en', 'fr', 'es']

const detectInitialLanguage = () => {
  try {
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get('lang')
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang

    const saved = localStorage.getItem('bleuwi_language')
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved

    const navLangs = navigator.languages || [navigator.language || '']
    for (const l of navLangs) {
      if (!l) continue
      const lower = l.toLowerCase()
      if (lower.startsWith('ar')) return 'ar'
      if (lower.startsWith('fr')) return 'fr'
      if (lower.startsWith('es')) return 'es'
      if (lower.startsWith('en')) return 'en'
    }
  } catch {
    // fallback
  }
  return 'ar' // Default to Arabic as primary Moroccan store language
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
    if (!SUPPORTED_LANGS.includes(newLang)) return
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
