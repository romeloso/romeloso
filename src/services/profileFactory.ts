import { PROFILE_SEEDS } from '@/config/profiles'
import { createInitialGameProgress } from '@/domain/progress'
import { getAvailableReadingLevels } from '@/data/games/reading/levels'
import { TYPING_LEVELS } from '@/data/games/typing/levels'
import type { AppState, ChildProfile, ContentBank, GameId, GameProgress } from '@/types'

function nowIso() {
  return new Date().toISOString()
}

export function emptyContentBank(): ContentBank {
  return { words: [], passages: [] }
}

export function createProfileFromSeed(seed: (typeof PROFILE_SEEDS)[number]): ChildProfile {
  return {
    ...seed,
    level: 1,
    xp: 0,
    points: 0,
    coins: 0,
    streakDays: 0,
    lastPlayedDate: null,
    achievements: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function createDefaultProgressForChild(
  contentBank: ContentBank = emptyContentBank(),
): Record<GameId, GameProgress> {
  return {
    reading: createInitialGameProgress('reading', getAvailableReadingLevels(contentBank)),
    typing: createInitialGameProgress(
      'typing',
      TYPING_LEVELS.filter((level) => level.lessonIds.length > 0),
    ),
    memory: createInitialGameProgress('memory', []),
    math: createInitialGameProgress('math', []),
    science: createInitialGameProgress('science', []),
    english: createInitialGameProgress('english', []),
    creativity: createInitialGameProgress('creativity', []),
  }
}

export function createInitialAppState(soundEnabled = true): AppState {
  const profiles: Record<string, ChildProfile> = {}
  const progress: AppState['progress'] = {}

  for (const seed of PROFILE_SEEDS) {
    profiles[seed.id] = createProfileFromSeed(seed)
    progress[seed.id] = createDefaultProgressForChild()
  }

  return {
    version: 2,
    soundEnabled,
    activeProfileId: null,
    sessionRole: 'child',
    profiles,
    progress,
    contentBank: emptyContentBank(),
  }
}
