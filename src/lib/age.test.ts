import { describe, expect, it } from 'vitest'
import { ageBandFromAge, ageFromBirthDate, formatAge, topicFitsAge } from './age'

describe('ageFromBirthDate', () => {
  it('calcula edad desde fecha ISO', () => {
    const today = new Date(2026, 9, 4) // 4 oct 2026
    expect(ageFromBirthDate('2018-05-10', today)).toBe(8)
    expect(ageFromBirthDate('2019-10-04', today)).toBe(7)
    expect(ageFromBirthDate('2019-10-05', today)).toBe(6)
  })

  it('retorna null si no hay fecha', () => {
    expect(ageFromBirthDate(null)).toBeNull()
    expect(ageFromBirthDate('no-fecha')).toBeNull()
  })
})

describe('age helpers', () => {
  it('clasifica bandas', () => {
    expect(ageBandFromAge(4)).toBe('early')
    expect(ageBandFromAge(7)).toBe('primary')
    expect(ageBandFromAge(10)).toBe('upper')
  })

  it('formatea edad y filtra topics', () => {
    expect(formatAge(1)).toBe('1 año')
    expect(formatAge(7)).toBe('7 años')
    expect(topicFitsAge({ minAge: 3, maxAge: 8 }, 7)).toBe(true)
    expect(topicFitsAge({ minAge: 3, maxAge: 8 }, 10)).toBe(false)
  })
})
