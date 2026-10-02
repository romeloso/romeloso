import { APP_CONFIG } from '@/config/app'

export function xpRequiredForLevel(level: number): number {
  return Math.round(APP_CONFIG.xpPerLevelBase * Math.pow(level, 1.35))
}

export function levelFromXp(xp: number): number {
  let level = 1
  let remaining = xp

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level)
    level += 1
    if (level > 99) break
  }

  return level
}

export function xpProgressWithinLevel(xp: number): {
  level: number
  current: number
  needed: number
  ratio: number
} {
  let level = 1
  let remaining = xp

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level)
    level += 1
    if (level > 99) break
  }

  const needed = xpRequiredForLevel(level)
  return {
    level,
    current: remaining,
    needed,
    ratio: needed === 0 ? 1 : Math.min(1, remaining / needed),
  }
}

export function starsFromAccuracy(accuracy: number): number {
  if (accuracy >= 0.95) return 3
  if (accuracy >= 0.8) return 2
  if (accuracy >= 0.6) return 1
  return 0
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function nextDayKey(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}
