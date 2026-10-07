/** Configuración central de marca Sorovagames. */
export const APP_CONFIG = {
  name: 'Sorovagames',
  slug: 'sorovagames',
  tagline: 'Aprender es una aventura',
  slogan: 'Grandes sueños, pequeños logros',
  version: '0.2.0',
  storageKey: 'sorovagames.v1',
  unlockThreshold: 0.7,
  xpPerLevelBase: 100,
  defaultSoundEnabled: true,
  brandImage: '/brand-sorova.jpg',
} as const

export const BRAND_COLORS = {
  indigo: '#6366F1',
  pink: '#EC4899',
  amber: '#F59E0B',
  emerald: '#10B981',
  sky: '#3B82F6',
  violet: '#8B5CF6',
  yellow: '#FDE047',
  navy: '#0F172A',
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
