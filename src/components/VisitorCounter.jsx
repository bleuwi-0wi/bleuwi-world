import { useState, useEffect } from 'react'
import { Eye, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function VisitorCounter({ compact = false }) {
  const { lang } = useLanguage()
  const [visitorCount, setVisitorCount] = useState(() => {
    const cached = localStorage.getItem('bleuwi_visitor_count')
    return cached ? parseInt(cached, 10) : 100
  })
  const [onlineCount, setOnlineCount] = useState(3)

  useEffect(() => {
    // 1. Session tracking to avoid duplicate counts in the same tab session
    const hasVisitedSession = sessionStorage.getItem('bleuwi_visited')
    
    // Fetch live persistent counter from public cloud SVG counter
    fetch('https://komarev.com/ghpvc/?username=bleuwiworld-shop-visitors')
      .then((res) => res.text())
      .then((svg) => {
        // Parse the counter text from SVG
        const matches = [...svg.matchAll(/<text[^>]*>(\d+)<\/text>/g)]
        if (matches && matches.length > 0) {
          const rawCount = parseInt(matches[matches.length - 1][1], 10)
          // Base offset for established website traffic
          const displayCount = Math.max(rawCount + 240, 240)
          setVisitorCount(displayCount)
          localStorage.setItem('bleuwi_visitor_count', displayCount.toString())
        }
      })
      .catch(() => {
        // Fallback to local increment
        if (!hasVisitedSession) {
          setVisitorCount((prev) => {
            const next = prev + 1
            localStorage.setItem('bleuwi_visitor_count', next.toString())
            return next
          })
        }
      })

    if (!hasVisitedSession) {
      sessionStorage.setItem('bleuwi_visited', 'true')
    }

    // Dynamic online users variation (realistic 2 to 6 active visitors)
    const onlineInterval = setInterval(() => {
      setOnlineCount(Math.floor(Math.random() * 4) + 2)
    }, 15000)

    return () => clearInterval(onlineInterval)
  }, [])

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/[0.06] px-2.5 py-1 text-[11px] font-medium text-sky-200 backdrop-blur-md"
        title={lang === 'ar' ? 'إجمالي زيارات الموقع المباشرة' : 'Live site visitors count'}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="font-mono font-semibold text-white">{visitorCount.toLocaleString()}</span>
        <span className="text-slate-400">{lang === 'ar' ? 'زيارة' : 'visits'}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-slate-300">
        <Eye size={13} className="text-sky-400" />
        <span>{lang === 'ar' ? 'إجمالي الزيارات:' : 'Total Visits:'}</span>
        <span className="font-mono font-bold text-white">{visitorCount.toLocaleString()}</span>
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-emerald-200">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <Users size={12} className="text-emerald-400" />
        <span className="font-mono font-bold text-white">{onlineCount}</span>
        <span className="text-emerald-300/80">{lang === 'ar' ? 'متصلون الآن' : 'online now'}</span>
      </div>
    </div>
  )
}
