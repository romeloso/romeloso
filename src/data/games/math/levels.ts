import type { GameLevelMeta, LessonDefinition, SchoolGrade } from '@/types'
import { contentFitsLearner } from '@/lib/grade'
import { MATH_LESSONS } from './content'

export const MATH_LEVELS: GameLevelMeta[] = [
  {
    id: 'math-l1',
    gameId: 'math',
    order: 1,
    title: 'Contar',
    subtitle: 'Reconoce y elige números',
    icon: '1️⃣',
    lessonIds: ['math-l1-a', 'math-l1-b'],
  },
  {
    id: 'math-l2',
    gameId: 'math',
    order: 2,
    title: 'Sumas',
    subtitle: 'Suma con confianza',
    icon: '➕',
    lessonIds: ['math-l2-a', 'math-l2-b'],
  },
  {
    id: 'math-l3',
    gameId: 'math',
    order: 3,
    title: 'Restas',
    subtitle: 'Resta paso a paso',
    icon: '➖',
    lessonIds: ['math-l3-a', 'math-l3-b'],
  },
  {
    id: 'math-l4',
    gameId: 'math',
    order: 4,
    title: 'Problemas',
    subtitle: 'Resuelve situaciones reales',
    icon: '🧠',
    lessonIds: ['math-l4-a', 'math-l4-b'],
  },
]

export function getMathLessons(
  age: number | null = null,
  grade: SchoolGrade | null = null,
): LessonDefinition[] {
  const learner = { age, grade }
  return MATH_LESSONS.filter((lesson) =>
    contentFitsLearner(
      {
        minAge: lesson.minAge ?? 0,
        maxAge: lesson.maxAge ?? 99,
        minGrade: lesson.minGrade,
        maxGrade: lesson.maxGrade,
      },
      learner,
    ),
  )
}

export function getMathLesson(
  lessonId: string,
  age: number | null = null,
  grade: SchoolGrade | null = null,
): LessonDefinition | undefined {
  return getMathLessons(age, grade).find((lesson) => lesson.id === lessonId)
}

export function getAvailableMathLevels(
  age: number | null = null,
  grade: SchoolGrade | null = null,
): GameLevelMeta[] {
  const availableIds = new Set(getMathLessons(age, grade).map((lesson) => lesson.id))
  return MATH_LEVELS.map((level) => ({
    ...level,
    lessonIds: level.lessonIds.filter((id) => availableIds.has(id)),
  })).filter((level) => level.lessonIds.length > 0)
}
