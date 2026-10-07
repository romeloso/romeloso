import type { ContentBank, GameLevelMeta, LessonDefinition, SchoolGrade } from '@/types'
import { contentFitsLearner } from '@/lib/grade'
import { READING_LESSONS } from './content'
import { READING_PASSAGE_LESSONS } from './passages'
import { READING_QUIZ_AND_PRACTICE_LESSONS } from './quizContent'
import { getCachedAdminReadingLessons } from '@/services/cache/contentCache'

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
    lessonIds: [
      'reading-l8-a',
      'reading-pass-early-cuento',
      'reading-pass-early-info',
      'reading-pass-early-poema',
      'reading-pass-early-dialogo',
      'reading-pass-mid-cuento',
      'reading-pass-mid-info',
      'reading-pass-mid-fabula',
      'reading-admin-passages',
    ],
  },
  {
    id: 'reading-l9',
    gameId: 'reading',
    order: 9,
    title: 'Lecturas por grado',
    subtitle: 'Cuentos, textos e ideas con puntuación',
    icon: '📚',
    lessonIds: [
      'reading-pass-mid-dialogo',
      'reading-pass-upper-cuento',
      'reading-pass-upper-info',
      'reading-pass-upper-poema',
      'reading-pass-upper-fabula',
      'reading-pass-upper-dialogo',
    ],
  },
]

function lessonFitsLearner(
  lesson: LessonDefinition,
  learner: { age: number | null; grade: SchoolGrade | null },
) {
  if (
    lesson.minAge == null &&
    lesson.maxAge == null &&
    lesson.minGrade == null &&
    lesson.maxGrade == null
  ) {
    return true
  }
  return contentFitsLearner(
    {
      minAge: lesson.minAge ?? 0,
      maxAge: lesson.maxAge ?? 99,
      minGrade: lesson.minGrade,
      maxGrade: lesson.maxGrade,
    },
    learner,
  )
}

export function getBuiltinReadingLessons(
  age: number | null = null,
  grade: SchoolGrade | null = null,
): LessonDefinition[] {
  const learner = { age, grade }
  return [
    ...READING_LESSONS,
    ...READING_QUIZ_AND_PRACTICE_LESSONS,
    ...READING_PASSAGE_LESSONS,
  ].filter((lesson) => lessonFitsLearner(lesson, learner))
}

export function getReadingLessons(
  bank?: ContentBank,
  age: number | null = null,
  grade: SchoolGrade | null = null,
): LessonDefinition[] {
  const adminLessons = bank ? getCachedAdminReadingLessons(bank, age, grade) : []
  const adminIds = new Set(adminLessons.map((lesson) => lesson.id))
  const builtin = getBuiltinReadingLessons(age, grade).filter((lesson) => !adminIds.has(lesson.id))
  return [...builtin, ...adminLessons]
}

export function getReadingLesson(
  lessonId: string,
  bank?: ContentBank,
  age: number | null = null,
  grade: SchoolGrade | null = null,
): LessonDefinition | undefined {
  return getReadingLessons(bank, age, grade).find((lesson) => lesson.id === lessonId)
}

/** Niveles con lecciones realmente disponibles según el bank, edad y grado. */
export function getAvailableReadingLevels(
  bank?: ContentBank,
  age: number | null = null,
  grade: SchoolGrade | null = null,
): GameLevelMeta[] {
  const lessons = getReadingLessons(bank, age, grade)
  const availableIds = new Set(lessons.map((lesson) => lesson.id))

  return READING_LEVELS.map((level) => ({
    ...level,
    lessonIds: level.lessonIds.filter((id) => availableIds.has(id)),
  })).filter((level) => level.lessonIds.length > 0)
}
