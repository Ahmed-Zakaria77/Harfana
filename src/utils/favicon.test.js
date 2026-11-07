import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

describe('GitHub Pages favicon', () => {
  it('uses the project logo through Vite BASE_URL', () => {
    const html=readFileSync('index.html','utf8')
    expect(html).toContain('href="%BASE_URL%logo.png"')
    expect(existsSync('public/logo.png')).toBe(true)
  })
})
