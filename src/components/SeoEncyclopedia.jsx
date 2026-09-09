import { useState, useMemo } from 'react'
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Key, 
  Zap, 
  Coins, 
  Video, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  Wrench, 
  MessageCircle, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Layers,
  Cpu
} from 'lucide-react'
import { ENCYCLOPEDIA_VOLUMES, masterEncyclopediaMeta } from '../data/encyclopedia/index.js'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_DIRECT_LINK, openWhatsAppChat } from '../data/links'

const VOLUME_ICONS = [
  Flame,          // Vol 1: Free Fire
  Key,            // Vol 2: Windows & Office
  Zap,            // Vol 3: AI
  Cpu,            // Vol 4: Hardware
  Coins,          // Vol 5: Esports & Economies
  Video,          // Vol 6: Creative
  ShieldCheck,    // Vol 7: Security & Panels
  CreditCard,     // Vol 8: Finance
  HelpCircle,     // Vol 9: 500+ FAQ
  Wrench,         // Vol 10: Glossary
]

export default function SeoEncyclopedia({ onOpenOrder }) {
  const { lang, isRTL } = useLanguage()
  const [activeVolIndex, setActiveVolIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedChapterIds, setExpandedChapterIds] = useState(() => new Set(['vol1-ch1', 'vol1-ch2']))

  const activeVolume = ENCYCLOPEDIA_VOLUMES[activeVolIndex] || ENCYCLOPEDIA_VOLUMES[0]

  const toggleChapter = (id) => {
    setExpandedChapterIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAllInVolume = () => {
    setExpandedChapterIds(new Set(activeVolume.chapters.map((c) => c.id)))
  }

  const collapseAllInVolume = () => {
    setExpandedChapterIds(new Set())
  }

  // Filter chapters inside the active volume based on search query
  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return activeVolume.chapters

    return activeVolume.chapters.filter((ch) => {
      const matchTitle = (ch.titleAr + ' ' + ch.titleEn).toLowerCase().includes(q)
      const matchSummary = (ch.summaryAr || '').toLowerCase().includes(q)
      const matchSections = ch.sections.some(
        (s) => (s.headingAr || '').toLowerCase().includes(q) || (s.contentAr || '').toLowerCase().includes(q)
      )
      return matchTitle || matchSummary || matchSections
    })
  }, [activeVolume, searchQuery])

  const handleCtaClick = (chapter) => {
    const volId = activeVolume.id
    if (volId.includes('freefire')) {
      if (onOpenOrder) {
        onOpenOrder({ category: 'Free Fire Diamond', item: 'Free Fire 1080 Diamonds - 120 DH' })
      } else {
        openWhatsAppChat('مرحباً BLEUWI، أرغب في شحن باقة فري فاير (1080 جوهرة - 120 درهم) عبر الآيدي.')
      }
    } else if (volId.includes('windows')) {
      if (onOpenOrder) {
        onOpenOrder({ category: 'Windows & Office', item: 'Windows 11 Pro (#25) - 140 DH' })
      } else {
        openWhatsAppChat('مرحباً BLEUWI، أود شراء سيريال أصلي لويندوز 11 برو مدى الحياة.')
      }
    } else if (volId.includes('ai')) {
      if (onOpenOrder) {
        onOpenOrder({ category: 'AI Subscriptions', item: 'ChatGPT Plus (#20) - 1 Year' })
      } else {
        openWhatsAppChat('مرحباً BLEUWI، أود الاشتراك في باقة ChatGPT Plus VIP أو Claude Pro.')
      }
    } else if (volId.includes('esports') || volId.includes('coins')) {
      if (onOpenOrder) {
        onOpenOrder({ category: 'Game Coins', item: 'Robux Packs / FC Coins' })
      } else {
        openWhatsAppChat('مرحباً BLEUWI، أرغب في شحن كوينز / رصيد ألعاب.')
      }
    } else if (volId.includes('creative')) {
      if (onOpenOrder) {
        onOpenOrder({ category: 'Video Editing', item: 'YouTube Long-Form Video Edit' })
      } else {
        openWhatsAppChat('مرحباً BLEUWI، أود حجز جلسة مونتاج فيديو / تصميم هوية بصرية.')
      }
    } else if (volId.includes('cybersecurity')) {
      if (onOpenOrder) {
        onOpenOrder({ category: 'Cheat Panels', item: 'Private Tool / HWID Spoofer' })
      } else {
        openWhatsAppChat('مرحباً BLEUWI، أود الاستفسار عن جلسات البانل التنافسي والسبوفر HWID.')
      }
    } else {
      openWhatsAppChat('مرحباً BLEUWI، اطلعت على الموسوعة الكبرى ولدي استفسار بخصوص المنتجات والخدمات.')
    }
  }

  return (
    <section 
      id="encyclopedia" 
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 scroll-mt-24"
      aria-label="BLEUWI WORLD 100,000+ Word Grand Digital Knowledge Base & SEO Encyclopedia"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-sky-600/15 via-emerald-600/10 to-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold text-sky-300 mb-4 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
          <Layers size={14} className="animate-pulse text-sky-400" />
          <span>{lang === 'ar' ? 'الموسوعة الكبرى ودليل الشراء الشامل (100,000+ كلمة موثقة)' : 'The Grand 100,000+ Word Authority Codex & Buyer Guide'}</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          {lang === 'ar' ? (
            <>
              المرجع المعرفي الرقمي الأضخم في المغرب:{' '}
              <span className="text-gradient">10 مجلدات و 195,000+ كلمة</span>
            </>
          ) : (
            <>
              The Premier Digital Compendium:{' '}
              <span className="text-gradient">10 Volumes & 195,000+ Words</span>
            </>
          )}
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          {lang === 'ar'
            ? 'موسوعة تقنية عملاقة وموثقة تغطي كافة تفاصيل شحن فري فاير بالآيدي (1$=10 دراهم)، مفاتيح ويندوز 10 و 11 وأوفيس الأصلية مدى الحياة، اشتراكات الذكاء الاصطناعي VIP، عتاد الحواسيب، واقتصادات الألعاب، وطرق الدفع في المغرب مع الضمان الذهبي 100%.'
            : 'An exhaustive technical knowledge base covering Free Fire ID recharge, genuine lifetime Microsoft licenses, VIP AI subscriptions, Moroccan payment workflows, hardware guides, and 500+ master FAQs.'}
        </p>

        {/* Stats Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-400">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
            <FileText size={15} className="text-sky-400" />
            <span>{masterEncyclopediaMeta.totalWordsVerified}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
            <Layers size={15} className="text-emerald-400" />
            <span>10 {lang === 'ar' ? 'مجلدات تخصصية' : 'Specialized Volumes'}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
            <BookOpen size={15} className="text-amber-400" />
            <span>100 {lang === 'ar' ? 'فصل تفصيلي' : 'Comprehensive Chapters'}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>{lang === 'ar' ? 'الضمان الذهبي 100%' : '100% Golden Guarantee'}</span>
          </div>
        </div>
      </div>

      {/* Volume Switcher Tabs */}
      <div className="relative z-10 mb-8 max-w-5xl mx-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <Filter size={13} className="text-sky-400" />
          <span>{lang === 'ar' ? 'اختر المجلد المعرفي (1 من 10):' : 'Select Volume (1 of 10):'}</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ENCYCLOPEDIA_VOLUMES.map((vol, idx) => {
            const IconComp = VOLUME_ICONS[idx] || BookOpen
            const isActive = activeVolIndex === idx
            return (
              <button
                key={vol.id}
                onClick={() => {
                  setActiveVolIndex(idx)
                  setExpandedChapterIds(new Set([vol.chapters[0]?.id]))
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-start transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.02]'
                    : 'bg-[#080d1a]/90 text-slate-300 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-slate-950 text-sky-400' : 'bg-white/[0.08] text-sky-400'}`}>
                  <IconComp size={13} />
                </div>
                <div className="truncate">
                  <span className="block text-[10px] opacity-75 font-mono">Vol {idx + 1}</span>
                  <span className="truncate block">{lang === 'ar' ? vol.badgeAr : vol.badgeEn}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Volume Header & Search Bar */}
      <div className="relative z-10 mb-8 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-white/[0.1] bg-[#080d1a]/95 p-5 mb-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                VOLUME {activeVolIndex + 1} OF 10 • {activeVolume.badgeEn}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {lang === 'ar' ? activeVolume.titleAr : activeVolume.titleEn}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={expandAllInVolume}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition"
              >
                {lang === 'ar' ? 'توسيع فصول المجلد' : 'Expand Volume'}
              </button>
              <button
                onClick={collapseAllInVolume}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition"
              >
                {lang === 'ar' ? 'طي الكل' : 'Collapse'}
              </button>
            </div>
          </div>

          {/* Search inside Active Volume */}
          <div className="relative w-full">
            <Search 
              size={18} 
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${isRTL ? 'right-4' : 'left-4'}`} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? `ابحث داخل المجلد ${activeVolIndex + 1} (${activeVolume.badgeAr})...` : `Search inside Volume ${activeVolIndex + 1}...`}
              className={`w-full bg-[#05070d] border border-white/[0.12] focus:border-sky-400/60 rounded-xl py-2.5 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner focus:ring-2 focus:ring-sky-400/20 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md ${isRTL ? 'left-3' : 'right-3'}`}
              >
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chapters Accordion List for Active Volume */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-4">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-16 bg-[#080d1a]/50 rounded-2xl border border-white/[0.08]">
            <BookOpen size={36} className="mx-auto text-slate-600 mb-3 animate-bounce" />
            <p className="text-slate-300 font-bold text-base">
              {lang === 'ar' ? 'لم يتم العثور على فصول تطابق بحثك في هذا المجلد' : 'No chapters match your search in this volume'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-xs font-bold text-sky-400 hover:underline"
            >
              {lang === 'ar' ? 'مسح البحث' : 'Clear Search'}
            </button>
          </div>
        ) : (
          filteredChapters.map((chapter) => {
            const isExpanded = expandedChapterIds.has(chapter.id)
            const VolIcon = VOLUME_ICONS[activeVolIndex] || BookOpen

            return (
              <article
                key={chapter.id}
                id={chapter.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-[#080d1a]/85 backdrop-blur-md ${
                  isExpanded
                    ? 'border-sky-500/40 shadow-[0_4px_30px_rgba(56,189,248,0.1)]'
                    : 'border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                {/* Chapter Header / Toggle Bar */}
                <header
                  onClick={() => toggleChapter(chapter.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Chapter Number Badge */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-300 font-black text-xs shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                      {chapter.number}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[11px] font-bold text-amber-300">
                          <VolIcon size={11} className="text-amber-400" />
                          <span>{lang === 'ar' ? chapter.badgeAr : chapter.badgeEn}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock size={11} className="text-slate-500" />
                          <span>{chapter.readTime}</span>
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          ~{chapter.wordCountEstimate} {lang === 'ar' ? 'كلمة' : 'words'}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {lang === 'ar' ? chapter.titleAr : chapter.titleEn}
                      </h4>

                      {!isExpanded && (
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {chapter.summaryAr}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-xs font-bold text-sky-400 hidden sm:inline-block">
                      {isExpanded ? (lang === 'ar' ? 'إخفاء' : 'Collapse') : (lang === 'ar' ? 'عرض الفصل' : 'Read')}
                    </span>
                    <div className="h-8 w-8 rounded-full border border-white/[0.1] flex items-center justify-center text-slate-300 bg-white/[0.03]">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </header>

                {/* Chapter Expanded Body */}
                {isExpanded && (
                  <div className="border-t border-white/[0.08] px-5 sm:px-8 py-6 bg-black/20 text-slate-200">
                    {/* Chapter Summary Box */}
                    <div className="mb-6 rounded-xl border border-sky-500/20 bg-sky-950/20 p-4 text-xs sm:text-sm text-sky-200 leading-relaxed flex items-start gap-3">
                      <Sparkles size={18} className="text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-white font-bold mb-0.5">
                          {lang === 'ar' ? 'خلاصة الفصل:' : 'Executive Summary:'}
                        </strong>
                        {chapter.summaryAr}
                      </div>
                    </div>

                    {/* Chapter Subsections */}
                    <div className="space-y-6">
                      {chapter.sections.map((sec, idx) => (
                        <section key={idx} className="space-y-2.5">
                          <h5 className="text-sm font-extrabold text-amber-300 flex items-center gap-2 border-b border-white/[0.06] pb-2">
                            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                            <span>{sec.headingAr}</span>
                          </h5>
                          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                            {sec.contentAr}
                          </div>
                        </section>
                      ))}
                    </div>

                    {/* In-Chapter Conversion Call to Action */}
                    <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-xl">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white">
                          {lang === 'ar' ? 'جاهز لطلب هذه الخدمة أو الترقية؟' : 'Ready to order or need direct consultation?'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {lang === 'ar' ? 'تنفيذ فوري في أقل من 5 دقائق مع الضمان الذهبي 100% عبر واتساب' : 'Instant 5-minute delivery with Golden Guarantee on WhatsApp'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCtaClick(chapter)}
                        className="btn-cta-primary text-xs shrink-0 w-full sm:w-auto"
                      >
                        <MessageCircle size={15} />
                        <span>{lang === 'ar' ? 'طلب فوري عبر واتساب' : 'Order on WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })
        )}
      </div>

      {/* Bottom Authority Trust Seal */}
      <div className="relative z-10 mt-14 max-w-4xl mx-auto rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-slate-900/40 to-sky-950/30 p-6 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/20 text-emerald-300 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <ShieldCheck size={26} />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          {lang === 'ar' ? 'BLEUWI WORLD - المرجع الرقمي المتكامل والأول في المغرب' : 'BLEUWI WORLD - The Premier Verified Digital Store in Morocco'}
        </h3>
        <p className="mt-1 text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {lang === 'ar'
            ? 'نحن نلتزم بتقديم تراخيص أصلية، وشحن فوري بدون كلمات مرور، وحسابات موثقة بأفضل الأسعار الممكنة مع دعم فني متواصل 24 ساعة طوال أيام الأسبوع.'
            : 'Committed to delivering 100% genuine retail licenses, password-free instant game top-ups, and guaranteed verified AI accounts.'}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <a
            href={WHATSAPP_DIRECT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-primary text-xs"
          >
            <MessageCircle size={14} />
            <span>{lang === 'ar' ? 'محادثة مباشرة مع BLEUWI على واتساب' : 'Direct WhatsApp Chat with BLEUWI'}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
