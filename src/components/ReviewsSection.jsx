import { useState, useEffect } from 'react'
import { CheckCircle2, MessageCircle, Star, ThumbsUp, UserCheck, X, Plus, Edit3, Trash2, ShieldCheck, AlertCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { verifiedReviews } from '../data/reviews'

export default function ReviewsSection() {
  const { t, lang, isRTL } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  // One-time review protection states
  const [hasReviewed, setHasReviewed] = useState(false)
  const [myReview, setMyReview] = useState(null)

  // Form states
  const [name, setName] = useState('')
  const [service, setService] = useState('Video Editing')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  // Load reviews on mount
  useEffect(() => {
    try {
      const savedMyReviewStr = localStorage.getItem('bleuwi_my_review')
      let localUserReview = null
      if (savedMyReviewStr) {
        localUserReview = JSON.parse(savedMyReviewStr)
        setMyReview(localUserReview)
        setHasReviewed(true)
        setName(localUserReview.name || '')
        setService(localUserReview.service || 'Video Editing')
        setRating(localUserReview.rating || 5)
        setComment(localUserReview.comment || '')
      }

      // Merge verified global reviews + user's own review (if exists and not duplicated)
      const allReviews = [...verifiedReviews]
      if (localUserReview && !allReviews.some((r) => r.id === localUserReview.id)) {
        allReviews.unshift(localUserReview)
      }
      setReviews(allReviews)
    } catch {
      setReviews([...verifiedReviews])
    }
  }, [])

  // Handle Review Submission (Strictly 1 review per user)
  const handleSaveReview = (e) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return

    const newReview = {
      id: myReview ? myReview.id : Date.now(),
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
      isMine: true,
    }

    // Save strictly as this device's ONE review
    setMyReview(newReview)
    setHasReviewed(true)
    localStorage.setItem('bleuwi_my_review', JSON.stringify(newReview))
    localStorage.setItem('bleuwi_has_reviewed', 'true')

    // Update list
    setReviews((prev) => {
      const filtered = prev.filter((r) => r.id !== newReview.id)
      return [newReview, ...filtered]
    })

    setSubmittedSuccess(true)
  }

  // Handle Delete Review (allows user to clear their one review if they made a mistake)
  const handleDeleteMyReview = () => {
    if (!myReview) return
    localStorage.removeItem('bleuwi_my_review')
    localStorage.removeItem('bleuwi_has_reviewed')
    setReviews((prev) => prev.filter((r) => r.id !== myReview.id))
    setMyReview(null)
    setHasReviewed(false)
    setName('')
    setComment('')
    setRating(5)
    setModalOpen(false)
    setSubmittedSuccess(false)
  }

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter((r) => r.service.toLowerCase().includes(filter.toLowerCase()))

  const getWhatsAppReviewLink = () => {
    const revName = name || (myReview ? myReview.name : '')
    const revService = service || (myReview ? myReview.service : 'Video Editing')
    const revRating = rating || (myReview ? myReview.rating : 5)
    const revComment = comment || (myReview ? myReview.comment : '')

    const starsStr = '⭐'.repeat(revRating)
    const text = encodeURIComponent(
      lang === 'ar'
        ? `السلام عليكم BLEUWI! أود إرسال وتوثيق تقييمي الرسمي:\n- الاسم: ${revName || 'عميل'}\n- الخدمة المطلوبة: ${revService}\n- التقييم: ${starsStr} (${revRating}/5)\n- الرأي والتجربة: ${revComment || ''}\n\nيرجى اعتماد ونشر تقييمي على الموقع!`
        : `Hello BLEUWI! I would like to submit and verify my official review:\n- Name: ${revName || 'Client'}\n- Service: ${revService}\n- Rating: ${starsStr} (${revRating}/5)\n- Feedback: ${revComment || ''}\n\nPlease approve and feature my review on the website!`
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
              ? 'تقييمات صادقة من صناع المحتوى واللاعبين. يُسمح بتقييم واحد فقط لكل عميل لمنع التكرار والتقييمات الوهمية.'
              : 'Authentic feedback from verified clients. Strictly limited to 1 review per person to eliminate spam.'}
          </p>
        </div>

        {/* Action Buttons: Write a Review (or View My Review) & WhatsApp */}
        <div className="flex flex-wrap items-center gap-3">
          {hasReviewed ? (
            <button
              type="button"
              onClick={() => {
                setSubmittedSuccess(false)
                setModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400/20 cursor-pointer"
            >
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>{lang === 'ar' ? 'تم تسجيل تقييمك (انقر للتعديل)' : 'Review Submitted (Click to edit)'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSubmittedSuccess(false)
                setModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-sky-400/20 transition hover:bg-sky-300 cursor-pointer"
            >
              <Plus size={15} />
              <span>{lang === 'ar' ? 'أضف تقييمك (مرة واحدة)' : 'Write a Review (1 Time)'}</span>
            </button>
          )}

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
              className={`relative flex flex-col justify-between rounded-2xl border p-6 shadow-xl backdrop-blur-sm transition ${
                rev.isMine
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.08] to-white/[0.01]'
                  : 'border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015]'
              }`}
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

                  <div className="flex items-center gap-1.5">
                    {rev.isMine && (
                      <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-400/30">
                        {lang === 'ar' ? 'تقييمك' : 'Your Review'}
                      </span>
                    )}
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        <CheckCircle2 size={11} />
                        <span>{lang === 'ar' ? 'عميل موثق' : 'Verified'}</span>
                      </span>
                    )}
                  </div>
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">{rev.date}</span>
                  {rev.isMine && (
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedSuccess(false)
                        setModalOpen(true)
                      }}
                      className="text-slate-400 hover:text-sky-300 cursor-pointer"
                      title={lang === 'ar' ? 'تعديل التقييم' : 'Edit review'}
                    >
                      <Edit3 size={13} />
                    </button>
                  )}
                </div>
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
              ? 'نحن نلتزم بالشفافية المطلقة ولا نضع تقييمات وهمية. يُسمح بتقييم واحد فقط لكل عميل. هل طلبت مونتاجاً، كوينز، أو اشتراكاً مؤخراً؟ شارك رأيك الصادق!'
              : 'We strictly avoid fake reviews. Each client can submit exactly 1 review. If you recently ordered editing, coins, or game keys, share your experience!'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmittedSuccess(false)
                setModalOpen(true)
              }}
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

      {/* Modal: Write / Edit Review (One Time Only Lock) */}
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

            {submittedSuccess ? (
              /* Success & WhatsApp Forward Prompt */
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar' ? 'تم تسجيل تقييمك بنجاح!' : 'Review Submitted Successfully!'}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300">
                    {lang === 'ar'
                      ? 'تم قفل التقييم (تقييم واحد لكل عميل لمنع التكرار). يمكنك أيضاً إرساله إلى واتساب لتأكيد توثيقه الدائم.'
                      : 'Locked to 1 review per client. Send it to WhatsApp to get it verified permanently!'}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={getWhatsAppReviewLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
                  >
                    <MessageCircle size={15} />
                    <span>{lang === 'ar' ? 'إرسال التقييم إلى واتساب BLEUWI' : 'Send to BLEUWI WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-white/10 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
                  >
                    {lang === 'ar' ? 'إغلاق وعرض التقييم' : 'Close & View Review'}
                  </button>
                </div>
              </div>
            ) : (
              /* Review Form */
              <>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-sky-400" />
                  <h3 className="text-lg font-bold text-white">
                    {hasReviewed
                      ? (lang === 'ar' ? 'تعديل تقييمك المسجل' : 'Edit Your Submitted Review')
                      : (lang === 'ar' ? 'شاركنا تقييمك (مرة واحدة)' : 'Submit Official Review (1 Time)')}
                  </h3>
                </div>

                <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-sky-400/20 bg-sky-400/[0.05] p-2 text-[11px] text-sky-200">
                  <AlertCircle size={13} className="text-sky-400 flex-shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'نظام الحماية: يُسمح بتقييم واحد فقط لكل شخص لمنع التقييمات الوهمية والمكررة.'
                      : 'Protection: Exactly 1 review per visitor is allowed to prevent fake spam reviews.'}
                  </span>
                </div>

                <form onSubmit={handleSaveReview} className="mt-4 space-y-3.5">
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
                      <option value="Sell Games">Sell Games (مفاتيح وألعاب)</option>
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

                  <div className="flex items-center justify-between pt-2">
                    {hasReviewed ? (
                      <button
                        type="button"
                        onClick={handleDeleteMyReview}
                        className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                        title={lang === 'ar' ? 'حذف تقييمي' : 'Delete my review'}
                      >
                        <Trash2 size={13} />
                        <span>{lang === 'ar' ? 'حذف تقييمي' : 'Delete'}</span>
                      </button>
                    ) : <span />}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="rounded-xl px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-sky-300 cursor-pointer"
                      >
                        {hasReviewed
                          ? (lang === 'ar' ? 'حفظ التعديل' : 'Update Review')
                          : (lang === 'ar' ? 'تسجيل التقييم' : 'Submit Review')}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
