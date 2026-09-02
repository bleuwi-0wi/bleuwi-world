import LinkCard from './LinkCard'
import { links } from '../data/links'
import { useLanguage } from '../context/LanguageContext'

export default function LinksSection() {
  const { t, lang } = useLanguage()

  return (
    <section id="links" className="section-shell scroll-mt-20">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="section-heading !max-w-xl">
          <p className="eyebrow">{t('linksHeadingEyebrow')}</p>
          <h2>
            {lang === 'ar' ? 'جميع ' : 'All the '}
            <span className="text-gradient">
              {lang === 'ar' ? 'الروابط.' : 'links.'}
            </span>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-6 text-slate-500">
          {t('linksHeadingDesc')}
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <LinkCard key={link.name} link={link} />
        ))}
      </div>
    </section>
  )
}
