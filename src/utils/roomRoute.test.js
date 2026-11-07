import { describe, expect, it, vi } from 'vitest'
import { roomRoute, syncRoomRoute } from './roomRoute.js'

describe('Firestore-driven room navigation', () => {
  it('sends every client to the active round', () => {
    expect(roomRoute({ status: 'playing', currentRoundId: 'r2' }, 'ABC123')).toBe('/room/ABC123/round/r2')
  })
  it('restores review and results routes after reconnecting', () => {
    expect(roomRoute({ status: 'review', currentRoundId: 'r3' }, 'ABC123')).toBe('/room/ABC123/round/r3/review')
    expect(roomRoute({ status: 'results', currentRoundId: 'r3' }, 'ABC123')).toBe('/room/ABC123/results')
  })
  it('restores the final leaderboard after the game is finished', () => {
    expect(roomRoute({ status: 'finished', currentRoundId: 'g1-r3' }, 'ABC123')).toBe('/room/ABC123/results')
  })
  it('waits during preparing until the shared deadline is committed', () => {
    expect(roomRoute({ status: 'preparing', currentRoundId: 'r2' }, 'ABC123')).toBeNull()
  })
  it('does not repeat navigation when already on the canonical route', () => {
    const router = { replace: vi.fn() }
    syncRoomRoute(router, '/room/ABC123/round/r2', { status: 'playing', currentRoundId: 'r2' }, 'ABC123')
    expect(router.replace).not.toHaveBeenCalled()
  })
})
