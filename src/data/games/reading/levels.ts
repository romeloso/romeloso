import type { ContentBank, GameLevelMeta, LessonDefinition } from '@/types'
import { READING_LESSONS } from './content'
import { READING_QUIZ_AND_PRACTICE_LESSONS } from './quizContent'
import { buildAdminReadingLessons } from '@/services/contentService'

export const READING_LEVELS: GameLevelMeta[] = [
  {
    id: 'reading-l1',
    gameId: 'reading',
    order: 1,
    title: 'Letras',
    subtitle: 'Reconoce las letras del abecedario',
    icon: '🔤',
    lessonIds: ['reading-l1-a', 'reading-l1-b'],
  },
  {
    id: 'reading-l2',
    gameId: 'reading',
    order: 2,
    title: 'Letra e imagen',
    subtitle: 'Asocia letras con palabras',
    icon: '🍎',
    lessonIds: ['reading-l2-a', 'reading-l2-b'],
  },
  {
    id: 'reading-l3',
    gameId: 'reading',
    order: 3,
    title: 'Sílabas',
    subtitle: 'Forma sílabas sencillas',
    icon: '🧩',
    lessonIds: ['reading-l3-a', 'reading-l3-b'],
  },
  {
    id: 'reading-l4',
    gameId: 'reading',
    order: 4,
    title: 'Palabras cortas',
    subtitle: 'Lee palabras fáciles',
    icon: '🐱',
    lessonIds: ['reading-l4-a', 'reading-l4-b'],
  },
  {
    id: 'reading-l5',
    gameId: 'reading',
    order: 5,
    title: 'Construir palabras',
    subtitle: 'Ordena letras para formar palabras',
    icon: '🏠',
    lessonIds: ['reading-l5-a', 'reading-l5-b'],
  },
  {
    id: 'reading-l6',
    gameId: 'reading',
    order: 6,
    title: 'Quiz de palabras',
    subtitle: 'Identifica la palabra correcta',
    icon: '🧠',
    lessonIds: ['reading-l6-a', 'reading-l6-b', 'reading-admin-quiz'],
  },
  {
    id: 'reading-l7',
    gameId: 'reading',
    order: 7,
    title: 'Práctica de lectura',
    subtitle: 'Lee y recibe corrección al instante',
    icon: '📝',
    lessonIds: ['reading-l7-a', 'reading-l7-b', 'reading-admin-practice'],
  },
  {
    id: 'reading-l8',
    gameId: 'reading',
    order: 8,
    title: 'Historias',
    subtitle: 'Lee y responde preguntas',
    icon: '📖',
    lessonIds: ['reading-l8-a', 'reading-admin-passages'],
  },
]

export function getBuiltinReadingLessons(): LessonDefinition[] {
  return [...READING_LESSONS, ...READING_QUIZ_AND_PRACTICE_LESSONS]
}

export function getReadingLessons(bank?: ContentBank): LessonDefinition[] {
  const adminLessons = bank ? buildAdminReadingLessons(bank) : []
  const adminIds = new Set(adminLessons.map((lesson) => lesson.id))
  const builtin = getBuiltinReadingLessons().filter((lesson) => !adminIds.has(lesson.id))
  return [...builtin, ...adminLessons]
}

export function getReadingLesson(
  lessonId: string,
  bank?: ContentBank,
): LessonDefinition | undefined {
  return getReadingLessons(bank).find((lesson) => lesson.id === lessonId)
}

/** Niveles con lecciones realmente disponibles según el bank. */
export function getAvailableReadingLevels(bank?: ContentBank): GameLevelMeta[] {
  const lessons = getReadingLessons(bank)
  const availableIds = new Set(lessons.map((lesson) => lesson.id))

  return READING_LEVELS.map((level) => ({
    ...level,
    lessonIds: level.lessonIds.filter((id) => availableIds.has(id)),
  })).filter((level) => level.lessonIds.length > 0)
}
