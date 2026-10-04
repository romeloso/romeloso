import { describe, expect, it } from 'vitest'
import {
  difficultyFromGrade,
  effectiveLearningAge,
  formatGrade,
  parseSchoolGrade,
  topicFitsGrade,
  typicalAgeFromGrade,
} from './grade'

describe('grade helpers', () => {
  it('parsea y formatea grados', () => {
    expect(parseSchoolGrade('3')).toBe(3)
    expect(parseSchoolGrade('')).toBeNull()
    expect(formatGrade(1)).toBe('1° grado')
    expect(formatGrade(null)).toBe('Grado sin definir')
  })

  it('mapea edad típica y dificultad', () => {
    expect(typicalAgeFromGrade(0)).toBe(5)
    expect(typicalAgeFromGrade(6)).toBe(11)
    expect(difficultyFromGrade(1)).toBe('early')
    expect(difficultyFromGrade(5)).toBe('upper')
  })

  it('filtra por rango de grado y edad efectiva', () => {
    expect(topicFitsGrade({ minGrade: 1, maxGrade: 3 }, 2)).toBe(true)
    expect(topicFitsGrade({ minGrade: 1, maxGrade: 3 }, 5)).toBe(false)
    expect(effectiveLearningAge(8, 2)).toBe(8)
    expect(effectiveLearningAge(null, 4)).toBe(9)
  })
})
