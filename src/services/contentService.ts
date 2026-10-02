import type {
  AdminPassageItem,
  AdminWordItem,
  ChoiceOption,
  ContentBank,
  LessonDefinition,
  WordQuizActivity,
  ReadingPracticeActivity,
} from '@/types'

const choice = (value: string): ChoiceOption => ({
  id: value,
  label: value,
  value,
})

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

/** Convierte material del admin en lecciones jugables de lectura. */
export function buildAdminReadingLessons(bank: ContentBank): LessonDefinition[] {
  const lessons: LessonDefinition[] = []

  if (bank.words.length > 0) {
    const quizActivities: WordQuizActivity[] = bank.words.slice(0, 12).map((word, index) => {
      const options = shuffle([
        choice(word.word.toUpperCase()),
        ...word.distractors.slice(0, 2).map((item) => choice(item.toUpperCase())),
      ])
      while (options.length < 3) {
        options.push(choice(`OPCIÓN ${options.length + 1}`))
      }
      return {
        id: `admin-quiz-${word.id}-${index}`,
        kind: 'word_quiz',
        prompt: '¿Cuál es la palabra correcta?',
        image: word.image,
        clue: word.clue ?? `Elige la palabra: ${word.word}`,
        options,
        answer: word.word.toUpperCase(),
      }
    })

    const practiceActivities: ReadingPracticeActivity[] = bank.words.slice(0, 8).map((word, index) => ({
      id: `admin-practice-${word.id}-${index}`,
      kind: 'reading_practice',
      prompt: 'Lee y escribe la palabra',
      text: word.word.toUpperCase(),
      mode: 'type',
      answer: word.word.toUpperCase(),
      hint: word.clue,
    }))

    if (quizActivities.length > 0) {
      lessons.push({
        id: 'reading-admin-quiz',
        gameId: 'reading',
        levelId: 'reading-l6',
        title: 'Quiz del admin',
        source: 'admin',
        activities: quizActivities,
      })
    }

    if (practiceActivities.length > 0) {
      lessons.push({
        id: 'reading-admin-practice',
        gameId: 'reading',
        levelId: 'reading-l7',
        title: 'Práctica del admin',
        source: 'admin',
        activities: practiceActivities,
      })
    }
  }

  if (bank.passages.length > 0) {
    const passageActivities = bank.passages.flatMap((passage) => {
      const read: ReadingPracticeActivity = {
        id: `admin-pass-read-${passage.id}`,
        kind: 'reading_practice',
        prompt: 'Lee el texto con calma',
        text: passage.text,
        mode: 'choose',
        options: [choice('Ya lo leí')],
        answer: 'Ya lo leí',
        hint: passage.title,
      }
      const quiz: WordQuizActivity = {
        id: `admin-pass-quiz-${passage.id}`,
        kind: 'word_quiz',
        prompt: passage.question,
        clue: passage.text,
        options: shuffle(passage.options.map((item) => choice(item))),
        answer: passage.answer,
      }
      return [read, quiz]
    })

    lessons.push({
      id: 'reading-admin-passages',
      gameId: 'reading',
      levelId: 'reading-l8',
      title: 'Historias del admin',
      source: 'admin',
      activities: passageActivities,
    })
  }

  return lessons
}

export function createAdminWord(input: {
  word: string
  image?: string
  clue?: string
  distractors: string[]
}): AdminWordItem {
  return {
    id: `word-${crypto.randomUUID()}`,
    word: input.word.trim(),
    image: input.image?.trim() || undefined,
    clue: input.clue?.trim() || undefined,
    distractors: input.distractors.map((item) => item.trim()).filter(Boolean),
    createdAt: new Date().toISOString(),
  }
}

export function createAdminPassage(input: {
  title: string
  text: string
  question: string
  options: string[]
  answer: string
}): AdminPassageItem {
  return {
    id: `pass-${crypto.randomUUID()}`,
    title: input.title.trim(),
    text: input.text.trim(),
    question: input.question.trim(),
    options: input.options.map((item) => item.trim()).filter(Boolean),
    answer: input.answer.trim(),
    createdAt: new Date().toISOString(),
  }
}
