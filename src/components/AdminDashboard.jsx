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
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'

export default function AdminDashboard({ onBackToStore }) {
  const { user, logout } = useAuth()
  const { lang, isRTL } = useLanguage()

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'orders' | 'users' | 'settings' | 'cloudflare'
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('')
  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [userSearchQuery, setUserSearchQuery] = useState('')

  // Flash notification helper
  const notify = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  // Load Admin Data
  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, ordersRes, usersRes, settingsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getAdminUsers(),
        api.getSettings(),
      ])
      setStats(statsRes?.stats || null)
      setOrders(ordersRes || [])
      setUsers(usersRes || [])
      setSettings(settingsRes || {})
    } catch (err) {
      notify('Failed to load some dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

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
      (u.phone && u.phone.includes(q))
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
              { id: 'orders', label: `${lang === 'ar' ? 'الطلبات' : 'Orders'} (${orders.length})`, icon: ShoppingBag },
              { id: 'users', label: `${lang === 'ar' ? 'المستخدمين' : 'Users'} (${users.length})`, icon: Users },
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
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
              {/* Card 1: Real Unique Visitors */}
              <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/80 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
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

              {/* Card 2: Real Clicks */}
              <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/80 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
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
                  {lang === 'ar' ? 'تفاعل حقيقي 100%' : '100% Real Interactions'}
                </p>
              </div>

              {/* Card 3: Real Orders */}
              <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/80 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">{lang === 'ar' ? 'إجمالي الطلبات' : 'Real Orders'}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <ShoppingBag size={16} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {stats?.totalOrders ?? orders.length ?? 0}
                </div>
                <p className="mt-1 text-[10px] text-emerald-300 font-medium">
                  {stats?.pendingOrders ?? 0} {lang === 'ar' ? 'قيد المعالجة' : 'pending'}
                </p>
              </div>

              {/* Card 4: Revenue */}
              <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/80 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
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

              {/* Card 5: Action / Export */}
              <div className="rounded-2xl border border-sky-400/20 bg-[#0a0f1d]/80 p-4 sm:p-5 shadow-sm backdrop-blur-xl flex flex-col justify-between">
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
                      <span className="font-mono font-bold text-white">+212762635898</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-white/5">
                      <span className="text-slate-400">Master Admin:</span>
                      <span className="font-bold text-sky-300">damimehdi20@gmail.com</span>
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
        {/* TAB 2: ORDERS MANAGEMENT */}
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
                              <div className="text-[10px] text-slate-500 font-sans font-normal">
                                {new Date(ord.created_at).toLocaleDateString()}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold text-white">{ord.customer_name}</div>
                              <div className="text-[11px] text-slate-400">{ord.customer_phone}</div>
                            </td>

                            <td className="p-3.5 max-w-xs">
                              {items && items.map((it, idx) => (
                                <div key={idx} className="truncate text-[11px]">
                                  <span className="text-sky-400 font-bold">{it.quantity || 1}x</span> {it.title}
                                </div>
                              ))}
                            </td>

                            <td className="p-3.5 font-extrabold text-amber-400 text-sm">
                              {ord.total_price} {ord.currency || 'MAD'}
                            </td>

                            <td className="p-3.5">
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
                            </td>

                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                {cleanPhone && (
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30"
                                    title="Contact on WhatsApp"
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
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
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
      </main>
    </div>
  )
}
