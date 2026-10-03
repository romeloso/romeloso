export type AgeBand = 'early' | 'primary' | 'upper'

export function ageFromBirthDate(birthDate: string | null | undefined, today = new Date()): number | null {
  if (!birthDate) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const birth = new Date(year, month - 1, day)
  if (Number.isNaN(birth.getTime())) return null

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }

  return Math.max(0, Math.min(18, age))
}

export function ageBandFromAge(age: number | null): AgeBand {
  if (age == null) return 'primary'
  if (age <= 5) return 'early'
  if (age <= 8) return 'primary'
  return 'upper'
}

export function ageBandLabel(band: AgeBand): string {
  if (band === 'early') return 'Inicial (3–5)'
  if (band === 'primary') return 'Básico (6–8)'
  return 'Avanzado (9–12)'
}

export function topicFitsAge(topic: { minAge: number; maxAge: number }, age: number | null): boolean {
  if (age == null) return true
  return age >= topic.minAge && age <= topic.maxAge
}

export function formatAge(age: number | null): string {
  if (age == null) return 'Edad sin definir'
  return age === 1 ? '1 año' : `${age} años`
}
