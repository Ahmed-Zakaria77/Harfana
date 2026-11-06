export function answerCompletion(categories = [], answers = {}) {
  const missing = categories.filter(category => typeof answers[category] !== 'string' || answers[category].trim() === '')
  return { total: categories.length, completed: categories.length - missing.length, missing, isComplete: categories.length > 0 && missing.length === 0 }
}
