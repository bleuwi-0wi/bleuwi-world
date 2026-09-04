import { useState, useEffect } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import Hero from './components/Hero'
import HotSellers from './components/HotSellers'
import PreviewCard from './components/PreviewCard'
import WorkShowcase from './components/WorkShowcase'
import LinksSection from './components/LinksSection'
import PaymentMethodsSection from './components/PaymentMethodsSection'
import ReviewsSection from './components/ReviewsSection'
import Footer from './components/Footer'
import OrderModal from './components/OrderModal'
import SettingsModal from './components/SettingsModal'
import WarrantyModal from './components/WarrantyModal'
import WarrantyBanner from './components/WarrantyBanner'
import ParticlesBackground from './components/ParticlesBackground'
import CustomCursor from './components/CustomCursor'

function MainApp() {
  const [showcase, setShowcase] = useState(() => {
    return new URLSearchParams(window.location.search).get('showcase')
  })

  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderModalData, setOrderModalData] = useState({})
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false)

  const handleOpenOrder = (data = {}) => {
    setOrderModalData(data)
    setOrderModalOpen(true)
  }

  const handleCloseOrder = () => {
    setOrderModalOpen(false)
  }

  const handleOpenSettings = () => {
    setSettingsModalOpen(true)
  }

  const handleCloseSettings = () => {
    setSettingsModalOpen(false)
  }

  const handleOpenWarranty = () => {
    setWarrantyModalOpen(true)
  }

  const handleCloseWarranty = () => {
    setWarrantyModalOpen(false)
  }

  useEffect(() => {
    const handlePopState = () => {
      setShowcase(new URLSearchParams(window.location.search).get('showcase'))
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
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

  const navigateToShowcase = (type) => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isShowcaseActive = showcase === 'video' || showcase === 'panels' || showcase === 'design' || showcase === 'digital' || showcase === 'services' || showcase === 'freefire' || showcase === 'all'

  return (
    <div className={`relative min-h-screen ${isShowcaseActive ? '' : 'overflow-x-clip'} bg-[#05070d] text-white selection:bg-sky-400 selection:text-slate-950`}>
      {/* Interactive Background Particles */}
      <ParticlesBackground />

      {/* Smooth Dark Blue Mouse Cursor */}
      <CustomCursor />

      {/* Main Header with Language & Settings controls */}
      <Header
        onHomeClick={navigateHome}
        activeShowcase={showcase}
        onOpenSettings={handleOpenSettings}
        onOpenWarranty={handleOpenWarranty}
      />

      <main className={`relative z-10 ${isShowcaseActive ? 'pt-10' : ''}`}>
        {isShowcaseActive ? (
          <WorkShowcase
            type={showcase}
            onBack={navigateHome}
            onSelectType={navigateToShowcase}
            onOpenOrder={handleOpenOrder}
          />
        ) : (
          <>
            <Hero onOpenWarranty={handleOpenWarranty} onOpenOrder={handleOpenOrder} />
            <WarrantyBanner onOpenWarranty={handleOpenWarranty} />
            <HotSellers
              onOpenOrder={handleOpenOrder}
              onOpenWarranty={handleOpenWarranty}
            />
            <PreviewCard
              onSelectShowcase={navigateToShowcase}
              onOpenOrder={handleOpenOrder}
            />
            <PaymentMethodsSection onOpenOrder={handleOpenOrder} />
            <ReviewsSection />
            <LinksSection />
          </>
        )}
      </main>

      <Footer />

      {/* WhatsApp Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={handleCloseOrder}
        initialData={orderModalData}
        onOpenWarranty={handleOpenWarranty}
      />

      {/* Official Golden Warranty Modal */}
      <WarrantyModal
        isOpen={warrantyModalOpen}
        onClose={handleCloseWarranty}
        onOpenOrder={handleOpenOrder}
      />

      {/* Settings Modal (Language, Particles, Custom Cursor) */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={handleCloseSettings}
      />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  )
}
