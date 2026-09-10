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
  Home,
  Star,
  CreditCard,
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

      <div className="mx-auto flex h-16 sm:h-20 max-w-[1600px] w-full items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo with clear spacing & glowing badge */}
        <a
          className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 py-1"
          href="#home"
          onClick={handleLogoClick}
          aria-label="BLEUWI WORLD home"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-sky-500/25 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <BrandMark size="small" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black tracking-[0.16em] sm:tracking-[0.2em] text-white group-hover:text-sky-200 transition-colors">
              BLEUWI <span className="text-sky-400">WORLD</span>
            </span>
            <span className="hidden xl:inline-block text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              {lang === 'ar' ? 'المتجر الرقمي الرسمي' : 'Official Store'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Dock: Organized Glassmorphic Capsule */}
        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 rounded-full border border-white/[0.08] bg-[#090e1d]/85 px-2 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl shrink-0"
          aria-label="Primary navigation"
        >
          {/* Store & Deals */}
          <div className="flex items-center gap-0.5">
            <a
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1.5 text-[11px] 2xl:text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-white/[0.08] hover:text-white cursor-pointer"
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              title={t('navHome')}
            >
              <Home size={14} className="text-sky-400 shrink-0" />
              <span>{t('navHome')}</span>
            </a>

            <a
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/35 bg-gradient-to-r from-amber-500/15 to-orange-500/15 px-2.5 2xl:px-3 py-1.5 text-[11px] 2xl:text-xs font-bold text-amber-300 transition-all duration-200 hover:border-amber-400/60 hover:bg-amber-500/25 hover:text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.18)] cursor-pointer"
              href="#hot-sellers"
              onClick={(e) => handleNavClick(e, 'hot-sellers')}
              title="Hot Sellers"
            >
              <Flame size={14} className="text-amber-400 animate-pulse shrink-0" />
              <span>{lang === 'ar' ? 'الأكثر مبيعاً' : lang === 'fr' ? 'Top Ventes' : lang === 'es' ? 'Más Vendidos' : 'Hot Sellers'}</span>
              <span className="hidden sm:inline-block rounded-full bg-amber-400/25 border border-amber-400/40 px-1.5 py-0.2 text-[8px] 2xl:text-[9px] font-black text-amber-200 uppercase">
                HOT
              </span>
            </a>
          </div>

          {/* Subtle Vertical Divider */}
          <div className="mx-0.5 h-3.5 w-[1px] bg-white/10" aria-hidden="true" />

          {/* Interactive Tools */}
          <div className="flex items-center gap-0.5">
            <a
              className="inline-flex items-center gap-1.5 rounded-full px-2 2xl:px-2.5 py-1.5 text-[11px] 2xl:text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-purple-500/15 hover:text-purple-300 cursor-pointer"
              href="#diamond-calculator"
              onClick={(e) => handleNavClick(e, 'diamond-calculator')}
              title={lang === 'ar' ? 'حاسبة فري فاير' : 'FF Calculator'}
            >
              <Gem size={14} className="text-purple-400 shrink-0" />
              <span>{lang === 'ar' ? 'حاسبة فري فاير' : lang === 'fr' ? 'Calculateur FF' : lang === 'es' ? 'Calculadora FF' : 'FF Calculator'}</span>
            </a>

            <a
              className="inline-flex items-center gap-1.5 rounded-full px-2 2xl:px-2.5 py-1.5 text-[11px] 2xl:text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-emerald-500/15 hover:text-emerald-300 cursor-pointer"
              href="#windows-advisor"
              onClick={(e) => handleNavClick(e, 'windows-advisor')}
              title={lang === 'ar' ? 'مستشار ويندوز' : 'Key Advisor'}
            >
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>{lang === 'ar' ? 'مستشار ويندوز' : lang === 'fr' ? 'Conseiller Clés' : lang === 'es' ? 'Asesor Claves' : 'Key Advisor'}</span>
            </a>
          </div>

          {/* Subtle Vertical Divider */}
          <div className="mx-0.5 h-3.5 w-[1px] bg-white/10" aria-hidden="true" />

          {/* Trust, Payments & Community */}
          <div className="flex items-center gap-0.5">
            <a
              className="inline-flex items-center gap-1.5 rounded-full px-2 2xl:px-2.5 py-1.5 text-[11px] 2xl:text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-amber-400/10 hover:text-amber-300 cursor-pointer"
              href="#reviews"
              onClick={(e) => handleNavClick(e, 'reviews')}
              title={lang === 'ar' ? 'التقييمات' : 'Reviews'}
            >
              <Star size={14} className="text-amber-300 fill-amber-400/25 shrink-0" />
              <span>{lang === 'ar' ? 'التقييمات' : lang === 'fr' ? 'Avis' : lang === 'es' ? 'Opiniones' : 'Reviews'}</span>
            </a>

            <a
              className="inline-flex max-xl:hidden items-center gap-1.5 rounded-full px-2 2xl:px-2.5 py-1.5 text-[11px] 2xl:text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-sky-500/15 hover:text-sky-300 cursor-pointer"
              href="#payments"
              onClick={(e) => handleNavClick(e, 'payments')}
              title={lang === 'ar' ? 'طرق الدفع' : 'Payments'}
            >
              <CreditCard size={14} className="text-sky-400 shrink-0" />
              <span>{lang === 'ar' ? 'طرق الدفع' : lang === 'fr' ? 'Paiements' : lang === 'es' ? 'Pagos' : 'Payments'}</span>
            </a>

            <a
              className="inline-flex max-xl:hidden items-center gap-1.5 rounded-full px-2 2xl:px-2.5 py-1.5 text-[11px] 2xl:text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-indigo-500/15 hover:text-indigo-300 cursor-pointer"
              href="#faq-section"
              onClick={(e) => handleNavClick(e, 'faq-section')}
              title={lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            >
              <HelpCircle size={14} className="text-indigo-400 shrink-0" />
              <span>{lang === 'ar' ? 'الأسئلة الشائعة' : lang === 'fr' ? 'FAQ' : lang === 'es' ? 'Preguntas' : 'FAQ'}</span>
            </a>

            <a
              className="inline-flex max-xl:hidden items-center gap-1.5 rounded-full px-2 2xl:px-2.5 py-1.5 text-[11px] 2xl:text-xs font-semibold text-slate-300 transition-all duration-200 hover:bg-teal-500/15 hover:text-teal-300 cursor-pointer"
              href="#links"
              onClick={(e) => handleNavClick(e, 'links')}
              title={t('navLinks')}
            >
              <BookOpen size={14} className="text-teal-400 shrink-0" />
              <span>{t('navLinks')}</span>
            </a>
          </div>
        </nav>


        {/* Desktop Action Controls: Unified Preferences + Cart CTA + User Profile */}
        <div className="hidden items-center gap-2.5 md:flex shrink-0">
          {/* Preferences Cluster: Currency + Language + Settings in a single sleek capsule */}
          <div className="flex items-center rounded-full border border-white/[0.08] bg-[#090e1d]/80 p-1 shadow-inner shadow-white/5 backdrop-blur-xl">
            {/* Currency Pill */}
            <button
              type="button"
              onClick={cycleCurrency}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-slate-300 transition-all duration-200 hover:bg-white/[0.08] hover:text-white cursor-pointer"
              title={lang === 'ar' ? `العملة الحالية: ${currency} (انقر للتبديل)` : `Currency: ${currency} (click to cycle)`}
            >
              <span className="text-sm">{currentCurrConf.flag}</span>
              <span className="font-extrabold">{currency}</span>
            </button>

            {/* Divider */}
            <div className="h-3.5 w-[1px] bg-white/10" aria-hidden="true" />

            {/* Language Pill */}
            <button
              type="button"
              onClick={cycleLanguage}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-slate-300 transition-all duration-200 hover:bg-white/[0.08] hover:text-white cursor-pointer"
              title={LANG_CONFIG[lang]?.label || 'Language'}
            >
              <span className="text-sm">{LANG_CONFIG[lang]?.flag || '🌐'}</span>
              <span className="font-extrabold">{LANG_CONFIG[lang]?.code || 'LANG'}</span>
            </button>

            {/* Divider */}
            <div className="h-3.5 w-[1px] bg-white/10" aria-hidden="true" />

            {/* Settings Quick Icon */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="group inline-flex items-center justify-center rounded-full p-1.5 text-slate-400 transition-all duration-200 hover:bg-white/[0.08] hover:text-sky-300 cursor-pointer"
              title={t('navSettings')}
              aria-label="Settings"
            >
              <SettingsIcon size={14} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Cart CTA Button - Prominent & Glowing */}
          <button
            type="button"
            onClick={openCart}
            className="group relative inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/25 px-3.5 py-1.5 text-xs font-extrabold text-emerald-300 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer shadow-sm shadow-emerald-500/15"
            title={lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={14} className="text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
            <span>{lang === 'ar' ? 'السلة' : 'Cart'}</span>
            <span
              className={`flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full text-[10px] font-black transition-all ${
                totalItemsCount > 0
                  ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/50 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {totalItemsCount}
            </span>
          </button>

          {/* User Account Capsule / Login */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`inline-flex items-center gap-2 rounded-full border transition-all duration-200 py-1 pl-1.5 pr-3 text-xs font-bold cursor-pointer shadow-sm ${
                  userDropdownOpen
                    ? 'border-sky-400 bg-sky-500/25 text-white shadow-[0_0_18px_rgba(56,189,248,0.25)]'
                    : 'border-sky-400/30 bg-gradient-to-r from-sky-500/15 to-blue-600/15 text-sky-200 hover:border-sky-400 hover:bg-sky-500/20 hover:text-white shadow-sky-500/10'
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-slate-950 font-black text-[11px] shadow-sm">
                  {(user.fullName || user.username || 'U')[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate font-extrabold">{user.fullName || user.username}</span>
                {isAdmin ? (
                  <span className="rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-400/50 px-2 py-0.5 text-[9px] text-purple-200 font-black tracking-wider uppercase shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    ADMIN
                  </span>
                ) : (
                  <ChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-sky-400' : ''}`}
                  />
                )}
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-2xl border border-sky-400/25 bg-[#090e1d]/95 p-2 shadow-2xl backdrop-blur-2xl animate-scaleIn z-50 divide-y divide-white/[0.07]"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-black text-white">{user.fullName || user.username}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/[0.06] px-2.5 py-1.5 text-[10px]">
                      <span className="text-slate-400 font-medium">{lang === 'ar' ? 'الرصيد' : 'Balance'}:</span>
                      <span className="text-emerald-400 font-black text-xs">
                        {user.balance || 0} {currency}
                      </span>
                    </div>
                  </div>

                  <div className="py-1.5 space-y-1">
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
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
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
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/15 cursor-pointer"
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
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-gradient-to-r from-sky-500/20 via-blue-600/25 to-sky-500/20 px-4 py-1.5 text-xs font-black text-white transition-all duration-200 hover:border-sky-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:scale-102 cursor-pointer shadow-sm shadow-sky-500/15"
            >
              <User size={13} className="text-sky-300" />
              <span>{lang === 'ar' ? 'دخول / حساب' : 'Sign In'}</span>
            </button>
          )}
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

            <div className="space-y-1">
              <a
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                href="#home"
                onClick={(e) => handleNavClick(e, 'home')}
              >
                <Home size={16} className="text-sky-400" />
                <span>{t('navHome')}</span>
              </a>
              <a
                className="flex items-center justify-between rounded-xl bg-amber-400/10 border border-amber-400/25 px-3.5 py-2.5 text-sm font-bold text-amber-300 transition hover:bg-amber-400/20 hover:text-amber-200 cursor-pointer"
                href="#hot-sellers"
                onClick={(e) => handleNavClick(e, 'hot-sellers')}
              >
                <div className="flex items-center gap-2.5">
                  <Flame size={16} className="text-amber-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'الأكثر مبيعاً' : lang === 'fr' ? 'Top Ventes' : lang === 'es' ? 'Más Vendidos' : 'Hot Sellers'}</span>
                </div>
                <span className="rounded-full bg-amber-400/25 px-2 py-0.5 text-[10px] font-black text-amber-200 uppercase">
                  HOT
                </span>
              </a>
              <a
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/15 cursor-pointer"
                href="#diamond-calculator"
                onClick={(e) => handleNavClick(e, 'diamond-calculator')}
              >
                <Gem size={16} className="text-purple-400" />
                <span>{lang === 'ar' ? 'حاسبة فري فاير' : lang === 'fr' ? 'Calculateur FF' : lang === 'es' ? 'Calculadora FF' : 'FF Calculator'}</span>
              </a>
              <a
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/15 cursor-pointer"
                href="#windows-advisor"
                onClick={(e) => handleNavClick(e, 'windows-advisor')}
              >
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>{lang === 'ar' ? 'مستشار ويندوز' : lang === 'fr' ? 'Conseiller Clés' : lang === 'es' ? 'Asesor Claves' : 'Key Advisor'}</span>
              </a>
              <a
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                href="#reviews"
                onClick={(e) => handleNavClick(e, 'reviews')}
              >
                <Star size={16} className="text-amber-300" />
                <span>{lang === 'ar' ? 'التقييمات' : lang === 'fr' ? 'Avis' : lang === 'es' ? 'Opiniones' : 'Reviews'}</span>
              </a>
              <a
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                href="#payments"
                onClick={(e) => handleNavClick(e, 'payments')}
              >
                <CreditCard size={16} className="text-sky-400" />
                <span>{lang === 'ar' ? 'طرق الدفع' : lang === 'fr' ? 'Paiements' : lang === 'es' ? 'Pagos' : 'Payments'}</span>
              </a>
              <a
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                href="#faq-section"
                onClick={(e) => handleNavClick(e, 'faq-section')}
              >
                <HelpCircle size={16} className="text-indigo-400" />
                <span>{lang === 'ar' ? 'الأسئلة الشائعة' : lang === 'fr' ? 'FAQ' : lang === 'es' ? 'Preguntas' : 'FAQ'}</span>
              </a>
              <a
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
                href="#links"
                onClick={(e) => handleNavClick(e, 'links')}
              >
                <BookOpen size={16} className="text-teal-400" />
                <span>{t('navLinks')}</span>
              </a>
            </div>

            <div className="pt-2 mt-2 border-t border-white/[0.08] space-y-1">
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  openCart()
                }}
                className="flex w-full items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/25 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={16} className="text-emerald-400" />
                  <span>{lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}</span>
                </div>
                <span className="rounded-full bg-emerald-400 text-slate-950 px-2 py-0.5 text-xs font-black">
                  {totalItemsCount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  onOpenSettings()
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-sky-300 transition hover:bg-white/[0.08] cursor-pointer"
              >
                <SettingsIcon size={16} />
                <span>{t('navSettings')}</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
