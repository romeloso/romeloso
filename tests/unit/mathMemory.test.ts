import { describe, expect, it } from 'vitest'
import { getAvailableMathLevels, getMathLessons } from '@/data/games/math/levels'
import { getAvailableMemoryLevels, getMemoryRounds } from '@/data/games/memory/levels'
import { createInitialGameProgress } from '@/domain/progress'

describe('matemáticas y memoria', () => {
  it('adapta lecciones de mates por grado', () => {
    const early = getMathLessons(5, 0).map((lesson) => lesson.id)
    const upper = getMathLessons(11, 6).map((lesson) => lesson.id)
    expect(early).toContain('math-l1-a')
    expect(early).not.toContain('math-l4-b')
    expect(upper).toContain('math-l4-b')
  })

  it('crea progreso inicial de mates con niveles', () => {
    const levels = getAvailableMathLevels()
    const progress = createInitialGameProgress('math', levels)
    expect(progress.unlockedLevelIds.length).toBeGreaterThan(0)
    expect(Object.keys(progress.lessonProgress).length).toBeGreaterThan(0)
  })

  it('adapta rondas de memoria por grado', () => {
    const early = getMemoryRounds(5, 0).map((round) => round.id)
    const upper = getMemoryRounds(11, 6).map((round) => round.id)
    expect(early).toContain('memory-l1-a')
    expect(early).not.toContain('memory-l3-a')
    expect(upper).toContain('memory-l3-a')
  })

  it('expone niveles de memoria disponibles', () => {
    const levels = getAvailableMemoryLevels(8, 3)
    expect(levels.length).toBeGreaterThan(0)
  })
})
