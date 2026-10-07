import type { GameLevelMeta, LessonDefinition, SchoolGrade } from '@/types'
import { contentFitsLearner } from '@/lib/grade'

export interface MemoryRoundDef {
  id: string
  levelId: string
  title: string
  pairs: string[]
  minGrade: number
  maxGrade: number
  minAge: number
  maxAge: number
}

export const MEMORY_ROUNDS: MemoryRoundDef[] = [
  {
    id: 'memory-l1-a',
    levelId: 'memory-l1',
    title: 'Parejas de animales',
    pairs: ['🐶', '🐱', '🐰', '🦊'],
    minGrade: 0,
    maxGrade: 2,
    minAge: 4,
    maxAge: 8,
  },
  {
    id: 'memory-l1-b',
    levelId: 'memory-l1',
    title: 'Parejas de frutas',
    pairs: ['🍎', '🍌', '🍇', '🍓'],
    minGrade: 0,
    maxGrade: 3,
    minAge: 4,
    maxAge: 9,
  },
  {
    id: 'memory-l2-a',
    levelId: 'memory-l2',
    title: 'Emociones',
    pairs: ['😀', '😢', '😡', '😮', '😴', '🥳'],
    minGrade: 1,
    maxGrade: 4,
    minAge: 6,
    maxAge: 10,
  },
  {
    id: 'memory-l2-b',
    levelId: 'memory-l2',
    title: 'Medios de transporte',
    pairs: ['🚗', '🚌', '✈️', '🚢', '🚲', '🚂'],
    minGrade: 2,
    maxGrade: 5,
    minAge: 7,
    maxAge: 11,
  },
  {
    id: 'memory-l3-a',
    levelId: 'memory-l3',
    title: 'Ciencia y planeta',
    pairs: ['🌍', '🌙', '⭐', '🔥', '💧', '🌱', '🧪', '🔭'],
    minGrade: 3,
    maxGrade: 6,
    minAge: 8,
    maxAge: 12,
  },
  {
    id: 'memory-l3-b',
    levelId: 'memory-l3',
    title: 'Deportes',
    pairs: ['⚽', '🏀', '🎾', '🏐', '🏊', '🚴', '🤸', '🏆'],
    minGrade: 3,
    maxGrade: 6,
    minAge: 8,
    maxAge: 12,
  },
]

export const MEMORY_LEVELS: GameLevelMeta[] = [
  {
    id: 'memory-l1',
    gameId: 'memory',
    order: 1,
    title: 'Parejas fáciles',
    subtitle: 'Encuentra 4 pares',
    icon: '🧩',
    lessonIds: ['memory-l1-a', 'memory-l1-b'],
  },
  {
    id: 'memory-l2',
    gameId: 'memory',
    order: 2,
    title: 'Más memoria',
    subtitle: 'Encuentra 6 pares',
    icon: '🧠',
    lessonIds: ['memory-l2-a', 'memory-l2-b'],
  },
  {
    id: 'memory-l3',
    gameId: 'memory',
    order: 3,
    title: 'Reto experto',
    subtitle: 'Encuentra 8 pares',
    icon: '🏆',
    lessonIds: ['memory-l3-a', 'memory-l3-b'],
  },
]

export function getMemoryRounds(
  age: number | null = null,
  grade: SchoolGrade | null = null,
): MemoryRoundDef[] {
  return MEMORY_ROUNDS.filter((round) =>
    contentFitsLearner(
      {
        minAge: round.minAge,
        maxAge: round.maxAge,
        minGrade: round.minGrade,
        maxGrade: round.maxGrade,
      },
      { age, grade },
    ),
  )
}

export function getMemoryRound(
  roundId: string,
  age: number | null = null,
  grade: SchoolGrade | null = null,
): MemoryRoundDef | undefined {
  return getMemoryRounds(age, grade).find((round) => round.id === roundId)
}

export function getAvailableMemoryLevels(
  age: number | null = null,
  grade: SchoolGrade | null = null,
): GameLevelMeta[] {
  const availableIds = new Set(getMemoryRounds(age, grade).map((round) => round.id))
  return MEMORY_LEVELS.map((level) => ({
    ...level,
    lessonIds: level.lessonIds.filter((id) => availableIds.has(id)),
  })).filter((level) => level.lessonIds.length > 0)
}

/** Lecciones sintéticas para progreso/desbloqueo (el juego usa MemoryPage). */
export function getMemoryLessons(
  age: number | null = null,
  grade: SchoolGrade | null = null,
): LessonDefinition[] {
  return getMemoryRounds(age, grade).map((round) => ({
    id: round.id,
    gameId: 'memory',
    levelId: round.levelId,
    title: round.title,
    minAge: round.minAge,
    maxAge: round.maxAge,
    minGrade: round.minGrade,
    maxGrade: round.maxGrade,
    activities: [],
  }))
}
