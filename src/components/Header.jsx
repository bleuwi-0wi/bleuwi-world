import { useState, useEffect } from 'react'
import {
  Globe,
  Menu,
  Settings as SettingsIcon,
  X,
  Flame,
  ShieldCheck,
  ShoppingBag,
  Coins,
  BookOpen,
  Gem,
  HelpCircle,
  User,
  Shield,
  LogOut,
  Package,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react'
import BrandMark from './BrandMark'
import { useLanguage } from '../context/LanguageContext'
import { useShop, CURRENCY_RATES } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { WHATSAPP_DIRECT_LINK } from '../data/links'
import { api } from '../services/api'

export default function Header({ onHomeClick, activeShowcase, onOpenSettings, onOpenAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [liveBannerText, setLiveBannerText] = useState('')

  const { lang, setLang, t, isRTL } = useLanguage()
  const { currency, setCurrency, totalItemsCount, openCart } = useShop()
  const { user, isAdmin, logout, openAuthModal, openUserOrdersModal } = useAuth()

  // Fetch live announcement override if set by admin
  useEffect(() => {
    api.getSettings().then((settings) => {
      if (settings) {
        const key = `banner_announcement_${lang}`
        if (settings[key]) {
          setLiveBannerText(settings[key])
        }
      }
    }).catch(() => {})
  }, [lang])

  const closeMenu = () => {
    setMenuOpen(false)
    setUserDropdownOpen(false)
  }

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

  const LANG_CONFIG = {
    ar: { label: 'العربية', code: 'عربي', flag: '🇲🇦' },
    en: { label: 'English', code: 'EN', flag: '🇬🇧' },
    fr: { label: 'Français', code: 'FR', flag: '🇫🇷' },
    es: { label: 'Español', code: 'ES', flag: '🇪🇸' },
  }

  const cycleLanguage = () => {
    const order = ['ar', 'en', 'fr', 'es']
    const nextIdx = (order.indexOf(lang) + 1) % order.length
    setLang(order[nextIdx])
  }

  const cycleCurrency = () => {
    const order = ['MAD', 'USD', 'EUR']
    const nextIdx = (order.indexOf(currency) + 1) % order.length
    setCurrency(order[nextIdx])
  }

  const currentCurrConf = CURRENCY_RATES[currency] || CURRENCY_RATES.MAD

  const defaultBanner =
    lang === 'ar'
      ? '⚡ نعمل 24/7 مع ضمان 100% (استبدال فوري ودعم فني متواصل)'
      : lang === 'fr'
      ? '⚡ SERVICE 24/7 AVEC GARANTIE OR 100% (Remplacement immédiat & support)'
      : lang === 'es'
      ? '⚡ SERVICIO 24/7 CON GARANTÍA DORADA 100% (Reemplazo instantáneo & soporte)'
      : '⚡ WE WORK 24/7 WITH 100% GUARANTEE (Instant Swap & 24/7 Support)'

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
            {liveBannerText || defaultBanner}
          </span>
          <span className="hidden min-[620px]:inline-block rounded-md bg-emerald-400/25 border border-emerald-400/40 px-2 py-0.5 text-[10px] text-emerald-200 font-bold group-hover:bg-white group-hover:text-slate-950 transition-colors">
            {lang === 'ar' ? 'تواصل عبر واتساب ←' : lang === 'fr' ? 'WhatsApp Direct ←' : lang === 'es' ? 'WhatsApp Directo ←' : 'Chat on WhatsApp →'}
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
        <nav className="hidden items-center gap-6 lg:gap-7 md:flex" aria-label="Primary navigation">
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
            <span>{lang === 'ar' ? 'الأكثر مبيعاً' : lang === 'fr' ? 'Top Ventes' : lang === 'es' ? 'Más Vendidos' : 'Hot Sellers'}</span>
          </a>
          <a
            className="nav-link cursor-pointer flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
            href="#diamond-calculator"
            onClick={(e) => handleNavClick(e, 'diamond-calculator')}
          >
            <Gem size={14} className="text-amber-400" />
            <span>{lang === 'ar' ? 'حاسبة فري فاير' : lang === 'fr' ? 'Calculateur FF' : lang === 'es' ? 'Calculadora FF' : 'FF Calculator'}</span>
          </a>
          <a
            className="nav-link cursor-pointer flex items-center gap-1.5 text-sky-300 hover:text-sky-200"
            href="#windows-advisor"
            onClick={(e) => handleNavClick(e, 'windows-advisor')}
          >
            <ShieldCheck size={14} className="text-sky-400" />
            <span>{lang === 'ar' ? 'مستشار ويندوز' : lang === 'fr' ? 'Conseiller Clés' : lang === 'es' ? 'Asesor Claves' : 'Key Advisor'}</span>
          </a>
          <a
            className="nav-link cursor-pointer"
            href="#payments"
            onClick={(e) => handleNavClick(e, 'payments')}
          >
            {lang === 'ar' ? 'طرق الدفع' : lang === 'fr' ? 'Paiements' : lang === 'es' ? 'Pagos' : 'Payments'}
          </a>
          <a
            className="nav-link cursor-pointer flex items-center gap-1.5 text-slate-300 hover:text-white"
            href="#faq-section"
            onClick={(e) => handleNavClick(e, 'faq-section')}
          >
            <HelpCircle size={14} className="text-sky-400" />
            <span>{lang === 'ar' ? 'الأسئلة الشائعة' : lang === 'fr' ? 'FAQ' : lang === 'es' ? 'Preguntas' : 'FAQ'}</span>
          </a>
          <a
            className="nav-link cursor-pointer"
            href="#reviews"
            onClick={(e) => handleNavClick(e, 'reviews')}
          >
            {lang === 'ar' ? 'التقييمات' : lang === 'fr' ? 'Avis' : lang === 'es' ? 'Opiniones' : 'Reviews'}
          </a>
          <a
            className="nav-link cursor-pointer"
            href="#links"
            onClick={(e) => handleNavClick(e, 'links')}
          >
            {t('navLinks')}
          </a>
        </nav>

        {/* Desktop Action Controls: Auth + Currency + Cart + Language + Settings */}
        <div className="hidden items-center gap-2.5 md:flex">
          {/* User Auth Button / Dropdown */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/15 py-1.5 pl-2 pr-3 text-xs font-bold text-sky-200 transition hover:bg-sky-500/25 hover:text-white cursor-pointer shadow-sm shadow-sky-500/10"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-slate-950 font-black text-[11px]">
                  {(user.fullName || user.username || 'U')[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.fullName || user.username}</span>
                {isAdmin ? (
                  <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-1.5 py-0.2 text-[9px] text-purple-300 font-black">
                    ADMIN
                  </span>
                ) : (
                  <ChevronDown size={12} className="text-slate-400" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/95 p-2 shadow-2xl backdrop-blur-2xl animate-scaleIn z-50"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="text-xs font-black text-white">{user.fullName || user.username}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">
                        {user.balance || 0} {currency}
                      </span>
                      <span className="text-sky-300 capitalize font-medium">{user.role}</span>
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          if (onOpenAdmin) onOpenAdmin()
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/15 cursor-pointer"
                      >
                        <LayoutDashboard size={14} className="text-amber-400" />
                        <span>{lang === 'ar' ? 'لوحة تحكم الأدمن' : 'Admin Dashboard'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        openUserOrdersModal()
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                      <Package size={14} className="text-sky-400" />
                      <span>{lang === 'ar' ? 'طلباتي السابقة' : 'My Orders'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/15 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-gradient-to-r from-sky-500/20 to-blue-600/20 px-3.5 py-1.5 text-xs font-bold text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/30 hover:text-white cursor-pointer shadow-sm shadow-sky-500/10"
            >
              <User size={13} className="text-sky-300" />
              <span>{lang === 'ar' ? 'دخول / تسجيل' : 'Sign In'}</span>
            </button>
          )}

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

          {/* Quick Language Switcher Button (AR, EN, FR, ES) */}
          <button
            type="button"
            onClick={cycleLanguage}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white cursor-pointer"
            title={LANG_CONFIG[lang]?.label || 'Language'}
          >
            <span className="text-sm">{LANG_CONFIG[lang]?.flag || '🌐'}</span>
            <span className="font-bold">{LANG_CONFIG[lang]?.code || 'LANG'}</span>
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

        {/* Mobile controls: Auth + Currency + Cart + Language + Settings + Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
          {/* Mobile Auth Button */}
          {user ? (
            <button
              type="button"
              onClick={() => {
                if (isAdmin && onOpenAdmin) {
                  onOpenAdmin()
                } else {
                  openUserOrdersModal()
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-slate-950 font-black text-[11px] shadow-sm"
              title={user.fullName || user.username}
            >
              {(user.fullName || user.username || 'U')[0].toUpperCase()}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="rounded-lg border border-sky-400/30 bg-sky-500/15 p-1.5 text-sky-200 cursor-pointer"
              title="Sign In"
            >
              <User size={15} />
            </button>
          )}

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
            onClick={cycleLanguage}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-sky-200 cursor-pointer flex items-center gap-1"
            title={LANG_CONFIG[lang]?.label}
          >
            <span>{LANG_CONFIG[lang]?.flag}</span>
            <span>{LANG_CONFIG[lang]?.code}</span>
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
            {/* User status card on top of mobile menu */}
            {user ? (
              <div className="mb-3 rounded-xl border border-sky-400/20 bg-sky-950/40 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{user.fullName || user.username}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-2 py-0.5 text-[10px] text-purple-300 font-black">
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu()
                        if (onOpenAdmin) onOpenAdmin()
                      }}
                      className="flex-1 rounded-lg bg-amber-500/20 border border-amber-400/40 py-1.5 text-center text-xs font-bold text-amber-300"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu()
                      openUserOrdersModal()
                    }}
                    className="flex-1 rounded-lg bg-sky-500/20 border border-sky-400/40 py-1.5 text-center text-xs font-bold text-sky-300"
                  >
                    My Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu()
                      logout()
                    }}
                    className="rounded-lg bg-rose-500/20 border border-rose-400/40 px-3 py-1.5 text-center text-xs font-bold text-rose-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  openAuthModal('login')
                }}
                className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 cursor-pointer"
              >
                <User size={15} />
                <span>{lang === 'ar' ? 'تسجيل الدخول / حساب جديد' : 'Sign In / Register'}</span>
              </button>
            )}

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
              <span>{lang === 'ar' ? 'الأكثر مبيعاً' : lang === 'fr' ? 'Top Ventes' : lang === 'es' ? 'Más Vendidos' : 'Hot Sellers'}</span>
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-amber-400 transition hover:bg-white/[0.06] hover:text-amber-300 cursor-pointer"
              href="#diamond-calculator"
              onClick={(e) => handleNavClick(e, 'diamond-calculator')}
            >
              <Gem size={15} className="text-amber-400" />
              <span>{lang === 'ar' ? 'حاسبة فري فاير' : lang === 'fr' ? 'Calculateur FF' : lang === 'es' ? 'Calculadora FF' : 'FF Calculator'}</span>
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-sky-300 transition hover:bg-white/[0.06] hover:text-sky-200 cursor-pointer"
              href="#windows-advisor"
              onClick={(e) => handleNavClick(e, 'windows-advisor')}
            >
              <ShieldCheck size={15} className="text-sky-400" />
              <span>{lang === 'ar' ? 'مستشار ويندوز' : lang === 'fr' ? 'Conseiller Clés' : lang === 'es' ? 'Asesor Claves' : 'Windows Key Advisor'}</span>
            </a>
            <a
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
              href="#payments"
              onClick={(e) => handleNavClick(e, 'payments')}
            >
              {lang === 'ar' ? 'طرق الدفع' : lang === 'fr' ? 'Paiements' : lang === 'es' ? 'Pagos' : 'Payments'}
            </a>
            <a
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
              href="#faq-section"
              onClick={(e) => handleNavClick(e, 'faq-section')}
            >
              <HelpCircle size={15} className="text-sky-400" />
              <span>{lang === 'ar' ? 'الأسئلة الشائعة' : lang === 'fr' ? 'FAQ' : lang === 'es' ? 'Preguntas Frecuentes' : 'FAQ'}</span>
            </a>
            <a
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white cursor-pointer"
              href="#reviews"
              onClick={(e) => handleNavClick(e, 'reviews')}
            >
              {lang === 'ar' ? 'التقييمات' : lang === 'fr' ? 'Avis' : lang === 'es' ? 'Opiniones' : 'Reviews'}
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
