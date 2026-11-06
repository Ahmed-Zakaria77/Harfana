export const COUNTDOWN_BOUNDARIES = new Set([30,25,20,15,10,9,8,7,6,5,4,3,2,1,0])

export function countdownCue({ previous, current, status='answering', visible=true, stopReason=null }) {
  if (stopReason === 'harfana') return 'harfana'
  if (status !== 'answering' || !visible || previous == null || current === previous) return null
  if (!COUNTDOWN_BOUNDARIES.has(current) || previous - current > 1) return null
  if (current === 0) return 'roundEnd'
  if (current <= 2) return 'tickFinal'
  if (current <= 5) return 'tickStrong'
  return 'tick'
}

export function transitionSound({ from, to, stopReason, isFinalRound=false }) {
  if (from === 'answering' && to === 'reviewing') return stopReason === 'harfana' ? 'harfana' : 'roundEnd'
  if (to === 'finalized') return isFinalRound ? 'winner' : 'results'
  return null
}
