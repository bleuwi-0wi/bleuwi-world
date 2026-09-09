import { useState } from 'react'
import { Globe, Menu, Settings as SettingsIcon, X, Flame, ShieldCheck, ShoppingBag, Coins } from 'lucide-react'
import BrandMark from './BrandMark'
import { useLanguage } from '../context/LanguageContext'
import { useShop, CURRENCY_RATES } from '../context/ShopContext'
import { WHATSAPP_DIRECT_LINK } from '../data/links'

export default function Header({ onHomeClick, activeShowcase, onOpenSettings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang, t, isRTL } = useLanguage()
  const { currency, setCurrency, totalItemsCount, openCart } = useShop()

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

  const cycleCurrency = () => {
    const order = ['MAD', 'USD', 'EUR']
    const nextIdx = (order.indexOf(currency) + 1) % order.length
    setCurrency(order[nextIdx])
  }

  const currentCurrConf = CURRENCY_RATES[currency] || CURRENCY_RATES.MAD

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05070d]/90 backdrop-blur-xl">
      {/* Top 24/7 Service & 100% Guarantee Announcement Bar */}
      <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/15 via-amber-500/15 to-sky-500/15 px-3 py-1.5 text-center shadow-[0_1px_15px_rgba(16,185,129,0.1)]">
        <a
          href={WHATSAPP_DIRECT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-amber-300 transition hover:text-white"
        >
          <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 px-2 py-0.5 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>24/7 ONLINE</span>
          </span>
          <span className="text-white/95 font-extrabold tracking-wide">
            {lang === 'ar'
              ? '⚡ نعمل 24/7 مع ضمان 100% (استبدال فوري ودعم فني متواصل)'
              : '⚡ WE WORK 24/7 WITH 100% GUARANTEE (Instant Swap & 24/7 Support)'}
          </span>
          <span className="hidden min-[620px]:inline-block rounded-md bg-emerald-400/25 border border-emerald-400/40 px-2 py-0.5 text-[10px] text-emerald-200 font-bold group-hover:bg-white group-hover:text-slate-950 transition-colors">
            {lang === 'ar' ? 'تواصل عبر واتساب ←' : 'Chat on WhatsApp →'}
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

        {/* Desktop Action Controls: Currency + Cart + Language + Settings */}
        <div className="hidden items-center gap-2.5 md:flex">
          {/* Currency Switcher Pill */}
          <button
            type="button"
            onClick={cycleCurrency}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white cursor-pointer"
            title={lang === 'ar' ? `العملة الحالية: ${currency} (انقر للتبديل)` : `Currency: ${currency} (click to cycle)`}
          >
            <span className="text-sm">{currentCurrConf.flag}</span>
            <span className="font-bold">{currency}</span>
          </button>

          {/* Cart Drawer Trigger Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1.5 text-xs font-bold text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/25 hover:text-white cursor-pointer shadow-sm shadow-sky-500/10"
            title={lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={14} className="text-sky-300" />
            <span>{lang === 'ar' ? 'السلة' : 'Cart'}</span>
            {totalItemsCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 shadow-md animate-scaleIn">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Quick Language Switcher Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe size={13} className="text-sky-400" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white cursor-pointer"
            title={t('navSettings')}
          >
            <SettingsIcon size={14} className="text-sky-300" />
          </button>
        </div>

        {/* Mobile controls: Currency + Cart + Language + Settings + Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
          {/* Mobile Currency toggle */}
          <button
            type="button"
            onClick={cycleCurrency}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-bold text-slate-200 cursor-pointer flex items-center gap-1"
            title="Switch Currency"
          >
            <span>{currentCurrConf.flag}</span>
            <span>{currency}</span>
          </button>

          {/* Mobile Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-lg border border-sky-400/30 bg-sky-500/15 p-1.5 text-sky-200 cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={17} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 shadow-md">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Language Button */}
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
                openCart()
              }}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-emerald-300 transition hover:bg-white/[0.06] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} />
                <span>{lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-xs text-emerald-200 font-bold">
                {totalItemsCount}
              </span>
            </button>
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
