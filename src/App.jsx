import { useState, useEffect, lazy, Suspense } from 'react'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ShopProvider } from './context/ShopContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import HotSellers from './components/HotSellers'
import PreviewCard from './components/PreviewCard'
import LinksSection from './components/LinksSection'
import PaymentMethodsSection from './components/PaymentMethodsSection'
import ReviewsSection from './components/ReviewsSection'
import Footer from './components/Footer'
import ParticlesBackground from './components/ParticlesBackground'
import CustomCursor from './components/CustomCursor'
import MobileQuickBar from './components/MobileQuickBar'
import CartDrawer from './components/CartDrawer'
import CartToast from './components/CartToast'
import PwaInstallBanner from './components/PwaInstallBanner'

// Code-split heavy non-critical components for ultra-fast initial load
const WorkShowcase = lazy(() => import('./components/WorkShowcase'))
const OrderModal = lazy(() => import('./components/OrderModal'))
const SettingsModal = lazy(() => import('./components/SettingsModal'))
const WindowsKeyAdvisor = lazy(() => import('./components/WindowsKeyAdvisor'))
const FreeFireCalculator = lazy(() => import('./components/FreeFireCalculator'))
const FaqSection = lazy(() => import('./components/FaqSection'))
import { api } from './services/api'

// Cloudflare Authentication & Admin Dashboard components
const AuthModal = lazy(() => import('./components/AuthModal'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))
const UserOrdersModal = lazy(() => import('./components/UserOrdersModal'))

const ADMIN_SECRET_PATH = (import.meta.env.VITE_ADMIN_SECRET_PATH || '/bleuwi-x7k9q2-control').toLowerCase()

