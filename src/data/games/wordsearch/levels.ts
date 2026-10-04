import type { GameLevelMeta, LessonDefinition, SchoolGrade } from '@/types'
import { getWordSearchLevelsForAge, getWordSearchPuzzle } from './puzzles'

export function getWordSearchLevels(
  age: number | null = null,
  grade: SchoolGrade | null = null,
): GameLevelMeta[] {
  return getWordSearchLevelsForAge(age, grade).map((level) => ({
    id: level.id,
    gameId: 'wordsearch',
    order: level.order,
    title: level.title,
    subtitle: level.subtitle,
    icon: level.icon,
    lessonIds: [level.id],
  }))
}

/** Lección sintética para reutilizar el sistema de progreso/recompensas. */
export function getWordSearchLesson(lessonId: string): LessonDefinition | undefined {
  const puzzle = getWordSearchPuzzle(lessonId)
  if (!puzzle) return undefined
  return {
    id: puzzle.id,
    gameId: 'wordsearch',
    levelId: puzzle.id,
    title: puzzle.title,
    activities: [
      {
        id: `${puzzle.id}-find`,
        kind: 'word_select',
        prompt: 'Encuentra todas las palabras',
        word: puzzle.words[0] ?? 'SOL',
        options: puzzle.words.map((word) => ({ id: word, label: word, value: word })),
        answer: puzzle.words[0] ?? 'SOL',
      },
    ],
  }
}
