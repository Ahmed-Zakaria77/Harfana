import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const { roomStops, playerStops, watchRoom, watchPlayers } = vi.hoisted(() => {
  const roomStops = [], playerStops = []
  return {
    roomStops,
    playerStops,
    watchRoom: vi.fn(() => { const stop=vi.fn();roomStops.push(stop);return stop }),
    watchPlayers: vi.fn(() => { const stop=vi.fn();playerStops.push(stop);return stop }),
  }
})
vi.mock('../services/rooms.js', () => ({ watchRoom, watchPlayers }))

import { useRoomStore } from './room.js'

describe('room realtime subscription ownership', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    watchRoom.mockClear();watchPlayers.mockClear();roomStops.length=0;playerStops.length=0
  })

  it('shares one listener pair during route transitions and releases it once', () => {
    const store=useRoomStore()
    const releaseOldPage=store.subscribe('ABC123')
    const releaseNewPage=store.subscribe('ABC123')
    expect(watchRoom).toHaveBeenCalledTimes(1)
    expect(watchPlayers).toHaveBeenCalledTimes(1)
    releaseOldPage()
    expect(roomStops[0]).not.toHaveBeenCalled()
    releaseNewPage()
    expect(roomStops[0]).toHaveBeenCalledTimes(1)
    expect(playerStops[0]).toHaveBeenCalledTimes(1)
  })
})
