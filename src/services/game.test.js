import { describe, expect, it } from 'vitest'
import { preserveAnswers } from './game.js'

describe('answer input preservation', () => {
  it('keeps Arabic spaces, the first character, and pasted text unchanged', () => {
    const answers={ولد:'محمد علي ',بلد:' مصر العربية'}
    expect(preserveAnswers(['ولد','بلد'],answers)).toEqual(answers)
  })

  it('limits storage without trimming or normalizing the visible value', () => {
    const value=` أ${'ب'.repeat(100)}`
    const saved=preserveAnswers(['اسم'],{اسم:value}).اسم
    expect(saved).toHaveLength(80)
    expect(saved.startsWith(' أ')).toBe(true)
  })
})
