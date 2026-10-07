/** Configuración central de marca Sorovagames (guía de estilo oficial). */
export const APP_CONFIG = {
  name: 'Sorovagames',
  slug: 'sorovagames',
  tagline: 'Aprender es una aventura',
  slogan: 'Grandes sueños, pequeños logros',
  version: '0.3.0',
  storageKey: 'sorovagames.v1',
  unlockThreshold: 0.7,
  xpPerLevelBase: 100,
  defaultSoundEnabled: true,
  brandImage: '/brand-sorova.jpg',
  styleGuideImage: '/brand/styleguide-sorova.png',
} as const

/** Paleta oficial de la guía de estilo Sorova Games. */
export const BRAND_COLORS = {
  navy: '#1E3A8A',
  sky: '#3B82F6',
  cyan: '#06B6D4',
  emerald: '#10B981',
  pink: '#F472B6',
  amber: '#F59E0B',
  violet: '#8B5CF6',
  yellow: '#FDE047',
  /** Alias de compatibilidad con componentes existentes. */
  indigo: '#3B82F6',
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
