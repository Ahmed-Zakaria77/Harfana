export function stopRejection({ isMember, instantStopEnabled, status, deadlineMs, nowMs }) {
  if (!isMember) return 'not-member'
  if (!instantStopEnabled) return 'disabled'
  if (status !== 'answering') return 'already-stopped'
  if (nowMs >= deadlineMs) return 'deadline-passed'
  return null
}

export function completeAnswers(categories, values) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) return null
  const keys = Object.keys(values)
  if (keys.length !== categories.length || !categories.every(category => keys.includes(category))) return null
  const cleaned = {}
  for (const category of categories) {
    if (typeof values[category] !== 'string') return null
    const answer = values[category].trim()
    if (!answer || answer.length > 80) return null
    cleaned[category] = answer
  }
  return cleaned
}
