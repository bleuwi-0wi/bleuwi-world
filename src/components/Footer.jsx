import { Camera, MessageCircle, Video } from 'lucide-react'
import BrandMark from './BrandMark'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t, lang } = useLanguage()

  return (
    <footer id="contact" className="mt-28 border-t border-white/[0.07] scroll-mt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <BrandMark size="small" />
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-white">BLEUWI WORLD</p>
            <p className="mt-1 text-xs text-slate-500">
              © {new Date().getFullYear()} BLEUWI. {t('footerCopyright')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="social-button"
            href="https://wa.me/212762635587"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp BLEUWI"
            title="Chat with BLEUWI on WhatsApp (+212 762-635587)"
          >
            <MessageCircle size={17} />
          </a>
          <a
            className="social-button"
            href="https://www.instagram.com/blue.bluewi/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Camera size={17} />
          </a>
          <a
            className="social-button"
            href="https://www.youtube.com/@blue_bleuwi"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            <Video size={18} />
          </a>
          <a
            className="text-sm text-slate-500 transition hover:text-sky-200"
            href="https://wa.me/212762635587"
            target="_blank"
            rel="noreferrer"
          >
            {t('footerWhatsApp')}
          </a>
        </div>
      </div>
    </footer>
  )
}
