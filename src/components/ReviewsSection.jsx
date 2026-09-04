import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  MessageCircle,
  Star,
  ThumbsUp,
  UserCheck,
  X,
  Plus,
  ShieldCheck,
  AlertCircle,
  Clock,
  Heart,
  MessageSquare,
  Send,
  Crown,
  RefreshCw,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { verifiedReviews } from '../data/reviews'
import { checkProfanity } from '../utils/profanityFilter'
import { WHATSAPP_NUMBER, getSecureWhatsAppUrl } from '../data/links'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const CLOUD_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/adcaaea'

export default function ReviewsSection() {
  const { t, lang, isRTL } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [isSyncing, setIsSyncing] = useState(false)

  // Weekly review & device/IP tracking states
  const [userIp, setUserIp] = useState('')
  const [myReview, setMyReview] = useState(null)
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [isWithinWeek, setIsWithinWeek] = useState(false)

  // Likes tracking state (dictionary of { [reviewId]: true/false })
  const [likedReviews, setLikedReviews] = useState({})

  // Replies open state
  const [openReplyReviewId, setOpenReplyReviewId] = useState(null)
  const [replyName, setReplyName] = useState('')
  const [replyComment, setReplyComment] = useState('')
  const [replyProfanityError, setReplyProfanityError] = useState('')

  // Form states for new review
  const [name, setName] = useState('')
  const [service, setService] = useState('Video Editing')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [profanityError, setProfanityError] = useState('')

  // 1. Synchronize reviews from live Cloud Database
  const fetchLiveReviews = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch(CLOUD_BIN_URL)
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data.reviews)) {
          setReviews(data.reviews)
          localStorage.setItem('bleuwi_community_reviews', JSON.stringify(data.reviews))
          return
        }
      }
    } catch {
      // Fallback silently if offline
    } finally {
      setIsSyncing(false)
    }

    // Fallback: local storage or static
    try {
      const savedReviewsStr = localStorage.getItem('bleuwi_community_reviews')
      if (savedReviewsStr) {
        setReviews(JSON.parse(savedReviewsStr))
        return
      }
    } catch {}

    setReviews([...verifiedReviews])
  }

  // Helper to persist reviews both locally AND to Cloud Database
  const saveReviewsToCloud = async (newReviewsList) => {
    setReviews(newReviewsList)
    try {
      localStorage.setItem('bleuwi_community_reviews', JSON.stringify(newReviewsList))
    } catch {}

    // Cloud sync PUT request
    try {
      await fetch(CLOUD_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: newReviewsList }),
      })
    } catch {
      // Offline fallback
    }
  }

  // Load reviews, check 1-week limit, and fetch IP on mount
  useEffect(() => {
    // 1. Fetch IP address for rate limiting
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.ip) setUserIp(data.ip)
      })
      .catch(() => {})

    // 2. Check last review timestamp for 1-week lock
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

    // 3. Load user's liked reviews from local device
    try {
      const savedLikes = localStorage.getItem('bleuwi_liked_reviews')
      if (savedLikes) setLikedReviews(JSON.parse(savedLikes))
    } catch {}

    // 4. Load user's my_review if exists
    try {
      const savedMyReviewStr = localStorage.getItem('bleuwi_my_review')
      if (savedMyReviewStr) setMyReview(JSON.parse(savedMyReviewStr))
    } catch {}

    // 5. Fetch live cloud reviews
    fetchLiveReviews()
  }, [])

  // Handle Review Submission: Save to Cloud Database & stay permanently
  const handleSaveReview = async (e) => {
    e.preventDefault()
    setProfanityError('')

    if (!name.trim() || !comment.trim()) return

    // Bad words check (English, Arabic, Moroccan Darija)
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

    // Construct Review Object
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
      isMine: true,
      ip: userIp || 'device',
      likes: 0,
      replies: [],
    }

    // Save weekly limit
    setMyReview(newReview)
    setIsWithinWeek(true)
    setDaysRemaining(7)
    localStorage.setItem('bleuwi_my_review', JSON.stringify(newReview))
    localStorage.setItem('bleuwi_last_review_time', Date.now().toString())
    if (userIp) localStorage.setItem('bleuwi_last_review_ip', userIp)

    // Save to Cloud Database so ALL visitors worldwide see it instantly!
    const updated = [newReview, ...reviews.filter((r) => r.id !== newReview.id)]
    await saveReviewsToCloud(updated)

    setSubmittedSuccess(true)
  }

  // Handle Heart / Like Toggle (Updates Cloud Database live!)
  const handleToggleLike = async (reviewId) => {
    const isCurrentlyLiked = !!likedReviews[reviewId]
    const nextLikedState = !isCurrentlyLiked

    const updatedLikesMap = {
      ...likedReviews,
      [reviewId]: nextLikedState,
    }
    setLikedReviews(updatedLikesMap)
    try {
      localStorage.setItem('bleuwi_liked_reviews', JSON.stringify(updatedLikesMap))
    } catch {}

    // Update review like count and sync to cloud
    const updatedReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        const currentLikes = r.likes || 0
        return {
          ...r,
          likes: nextLikedState ? currentLikes + 1 : Math.max(currentLikes - 1, 0),
        }
      }
      return r
    })
    await saveReviewsToCloud(updatedReviews)
  }

  // Handle Submit Reply (Updates Cloud Database live!)
  const handleAddReply = async (reviewId) => {
    setReplyProfanityError('')
    if (!replyName.trim() || !replyComment.trim()) return

    // Profanity check on reply
    const nameCheck = checkProfanity(replyName)
    const commentCheck = checkProfanity(replyComment)

    if (nameCheck.hasBadWords || commentCheck.hasBadWords) {
      const badWord = nameCheck.word || commentCheck.word
      setReplyProfanityError(
        lang === 'ar'
          ? `⚠️ لفظ غير لائق ("${badWord}"). يرجى الكتابة باحترام.`
          : `⚠️ Inappropriate word ("${badWord}"). Please keep it respectful.`
      )
      return
    }

    const isCreator =
      replyName.trim().toLowerCase() === 'bleuwi' ||
      replyName.trim().toLowerCase() === 'blue' ||
      replyName.trim().toLowerCase() === 'admin'

    const newReply = {
      id: Date.now(),
      author: replyName.trim(),
      text: replyComment.trim(),
      isCreator,
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }

    const updatedReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        const existingReplies = r.replies || []
        return {
          ...r,
          replies: [...existingReplies, newReply],
        }
      }
      return r
    })

    await saveReviewsToCloud(updatedReviews)
    setReplyComment('')
    setReplyProfanityError('')
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
    const text =
      lang === 'ar'
        ? `السلام عليكم BLEUWI! أود إرسال وتوثيق تقييمي الرسمي الدائم:\n- الاسم: ${revName || 'عميل'}\n- الخدمة المطلوبة: ${revService}\n- التقييم: ${starsStr} (${revRating}/5)\n- الرأي والتجربة: ${revComment || ''}\n\nيرجى اعتماد ونشر تقييمي على الموقع!`
        : `Hello BLEUWI! I would like to submit and verify my official permanent review:\n- Name: ${revName || 'Client'}\n- Service: ${revService}\n- Rating: ${starsStr} (${revRating}/5)\n- Feedback: ${revComment || ''}\n\nPlease approve and feature my review on the website!`

    return getSecureWhatsAppUrl(text)
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
              ? 'تقييمات سحابية حية ومشتركة لجميع الزوار. أي تقييم أو إعجاب أو رد يُحفظ سحابياً ويظهر للجميع فوراً!'
              : 'Live cloud-synced reviews. Any review, like, or reply updates in real time for all visitors worldwide!'}
          </p>
        </div>

        {/* Action Buttons: Write Review & WhatsApp */}
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
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/20 hover:border-emerald-400 cursor-pointer"
          >
            <MessageCircle size={15} className="text-emerald-400" />
            <span>{lang === 'ar' ? 'تقييم عبر واتساب' : 'Review on WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* Filter tabs */}
      {reviews.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {['all', 'Video Editing', 'Cheat Panels', 'Design', 'Digital Services', 'Game Coins', 'Subscriptions', 'Sell Games'].map((f) => (
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

      {/* Reviews Grid */}
      {filteredReviews.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((rev) => {
            const isLiked = !!likedReviews[rev.id]
            const isRepliesOpen = openReplyReviewId === rev.id
            const repliesList = rev.replies || []

            return (
              <div
                key={rev.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 shadow-xl backdrop-blur-sm transition ${
                  rev.isMine
                    ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.08] to-white/[0.01]'
                    : 'border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015]'
                }`}
              >
                <div>
                  {/* Top Bar: Stars + Badges */}
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

                  {/* Review Text */}
                  <p className="mt-3.5 text-sm leading-relaxed text-slate-200">
                    "{rev.comment}"
                  </p>
                </div>

                <div>
                  {/* Author & Date Footer */}
                  <div className="mt-5 border-t border-white/[0.07] pt-3.5 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <h4 className="font-semibold text-white">{rev.name}</h4>
                      <span className="text-[11px] text-sky-300">{rev.service}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{rev.date}</span>
                  </div>

                  {/* Interactive Heart Like + Reply Buttons */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.05] pt-3 text-xs">
                    {/* Heart Like Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLike(rev.id)}
                      className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/20'
                          : 'bg-white/[0.03] text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.06] border border-white/5'
                      }`}
                      title={isLiked ? (lang === 'ar' ? 'إلغاء الإعجاب' : 'Unlike') : (lang === 'ar' ? 'إعجاب بالتقييم' : 'Like review')}
                    >
                      <Heart
                        size={14}
                        className={`transition ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'group-hover:scale-110'}`}
                      />
                      <span className="font-mono font-bold">{rev.likes || 0}</span>
                      <span className="text-[10px]">{lang === 'ar' ? 'إعجاب' : 'Likes'}</span>
                    </button>

                    {/* Reply Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setOpenReplyReviewId(isRepliesOpen ? null : rev.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
                    >
                      <MessageSquare size={13} className="text-sky-400" />
                      <span className="font-mono font-bold">{repliesList.length}</span>
                      <span className="text-[10px]">{lang === 'ar' ? 'ردود' : 'Replies'}</span>
                    </button>
                  </div>

                  {/* Replies Thread */}
                  {isRepliesOpen && (
                    <div className="mt-3.5 space-y-2.5 rounded-xl border border-white/10 bg-black/40 p-3 text-xs animate-fade-up">
                      {repliesList.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {repliesList.map((rep) => (
                            <div
                              key={rep.id}
                              className={`rounded-lg p-2.5 ${
                                rep.isCreator
                                  ? 'border border-amber-500/30 bg-amber-500/[0.08]'
                                  : 'border border-white/5 bg-white/[0.03]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 text-[11px]">
                                <span className="flex items-center gap-1 font-bold text-white">
                                  {rep.isCreator && <Crown size={12} className="text-amber-400" />}
                                  <span className={rep.isCreator ? 'text-amber-300' : 'text-slate-200'}>
                                    {rep.author}
                                  </span>
                                  {rep.isCreator && (
                                    <span className="rounded bg-amber-400/20 px-1 py-0.2 text-[9px] font-semibold text-amber-300">
                                      Creator
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-slate-500">{rep.date}</span>
                              </div>
                              <p className="mt-1 text-slate-300 leading-relaxed">{rep.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 text-center py-1">
                          {lang === 'ar' ? 'لا توجد ردود بعد. كن أول من يرد!' : 'No replies yet. Be the first to reply!'}
                        </p>
                      )}

                      {/* Profanity warning on reply */}
                      {replyProfanityError && (
                        <p className="text-[10px] text-rose-400">{replyProfanityError}</p>
                      )}

                      {/* Reply Input Form */}
                      <div className="space-y-1.5 pt-1.5 border-t border-white/10">
                        <input
                          type="text"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          placeholder={lang === 'ar' ? 'اسمك أو معرّفك' : 'Your name'}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                        />
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={replyComment}
                            onChange={(e) => setReplyComment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddReply(rev.id)
                            }}
                            placeholder={lang === 'ar' ? 'اكتب رداً...' : 'Write a reply...'}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReply(rev.id)}
                            className="rounded-lg bg-sky-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-sky-300 transition cursor-pointer flex items-center gap-1"
                          >
                            <Send size={11} />
                            <span>{lang === 'ar' ? 'رد' : 'Reply'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State Card */
        <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-400">
            <ThumbsUp size={26} />
          </div>
          <h3 className="mt-5 text-lg font-bold text-white">
            {lang === 'ar' ? 'كن أول من يشاركنا تقييمه الدائم!' : 'Be the first to share a permanent review!'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            {lang === 'ar'
              ? 'التقييمات هنا سحابية حية ودائمة لضمان المصداقية. يُسمح بتقييم واحد أسبوعياً من نفس الجهاز والـ IP.'
              : 'Live cloud reviews for full transparency. 1 review per week per IP/device.'}
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
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 cursor-pointer"
            >
              <MessageCircle size={15} className="text-emerald-400" />
              <span>{lang === 'ar' ? 'إرسال التقييم عبر واتساب' : 'Send via WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Modal: Write Permanent Review */}
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

            {/* If user already submitted this week */}
            {isWithinWeek && !submittedSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  <Clock size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar' ? 'تقييمك منشور بشكل دائم!' : 'Your Review is Permanently Published!'}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {lang === 'ar'
                      ? `لقد قمت بنشر تقييمك بالفعل لهذا الأسبوع، وتقييمك منشور سحابياً على الموقع لجميع الزوار (دائم وثابت لضمان المصداقية). يتبقى ${daysRemaining} ${daysRemaining === 1 ? 'يوم' : 'أيام'} لنشر تقييم جديد.`
                      : `You have already posted your review for this week. It is live in the cloud for everyone (permanent for transparency). You can post another review in ${daysRemaining} day(s).`}
                  </p>
                </div>

                {myReview && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-white">{myReview.name}</span>
                      <span className="text-amber-400">{'⭐'.repeat(myReview.rating)}</span>
                    </div>
                    <p className="mt-2 text-slate-200 italic">"{myReview.comment}"</p>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={getWhatsAppReviewLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
                  >
                    <MessageCircle size={15} />
                    <span>{lang === 'ar' ? 'توثيق التقييم عبر واتساب' : 'Verify on WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-white/10 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            ) : submittedSuccess ? (
              /* Success & WhatsApp Forward Prompt */
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar' ? 'تم نشر تقييمك سحابياً بنجاح!' : 'Review Published to Cloud!'}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300">
                    {lang === 'ar'
                      ? 'تقييمك الآن منشور سحابياً على الموقع لجميع الزوار حول العالم بشكل دائم وثابت!'
                      : 'Your review is now live in the cloud and visible to all visitors worldwide permanently!'}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={getWhatsAppReviewLink()}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    {lang === 'ar' ? 'أضف تقييمك الرسمي (دائم وسحابي)' : 'Submit Official Review (Live & Permanent)'}
                  </h3>
                </div>

                <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-sky-400/20 bg-sky-400/[0.05] p-2 text-[11px] text-sky-200">
                  <AlertCircle size={13} className="text-sky-400 flex-shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'ملاحظة: التقييم يُحفظ سحابياً ويظهر لجميع الزوار فوراً. يُسمح بتقييم واحد أسبوعياً.'
                      : 'Notice: Reviews are saved to the cloud and visible to all visitors. 1 review per week.'}
                  </span>
                </div>

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

                  <div className="flex items-center justify-end gap-2 pt-2">
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
                      {lang === 'ar' ? 'نشر التقييم السحابي' : 'Post Review to Cloud'}
                    </button>
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
