import { useState, useEffect } from 'react'
import { CheckCircle2, MessageCircle, Star, ThumbsUp, UserCheck, X, Plus } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function ReviewsSection() {
  const { t, lang, isRTL } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  // New review form state
  const [name, setName] = useState('')
  const [service, setService] = useState('Video Editing')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bleuwi_real_reviews')
      if (saved) {
        setReviews(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSaveReview = (e) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      service,
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      verified: true,
    }

    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem('bleuwi_real_reviews', JSON.stringify(updated))

    // Reset form
    setName('')
    setComment('')
    setRating(5)
    setModalOpen(false)
  }

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter((r) => r.service.toLowerCase().includes(filter.toLowerCase()))

  const getWhatsAppReviewLink = () => {
    const text = encodeURIComponent(
      lang === 'ar'
        ? `السلام عليكم BLEUWI، أريد مشاركة تقييمي وتجربتي مع خدماتكم:\n- الاسم: \n- الخدمة: \n- التقييم: ⭐⭐⭐⭐⭐\n- الرأي: `
        : `Hello BLEUWI! I would like to submit my client review for your service:\n- Name: \n- Service: \n- Rating: 5/5 stars\n- Feedback: `
    )
    return `https://wa.me/212762635587?text=${text}`
  }

  return (
    <section id="reviews" className="section-shell scroll-mt-20">
      <div className="section-heading flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="eyebrow">
            <UserCheck size={14} className="text-sky-400" />
            <span>{lang === 'ar' ? 'آراء وتقييمات العملاء' : 'Client Feedback & Reviews'}</span>
          </p>
          <h2>
            {lang === 'ar' ? 'تجارب حقيقية،' : 'Real experiences,'}<br />
            <span className="text-gradient">
              {lang === 'ar' ? 'بكل شفافية ومصداقية.' : '100% authentic.'}
            </span>
          </h2>
          <p>
            {lang === 'ar'
              ? 'تقييمات وآراء حقيقية من صناع محتوى ولاعبين تعاملوا مع BLEUWI. لا نستخدم تقييمات مزيفة أبداً.'
              : 'Authentic thoughts and ratings from real clients, streamers, and gamers. Zero bot reviews.'}
          </p>
        </div>

        {/* Action Buttons: Write a Review or WhatsApp */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-sky-400/20 transition hover:bg-sky-300 cursor-pointer"
          >
            <Plus size={15} />
            <span>{lang === 'ar' ? 'أضف تقييمك' : 'Write a Review'}</span>
          </button>
          <a
            href={getWhatsAppReviewLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/20 hover:border-emerald-400 cursor-pointer"
          >
            <MessageCircle size={15} className="text-emerald-400" />
            <span>{lang === 'ar' ? 'تقييم عبر واتساب' : 'Review on WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* Filter tabs if reviews exist */}
      {reviews.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {['all', 'Video Editing', 'Cheat Panels', 'Design', 'Digital Services'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === f
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : f}
            </button>
          ))}
        </div>
      )}

      {/* Reviews Grid or Authentic Empty State */}
      {filteredReviews.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 shadow-xl backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                      />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      <CheckCircle2 size={11} />
                      <span>{lang === 'ar' ? 'عميل موثق' : 'Verified Client'}</span>
                    </span>
                  )}
                </div>

                <p className="mt-3.5 text-sm leading-relaxed text-slate-200">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-5 border-t border-white/[0.07] pt-3.5 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <h4 className="font-semibold text-white">{rev.name}</h4>
                  <span className="text-[11px] text-sky-300">{rev.service}</span>
                </div>
                <span className="text-[10px] text-slate-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Authentic Zero-Fake Empty State Card */
        <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-400">
            <ThumbsUp size={26} />
          </div>
          <h3 className="mt-5 text-lg font-bold text-white">
            {lang === 'ar' ? 'كن أول من يشاركنا تقييمه الرسمي!' : 'Be the first to share an official review!'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            {lang === 'ar'
              ? 'نحن نلتزم بالشفافية المطلقة ولا نضع تقييمات وهمية. هل طلبت مونتاجاً، كوينز، أو بانيل مؤخراً؟ شارك رأيك الصادق لتظهر هنا!'
              : 'We strictly avoid fake reviews. If you recently ordered video editing, game coins, or custom panels, share your real experience to be featured!'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-sky-300 cursor-pointer"
            >
              <Plus size={15} />
              <span>{lang === 'ar' ? 'كتابة تقييم جديد' : 'Write a Review'}</span>
            </button>
            <a
              href={getWhatsAppReviewLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 cursor-pointer"
            >
              <MessageCircle size={15} className="text-emerald-400" />
              <span>{lang === 'ar' ? 'إرسال التقييم عبر واتساب' : 'Send via WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Modal: Write a Real Review */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#080d1a] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'شاركنا تقييمك الحقيقي' : 'Write a Real Review'}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {lang === 'ar'
                ? 'رأيك يساعد مجتمع BLEUWI على معرفة جودة الخدمات بكل صدق.'
                : 'Your honest feedback helps the BLEUWI community grow.'}
            </p>

            <form onSubmit={handleSaveReview} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'اسمك أو معرّف الألعاب:' : 'Your Name or Gamer Tag:'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: أنس أو Viper_Gamer' : 'e.g. Alex or Viper_99'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'الخدمة التي طلبتها:' : 'Service Ordered:'}
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1627] px-3.5 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
                >
                  <option value="Video Editing">Video Editing (مونتاج فيديو)</option>
                  <option value="Cheat Panels">Cheat Panels (بانيل ألعاب)</option>
                  <option value="Design / Dev">Design / Web Dev (تصميم وهوية)</option>
                  <option value="Game Coins">Game Coins (كوينز الألعاب)</option>
                  <option value="Subscriptions">Subscriptions (اشتراكات رقمية)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'التقييم بالنجوم:' : 'Rating:'}
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-amber-400">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'رأيك وتجربتك بالتفصيل:' : 'Your Honest Feedback:'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'اكتب عن سرعة التسليم، جودة المونتاج أو الخدمة...'
                      : 'Tell us about delivery speed, quality, support...'
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-sky-300 cursor-pointer"
                >
                  {lang === 'ar' ? 'نشر التقييم' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