function MainApp() {
  const [showcase, setShowcase] = useState(() => {
    return new URLSearchParams(window.location.search).get('showcase')
  })

  const [adminView, setAdminView] = useState(() => {
    return window.location.pathname.toLowerCase() === ADMIN_SECRET_PATH
  })

  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderModalData, setOrderModalData] = useState({})
  const [pendingOrderData, setPendingOrderData] = useState(null)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  const { lang } = useLanguage()

  const {
    user,
    isAdmin,
    authModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    userOrdersModalOpen,
    closeUserOrdersModal,
  } = useAuth()

  // Mandatory Login Before Purchase: Guard all purchases
  const handleOpenOrder = (data = {}) => {
    if (!user) {
      setPendingOrderData(data)
      openAuthModal(
        'login',
        lang === 'ar'
          ? 'يرجى تسجيل الدخول أو إنشاء حساب لإتمام عملية الشراء ومتابعة طلبك عبر واتساب.'
          : 'Please sign in or create an account to complete your purchase and track your order.'
      )
      return
    }
    setOrderModalData(data)
    setOrderModalOpen(true)
  }

  // Auto-resume order immediately once authenticated
  useEffect(() => {
    if (user && pendingOrderData) {
      const resume = pendingOrderData
      setPendingOrderData(null)
      setOrderModalData(resume)
      setOrderModalOpen(true)
    }
  }, [user, pendingOrderData])


  const handleCloseOrder = () => {
    setOrderModalOpen(false)
  }

  const handleOpenSettings = () => {
    setSettingsModalOpen(true)
  }

  const handleCloseSettings = () => {
    setSettingsModalOpen(false)
  }

  const handleOpenAdmin = () => {
    if (isAdmin) {
      window.history.pushState({}, '', ADMIN_SECRET_PATH)
      setAdminView(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      openAuthModal('login')
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      setShowcase(params.get('showcase'))
      setAdminView(window.location.pathname.toLowerCase() === ADMIN_SECRET_PATH)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])


  // Real Analytics: Track live pageview on mount
  useEffect(() => {
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'pageview', pagePath: window.location.pathname }),
      }).catch(() => {})
    } catch (e) {}
  }, [])

  // Anti-Inspect, Anti-RightClick, and Anti-F12 Protection
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    const handleKeyDown = (e) => {
      // Disable F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      // Disable DevTools shortcuts: Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      // Disable View Source: Ctrl+U, Save Page: Ctrl+S
      if ((e.ctrlKey || e.metaKey) && ['u', 'U', 's', 'S'].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  // Real Click Analytics: Tracks real user clicks into Cloudflare D1
  useEffect(() => {
    let lastClickTime = 0
    const handleClick = (e) => {
      const now = Date.now()
      if (now - lastClickTime < 2000) return // Throttle to 1 event per 2s to keep DB clean
      lastClickTime = now
      const target = e.target.closest('button, a, [role="button"]')
      const label = target ? (target.innerText || target.getAttribute('title') || target.tagName) : 'page'
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'click',
          pagePath: window.location.pathname,
          referrer: String(label || 'action').trim().slice(0, 50),
        }),
      }).catch(() => {})
    }
    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const navigateToShowcase = (type) => {
    setAdminView(false)
    if (type && type !== 'all') {
      window.history.pushState({}, '', `/?showcase=${type}`)
      setShowcase(type)
    } else if (type === 'all') {
      window.history.pushState({}, '', '/?showcase=all')
      setShowcase('all')
    } else {
      window.history.pushState({}, '', '/')
      setShowcase(null)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateHome = () => {
    window.history.pushState({}, '', '/')
    setShowcase(null)
    setAdminView(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // If Admin View is active
  if (adminView) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-sky-400">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                <span className="text-sm font-bold">Loading BLEUWI Admin Control Center...</span>
              </div>
            </div>
          }
        >
          {isAdmin ? (
            <AdminDashboard onBackToStore={navigateHome} />
          ) : (
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="max-w-md w-full rounded-2xl border border-sky-400/20 bg-[#0a0f1d] p-6 text-center shadow-2xl">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400">
                  🔒
                </div>
                <h2 className="text-xl font-black text-white">Authorized Access Required</h2>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Sign in with authorized credentials to access this portal.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={navigateHome}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Return to Storefront
                  </button>
                </div>
              </div>
            </div>

          )}
        </Suspense>

        {/* Auth Modal if needed */}
        {authModalOpen && (
          <Suspense fallback={null}>
            <AuthModal
              isOpen={authModalOpen}
              onClose={closeAuthModal}
              initialTab={authModalTab}
            />
          </Suspense>
        )}
      </div>
    )
  }

  const isShowcaseActive = showcase === 'video' || showcase === 'panels' || showcase === 'design' || showcase === 'digital' || showcase === 'services' || showcase === 'freefire' || showcase === 'ai' || showcase === 'windows' || showcase === 'all'

  return (
    <div className={`relative min-h-screen ${isShowcaseActive ? '' : 'overflow-x-clip'} bg-[#05070d] text-white selection:bg-sky-400 selection:text-slate-950`}>
      {/* Interactive Background Particles */}
      <ParticlesBackground />

      {/* Smooth Dark Blue Mouse Cursor */}
      <CustomCursor />

      {/* Main Header with Language, Currency, Cart, Auth & Settings controls */}
      <Header
        onHomeClick={navigateHome}
        activeShowcase={showcase}
        onOpenSettings={handleOpenSettings}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Progressive Web App Install Banner */}
      <PwaInstallBanner />

      <main className={`relative z-10 ${isShowcaseActive ? 'pt-10' : ''}`}>
        {isShowcaseActive ? (
          <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-sky-400">Loading showcase...</div>}>
            <WorkShowcase
              type={showcase}
              onBack={navigateHome}
              onSelectType={navigateToShowcase}
              onOpenOrder={handleOpenOrder}
            />
          </Suspense>
        ) : (
          <>
            <Hero onOpenOrder={handleOpenOrder} />
            <HotSellers
              onOpenOrder={handleOpenOrder}
            />
            <Suspense fallback={null}>
              <FreeFireCalculator />
            </Suspense>
            <PreviewCard
              onSelectShowcase={navigateToShowcase}
              onOpenOrder={handleOpenOrder}
            />
            <Suspense fallback={null}>
              <WindowsKeyAdvisor onOpenOrder={handleOpenOrder} />
            </Suspense>
            <PaymentMethodsSection onOpenOrder={handleOpenOrder} />
            <Suspense fallback={null}>
              <FaqSection />
            </Suspense>
            <ReviewsSection />
            <LinksSection />
          </>
        )}
      </main>

      <Footer />

      {/* Mobile Sticky Quick Action Bar */}
      <MobileQuickBar onOpenOrder={handleOpenOrder} />

      {/* Slide-over Multi-Item Cart Drawer */}
      <CartDrawer />

      {/* Floating Add to Cart Feedback Toast */}
      <CartToast />



      {/* WhatsApp Order Modal (Dynamically loaded when triggered) */}
      {orderModalOpen && (
        <Suspense fallback={null}>
          <OrderModal
            isOpen={orderModalOpen}
            onClose={handleCloseOrder}
            initialData={orderModalData}
          />
        </Suspense>
      )}

      {/* Settings Modal (Dynamically loaded when triggered) */}
      {settingsModalOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            isOpen={settingsModalOpen}
            onClose={handleCloseSettings}
            onOpenAdmin={handleOpenAdmin}
          />
        </Suspense>
      )}

      {/* Authentication Modal (Login / Sign Up) */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModalOpen}
            onClose={closeAuthModal}
            initialTab={authModalTab}
          />
        </Suspense>
      )}

      {/* User Orders History Modal */}
      {userOrdersModalOpen && (
        <Suspense fallback={null}>
          <UserOrdersModal
            isOpen={userOrdersModalOpen}
            onClose={closeUserOrdersModal}
          />
        </Suspense>
      )}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <ShopProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ShopProvider>
    </LanguageProvider>
  )
}
