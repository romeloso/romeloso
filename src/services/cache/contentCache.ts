import type { ContentBank, GameId, LessonDefinition, StudyTopic } from '@/types'
import { buildAdminReadingLessons, topicsForAge } from '@/services/contentService'
import { contentBankFingerprint, MemoryCache } from './memoryCache'

const lessonCache = new MemoryCache<LessonDefinition[]>({ maxEntries: 32, ttlMs: 120_000 })
const topicCache = new MemoryCache<StudyTopic[]>({ maxEntries: 48, ttlMs: 120_000 })

export function getCachedAdminReadingLessons(
  bank: ContentBank,
  age: number | null,
): LessonDefinition[] {
  const key = `lessons:${contentBankFingerprint(bank)}:${age ?? 'any'}`
  const hit = lessonCache.get(key)
  if (hit) return hit
  const lessons = buildAdminReadingLessons(bank, age)
  lessonCache.set(key, lessons)
  return lessons
}

export function getCachedTopicsForAge(
  topics: StudyTopic[],
  age: number | null,
  subjectId?: GameId,
): StudyTopic[] {
  const key = `topics:${topics.length}:${topics[0]?.id ?? ''}:${age ?? 'any'}:${subjectId ?? 'all'}`
  const hit = topicCache.get(key)
  if (hit) return hit
  const filtered = topicsForAge(topics, age, subjectId)
  topicCache.set(key, filtered)
  return filtered
}

export function invalidateContentCaches() {
  lessonCache.invalidate()
  topicCache.invalidate()
}

export const contentCacheStats = () => ({
  lessons: lessonCache.size(),
  topics: topicCache.size(),
})
