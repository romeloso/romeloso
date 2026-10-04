import type { AchievementDefinition, ChildProfile, GameProgress, LessonSessionResult } from '@/types'

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-lesson',
    title: 'Primera lección',
    description: 'Completaste tu primera actividad.',
    icon: '🌟',
    gameId: 'global',
  },
  {
    id: 'first-word',
    title: 'Primera palabra',
    description: 'Aprendiste tu primera palabra.',
    icon: '📖',
    gameId: 'reading',
  },
  {
    id: 'ten-words',
    title: '10 palabras',
    description: 'Ya conoces 10 palabras.',
    icon: '📚',
    gameId: 'reading',
  },
  {
    id: 'reading-streak-starter',
    title: 'Lectora constante',
    description: 'Jugaste 3 días seguidos.',
    icon: '🔥',
    gameId: 'global',
  },
  {
    id: 'typing-first-keys',
    title: 'Primeras teclas',
    description: 'Completaste tu primera lección de tecleo.',
    icon: '⌨️',
    gameId: 'typing',
  },
  {
    id: 'typing-accuracy-90',
    title: 'Precisión 90%',
    description: 'Alcanzaste 90% de precisión al teclear.',
    icon: '🎯',
    gameId: 'typing',
  },
  {
    id: 'typing-wpm-20',
    title: '20 PPM',
    description: 'Escribiste a 20 palabras por minuto.',
    icon: '⚡',
    gameId: 'typing',
  },
  {
    id: 'perfect-lesson',
    title: '¡Perfecto!',
    description: 'Completaste una lección sin errores.',
    icon: '🏆',
    gameId: 'global',
  },
  {
    id: 'coins-50',
    title: '50 monedas',
    description: 'Acumulaste 50 monedas.',
    icon: '🪙',
    gameId: 'global',
  },
]

export function evaluateAchievements(input: {
  profile: ChildProfile
  reading?: GameProgress
  typing?: GameProgress
  result: LessonSessionResult
}): AchievementDefinition[] {
  const owned = new Set(input.profile.achievements)
  const unlocked: AchievementDefinition[] = []

  const unlock = (id: string) => {
    if (owned.has(id)) return
    const achievement = ACHIEVEMENTS.find((item) => item.id === id)
    if (achievement) {
      owned.add(id)
      unlocked.push(achievement)
    }
  }

  unlock('first-lesson')

  if (input.result.accuracy >= 0.999) {
    unlock('perfect-lesson')
  }

  if (input.profile.streakDays >= 3) {
    unlock('reading-streak-starter')
  }

  if (input.profile.coins + 10 >= 50) {
    unlock('coins-50')
  }

  if (input.result.gameId === 'reading') {
    const words = (input.reading?.stats as { wordsLearned?: string[] } | undefined)?.wordsLearned ?? []
    if ((input.result.words?.length ?? 0) > 0 || words.length > 0) {
      unlock('first-word')
    }
    if (words.length + (input.result.words?.length ?? 0) >= 10) {
      unlock('ten-words')
    }
  }

  if (input.result.gameId === 'typing') {
    unlock('typing-first-keys')
    if (input.result.accuracy >= 0.9) {
      unlock('typing-accuracy-90')
    }
    if ((input.result.wpm ?? 0) >= 20) {
      unlock('typing-wpm-20')
    }
  }

  return unlocked
}
