import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const view=readFileSync('src/views/GameView.vue','utf8')
const css=readFileSync('src/assets/styles/main.css','utf8')

describe('game command center', () => {
  it('renders live round, letter, timer, and completion data', () => {
    expect(view).toContain('round.number||1')
    expect(view).toContain('{{round.letter}}')
    expect(view).toContain('{{ formatted }}')
    expect(view).toContain('completion.completed')
    expect(view).toContain('completionPercent')
  })

  it('keeps exit, sound, and settings controls wired', () => {
    expect(view).toContain(':to="`/room/${code}`"')
    expect(view).toContain('@click="toggleMute"')
    expect(view).toContain("emit('open-settings')")
  })

  it('has mobile and reduced-motion styles', () => {
    expect(css).toContain('@media(max-width:430px)')
    expect(css).toContain('@media(prefers-reduced-motion:reduce)')
  })
})
