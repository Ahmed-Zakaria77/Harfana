import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('global app footer', () => {
  it('is mounted once in the root layout with the exact credit', () => {
    const app=readFileSync('src/App.vue','utf8')
    const footer=readFileSync('src/components/common/AppFooter.vue','utf8')
    expect(app.match(/<AppFooter\s*\/>/g)).toHaveLength(1)
    expect(footer).toContain('Created by</span> <strong>@Ahmed Zakaria</strong> <span>2026')
  })

  it('uses normal flow and mobile safe-area spacing', () => {
    const css=readFileSync('src/assets/styles/main.css','utf8')
    expect(css).toContain('.app-footer{margin-top:auto')
    expect(css).toContain('env(safe-area-inset-bottom)')
    expect(css).not.toContain('.app-footer{position:fixed')
  })
})
