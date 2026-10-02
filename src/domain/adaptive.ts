import type { AdaptiveHint, LessonSessionResult } from '@/types'

export function evaluateAdaptiveDifficulty(
  recentResults: LessonSessionResult[],
): AdaptiveHint {
  if (recentResults.length === 0) {
    return {
      mode: 'steady',
      message: '¡Vamos a practicar juntas!',
    }
  }

  const window = recentResults.slice(-3)
  const avgAccuracy =
    window.reduce((sum, item) => sum + item.accuracy, 0) / window.length

  if (avgAccuracy >= 0.9) {
    return {
      mode: 'challenge',
      message: '¡Estás lista para un nuevo reto!',
    }
  }

  if (avgAccuracy < 0.6) {
    return {
      mode: 'reinforce',
      message: 'Vamos a practicar un poquito más',
    }
  }

  return {
    mode: 'steady',
    message: '¡Vas muy bien! Sigue así',
  }
}
