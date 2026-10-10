import type { AppState, ChildProfile, SessionRole } from '@/types'

/** Nombre en mayúsculas, sin tildes ni espacios: «María José» → MARIAJOSE. */
export function normalizePersonName(name: string) {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

export function normalizeAccessCode(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

/**
 * Código del niño: nombre + día + mes + año (dos dígitos).
 * Sophia, 4 de diciembre de 2017 → SOPHIA041217.
 */
export function childAccessCode(name: string, birthDate: string | null | undefined) {
  if (!birthDate) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate)
  if (!match) return null
  const namePart = normalizePersonName(name)
  if (!namePart) return null
  const year = match[1] ?? ''
  const month = match[2] ?? ''
  const day = match[3] ?? ''
  return `${namePart}${day}${month}${year.slice(2)}`
}

export function createTutorAccessCode(name: string, taken: Set<string>) {
  const base = normalizePersonName(name).slice(0, 10) || 'TUTOR'
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const suffix = String(Math.floor(1000 + Math.random() * 9000))
    const code = `${base}${suffix}`
    if (!taken.has(code)) return code
  }
  return `${base}${crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`
}

export function normalizeSessionRole(role: unknown): SessionRole {
  if (role === 'child' || role === 'tutor' || role === 'superadmin') return role
  if (role === 'admin') return 'superadmin'
  return 'child'
}

export function canManageProfiles(role: SessionRole) {
  return role === 'tutor' || role === 'superadmin'
}

export function visibleChildProfiles(state: Pick<AppState, 'profiles' | 'sessionRole' | 'activeTutorId'>) {
  const profiles = Object.values(state.profiles)
  if (state.sessionRole === 'superadmin') return profiles
  if (state.sessionRole === 'tutor' && state.activeTutorId) {
    return profiles.filter((profile) => profile.tutorId === state.activeTutorId)
  }
  return []
}

export function ownsChild(state: Pick<AppState, 'sessionRole' | 'activeTutorId' | 'activeProfileId'>, profile: ChildProfile) {
  if (state.sessionRole === 'superadmin') return true
  if (state.sessionRole === 'tutor') return profile.tutorId === state.activeTutorId
  return state.sessionRole === 'child' && state.activeProfileId === profile.id
}
