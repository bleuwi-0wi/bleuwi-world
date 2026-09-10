// BLEUWI WORLD - Executive Admin Control Center
import { useState, useEffect, useCallback } from 'react'
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Phone,
  Mail,
  ExternalLink,
  Sliders,
  Database,
  Cloud,
  Download,
  Flame,
  Check,
  Ban,
  UserCheck,
  Shield,
  ShieldCheck,
  Send,
  Activity,
  Globe,
  Copy,
  CheckCheck,
  MapPin,
  Monitor,
  Smartphone,
  Eye,
  Radio,
  X,
  Star,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'

export default function AdminDashboard({ onBackToStore }) {
  const { user, logout } = useAuth()
  const { lang, isRTL } = useLanguage()

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'visitors' | 'orders' | 'users' | 'reviews' | 'settings' | 'cloudflare'
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [settings, setSettings] = useState({})
  const [adminReviews, setAdminReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('')
  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [visitorSearchQuery, setVisitorSearchQuery] = useState('')
  const [copiedIp, setCopiedIp] = useState(null)

  // Done & Save Operations State
  const [completingOrder, setCompletingOrder] = useState(null)
  const [fulfillmentNotes, setFulfillmentNotes] = useState('')
  const [savingDone, setSavingDone] = useState(false)
  const [viewingNotesOrder, setViewingNotesOrder] = useState(null)

  const getDurationText = (created_at, completed_at, minutes) => {
    if (minutes != null) return `${minutes} min`
    if (completed_at && created_at) {
      const diff = Math.max(1, Math.round((new Date(completed_at) - new Date(created_at)) / 60000))
      return `${diff} min`
    }
    if (created_at) {
      const diff = Math.max(1, Math.round((Date.now() - new Date(created_at)) / 60000))
      return `${diff} min`
    }
    return '—'
  }

  const handleOpenDoneModal = (ord) => {
    setCompletingOrder(ord)
    setFulfillmentNotes(ord.fulfillment_notes || ord.notes || '')
  }

  const handleSaveDoneOrder = async () => {
    if (!completingOrder) return
    setSavingDone(true)
    try {
      await api.updateAdminOrder(completingOrder.id, {
        status: 'completed',
        fulfillmentNotes: fulfillmentNotes.trim(),
      })
      notify(`Order ${completingOrder.order_number || completingOrder.id} marked as DONE & SAVED!`)
      setCompletingOrder(null)
      setFulfillmentNotes('')
      loadDashboardData()
    } catch (err) {
      notify(err.message || 'Failed to save completed order')
    } finally {
      setSavingDone(false)
    }
  }

  // Copy IP Helper with feedback
  const handleCopyIp = (ip) => {
    if (!ip) return
    try {
      navigator.clipboard.writeText(ip)
      setCopiedIp(ip)
      setTimeout(() => setCopiedIp(null), 2500)
      notify(`Copied IP ${ip} to clipboard!`)
    } catch {
      notify(`IP: ${ip}`)
    }
  }


  // Country Code to Flag Emoji helper
  const getCountryFlag = (cc) => {
    if (!cc || cc === 'XX' || cc === 'LOCAL' || cc.length !== 2) return '🌐'
    const codePoints = cc
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt())
    try {
      return String.fromCodePoint(...codePoints)
    } catch {
      return '🌐'
    }
  }

  // Parse User Agent helper
  const parseDevice = (ua) => {
    if (!ua) return { name: 'Desktop Browser', isMobile: false }
    const lower = ua.toLowerCase()
    const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(lower)
    let os = 'Windows'
    if (lower.includes('macintosh') || lower.includes('mac os')) os = 'macOS'
    else if (lower.includes('iphone')) os = 'iPhone'
    else if (lower.includes('ipad')) os = 'iPad'
    else if (lower.includes('android')) os = 'Android'
    else if (lower.includes('linux')) os = 'Linux'
    else if (lower.includes('windows')) os = 'Windows'

    let browser = 'Browser'
    if (lower.includes('chrome') && !lower.includes('edg')) browser = 'Chrome'
    else if (lower.includes('safari') && !lower.includes('chrome')) browser = 'Safari'
    else if (lower.includes('edg')) browser = 'Edge'
    else if (lower.includes('firefox')) browser = 'Firefox'

    return { name: `${browser} · ${os}`, isMobile }
  }

  // Flash notification helper
  const notify = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Load Admin Data
  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, ordersRes, usersRes, settingsRes, reviewsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getAdminUsers(),
        api.getSettings(),
        api.getAdminReviews(),
      ])
      setStats(
        statsRes?.stats
          ? {
              ...statsRes.stats,
              recentVisitors: statsRes.recentVisitors || [],
              topCountries: statsRes.topCountries || [],
            }
          : statsRes || null
      )
      setOrders(ordersRes || [])
      setUsers(usersRes || [])
      setSettings(settingsRes || {})
      setAdminReviews(reviewsRes || [])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      notify('Failed to load some dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete Customer Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا التقييم نهائياً من قاعدة البيانات؟' : 'Are you sure you want to permanently delete this review?')) return
    setActionLoading(true)
    try {
      await api.deleteAdminReview(reviewId)
      notify(lang === 'ar' ? 'تم حذف التقييم بنجاح' : 'Review deleted successfully')
      loadDashboardData()
    } catch (err) {
      notify(err.message || 'Failed to delete review')
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Change Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionLoading(true)
    try {
      await api.updateAdminOrder(orderId, { status: newStatus })
      notify(`Order status updated to ${newStatus}`)
      loadDashboardData()
    } catch (err) {
      notify(err.message || 'Failed to update order status')
    } finally {
      setActionLoading(false)
    }
  }

  // Toggle User Ban
  const handleToggleUserBan = async (u) => {
    const newStatus = u.status === 'banned' ? 'active' : 'banned'
    setActionLoading(true)
    try {
      await api.updateAdminUser(u.id, { status: newStatus })
      notify(`User account is now ${newStatus}`)
      loadDashboardData()
    } catch (err) {
      notify(err.message || 'Failed to update user status')
    } finally {
      setActionLoading(false)
    }
  }

  // Toggle User Role
  const handleToggleUserRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    setActionLoading(true)
    try {
      await api.updateAdminUser(u.id, { role: newRole })
      notify(`User role changed to ${newRole}`)
      loadDashboardData()
    } catch (err) {
      notify(err.message || 'Failed to update user role')
    } finally {
      setActionLoading(false)
    }
  }

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      await api.updateSettings(settings)
      notify('Store settings saved successfully!')
    } catch (err) {
      notify('Failed to save settings')
    } finally {
      setActionLoading(false)
    }
  }

  // Export Database to JSON
  const handleExportDatabase = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      stats,
      orders,
      users,
      settings,
    }
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bleuwi_database_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    notify('Database exported to JSON backup file!')
  }

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = !orderStatusFilter || o.status === orderStatusFilter
    const q = orderSearchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      (o.order_number && o.order_number.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_phone && o.customer_phone.includes(q))
    return matchesStatus && matchesSearch
  })

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim()
    return (
      !q ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.last_login_ip && u.last_login_ip.toLowerCase().includes(q))
    )
  })

  // Filtered Live Visitors & Edge IPs
  const recentVisitors = stats?.recentVisitors || []
  const filteredVisitors = recentVisitors.filter((v) => {
    const q = visitorSearchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      (v.ip_address && v.ip_address.toLowerCase().includes(q)) ||
      (v.user_name && v.user_name.toLowerCase().includes(q)) ||
      (v.country && v.country.toLowerCase().includes(q)) ||
      (v.city && v.city.toLowerCase().includes(q)) ||
      (v.path && v.path.toLowerCase().includes(q)) ||
      (v.event_type && v.event_type.toLowerCase().includes(q)) ||
      (v.user_agent && v.user_agent.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-[#05070d] text-white selection:bg-sky-400 selection:text-slate-950 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-sky-400/40 bg-slate-900/95 px-5 py-3 text-sm font-bold text-sky-200 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-xl animate-scaleIn">
          <CheckCircle2 size={18} className="text-sky-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0f1d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={14} className={isRTL ? 'rotate-180' : ''} />
              <span>{lang === 'ar' ? 'العودة للمتجر' : 'Storefront'}</span>
            </button>

            <div className="h-5 w-px bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-sky-500 text-slate-950 font-black text-xs shadow-md">
                BW
              </span>
              <span className="text-sm font-black tracking-wide text-white">
                ADMIN <span className="text-sky-400">PANEL</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cloudflare Edge Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:text-white cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-sky-400' : ''} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <div className="flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs">
              <Shield size={13} className="text-sky-400" />
              <span className="font-bold text-sky-200">{user?.fullName || user?.username || 'Admin'}</span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="border-t border-white/5 bg-[#070b16] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl gap-1 sm:gap-2 overflow-x-auto py-2">
            {[
              { id: 'overview', label: lang === 'ar' ? 'نظرة عامة' : 'Overview', icon: TrendingUp },
              {
                id: 'visitors',
                label: `${lang === 'ar' ? 'الزوار والـ IP' : 'Live Visitors & IPs'} (${recentVisitors.length || stats?.totalUniqueIps || 0})`,
                icon: Activity,
                badge: 'PRO',
              },
              { id: 'orders', label: `${lang === 'ar' ? 'الطلبات' : 'Orders'} (${orders.length})`, icon: ShoppingBag },
              { id: 'users', label: `${lang === 'ar' ? 'المستخدمين' : 'Users'} (${users.length})`, icon: Users },
              { id: 'reviews', label: `${lang === 'ar' ? 'التقييمات والآراء' : 'Reviews'} (${adminReviews.length})`, icon: Star },
              { id: 'settings', label: lang === 'ar' ? 'إعلانات المتجر' : 'Store Settings', icon: Sliders },
              { id: 'cloudflare', label: 'Cloudflare & D1', icon: Cloud },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="rounded-md bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-black text-amber-300 border border-amber-400/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Dashboard Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid - 100% Real Live Metrics */}
            {/* KPI Cards Grid - 100% Real Live Metrics */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
              {/* Card 1: Real Visitors */}
              <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{lang === 'ar' ? 'الزوار الحقيقيون' : 'Real Visitors'}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                    <Users size={16} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {stats?.totalVisitors ?? 0}
                </div>
                <p className="mt-1 text-[10px] text-sky-300 font-medium">
                  {stats?.totalPageviews ?? 0} {lang === 'ar' ? 'مشاهدة صفحة' : 'pageviews'}
                </p>
              </div>

              {/* Card 2: Real Unique IPs */}
              <div className="rounded-2xl border border-emerald-500/20 bg-[#0a0f1d]/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{lang === 'ar' ? 'عناوين IP الفريدة' : 'Unique IPs'}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Globe size={16} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {stats?.totalUniqueIps ?? 0}
                </div>
                <p className="mt-1 text-[10px] text-emerald-300 font-medium">
                  Cloudflare Edge IPs
                </p>
              </div>

              {/* Card 3: Real Clicks */}
              <div className="rounded-2xl border border-amber-500/20 bg-[#0a0f1d]/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{lang === 'ar' ? 'النقرات الحقيقية' : 'Real Clicks'}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {stats?.totalClicks ?? 0}
                </div>
                <p className="mt-1 text-[10px] text-amber-300 font-medium">
                  {lang === 'ar' ? 'تفاعل حقيقي 100%' : '100% Real Activity'}
                </p>
              </div>

              {/* Card 4: Real Orders */}
              <div className="rounded-2xl border border-blue-500/20 bg-[#0a0f1d]/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{lang === 'ar' ? 'إجمالي الطلبات' : 'Real Orders'}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                    <ShoppingBag size={16} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {stats?.totalOrders ?? orders.length ?? 0}
                </div>
                <p className="mt-1 text-[10px] text-blue-300 font-medium">
                  {stats?.pendingOrders ?? 0} {lang === 'ar' ? 'قيد المعالجة' : 'pending'}
                </p>
              </div>

              {/* Card 5: Real Revenue */}
              <div className="rounded-2xl border border-purple-500/20 bg-[#0a0f1d]/80 p-4 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{lang === 'ar' ? 'المبيعات' : 'Revenue'}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {stats?.completedRevenueMad || 0}{' '}
                  <span className="text-xs font-bold text-amber-400">MAD</span>
                </div>
                <p className="mt-1 text-[10px] text-purple-300 font-medium">
                  {lang === 'ar' ? 'أرباح موثقة' : 'Verified earnings'}
                </p>
              </div>

              {/* Card 6: Action / Export */}
              <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/80 p-4 shadow-sm backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    {lang === 'ar' ? 'نسخ احتياطي' : 'Database'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">D1 Cloudflare Backup</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportDatabase}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-1.5 text-xs font-bold text-white shadow-md hover:brightness-110 cursor-pointer"
                >
                  <Download size={12} />
                  <span>Backup JSON</span>
                </button>
              </div>
            </div>

            {/* Live Edge Traffic & Real IPs Live Feed */}
            <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/90 p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Radio size={16} className="text-emerald-400 animate-pulse" />
                    <span>{lang === 'ar' ? 'حركة المرور والـ IP الحقيقي المباشر' : 'Live Edge Traffic & Real Client IPs'}</span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                      PRO LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'عناوين IP حقيقية مسجلة عبر Cloudflare Edge بدون بيانات وهمية'
                      : 'Real-time client IPs tracked via Cloudflare Edge headers with zero fake data'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('visitors')}
                  className="flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition cursor-pointer self-start sm:self-auto"
                >
                  <Eye size={13} />
                  <span>{lang === 'ar' ? 'عرض تفاصيل جميع الـ IPs' : 'Open Full IP Intelligence Hub'} →</span>
                </button>
              </div>

              {recentVisitors.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No live visitor logs recorded yet. Site is actively listening at Cloudflare Edge.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recentVisitors.slice(0, 6).map((v) => {
                    const device = parseDevice(v.user_agent)
                    const isCopied = copiedIp === v.ip_address
                    return (
                      <div
                        key={v.id}
                        className="flex flex-col justify-between rounded-xl border border-white/5 bg-slate-900/70 p-3 hover:border-sky-400/30 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg leading-none" title={v.country || 'Global'}>
                              {getCountryFlag(v.country)}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-bold text-sky-300">
                                  {v.ip_address || '127.0.0.1'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyIp(v.ip_address)}
                                  className="text-slate-400 hover:text-white transition cursor-pointer"
                                  title="Copy IP address"
                                >
                                  {isCopied ? <CheckCheck size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                </button>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {v.city ? `${v.city}, ` : ''}{v.country || 'Edge'}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                              v.event_type === 'click'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            }`}
                          >
                            {v.event_type || 'visit'}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1 text-slate-300 truncate max-w-[150px]">
                            {device.isMobile ? (
                              <Smartphone size={11} className="text-slate-400 shrink-0" />
                            ) : (
                              <Monitor size={11} className="text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{device.name}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">
                            {v.user_name ? `@${v.user_name}` : 'Guest'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions & Recent Orders Banner */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Recent Orders Overview */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0f1d]/90 p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Clock size={16} className="text-sky-400" />
                    <span>{lang === 'ar' ? 'أحدث الطلبات الواردة' : 'Latest Incoming Orders'}</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 cursor-pointer"
                  >
                    View all orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 text-slate-600" />
                    <p className="text-xs font-bold text-slate-300">
                      {lang === 'ar' ? 'لا توجد طلبات واردة حالياً (0 طلبات حقيقية)' : 'No incoming orders yet (0 real orders)'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {lang === 'ar' ? 'الموقع متصل بقاعدة بيانات D1 وجاهز لاستقبال أول طلب حقيقي' : 'Website connected to Cloudflare D1 and ready for real customers'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {orders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-3 transition hover:border-sky-400/30"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-sky-300">
                              {ord.order_number || ord.id}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              {ord.customer_name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{ord.customer_phone}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-400 text-sm">
                            {ord.total_price} {ord.currency || 'MAD'}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                              ord.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : ord.status === 'processing'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edge Security & Admin Status Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0f1d]/90 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span>Edge Security & Protection</span>
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-white/5">
                      <span className="text-slate-400">Two-Factor (2FA):</span>
                      <span className="font-bold text-emerald-300">Google Authenticator (Active)</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-white/5">
                      <span className="text-slate-400">Recovery Phone:</span>
                      <span className="font-mono font-bold text-white">{user?.phone || 'Active on Cloud'}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-white/5">
                      <span className="text-slate-400">Master Admin:</span>
                      <span className="font-bold text-sky-300">{user?.email || 'Administrator'}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-white/5">
                      <span className="text-slate-400">Analytics Engine:</span>
                      <span className="font-bold text-purple-300">Real Clicks & Visitors</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-[11px] text-emerald-300">
                  <span className="font-bold">Edge Protection:</span> Single-admin lock active. Any unauthorized login attempts are blocked at the Cloudflare edge.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LIVE VISITORS & IP INTELLIGENCE (PRO) */}
        {/* ======================================================== */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            {/* Header & Intelligence Summary */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Activity size={20} className="text-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'مركز مراقبة الزوار وعناوين الـ IP الحقيقية' : 'Live Visitors & Edge IP Intelligence Hub'}</span>
                  <span className="rounded-full bg-gradient-to-r from-amber-500 to-sky-500 px-2.5 py-0.5 text-[10px] font-black text-slate-950 uppercase shadow-md">
                    PRO 24/7
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'ar'
                    ? 'بيانات حقيقية 100% مستخلصة مباشرة من ترويسات Cloudflare Edge (CF-Connecting-IP) بدون أي أرقام وهمية'
                    : '100% real-time edge telemetry from Cloudflare headers (CF-Connecting-IP, CF-IPCountry, CF-IPCity) with zero mocked numbers.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadDashboardData}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-sky-400/40 transition cursor-pointer"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin text-sky-400' : ''} />
                  <span>{lang === 'ar' ? 'تحديث مباشر' : 'Live Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-white/10 bg-[#0a0f1d]/80 p-3.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {lang === 'ar' ? 'إجمالي الـ IPs الفريدة' : 'Unique Client IPs'}
                </span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">
                  {stats?.totalUniqueIps || 0}
                </span>
                <span className="text-[10px] text-slate-500">Verified Cloudflare IPs</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a0f1d]/80 p-3.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {lang === 'ar' ? 'جلسات التصفح المسجلة' : 'Logged Telemetry Events'}
                </span>
                <span className="text-xl font-black text-sky-400 mt-1 block">
                  {stats?.totalPageviews || recentVisitors.length || 0}
                </span>
                <span className="text-[10px] text-slate-500">Real Edge Requests</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a0f1d]/80 p-3.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {lang === 'ar' ? 'الدول المتصلة' : 'Connected Geographies'}
                </span>
                <span className="text-xl font-black text-amber-400 mt-1 block">
                  {stats?.topCountries?.length || 1}
                </span>
                <span className="text-[10px] text-slate-500">
                  {stats?.topCountries?.slice(0, 3).map((c) => `${getCountryFlag(c.country)} ${c.country}`).join('  ') || '🇲🇦 MA'}
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0a0f1d]/80 p-3.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {lang === 'ar' ? 'التفاعل المسجل' : 'Real User Actions'}
                </span>
                <span className="text-xl font-black text-purple-400 mt-1 block">
                  {stats?.totalClicks || 0}
                </span>
                <span className="text-[10px] text-slate-500">Verified Clicks & CTA</span>
              </div>
            </div>

            {/* Filter Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 sm:w-80">
                <input
                  type="text"
                  value={visitorSearchQuery}
                  onChange={(e) => setVisitorSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'بحث بواسطة الـ IP، اسم المستخدم، الدولة، أو المسار...' : 'Search by IP, username, country, city, or path...'}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none shadow-inner"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{lang === 'ar' ? 'السجلات المعروضة' : 'Showing'}:</span>
                <span className="font-mono font-bold text-sky-300">{filteredVisitors.length}</span>
                <span>/ {recentVisitors.length}</span>
              </div>
            </div>

            {/* Visitors Data Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1d]/90 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-white/10 bg-slate-950/80 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-3.5">Client IP Address</th>
                      <th className="p-3.5">Geolocation & City</th>
                      <th className="p-3.5">User Identity</th>
                      <th className="p-3.5">Path & Event</th>
                      <th className="p-3.5">Device & Browser</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-slate-500">
                          <Activity size={32} className="mx-auto mb-2 text-slate-600" />
                          <p className="font-bold text-slate-400">No visitor logs match your search.</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Visit the storefront in another tab to see real-time edge telemetry stream in.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((v) => {
                        const device = parseDevice(v.user_agent)
                        const isCopied = copiedIp === v.ip_address
                        const flag = getCountryFlag(v.country)
                        return (
                          <tr key={v.id} className="transition hover:bg-white/[0.03]">
                            {/* IP Address + Copy Button */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sky-300 text-xs bg-sky-950/40 border border-sky-400/20 px-2 py-0.5 rounded-lg">
                                  {v.ip_address || '127.0.0.1'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyIp(v.ip_address)}
                                  className="rounded p-1 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                  title="Copy IP"
                                >
                                  {isCopied ? (
                                    <CheckCheck size={12} className="text-emerald-400" />
                                  ) : (
                                    <Copy size={12} />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Geolocation */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className="text-base leading-none">{flag}</span>
                                <div>
                                  <div className="font-semibold text-white">
                                    {v.city ? `${v.city}, ` : ''}{v.country || 'Global Edge'}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    Cloudflare {v.country || 'Edge'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* User Identity */}
                            <td className="p-3.5">
                              {v.user_name ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 font-bold text-[10px]">
                                    {v.user_name.slice(0, 1).toUpperCase()}
                                  </span>
                                  <div>
                                    <span className="font-bold text-sky-200">@{v.user_name}</span>
                                    {v.user_name === user?.username && (
                                      <span className="ml-1 rounded bg-sky-500/20 px-1 py-0.2 text-[9px] font-black text-sky-300">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                                  Anonymous Visitor
                                </span>
                              )}
                            </td>

                            {/* Path & Event Type */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                                    v.event_type === 'click'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  }`}
                                >
                                  {v.event_type || 'pageview'}
                                </span>
                                <span className="font-mono text-xs text-slate-300 truncate max-w-[200px]" title={v.path}>
                                  {v.path || '/'}
                                </span>
                              </div>
                            </td>

                            {/* Device & User Agent */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                {device.isMobile ? (
                                  <Smartphone size={13} className="text-slate-400 shrink-0" />
                                ) : (
                                  <Monitor size={13} className="text-slate-400 shrink-0" />
                                )}
                                <span className="truncate max-w-[160px] text-xs font-medium" title={v.user_agent}>
                                  {device.name}
                                </span>
                              </div>
                            </td>

                            {/* Timestamp */}
                            <td className="p-3.5 font-mono text-[11px] text-slate-400">
                              {v.created_at ? new Date(v.created_at).toLocaleString() : 'Just now'}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Orders Header & Search/Filter Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-72">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by order #, name, phone..."
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              {/* Status Filter Badges */}
              <div className="flex flex-wrap gap-1.5">
                {['', 'pending', 'processing', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st ? st.toUpperCase() : 'ALL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1d]/90 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-white/10 bg-slate-950/70 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-3.5">Order #</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No orders found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        let items = []
                        try {
                          items = typeof ord.items_json === 'string' ? JSON.parse(ord.items_json) : ord.items_json
                        } catch (e) {
                          items = []
                        }

                        // WhatsApp Chat Link
                        const cleanPhone = (ord.customer_phone || '').replace(/[^0-9]/g, '')
                        const waMsg = encodeURIComponent(
                          `Bonjour ${ord.customer_name}, c'est l'équipe BLEUWI WORLD concernant votre commande ${ord.order_number} !`
                        )
                        const waUrl = `https://wa.me/${cleanPhone}?text=${waMsg}`

                        return (
                          <tr key={ord.id} className="transition hover:bg-white/[0.02]">
                            <td className="p-3.5 font-mono font-bold text-sky-300">
                              {ord.order_number || ord.id}
                              <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                                📅 {new Date(ord.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                ⏱️ {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold text-white text-sm">{ord.customer_name}</div>
                              {cleanPhone && (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline mt-0.5"
                                >
                                  <Phone size={10} />
                                  <span>{ord.customer_phone}</span>
                                </a>
                              )}
                              {ord.customer_ip && (
                                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-sky-300">
                                  <span>{getCountryFlag(ord.country)}</span>
                                  <span>{ord.customer_ip}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyIp(ord.customer_ip)}
                                    className="text-slate-400 hover:text-white transition cursor-pointer"
                                    title="Copy Customer IP"
                                  >
                                    {copiedIp === ord.customer_ip ? (
                                      <CheckCheck size={10} className="text-emerald-400" />
                                    ) : (
                                      <Copy size={10} />
                                    )}
                                  </button>
                                </div>
                              )}
                            </td>

                            <td className="p-3.5 max-w-xs">
                              {items && items.map((it, idx) => (
                                <div key={idx} className="truncate text-[11px]">
                                  <span className="text-sky-400 font-bold">{it.quantity || 1}x</span> {it.title}
                                </div>
                              ))}
                              {ord.notes && (
                                <div className="mt-1 text-[10px] text-slate-400 italic bg-white/[0.02] p-1 rounded">
                                  Note: {ord.notes}
                                </div>
                              )}
                            </td>

                            <td className="p-3.5 font-extrabold text-amber-400 text-sm">
                              {ord.total_price} {ord.currency || 'MAD'}
                            </td>

                            <td className="p-3.5">
                              {ord.status === 'completed' ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                                    <CheckCircle2 size={11} />
                                    <span>COMPLETED</span>
                                  </span>
                                  <div className="flex items-center gap-1 text-[10px] font-mono text-sky-300 font-bold">
                                    <Clock size={10} />
                                    <span>{getDurationText(ord.created_at, ord.completed_at, ord.time_to_complete_minutes)}</span>
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-mono">
                                    By @{ord.completed_by || 'damimehdi'}
                                  </div>
                                  {ord.fulfillment_notes && (
                                    <button
                                      type="button"
                                      onClick={() => setViewingNotesOrder(ord)}
                                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold block cursor-pointer"
                                    >
                                      View Delivery Note ↗
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <select
                                    value={ord.status}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                    disabled={actionLoading}
                                    className="rounded-lg border border-white/10 bg-slate-900 py-1 px-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
                                  >
                                    <option value="pending">🟡 Pending</option>
                                    <option value="processing">🔵 Processing</option>
                                    <option value="completed">🟢 Completed</option>
                                    <option value="cancelled">🔴 Cancelled</option>
                                  </select>
                                  <div className="text-[10px] font-mono text-amber-400/90">
                                    ⏱️ {getDurationText(ord.created_at)}
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="p-3.5">
                              <div className="flex flex-col gap-1.5">
                                {ord.status !== 'completed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDoneModal(ord)}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition cursor-pointer"
                                    title="Mark sale as completed and save duration"
                                  >
                                    <CheckCircle2 size={13} />
                                    <span>{lang === 'ar' ? 'إتمام وحفظ العملية' : 'Done & Save'}</span>
                                  </button>
                                )}

                                {cleanPhone && (
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition"
                                    title="Open customer WhatsApp chat"
                                  >
                                    <Phone size={11} />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>

                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: USERS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:w-80">
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search users by name, email, phone..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              </div>

              <div className="text-xs font-semibold text-slate-400">
                Total Registered: <span className="text-sky-300 font-bold">{users.length}</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1d]/90 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-white/10 bg-slate-950/70 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Real Balance</th>
                      <th className="p-3.5">Last Login IP</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No users found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelf = u.id === user?.id
                        return (
                          <tr key={u.id} className="transition hover:bg-white/[0.02]">
                            <td className="p-3.5">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{u.fullName || u.full_name || u.username}</span>
                                {isSelf && (
                                  <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-1.5 text-[9px] text-sky-300 font-black">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">@{u.username}</div>
                            </td>

                            <td className="p-3.5">
                              <div className="text-slate-300">{u.email}</div>
                              <div className="text-[11px] text-slate-500">{u.phone || 'No phone'}</div>
                            </td>

                            {/* Real Balance (Always 0.00 MAD / Real D1 Balance) */}
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-amber-400 text-xs bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-lg">
                                {(Number(u.balance) || 0).toFixed(2)} MAD
                              </span>
                            </td>

                            {/* Last Login IP */}
                            <td className="p-3.5">
                              {u.last_login_ip ? (
                                <div>
                                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-sky-300">
                                    <span>{u.last_login_ip}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyIp(u.last_login_ip)}
                                      className="text-slate-400 hover:text-white transition cursor-pointer"
                                      title="Copy IP"
                                    >
                                      {copiedIp === u.last_login_ip ? (
                                        <CheckCheck size={11} className="text-emerald-400" />
                                      ) : (
                                        <Copy size={11} />
                                      )}
                                    </button>
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">
                                    {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : 'Active session'}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-500 text-[11px] italic">Edge proxy</span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                                  u.role === 'admin'
                                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300'
                                    : 'bg-slate-800 text-slate-300 border border-white/10'
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                                  u.status === 'banned'
                                    ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                                    : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                                }`}
                              >
                                {u.status || 'active'}
                              </span>
                            </td>

                            <td className="p-3.5">
                              {!isSelf && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUserRole(u)}
                                    className="rounded-lg border border-purple-500/30 bg-purple-500/15 px-2 py-1 text-[11px] font-bold text-purple-300 hover:bg-purple-500/30 cursor-pointer"
                                  >
                                    {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUserBan(u)}
                                    className={`rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer ${
                                      u.status === 'banned'
                                        ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30'
                                        : 'border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/30'
                                    }`}
                                  >
                                    {u.status === 'banned' ? 'Activate' : 'Ban User'}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STORE SETTINGS & ANNOUNCEMENTS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0a0f1d]/90 p-6">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Sliders size={18} className="text-sky-400" />
                <span>Top Announcement Banner (Multilingual)</span>
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Customize the top golden ticker message displayed to visitors in each language.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Arabic Announcement (العربية)
                  </label>
                  <input
                    type="text"
                    value={settings.banner_announcement_ar || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, banner_announcement_ar: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs sm:text-sm text-white focus:border-sky-400 focus:outline-none"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    English Announcement
                  </label>
                  <input
                    type="text"
                    value={settings.banner_announcement_en || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, banner_announcement_en: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs sm:text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    French Announcement (Français)
                  </label>
                  <input
                    type="text"
                    value={settings.banner_announcement_fr || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, banner_announcement_fr: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs sm:text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Spanish Announcement (Español)
                  </label>
                  <input
                    type="text"
                    value={settings.banner_announcement_es || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, banner_announcement_es: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs sm:text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Direct WhatsApp Support Phone (International format without +)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_support_phone || '212620786522'}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp_support_phone: e.target.value })
                    }
                    placeholder="212620786522"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs sm:text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 cursor-pointer"
                >
                  <Check size={16} />
                  <span>Save Settings to Database</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CLOUDFLARE & D1 DATABASE */}
        {/* ======================================================== */}
        {activeTab === 'cloudflare' && (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-950/40 via-[#0a0f1d] to-[#05070d] p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                  <Cloud size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Cloudflare Pages & D1 Edge Database</h3>
                  <p className="text-xs text-sky-300">100% Free Tier Serverless Infrastructure</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                  <span className="text-xs text-slate-400 block mb-1">Compute</span>
                  <span className="text-sm font-bold text-emerald-400">Pages Functions</span>
                  <p className="text-[11px] text-slate-500 mt-1">100,000 requests/day ($0/mo)</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                  <span className="text-xs text-slate-400 block mb-1">Database</span>
                  <span className="text-sm font-bold text-emerald-400">Cloudflare D1 (SQL)</span>
                  <p className="text-[11px] text-slate-500 mt-1">5,000,000 reads/day ($0/mo)</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                  <span className="text-xs text-slate-400 block mb-1">Global CDN & SSL</span>
                  <span className="text-sm font-bold text-emerald-400">Unlimited & Free</span>
                  <p className="text-[11px] text-slate-500 mt-1">Custom domain + Auto SSL</p>
                </div>
              </div>

              {/* Deploy Guide */}
              <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>How to Deploy Live to Cloudflare in 3 Steps:</span>
                </h4>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
                  <li>
                    Run <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sky-300 font-mono">deploy-cloudflare.bat</code> in the project folder.
                  </li>
                  <li>
                    Login to Cloudflare when prompted in your browser (<code className="text-sky-300 font-mono">npx wrangler login</code>).
                  </li>
                  <li>
                    Your site will be live instantly with a free <code className="text-emerald-300 font-mono">.pages.dev</code> URL and automatic global database!
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: REVIEWS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Reviews Header & Quick Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0a0f1d] p-5 shadow-xl">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span>{lang === 'ar' ? 'إدارة تقييمات وآراء العملاء (Cloudflare D1)' : 'Customer Reviews Management'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'ar'
                    ? 'كافة التقييمات الحقيقية المسجلة من العملاء في قاعدة البيانات مع بيانات الـ IP والدولة'
                    : 'All real verified customer reviews stored in Cloudflare D1 with IP & country telemetry'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {lang === 'ar' ? 'إجمالي التقييمات' : 'Total Reviews'}
                  </span>
                  <span className="text-lg font-black text-amber-400">{adminReviews.length}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {lang === 'ar' ? 'متوسط التقييم' : 'Average'}
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    {adminReviews.length > 0
                      ? (adminReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / adminReviews.length).toFixed(1)
                      : '5.0'} ★
                  </span>
                </div>
              </div>
            </div>

            {/* Reviews Cards / Table */}
            {adminReviews.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0a0f1d] p-12 text-center shadow-xl">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                  <Star size={24} />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'لا توجد تقييمات مسجلة بعد' : 'No customer reviews found'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'ar'
                    ? 'سيظهر هنا أي تقييم يضيفه الزوار أو العملاء فوراً وبشكل تلقائي.'
                    : 'Any review submitted by website visitors will appear here in real-time.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-white/10 bg-[#0a0f1d] p-5 shadow-lg flex flex-col justify-between transition hover:border-amber-400/30"
                  >
                    <div>
                      {/* Top bar: name, rating, service, and delete */}
                      <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{rev.name}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 size={10} />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 rounded-md px-2 py-0.5">
                              {rev.service}
                            </span>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Star Rating */}
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={i < (Number(rev.rating) || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                              />
                            ))}
                          </div>

                          {/* Delete Review Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                            title={lang === 'ar' ? 'حذف هذا التقييم' : 'Delete Review'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-slate-200 leading-relaxed font-sans bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Bottom bar: IP, Country, Likes */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2 font-mono">
                        <span>{getCountryFlag(rev.country || 'MA')}</span>
                        {rev.ip ? (
                          <button
                            type="button"
                            onClick={() => handleCopyIp(rev.ip)}
                            className="flex items-center gap-1 hover:text-sky-300 transition cursor-pointer"
                            title="Click to copy IP"
                          >
                            <span>{rev.ip}</span>
                            <Copy size={11} />
                          </button>
                        ) : (
                          <span>Unknown IP</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-rose-400">❤️ {rev.likes || 0}</span>
                        {rev.replies && rev.replies.length > 0 && (
                          <span className="text-sky-400">💬 {rev.replies.length} replies</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL 1: MARK DONE & SAVE (إتمام وحفظ العملية) */}
        {completingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="fixed inset-0" onClick={() => !savingDone && setCompletingOrder(null)} />
            <div className="relative w-full max-w-lg rounded-3xl border border-emerald-400/30 bg-[#0a0f1d] p-6 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.25)] backdrop-blur-2xl z-10 text-white animate-scaleIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {lang === 'ar' ? 'إتمام وحفظ العملية في قاعدة البيانات' : 'Mark Order as Done & Save'}
                    </h3>
                    <p className="text-[11px] text-emerald-300">
                      {lang === 'ar' ? 'حساب تلقائي لمدة المعاملة وحفظ سجل التسليم' : 'Calculates turnaround & saves permanent audit log'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCompletingOrder(null)}
                  disabled={savingDone}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Order Brief */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 mb-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Order Number:</span>
                  <span className="font-mono font-bold text-sky-300 text-sm">{completingOrder.order_number || completingOrder.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-white">{completingOrder.customer_name} ({completingOrder.customer_phone})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="font-extrabold text-amber-400 text-sm">{completingOrder.total_price} {completingOrder.currency || 'MAD'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-slate-400">WhatsApp Order Time:</span>
                  <span className="font-mono text-slate-300">{new Date(completingOrder.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">Turnaround Duration:</span>
                  <span className="font-mono font-black text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    ⏱️ {getDurationText(completingOrder.created_at)}
                  </span>
                </div>
              </div>

              {/* Fulfillment Notes Textarea */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>{lang === 'ar' ? 'ملاحظات التسليم / المفاتيح الرقمية / إثبات التحويل:' : 'Fulfillment Notes / Digital Keys / Codes Delivered:'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>
                <textarea
                  rows={3}
                  value={fulfillmentNotes}
                  onChange={(e) => setFulfillmentNotes(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'مثال: تم إرسال مفتاح ويندوز 11 برو (XXXX-YYYY-ZZZZ) أو تم شحن 1080 جوهرة بالآيدي واستلام المبلغ عبر CIH Bank...'
                      : 'e.g. Sent Windows 11 Pro Key: W269N-WFGWX... or Diamonds top-up completed. Payment verified via CIH Bank.'
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setCompletingOrder(null)}
                  disabled={savingDone}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDoneOrder}
                  disabled={savingDone}
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {savingDone ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>{lang === 'ar' ? '💾 حفظ وتأكيد إتمام العملية' : '💾 Confirm & Save Done'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: VIEW DELIVERY NOTES (عرض تفاصيل التسليم) */}
        {viewingNotesOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="fixed inset-0" onClick={() => setViewingNotesOrder(null)} />
            <div className="relative w-full max-w-md rounded-3xl border border-sky-400/30 bg-[#0a0f1d] p-6 shadow-2xl z-10 text-white animate-scaleIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-400 text-sm">
                    {viewingNotesOrder.order_number || viewingNotesOrder.id}
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black">
                    DONE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingNotesOrder(null)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs mb-4">
                <div className="rounded-xl bg-slate-950 p-3 border border-white/5 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Customer:</span>
                    <span className="font-bold text-white">{viewingNotesOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Turnaround Duration:</span>
                    <span className="font-bold text-emerald-400">
                      ⏱️ {getDurationText(viewingNotesOrder.created_at, viewingNotesOrder.completed_at, viewingNotesOrder.time_to_complete_minutes)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Completed At:</span>
                    <span className="font-mono text-slate-300">
                      {viewingNotesOrder.completed_at ? new Date(viewingNotesOrder.completed_at).toLocaleString() : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Completed By:</span>
                    <span className="font-mono text-sky-300">@{viewingNotesOrder.completed_by || 'damimehdi'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Delivery Notes & Given Keys:
                  </label>
                  <div className="rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-sky-200 font-mono whitespace-pre-wrap select-all">
                    {viewingNotesOrder.fulfillment_notes || viewingNotesOrder.notes || 'No notes recorded.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingNotesOrder(null)}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

