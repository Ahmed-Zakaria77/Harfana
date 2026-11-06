const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g

export function normalizeArabic(value = '') {
  return String(value)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(DIACRITICS, '')
    .replace(/ـ/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
}

export function suggestedScores(entries) {
  const counts = new Map()
  for (const entry of entries) {
    const normalized = normalizeArabic(entry.answer)
    if (normalized) counts.set(normalized, (counts.get(normalized) || 0) + 1)
  }
  return entries.map((entry) => {
    const normalized = normalizeArabic(entry.answer)
    return { ...entry, normalized, duplicate: Boolean(normalized && counts.get(normalized) > 1), suggested: !normalized ? 0 : counts.get(normalized) > 1 ? 5 : 10 }
  })
}
