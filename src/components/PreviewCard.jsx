import { MoreHorizontal } from 'lucide-react'
import SessionCardsFan from './SessionCardsFan'
import { useLanguage } from '../context/LanguageContext'

export default function PreviewCard({ onSelectShowcase, onOpenOrder }) {
  const { t, lang } = useLanguage()

  return (
    <section id="preview" className="section-shell scroll-mt-20">
      <div className="section-heading">
        <p className="eyebrow">{t('sessionsHeadingEyebrow')}</p>
        <h2>
          {lang === 'ar' ? 'أوراق اللعب الخاصة،' : 'Pick your card,'}<br />
          <span className="text-gradient">
            {lang === 'ar' ? 'جلسات صُممت لتصنع الفارق.' : 'sessions crafted to win.'}
          </span>
        </h2>
        <p>{t('sessionsHeadingDesc')}</p>
      </div>

      <div className="preview-frame animate-fade-up mt-8">
        <div className="preview-bar">
          <div className="flex gap-1.5"><i /><i /><i /></div>
          <span>bleuwi.world / session-cards</span>
          <MoreHorizontal size={18} />
        </div>

        <div className="preview-surface p-4 sm:p-8">
          <SessionCardsFan
            onSelectShowcase={onSelectShowcase}
            onOpenOrder={onOpenOrder}
          />
        </div>
      </div>
    </section>
  )
}

