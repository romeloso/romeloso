import type { GameLevelMeta, LessonDefinition } from '@/types'
import { READING_LESSONS } from './content'

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
    title: 'Leer palabras',
    subtitle: 'Próximamente',
    icon: '🦋',
    lessonIds: [],
  },
  {
    id: 'reading-l7',
    gameId: 'reading',
    order: 7,
    title: 'Frases',
    subtitle: 'Próximamente',
    icon: '📝',
    lessonIds: [],
  },
  {
    id: 'reading-l8',
    gameId: 'reading',
    order: 8,
    title: 'Historias',
    subtitle: 'Próximamente',
    icon: '📖',
    lessonIds: [],
  },
]

export function getReadingLessons(): LessonDefinition[] {
  return READING_LESSONS
}

export function getReadingLesson(lessonId: string): LessonDefinition | undefined {
  return READING_LESSONS.find((lesson) => lesson.id === lessonId)
}
