import { ShieldCheck } from 'lucide-react'
import BrandMark from './BrandMark'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_DIRECT_LINK } from '../data/links'
import iconWhatsApp from '../assets/icon-whatsapp.png'
import iconInstagram from '../assets/icon-instagram.png'
import iconYouTube from '../assets/icon-youtube.png'
import iconCards27 from '../assets/payment-methods/27.png'
import iconWafacash28 from '../assets/payment-methods/28-white.png'
import iconCashPlus29 from '../assets/payment-methods/29.png'
import iconPaypal30 from '../assets/payment-methods/30.png'
import iconBinance31 from '../assets/payment-methods/31.png'
import iconCih32 from '../assets/payment-methods/32-white.png'

export default function Footer() {
  const { t, lang } = useLanguage()

  const officialPaymentIcons = [
    { id: 'cih', name: 'CIH Bank (#32)', icon: iconCih32, alt: 'CIH Bank' },
    { id: 'cards', name: 'Visa & Mastercard (#27)', icon: iconCards27, alt: 'Visa and Mastercard' },
    { id: 'cashplus', name: 'Cash Plus (#29)', icon: iconCashPlus29, alt: 'Cash Plus' },
    { id: 'wafacash', name: 'Wafacash (#28)', icon: iconWafacash28, alt: 'Wafacash' },
    { id: 'paypal', name: 'PayPal (#30)', icon: iconPaypal30, alt: 'PayPal' },
    { id: 'binance', name: 'Binance USDT (#31)', icon: iconBinance31, alt: 'Binance' },
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

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              className="social-button transition-transform hover:scale-105"
              href={WHATSAPP_DIRECT_LINK}
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

        {/* Accepted Payment Methods Bar with Official Icons from 27 to 32 */}
        <div className="mt-10 border-t border-white/[0.08] pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                  {lang === 'ar' ? 'طرق الدفع الرسمية والمعتمدة' : 'Official Payment Methods'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'تسليم فوري ومضمون 100% محلياً ودولياً' : '100% Safe, Instant & Verified Transactions'}
                </p>
              </div>
            </div>

            {/* Official Payment Method Icon Badges (27 to 32) Without Background */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-5 sm:gap-7">
              {officialPaymentIcons.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                  title={pm.name}
                >
                  <img
                    src={pm.icon}
                    alt={pm.alt}
                    className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-200 hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
