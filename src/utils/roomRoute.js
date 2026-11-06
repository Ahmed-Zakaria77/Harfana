export function roomRoute(room, code) {
  if (!room || !code) return null
  if (room.status === 'playing' && room.currentRoundId) return `/room/${code}/round/${room.currentRoundId}`
  if (room.status === 'review' && room.currentRoundId) return `/room/${code}/round/${room.currentRoundId}/review`
  if (room.status === 'results') return `/room/${code}/results`
  if (room.status === 'lobby') return `/room/${code}`
  return null
}

export function syncRoomRoute(router, currentPath, room, code) {
  const target = roomRoute(room, code)
  if (target && target !== currentPath) return router.replace(target)
  return null
}
