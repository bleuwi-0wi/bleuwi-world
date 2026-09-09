import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#040711" />
      <stop offset="45%" stop-color="#091226" />
      <stop offset="100%" stop-color="#020409" />
    </linearGradient>

    <!-- Ambient Glowing Nebulas -->
    <radialGradient id="glowCyan" cx="15%" cy="25%" r="60%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#0284c7" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowIndigo" cx="85%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#4f46e5" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowAmber" cx="95%" cy="85%" r="40%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Pebble Shape Gradients -->
    <linearGradient id="pebbleBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#143e64" />
      <stop offset="45%" stop-color="#0a1d30" />
      <stop offset="100%" stop-color="#050e18" />
    </linearGradient>

    <linearGradient id="pebbleBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="35%" stop-color="#7dd3fc" />
      <stop offset="70%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <filter id="shadowGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="18" flood-color="#0284c7" flood-opacity="0.6" />
    </filter>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#glowCyan)" />
  <rect width="1200" height="630" fill="url(#glowIndigo)" />
  <rect width="1200" height="630" fill="url(#glowAmber)" />

  <!-- Subtle Cyber Tech Grid Pattern -->
  <g opacity="0.06" stroke="#38bdf8" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="120" y1="0" x2="120" y2="630" />
    <line x1="240" y1="0" x2="240" y2="630" />
    <line x1="360" y1="0" x2="360" y2="630" />
    <line x1="480" y1="0" x2="480" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="720" y1="0" x2="720" y2="630" />
    <line x1="840" y1="0" x2="840" y2="630" />
    <line x1="960" y1="0" x2="960" y2="630" />
    <line x1="1080" y1="0" x2="1080" y2="630" />
  </g>

  <!-- Top Accent Neon Bar -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#pebbleBorder)" />

  <!-- Outer Glass Frame -->
  <rect x="28" y="28" width="1144" height="574" rx="24" fill="none" stroke="#38bdf8" stroke-opacity="0.2" stroke-width="1.5" />

  <!-- Center-Left Logo / Pebble Mark -->
  <g transform="translate(85, 95) scale(2.4)" filter="url(#shadowGlow)">
    <path
      d="M 19.68 4.00 A 40.32 20.16 0 0 1 60.00 24.16 A 17.36 35.84 0 0 1 42.64 60.00 A 38.64 36.40 0 0 1 4.00 23.60 A 15.68 19.60 0 0 1 19.68 4.00 Z"
      fill="url(#pebbleBg)"
      stroke="url(#pebbleBorder)"
      stroke-width="2.5"
    />
    <text
      x="31.5"
      y="39"
      text-anchor="middle"
      fill="#ffffff"
      font-family="'Segoe UI', Arial, sans-serif"
      font-weight="900"
      font-size="28"
      letter-spacing="-0.02em"
    >B</text>
  </g>

  <!-- Title & Branding Text -->
  <g transform="translate(280, 145)">
    <!-- Small Official Badge Pill -->
    <rect x="0" y="-38" width="260" height="28" rx="14" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-opacity="0.6" stroke-width="1.2" />
    <circle cx="16" cy="-24" r="5" fill="#38bdf8" />
    <text x="30" y="-20" fill="#7dd3fc" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="11.5" letter-spacing="0.14em">OFFICIAL STORE &amp; SERVICES</text>

    <!-- Main Store Title -->
    <text x="0" y="24" fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="52" letter-spacing="-0.01em">
      BLEUWI <tspan fill="#38bdf8">WORLD</tspan>
    </text>

    <!-- Arabic Headline -->
    <text x="0" y="68" fill="#e2e8f0" font-family="'Segoe UI', 'Cairo', Arial, sans-serif" font-weight="700" font-size="22">
      المتجر الرسمي للخدمات الرقمية • شحن فري فاير • اشتراكات الذكاء الاصطناعي
    </text>

    <!-- English Slogan -->
    <text x="0" y="102" fill="#94a3b8" font-family="'Segoe UI', Arial, sans-serif" font-weight="500" font-size="17">
      Everything BLEUWI, in one world • Instant Delivery • 100% Safe &amp; Guaranteed
    </text>
  </g>

  <!-- 4 Feature Cards Grid (2x2) -->
  <g transform="translate(85, 305)">
    <!-- Card 1: AI Subscriptions -->
    <g transform="translate(0, 0)" filter="url(#cardShadow)">
      <rect width="500" height="92" rx="16" fill="#091326" fill-opacity="0.9" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1.5" />
      <!-- Icon Glow Circle -->
      <circle cx="50" cy="46" r="26" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1" />
      <!-- Sparkle / AI Vector Icon -->
      <path d="M 50 30 L 52.5 41.5 L 64 44 L 52.5 46.5 L 50 58 L 47.5 46.5 L 36 44 L 47.5 41.5 Z" fill="#38bdf8" />
      <circle cx="58" cy="34" r="2" fill="#7dd3fc" />
      <text x="94" y="38" fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="19">AI Subscriptions (VIP)</text>
      <text x="94" y="66" fill="#7dd3fc" font-family="'Segoe UI', Arial, sans-serif" font-weight="500" font-size="14.5">ChatGPT Plus • Claude Pro • Gemini • Canva Pro</text>
    </g>

    <!-- Card 2: Free Fire Diamonds -->
    <g transform="translate(530, 0)" filter="url(#cardShadow)">
      <rect width="500" height="92" rx="16" fill="#091326" fill-opacity="0.9" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1.5" />
      <!-- Icon Glow Circle -->
      <circle cx="50" cy="46" r="26" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1" />
      <!-- Diamond Vector Icon -->
      <path d="M 41 37 L 59 37 L 64 44 L 50 57 L 36 44 Z" fill="#fbbf24" />
      <path d="M 44 37 L 50 57 L 56 37" fill="none" stroke="#b45309" stroke-width="1" />
      <text x="94" y="38" fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="19">Free Fire Diamond Top-Up</text>
      <text x="94" y="66" fill="#fcd34d" font-family="'Segoe UI', Arial, sans-serif" font-weight="500" font-size="14.5">Official Rate: 1$ = 10 DH • Instant ID Delivery 💎</text>
    </g>

    <!-- Card 3: Windows & Office Keys -->
    <g transform="translate(0, 114)" filter="url(#cardShadow)">
      <rect width="500" height="92" rx="16" fill="#091326" fill-opacity="0.9" stroke="#10b981" stroke-opacity="0.4" stroke-width="1.5" />
      <!-- Icon Glow Circle -->
      <circle cx="50" cy="46" r="26" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-opacity="0.4" stroke-width="1" />
      <!-- Key Vector Icon -->
      <circle cx="45" cy="42" r="7" fill="none" stroke="#34d399" stroke-width="2.5" />
      <path d="M 50 47 L 61 58 M 56 53 L 59 50 M 58 55 L 61 52" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" />
      <text x="94" y="38" fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="19">Windows &amp; Office Keys</text>
      <text x="94" y="66" fill="#6ee7b7" font-family="'Segoe UI', Arial, sans-serif" font-weight="500" font-size="14.5">Windows 10/11 Pro • Office 2024 Lifetime Key</text>
    </g>

    <!-- Card 4: Video Editing & Panels -->
    <g transform="translate(530, 114)" filter="url(#cardShadow)">
      <rect width="500" height="92" rx="16" fill="#091326" fill-opacity="0.9" stroke="#a855f7" stroke-opacity="0.4" stroke-width="1.5" />
      <!-- Icon Glow Circle -->
      <circle cx="50" cy="46" r="26" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7" stroke-opacity="0.4" stroke-width="1" />
      <!-- Clapperboard / Play Vector Icon -->
      <rect x="38" y="38" width="24" height="18" rx="3" fill="none" stroke="#c084fc" stroke-width="2" />
      <polygon points="48,43 54,47 48,51" fill="#c084fc" />
      <text x="94" y="38" fill="#ffffff" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="19">Video Editing &amp; Panels</text>
      <text x="94" y="66" fill="#d8b4fe" font-family="'Segoe UI', Arial, sans-serif" font-weight="500" font-size="14.5">Cinematic Montages • Highlights • Panels</text>
    </g>
  </g>

  <!-- Bottom Trust Bar -->
  <g transform="translate(85, 552)">
    <!-- Instant Delivery Badge -->
    <g transform="translate(0, 0)">
      <circle cx="10" cy="12" r="5" fill="#22c55e" />
      <text x="24" y="16.5" fill="#e2e8f0" font-family="'Segoe UI', Arial, sans-serif" font-weight="600" font-size="14.5">تسليم فوري • Instant Delivery</text>
    </g>

    <!-- Safe Guarantee -->
    <g transform="translate(295, 0)">
      <circle cx="10" cy="12" r="5" fill="#38bdf8" />
      <text x="24" y="16.5" fill="#e2e8f0" font-family="'Segoe UI', Arial, sans-serif" font-weight="600" font-size="14.5">ضمان وأمان 100%</text>
    </g>

    <!-- WhatsApp Support -->
    <g transform="translate(520, 0)">
      <circle cx="10" cy="12" r="5" fill="#22c55e" />
      <text x="24" y="16.5" fill="#e2e8f0" font-family="'Segoe UI', Arial, sans-serif" font-weight="600" font-size="14.5">دعم واتساب 24/7</text>
    </g>

    <!-- Domain link Badge -->
    <g transform="translate(790, -6)">
      <rect width="240" height="36" rx="18" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-opacity="0.7" stroke-width="1.5" />
      <circle cx="24" cy="18" r="4" fill="#38bdf8" />
      <text x="130" y="23" text-anchor="middle" fill="#38bdf8" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="15" letter-spacing="0.03em">bleuwiworld.shop</text>
    </g>
  </g>
</svg>
`;

async function generate() {
  const dir = './public';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await sharp(Buffer.from(svg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('./public/og-banner.png');

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95 })
    .toFile('./public/og-banner.jpg');

  console.log('✅ Generated public/og-banner.png and public/og-banner.jpg (1200x630)');
}

generate().catch(console.error);
