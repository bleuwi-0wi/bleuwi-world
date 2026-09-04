import { ShieldCheck } from 'lucide-react'
import BrandMark from './BrandMark'
import VisitorCounter from './VisitorCounter'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_NUMBER } from '../data/links'
import iconWhatsApp from '../assets/icon-whatsapp.png'
import iconInstagram from '../assets/icon-instagram.png'
import iconYouTube from '../assets/icon-youtube.png'

export default function Footer() {
  const { t, lang } = useLanguage()

  const paymentMethods = [
    'CIH Bank',
    'Attijariwafa',
    'Cash Plus',
    'Barid Bank',
    'PayPal',
    'USDT / Crypto',
  ]

  return (
    <footer id="contact" className="mt-28 border-t border-white/[0.07] scroll-mt-20 bg-black/40">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark size="small" />
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-white">BLEUWI WORLD</p>
              <p className="mt-1 text-xs text-slate-500">
                © {new Date().getFullYear()} BLEUWI. {t('footerCopyright')}
              </p>
            </div>
          </div>

          {/* Live Visitor Stats Counter */}
          <div className="flex items-center">
            <VisitorCounter compact={false} />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              className="social-button transition-transform hover:scale-105"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp BLEUWI"
              title="WhatsApp"
            >
              <img src={iconWhatsApp} alt="WhatsApp" className="h-[18px] w-[18px] object-contain" />
            </a>
            <a
              className="social-button transition-transform hover:scale-105"
              href="https://www.instagram.com/blue.bluewi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <img src={iconInstagram} alt="Instagram" className="h-[18px] w-[18px] object-contain" />
            </a>
            <a
              className="social-button transition-transform hover:scale-105"
              href="https://www.youtube.com/@blue_bleuwi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
            >
              <img src={iconYouTube} alt="YouTube" className="h-[18px] w-[18px] object-contain" />
            </a>
          </div>
        </div>

        {/* Accepted Payment Methods Bar */}
        <div className="mt-8 border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>{lang === 'ar' ? 'طرق دفع آمنة ومقبولة:' : 'Accepted Payment Methods:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((pm) => (
              <span
                key={pm}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-300"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
