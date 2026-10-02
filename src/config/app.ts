/** Configuración central: cambiar el nombre de la app aquí. */
export const APP_CONFIG = {
  name: 'Mis Juegos',
  tagline: 'Aprender es una aventura',
  version: '0.1.0',
  storageKey: 'mis-juegos.v1',
  unlockThreshold: 0.7,
  xpPerLevelBase: 100,
  defaultSoundEnabled: true,
} as const

export const REWARD_RULES = {
  correctAnswerXp: 10,
  correctAnswerCoins: 2,
  lessonCompleteXp: 50,
  lessonCompleteCoins: 10,
  levelCompleteXp: 80,
  levelCompleteCoins: 20,
  perfectLessonBonusXp: 25,
  perfectLessonBonusCoins: 5,
  streakBonusCoins: 3,
} as const
