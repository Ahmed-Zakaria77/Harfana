import { describe, expect, it } from 'vitest'
import { normalizeArabic, suggestedScores } from './arabic.js'

describe('normalizeArabic', () => {
  it('normalizes whitespace, diacritics, tatweel and alef variants', () => {
    expect(normalizeArabic('  إِســكندرية   الجديدة ')).toBe('اسكندرية الجديدة')
  })
  it('normalizes alef maqsura without changing taa marbuta', () => {
    expect(normalizeArabic('مُصطفى')).toBe('مصطفي')
    expect(normalizeArabic('مدرسة')).toBe('مدرسة')
  })
})

describe('suggestedScores', () => {
  it('suggests 5 for duplicates, 10 for unique answers, and 0 for empty answers', () => {
    const result = suggestedScores([{ answer: 'مصر' }, { answer: ' مِصْر ' }, { answer: 'المغرب' }, { answer: '' }])
    expect(result.map(({ suggested }) => suggested)).toEqual([5, 5, 10, 0])
    expect(result.map(({ duplicate }) => duplicate)).toEqual([true, true, false, false])
  })
})
