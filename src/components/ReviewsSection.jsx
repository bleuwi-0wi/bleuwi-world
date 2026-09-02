import { useState, useEffect } from 'react'
import { CheckCircle2, MessageCircle, Star, ThumbsUp, UserCheck, X, Plus, Edit3, Trash2, ShieldCheck, AlertCircle, Clock } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { verifiedReviews } from '../data/reviews'
import { checkProfanity } from '../utils/profanityFilter'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export default function ReviewsSection() {
  const { t, lang, isRTL } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  // Weekly review & device/IP tracking states
  const [userIp, setUserIp] = useState('')
  const [myReview, setMyReview] = useState(null)
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [isWithinWeek, setIsWithinWeek] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [service, setService] = useState('Video Editing')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [profanityError, setProfanityError] = useState('')

  // Load reviews, check 1-week limit, and fetch IP
  useEffect(() => {
    // 1. Fetch IP address for rate limiting
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.ip) setUserIp(data.ip)
      })
      .catch(() => {
        // Fallback silently if offline or blocked
      })

    // 2. Check last review timestamp
    const lastTimeStr = localStorage.getItem('bleuwi_last_review_time')
    if (lastTimeStr) {
      const timePassed = Date.now() - Number(lastTimeStr)
      if (timePassed < ONE_WEEK_MS) {
        setIsWithinWeek(true)
        setDaysRemaining(Math.ceil((ONE_WEEK_MS - timePassed) / (24 * 60 * 60 * 1000)))
      } else {
        setIsWithinWeek(false)
        setDaysRemaining(0)
      }
    }

    // 3. Load user's review if exists
    try {
      const savedMyReviewStr = localStorage.getItem('bleuwi_my_review')
      let localUserReview = null
      if (savedMyReviewStr) {
        localUserReview = JSON.parse(savedMyReviewStr)
        setMyReview(localUserReview)
        setName(localUserReview.name || '')
        setService(localUserReview.service || 'Video Editing')
        setRating(localUserReview.rating || 5)
        setComment(localUserReview.comment || '')
      }

      // Merge verified global reviews + user's local review
      const allReviews = [...verifiedReviews]
      if (localUserReview && !allReviews.some((r) => r.id === localUserReview.id)) {
        allReviews.unshift(localUserReview)
      }
      setReviews(allReviews)
    } catch {
      setReviews([...verifiedReviews])
    }
  }, [])

  // Handle Review Submission (With 1-week limit and bad words filter for EN, AR, Darija)
  const handleSaveReview = (e) => {
    e.preventDefault()
    setProfanityError('')

    if (!name.trim() || !comment.trim()) return

    // 1. Check for bad words in English, Arabic, and Moroccan Darija
    const nameCheck = checkProfanity(name)
    const commentCheck = checkProfanity(comment)

    if (nameCheck.hasBadWords || commentCheck.hasBadWords) {
      const badWord = nameCheck.word || commentCheck.word
      setProfanityError(
        lang === 'ar'
          ? `⚠️ تم اكتشاف كلمة أو لفظ غير لائق ("${badWord}"). يرجى الالتزام بالاحترام (العربية، الإنجليزية، أو الدارجة).`
          : `⚠️ Inappropriate word detected ("${badWord}"). Please keep your review respectful (English, Arabic & Darija).`
      )
      return
    }

    // 2. Prepare Review Data
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
      ip: userIp || 'device',
    }

    // 3. Save to localStorage with current timestamp for weekly rate-limiting
    setMyReview(newReview)
    setIsWithinWeek(true)
    setDaysRemaining(7)
    localStorage.setItem('bleuwi_my_review', JSON.stringify(newReview))
    localStorage.setItem('bleuwi_last_review_time', Date.now().toString())
    if (userIp) localStorage.setItem('bleuwi_last_review_ip', userIp)

    // Update list
    setReviews((prev) => {
      const filtered = prev.filter((r) => r.id !== newReview.id)
      return [newReview, ...filtered]
    })

    setSubmittedSuccess(true)
  }

  // Handle Delete Review
  const handleDeleteMyReview = () => {
    if (!myReview) return
    localStorage.removeItem('bleuwi_my_review')
    localStorage.removeItem('bleuwi_last_review_time')
    setReviews((prev) => prev.filter((r) => r.id !== myReview.id))
    setMyReview(null)
    setIsWithinWeek(false)
    setDaysRemaining(0)
    setName('')
    setComment('')
    setRating(5)
    setModalOpen(false)
    setSubmittedSuccess(false)
    setProfanityError('')
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
              ? 'تقييمات صادقة من صناع المحتوى واللاعبين. يُسمح بتقييم واحد أسبوعياً من نفس الجهاز والـ IP مع فلتر تلقائي ضد الكلمات غير اللائقة.'
              : 'Authentic feedback from verified clients. Strictly 1 review per week per IP/device with automatic profanity filter.'}
          </p>
        </div>

        {/* Action Buttons: Clean Write a Review & WhatsApp */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedSuccess(false)
              setProfanityError('')
              setModalOpen(true)
            }}
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
                        setProfanityError('')
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
              ? 'نحن نلتزم بالشفافية المطلقة وبدون تقييمات وهمية. يُسمح بتقييم واحد أسبوعياً من نفس الجهاز والـ IP لمنع التكرار.'
              : 'We strictly avoid fake reviews. 1 review per week per IP/device is allowed. Share your experience!'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmittedSuccess(false)
                setProfanityError('')
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

      {/* Modal: Write / Edit Review (With 1-Week Rate Limit & Profanity Filter) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#080d1a] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false)
                setProfanityError('')
              }}
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
                      ? 'تم تسجيل تقييمك أسبوعياً من هذا الجهاز. أرسله أيضاً عبر واتساب ليصل لـ BLEUWI مباشرة!'
                      : 'Saved for this week. Send it to WhatsApp to forward it directly to BLEUWI!'}
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
                    {isWithinWeek && myReview
                      ? (lang === 'ar' ? 'تعديل تقييمك لهذا الأسبوع' : 'Update Your Review for This Week')
                      : (lang === 'ar' ? 'أضف تقييمك الرسمي' : 'Submit Official Review')}
                  </h3>
                </div>

                {/* 1-Week Notice Banner */}
                {isWithinWeek && (
                  <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] p-2.5 text-xs text-amber-200">
                    <Clock size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        {lang === 'ar'
                          ? `قفل التكرار الأسبوعي: يتبقى ${daysRemaining} ${daysRemaining === 1 ? 'يوم' : 'أيام'} لإرسال تقييم جديد تماماً.`
                          : `Weekly Limit: ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left before posting another new review.`}
                      </p>
                      <p className="mt-0.5 text-[11px] text-amber-200/80">
                        {lang === 'ar'
                          ? 'يمكنك تحديث تقييمك الحالي في أي وقت، أو حذفه.'
                          : 'You can edit or update your existing review anytime.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bad words profanity warning alert */}
                {profanityError && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200 animate-pulse">
                    <AlertCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{profanityError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveReview} className="mt-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'ar' ? 'اسمك أو معرّف الألعاب:' : 'Your Name or Gamer Tag:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (profanityError) setProfanityError('')
                      }}
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
                      onChange={(e) => {
                        setComment(e.target.value)
                        if (profanityError) setProfanityError('')
                      }}
                      placeholder={
                        lang === 'ar'
                          ? 'اكتب عن سرعة التسليم، جودة المونتاج أو الخدمة...'
                          : 'Tell us about delivery speed, quality, support...'
                      }
                      className={`w-full rounded-xl border bg-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none resize-none ${
                        profanityError
                          ? 'border-rose-500/70 focus:border-rose-400 ring-1 ring-rose-500/40'
                          : 'border-white/10 focus:border-sky-400'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {myReview ? (
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
                        onClick={() => {
                          setModalOpen(false)
                          setProfanityError('')
                        }}
                        className="rounded-xl px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-sky-300 cursor-pointer"
                      >
                        {isWithinWeek && myReview
                          ? (lang === 'ar' ? 'حفظ التعديل' : 'Update Review')
                          : (lang === 'ar' ? 'نشر التقييم' : 'Post Review')}
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
