import { useState } from 'react'
import { Globe, Menu, Settings as SettingsIcon, X, Flame, Crown, Gem } from 'lucide-react'
import BrandMark from './BrandMark'
import VisitorCounter from './VisitorCounter'
import { useLanguage } from '../context/LanguageContext'

export default function Header({ onHomeClick, activeShowcase, onOpenSettings, onOpenWarranty }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang, t, isRTL } = useLanguage()

  const closeMenu = () => setMenuOpen(false)

  const handleNavClick = (e, target) => {
    closeMenu()
    if (activeShowcase && onHomeClick) {
      if (target === 'home') {
        e.preventDefault()
        onHomeClick()
      } else {
        onHomeClick()
      }
    }
  }

  const handleLogoClick = (e) => {
    closeMenu()
    if (activeShowcase && onHomeClick) {
      e.preventDefault()
      onHomeClick()
    }
  }

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05070d]/90 backdrop-blur-xl">
      {/* Top Trending Offers Announcement Bar */}
      <div className="border-b border-white/[0.06] bg-gradient-to-r from-amber-500/20 via-sky-500/15 to-purple-500/20 px-3 py-1 text-center">
        <a
          href="#hot-sellers"
          onClick={(e) => handleNavClick(e, 'hot-sellers')}
          className="group inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-amber-300 transition hover:text-white"
        >
          <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Flame size={11} className="text-amber-400 animate-pulse" />
            <span>{lang === 'ar' ? 'أقوى العروض' : 'TOP OFFERS'}</span>
          </span>
          <span className="text-white/95 font-medium truncate max-w-[210px] min-[420px]:max-w-[340px] sm:max-w-none">
            {lang === 'ar'
              ? '💎 فري فاير (60DH / 1$=10DH) · 🚗 قراند GTA V (200DH) · 🤠 ريد ديد (250DH) · ⚽ فيفا (200DH) · 🚀 دسكورد (70DH) · 🎬 كاب كات (90DH)'
              : '💎 Free Fire (60DH / 1$=10DH) · 🚗 GTA V (200DH) · 🤠 RDR2 (250DH) · ⚽ FIFA (200DH) · 🚀 Discord (70DH) · 🎬 CapCut (90DH)'}
          </span>
          <span className="hidden min-[500px]:inline-block rounded-md bg-amber-400/30 px-1.5 py-0.5 text-[10px] text-amber-200 font-bold group-hover:bg-white group-hover:text-slate-950 transition-colors">
            {lang === 'ar' ? 'اطلب الآن ←' : 'Order Now →'}
          </span>
        </a>
      </div>

      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          href="#home"
          onClick={handleLogoClick}
          aria-label="BLEUWI WORLD home"
        >
          <BrandMark size="small" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.14em] sm:tracking-[0.18em] text-white">
            BLEUWI <span className="text-sky-300">WORLD</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <a
            className="nav-link cursor-pointer"
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
          >
            {t('navHome')}
          </a>
          <a
            className="nav-link cursor-pointer flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
            href="#hot-sellers"
            onClick={(e) => handleNavClick(e, 'hot-sellers')}
          >
            <Flame size={14} className="text-amber-400 animate-pulse" />
            <span>{lang === 'ar' ? 'الأكثر مبيعاً' : 'Hot Sellers'}</span>
          </a>
          <a
            className="nav-link cursor-pointer flex items-center gap-1.5 text-amber-300 hover:text-amber-100"
            href="#hot-sellers"
            onClick={(e) => handleNavClick(e, 'hot-sellers')}
            title="Free Fire 1$ = 10 DH"
          >
            <Gem size={13} className="text-amber-400 animate-bounce" />
            <span>{lang === 'ar' ? 'فري فاير 💎' : 'Free Fire 💎'}</span>
            <span className="rounded bg-amber-400/20 px-1 text-[9px] font-mono text-amber-300">1$=10DH</span>
          </a>
          <button
            type="button"
            className="nav-link cursor-pointer flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition"
            onClick={onOpenWarranty}
          >
            <Crown size={14} className="text-amber-400" />
            <span>{lang === 'ar' ? 'الضمان الذهبي' : 'Golden Warranty'}</span>
          </button>
          <a
            className="nav-link cursor-pointer"
            href="#payments"
            onClick={(e) => handleNavClick(e, 'payments')}
          >
            {lang === 'ar' ? 'طرق الدفع' : 'Payments'}
          </a>
          <a
            className="nav-link cursor-pointer"
            href="#reviews"
            onClick={(e) => handleNavClick(e, 'reviews')}
          >
            {lang === 'ar' ? 'التقييمات' : 'Reviews'}
          </a>
          <a
            className="nav-link cursor-pointer"
            href="#links"
            onClick={(e) => handleNavClick(e, 'links')}
          >
            {t('navLinks')}
          </a>
        </nav>

        {/* Action Controls: Visitor Counter + Language toggle + Settings + Explore */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Live Visitor Counter Badge */}
          <VisitorCounter compact={true} />

          {/* Quick Language Switcher Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe size={13} className="text-sky-400" />
            <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white cursor-pointer"
            title={t('navSettings')}
          >
            <SettingsIcon size={14} className="text-sky-300" />
            <span>{t('navSettings')}</span>
          </button>

        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
          <VisitorCounter compact={true} />
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-sky-200 cursor-pointer"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 sm:p-2 text-slate-200 cursor-pointer"
            aria-label="Settings"
          >
            <SettingsIcon size={17} />
          </button>
          <button
            className="inline-flex rounded-lg p-1.5 sm:p-2 text-slate-200 transition hover:bg-white/[0.08] cursor-pointer"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav id="mobile-menu" className="border-t border-white/[0.06] bg-[#080b14] px-6 py-5 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <a
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
            >
              {t('navHome')}
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-amber-300 transition hover:bg-white/[0.06] hover:text-amber-200 cursor-pointer"
              href="#hot-sellers"
              onClick={(e) => handleNavClick(e, 'hot-sellers')}
            >
              <Flame size={15} className="text-amber-400 animate-pulse" />
              <span>{lang === 'ar' ? 'الأكثر مبيعاً (الألعاب)' : 'Hot Sellers (Games)'}</span>
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-amber-300 transition hover:bg-white/[0.06] hover:text-amber-200 cursor-pointer"
              href="#hot-sellers"
              onClick={(e) => handleNavClick(e, 'hot-sellers')}
            >
              <Gem size={15} className="text-amber-400 animate-bounce" />
              <span>{lang === 'ar' ? 'جواهر فري فاير (1$ = 10 DH)' : 'Free Fire Diamonds (1$ = 10 DH)'}</span>
            </a>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-amber-300 transition hover:bg-white/[0.06] hover:text-amber-200 cursor-pointer text-left w-full"
              onClick={() => {
                closeMenu()
                if (onOpenWarranty) onOpenWarranty()
              }}
            >
              <Crown size={16} className="text-amber-400" />
              <span>{lang === 'ar' ? 'الضمان الذهبي 100%' : '100% Golden Warranty'}</span>
            </button>
            <a
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
              href="#payments"
              onClick={(e) => handleNavClick(e, 'payments')}
            >
              {lang === 'ar' ? 'طرق الدفع' : 'Payments'}
            </a>
            <a
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
              href="#reviews"
              onClick={(e) => handleNavClick(e, 'reviews')}
            >
              {lang === 'ar' ? 'التقييمات' : 'Reviews'}
            </a>
            <a
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
              href="#links"
              onClick={(e) => handleNavClick(e, 'links')}
            >
              {t('navLinks')}
            </a>
            <button
              type="button"
              onClick={() => {
                closeMenu()
                onOpenSettings()
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-sky-300 transition hover:bg-white/[0.06] cursor-pointer"
            >
              <SettingsIcon size={16} />
              <span>{t('navSettings')}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
