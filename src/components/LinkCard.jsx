import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const arabicDescriptions = {
  'WhatsApp': 'تواصل مباشرة مع BLEUWI عبر واتساب (+212 762-635587).',
  'YouTube': 'شاهد أحدث الفيديوهات، المقاطع الطويلة، والمونتاج.',
  'Instagram': 'كواليس صناعة المحتوى ولحظات يومية متجددة.',
  'TikTok': 'مقاطع قصيرة، هايلايتس، ولحظات سريعة من البث.',
  'Discord': 'انضم إلى مجتمع وسيرفر الديسكورد الرسمي وتواصل معنا.',
  'KICK LIVE STREAM': 'شاهد البثوث المباشرة التفاعلية لـ BLEUWI على كيك.',
}

export default function LinkCard({ link }) {
  const Icon = link.icon
  const { lang, isRTL } = useLanguage()

  const description = (lang === 'ar' && arabicDescriptions[link.name]) ? arabicDescriptions[link.name] : link.description

  return (
    <a
      className="link-card cursor-pointer group"
      href={link.href}
      target={link.href.startsWith('http') ? '_blank' : undefined}
      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
    >
      <span className="link-icon relative overflow-hidden p-1.5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 shadow-lg group-hover:scale-105 group-hover:border-sky-400/40 transition-all duration-300">
        {link.image ? (
          <img
            src={link.image}
            alt={link.name}
            className="h-full w-full object-contain rounded-md transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <Icon size={21} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-white group-hover:text-sky-300 transition-colors">{link.name}</span>
        <span className="mt-1 block truncate text-sm text-slate-400">{description}</span>
      </span>
      <ArrowUpRight
        className={`link-arrow ${isRTL ? 'mr-auto ml-0 rotate-[270deg]' : 'ml-auto'} group-hover:text-sky-300`}
        size={20}
      />
    </a>
  )
}
