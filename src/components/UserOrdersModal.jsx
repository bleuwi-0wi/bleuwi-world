// BLEUWI WORLD - User Orders History Modal
import { useState, useEffect } from 'react'
import {
  X,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RotateCw,
  Package,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import { WHATSAPP_DIRECT_LINK } from '../data/links'

export default function UserOrdersModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const { lang, isRTL } = useLanguage()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await api.getMyOrders()
      setOrders(data || [])
    } catch (e) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders()
    }
  }, [isOpen, user])

  if (!isOpen) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
            <CheckCircle2 size={12} />
            <span>{lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 text-xs font-bold text-sky-300">
            <RotateCw size={12} className="animate-spin" />
            <span>{lang === 'ar' ? 'قيد التجهيز' : 'Processing'}</span>
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-bold text-rose-300">
            <AlertTriangle size={12} />
            <span>{lang === 'ar' ? 'ملغي' : 'Cancelled'}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
            <Clock size={12} />
            <span>{lang === 'ar' ? 'قيد الانتظار' : 'Pending'}</span>
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-sky-400/25 bg-[#0a0f1d]/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.18)] backdrop-blur-2xl transition-all duration-300 z-10 my-auto max-h-[85vh] flex flex-col"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Glow Accent Top Bar */}
        <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-400">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {lang === 'ar' ? 'طلباتي السابقة' : 'My Orders'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'تتبع حالة طلباتك وعمليات التسليم الفوري'
                : 'Track the status and details of your purchases'}
            </p>
          </div>
        </div>

        {/* Order List */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sky-400">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mb-2" />
              <p className="text-xs text-slate-400">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShoppingBag size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                {lang === 'ar' ? 'لا توجد طلبات سابقة حتى الآن' : 'No past orders yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar'
                  ? 'عندما تطلب أي خدمة، ستظهر لك تفاصيلها هنا فوراً!'
                  : 'Orders you place will automatically show up here with live status updates.'}
              </p>
            </div>
          ) : (
            orders.map((order) => {
              let items = []
              try {
                items = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json
              } catch (e) {
                items = []
              }

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-sky-400/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {order.order_number || order.id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1 text-xs text-slate-300 mb-3">
                    {items && items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity || 1}x {it.title}</span>
                        <span className="font-semibold text-slate-400">{it.price} {order.currency || 'MAD'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & WhatsApp Help */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="font-bold text-white">
                      {lang === 'ar' ? 'المجموع:' : 'Total:'}{' '}
                      <span className="text-amber-400 font-black">{order.total_price} {order.currency || 'MAD'}</span>
                    </span>
                    <a
                      href={`${WHATSAPP_DIRECT_LINK}?text=${encodeURIComponent(
                        `Bonjour BLEUWI, je demande des infos sur ma commande ${order.order_number || order.id}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      <span>{lang === 'ar' ? 'دعم الواتساب' : 'WhatsApp Support'}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
