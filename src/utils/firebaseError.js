export function firebaseErrorInfo(error) {
  return {
    code: error?.code || 'unknown',
    message: error?.message || String(error || 'Unknown Firebase error'),
    name: error?.name || 'FirebaseError',
  }
}

export function reportFirebaseError(context, error) {
  const info = firebaseErrorInfo(error)
  if (import.meta.env.DEV) console.error(`[Firebase:${context}]`, info, error)
  return info
}

export function firebaseErrorMessage(context, error, friendlyMessage) {
  const info = reportFirebaseError(context, error)
  return import.meta.env.DEV ? `${friendlyMessage} [${info.code}] ${info.message}` : friendlyMessage
}
