import type { AdminPassageItem, AdminWordItem, ContentBank, GameId, StudyTopic } from '@/types'
import { topicFitsAge } from '@/lib/age'

/**
 * Índices en memoria sobre el content bank.
 * Equivalente a meta-indexing para consultas frecuentes sin escanear arrays enteros.
 */
export interface ContentQueryIndex {
  wordsById: Map<string, AdminWordItem>
  passagesById: Map<string, AdminPassageItem>
  topicsBySubject: Map<GameId, StudyTopic[]>
  /** Buckets por edad (3–12) con ids de topics aplicables. */
  topicIdsByAge: Map<number, string[]>
  wordIdsByAge: Map<number, string[]>
  passageIdsByAge: Map<number, string[]>
}

function emptyAgeMaps() {
  const topicIdsByAge = new Map<number, string[]>()
  const wordIdsByAge = new Map<number, string[]>()
  const passageIdsByAge = new Map<number, string[]>()
  for (let age = 3; age <= 12; age += 1) {
    topicIdsByAge.set(age, [])
    wordIdsByAge.set(age, [])
    passageIdsByAge.set(age, [])
  }
  return { topicIdsByAge, wordIdsByAge, passageIdsByAge }
}

export function buildContentQueryIndex(bank: ContentBank): ContentQueryIndex {
  const wordsById = new Map(bank.words.map((item) => [item.id, item]))
  const passagesById = new Map(bank.passages.map((item) => [item.id, item]))
  const topicsBySubject = new Map<GameId, StudyTopic[]>()
  const { topicIdsByAge, wordIdsByAge, passageIdsByAge } = emptyAgeMaps()

  for (const topic of bank.topics) {
    const list = topicsBySubject.get(topic.subjectId) ?? []
    list.push(topic)
    topicsBySubject.set(topic.subjectId, list)
    for (let age = topic.minAge; age <= topic.maxAge; age += 1) {
      topicIdsByAge.get(age)?.push(topic.id)
    }
  }

  for (const word of bank.words) {
    for (let age = word.minAge; age <= word.maxAge; age += 1) {
      wordIdsByAge.get(age)?.push(word.id)
    }
  }

  for (const passage of bank.passages) {
    for (let age = passage.minAge; age <= passage.maxAge; age += 1) {
      passageIdsByAge.get(age)?.push(passage.id)
    }
  }

  return {
    wordsById,
    passagesById,
    topicsBySubject,
    topicIdsByAge,
    wordIdsByAge,
    passageIdsByAge,
  }
}

export function indexedTopicsForAge(
  bank: ContentBank,
  index: ContentQueryIndex,
  age: number | null,
  subjectId?: GameId,
): StudyTopic[] {
  if (age == null) {
    return bank.topics.filter((topic) => (subjectId ? topic.subjectId === subjectId : true))
  }
  const ids = new Set(index.topicIdsByAge.get(age) ?? [])
  return bank.topics.filter(
    (topic) => ids.has(topic.id) && (subjectId ? topic.subjectId === subjectId : true),
  )
}

export function indexedWordsForAge(
  bank: ContentBank,
  index: ContentQueryIndex,
  age: number | null,
): AdminWordItem[] {
  if (age == null) return bank.words
  const ids = new Set(index.wordIdsByAge.get(age) ?? [])
  return bank.words.filter((item) => ids.has(item.id) || topicFitsAge(item, age))
}
