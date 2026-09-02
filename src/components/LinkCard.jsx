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
      className="link-card cursor-pointer"
      href={link.href}
      target={link.href.startsWith('http') ? '_blank' : undefined}
      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
    >
      <span className="link-icon">
        <Icon size={21} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-white">{link.name}</span>
        <span className="mt-1 block truncate text-sm text-slate-400">{description}</span>
      </span>
      <ArrowUpRight
        className={`link-arrow ${isRTL ? 'mr-auto ml-0 rotate-[270deg]' : 'ml-auto'}`}
        size={20}
      />
    </a>
  )
}
