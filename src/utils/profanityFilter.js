// Anti-profanity word filter for English, Arabic, and Moroccan Darija

const badWordsEn = [
  'fuck', 'fucking', 'fucker', 'shit', 'bullshit', 'bitch', 'asshole', 'cunt', 'dick',
  'pussy', 'cock', 'bastard', 'slut', 'whore', 'scam', 'scammer', 'fake',
  'nigger', 'nigga', 'faggot', 'retard', 'scammed', 'idiot', 'scammers'
]

const badWordsAr = [
  'قحبة', 'قحبه', 'قحاب', 'شرموطة', 'شرموطه', 'شرايط', 'منيك', 'منيوك', 'منيكة',
  'عاهرة', 'عاهره', 'ديوث', 'عرص', 'كس', 'كسك', 'كسختك', 'طيز', 'طيزك', 'زب',
  'زبي', 'زبك', 'زامل', 'زوامل', 'زمل', 'قلاوي', 'قلاويك', 'طبون', 'طبونها',
  'طبونك', 'حوا', 'حواك', 'حواي', 'حواية', 'يحوي', 'تحوي', 'مك', 'دين مك',
  'ولد القحبة', 'بنت القحبة', 'شفار', 'شفارة', 'نكاح', 'تفو', 'خرا', 'خراك',
  'قواد', 'قوادة', 'نصاب', 'نصابة', 'كذاب', 'كذابة', 'حمار', 'كلب'
]

const badWordsDarijaLatin = [
  '9a7ba', '9ahba', 'qa7ba', 'qahba', 'zamel', 'zwaml', 'tboun', 'tabon',
  '9lawi', 'qlawi', '7wa', 'hawa', 'chfar', 'chffar', 'nik', 'zebi', 'zbi',
  'teez', 'din mok', 'nik mok', 'weld 9a7ba', 'bent 9a7ba', 'kess', 'khra',
  'chfara', '9awad', 'qawad'
]

export function normalizeText(text) {
  if (!text) return ''
  let str = text.toLowerCase()
  // Remove arabic diacritics
  str = str.replace(/[\u064B-\u065F\u0670]/g, '')
  // Normalize arabic letters
  str = str.replace(/[أإآ]/g, 'ا')
  str = str.replace(/ى/g, 'ي')
  str = str.replace(/ة/g, 'ه')
  // Collapse repeated characters: e.g. fuuuuck -> fuck
  str = str.replace(/(.)\1{2,}/g, '$1$1')
  return str
}

export function checkProfanity(text) {
  if (!text) return { hasBadWords: false }
  const normalized = normalizeText(text)
  const words = normalized.split(/[\s,.\-_!?:;()\[\]{}'"/\\|]+/).filter(Boolean)

  // Check individual words in English & Darija Arabizi
  for (const w of words) {
    if (badWordsEn.includes(w)) {
      return { hasBadWords: true, word: w }
    }
    if (badWordsDarijaLatin.includes(w)) {
      return { hasBadWords: true, word: w }
    }
  }

  // Check Arabic/Darija words
  for (const bad of badWordsAr) {
    const badNorm = normalizeText(bad)
    if (badNorm.includes(' ')) {
      if (normalized.includes(badNorm)) {
        return { hasBadWords: true, word: bad }
      }
    } else {
      if (words.includes(badNorm)) {
        return { hasBadWords: true, word: bad }
      }
    }
  }

  // Check multi-word Darija Latin phrases
  for (const bad of badWordsDarijaLatin) {
    if (bad.includes(' ') && normalized.includes(bad)) {
      return { hasBadWords: true, word: bad }
    }
  }

  return { hasBadWords: false }
}
