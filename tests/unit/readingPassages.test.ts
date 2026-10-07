import { describe, expect, it } from 'vitest'
import { READING_PASSAGE_LESSONS } from '@/data/games/reading/passages'
import { getAvailableReadingLevels, getBuiltinReadingLessons } from '@/data/games/reading/levels'

describe('lecturas por grado', () => {
  it('incluye lecturas de varios géneros', () => {
    const genres = new Set(READING_PASSAGE_LESSONS.map((lesson) => lesson.genre))
    expect(genres.has('cuento')).toBe(true)
    expect(genres.has('informativa')).toBe(true)
    expect(genres.has('poema')).toBe(true)
    expect(genres.has('dialogo')).toBe(true)
    expect(genres.has('fabula')).toBe(true)
  })

  it('filtra lecturas por grado preescolar', () => {
    const lessons = getBuiltinReadingLessons(5, 0)
    const ids = lessons.map((lesson) => lesson.id)
    expect(ids).toContain('reading-pass-early-cuento')
    expect(ids).not.toContain('reading-pass-upper-info')
  })

  it('filtra lecturas por grado 5', () => {
    const lessons = getBuiltinReadingLessons(10, 5)
    const ids = lessons.map((lesson) => lesson.id)
    expect(ids).toContain('reading-pass-upper-cuento')
    expect(ids).not.toContain('reading-pass-early-cuento')
  })

  it('expone nivel de lecturas por grado cuando hay contenido', () => {
    const levels = getAvailableReadingLevels(undefined, 10, 5)
    expect(levels.some((level) => level.id === 'reading-l9')).toBe(true)
  })

  it('tiene preguntas puntuables en cada lectura', () => {
    for (const lesson of READING_PASSAGE_LESSONS) {
      expect(lesson.activities.length).toBeGreaterThanOrEqual(2)
      expect(lesson.activities.every((item) => item.kind === 'reading_comprehension')).toBe(true)
    }
  })
})
