import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { APP_CONFIG } from '@/config/app'
import { ADMIN_CONFIG, PROFILE_SEEDS } from '@/config/profiles'
import { evaluateAchievements } from '@/data/achievements'
import { getAvailableReadingLevels } from '@/data/games/reading/levels'
import { TYPING_LEVELS } from '@/data/games/typing/levels'
import { evaluateAdaptiveDifficulty } from '@/domain/adaptive'
import { applyLessonResult, syncGameProgressWithLevels } from '@/domain/progress'
import { computeLessonRewards } from '@/domain/rewards'
import {
  createAdminPassage,
  createAdminWord,
} from '@/services/contentService'
import {
  createInitialAppState,
  emptyContentBank,
} from '@/services/profileFactory'
import { localAppStore } from '@/services/storage/localStore'
import { soundService } from '@/services/soundService'
import type {
  AdaptiveHint,
  AdminPassageItem,
  AdminWordItem,
  AppState,
  ChildProfile,
  GameId,
  GameProgress,
  LessonSessionResult,
  RewardPayload,
  SessionRole,
} from '@/types'

interface CompleteLessonResponse {
  reward: RewardPayload
  adaptive: AdaptiveHint
}

interface AppContextValue {
  ready: boolean
  state: AppState
  activeProfile: ChildProfile | null
  isAdmin: boolean
  selectProfile: (profileId: string) => void
  clearActiveProfile: () => void
  loginAdmin: (pin: string) => boolean
  logoutAdmin: () => void
  toggleSound: () => void
  getGameProgress: (gameId: GameId, profileId?: string) => GameProgress | null
  completeLesson: (result: LessonSessionResult) => CompleteLessonResponse | null
  resetAllProgress: () => void
  playSound: (name: 'correct' | 'wrong' | 'reward' | 'levelup') => void
  addWordMaterial: (input: {
    word: string
    image?: string
    clue?: string
    distractors: string[]
  }) => AdminWordItem
  addPassageMaterial: (input: {
    title: string
    text: string
    question: string
    options: string[]
    answer: string
  }) => AdminPassageItem
  removeWordMaterial: (id: string) => void
  removePassageMaterial: (id: string) => void
  updateProfileAvatar: (profileId: string, avatarImage: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function migrateState(raw: AppState | null): AppState {
  const base = createInitialAppState(APP_CONFIG.defaultSoundEnabled)
  if (!raw) return base

  const profiles = { ...base.profiles }
  for (const [id, profile] of Object.entries(raw.profiles ?? {})) {
    const seed = PROFILE_SEEDS.find((item) => item.id === id)
    const savedAvatar = profile.avatarImage
    const isCustomUpload = typeof savedAvatar === 'string' && savedAvatar.startsWith('data:')
    const isPhotoOrCartoon =
      typeof savedAvatar === 'string' &&
      (savedAvatar.includes('/avatars/photo/') || savedAvatar.includes('/avatars/cartoon/'))

    profiles[id] = {
      ...profiles[id],
      ...profile,
      avatarImage:
        isCustomUpload || isPhotoOrCartoon
          ? savedAvatar
          : (seed?.avatarImage ?? `/avatars/photo/${id}-1.jpg`),
      accent: profile.accent ?? seed?.accent ?? '#0f9b8e',
    }
  }

  const contentBank = raw.contentBank ?? emptyContentBank()
  const readingLevels = getAvailableReadingLevels(contentBank)
  const typingLevels = TYPING_LEVELS.filter((level) => level.lessonIds.length > 0)

  const progressEntries = Object.entries(raw.progress ?? {}).map(([childId, games]) => {
    const merged = { ...base.progress[childId], ...games } as Record<GameId, GameProgress>
    if (merged.reading) {
      merged.reading = syncGameProgressWithLevels(merged.reading, readingLevels)
    }
    if (merged.typing) {
      merged.typing = syncGameProgressWithLevels(merged.typing, typingLevels)
    }
    return [childId, merged] as const
  })

  return {
    ...base,
    ...raw,
    version: 2,
    sessionRole: (raw.sessionRole as SessionRole | undefined) ?? 'child',
    contentBank,
    profiles,
    progress: {
      ...base.progress,
      ...Object.fromEntries(progressEntries),
    },
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createInitialAppState())
  const [ready, setReady] = useState(false)
  const [recentResults, setRecentResults] = useState<LessonSessionResult[]>([])

  useEffect(() => {
    const loaded = migrateState(localAppStore.load())
    setState(loaded)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localAppStore.save(state)
  }, [state, ready])

  const activeProfile = useMemo(() => {
    if (!state.activeProfileId) return null
    return state.profiles[state.activeProfileId] ?? null
  }, [state.activeProfileId, state.profiles])

  const isAdmin = state.sessionRole === 'admin'

  const selectProfile = useCallback((profileId: string) => {
    setState((prev) => ({
      ...prev,
      activeProfileId: profileId,
      sessionRole: 'child',
    }))
  }, [])

  const clearActiveProfile = useCallback(() => {
    setState((prev) => ({ ...prev, activeProfileId: null, sessionRole: 'child' }))
  }, [])

  const loginAdmin = useCallback((pin: string) => {
    if (pin.trim() !== ADMIN_CONFIG.pin) return false
    setState((prev) => ({
      ...prev,
      sessionRole: 'admin',
      activeProfileId: null,
    }))
    return true
  }, [])

  const logoutAdmin = useCallback(() => {
    setState((prev) => ({ ...prev, sessionRole: 'child' }))
  }, [])

  const toggleSound = useCallback(() => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
  }, [])

  const playSound = useCallback(
    (name: 'correct' | 'wrong' | 'reward' | 'levelup') => {
      void soundService.play(name, state.soundEnabled)
    },
    [state.soundEnabled],
  )

  const getGameProgress = useCallback(
    (gameId: GameId, profileId?: string) => {
      const id = profileId ?? state.activeProfileId
      if (!id) return null
      return state.progress[id]?.[gameId] ?? null
    },
    [state.activeProfileId, state.progress],
  )

  const completeLesson = useCallback(
    (result: LessonSessionResult): CompleteLessonResponse | null => {
      if (!state.activeProfileId) return null
      const profile = state.profiles[state.activeProfileId]
      const childProgress = state.progress[state.activeProfileId]
      if (!profile || !childProgress) return null

      const levels =
        result.gameId === 'reading'
          ? getAvailableReadingLevels(state.contentBank)
          : result.gameId === 'typing'
            ? TYPING_LEVELS.filter((level) => level.lessonIds.length > 0)
            : []

      const currentGameProgress = childProgress[result.gameId]
      const nextGameProgress = applyLessonResult(
        currentGameProgress,
        levels,
        [],
        result,
      )

      const achievements = evaluateAchievements({
        profile,
        reading: result.gameId === 'reading' ? nextGameProgress : childProgress.reading,
        typing: result.gameId === 'typing' ? nextGameProgress : childProgress.typing,
        result,
      })

      const { profile: nextProfile, reward } = computeLessonRewards(
        profile,
        result,
        achievements,
      )

      setState((prev) => ({
        ...prev,
        profiles: {
          ...prev.profiles,
          [profile.id]: nextProfile,
        },
        progress: {
          ...prev.progress,
          [profile.id]: {
            ...prev.progress[profile.id],
            [result.gameId]: nextGameProgress,
          } as Record<GameId, GameProgress>,
        },
      }))

      const nextRecent = [...recentResults, result].slice(-5)
      setRecentResults(nextRecent)

      if (reward.leveledUp) {
        void soundService.play('levelup', state.soundEnabled)
      } else {
        void soundService.play('reward', state.soundEnabled)
      }

      return {
        reward,
        adaptive: evaluateAdaptiveDifficulty(nextRecent),
      }
    },
    [
      recentResults,
      state.activeProfileId,
      state.contentBank,
      state.profiles,
      state.progress,
      state.soundEnabled,
    ],
  )

  const resetAllProgress = useCallback(() => {
    const fresh = createInitialAppState(state.soundEnabled)
    setState({
      ...fresh,
      contentBank: state.contentBank,
    })
    setRecentResults([])
  }, [state.contentBank, state.soundEnabled])

  const addWordMaterial = useCallback(
    (input: { word: string; image?: string; clue?: string; distractors: string[] }) => {
      const item = createAdminWord(input)
      setState((prev) => {
        const contentBank = {
          ...prev.contentBank,
          words: [item, ...prev.contentBank.words],
        }
        const readingLevels = getAvailableReadingLevels(contentBank)
        const progress = Object.fromEntries(
          Object.entries(prev.progress).map(([childId, games]) => [
            childId,
            {
              ...games,
              reading: syncGameProgressWithLevels(games.reading, readingLevels),
            },
          ]),
        )
        return { ...prev, contentBank, progress }
      })
      return item
    },
    [],
  )

  const addPassageMaterial = useCallback(
    (input: {
      title: string
      text: string
      question: string
      options: string[]
      answer: string
    }) => {
      const item = createAdminPassage(input)
      setState((prev) => {
        const contentBank = {
          ...prev.contentBank,
          passages: [item, ...prev.contentBank.passages],
        }
        const readingLevels = getAvailableReadingLevels(contentBank)
        const progress = Object.fromEntries(
          Object.entries(prev.progress).map(([childId, games]) => [
            childId,
            {
              ...games,
              reading: syncGameProgressWithLevels(games.reading, readingLevels),
            },
          ]),
        )
        return { ...prev, contentBank, progress }
      })
      return item
    },
    [],
  )

  const removeWordMaterial = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      contentBank: {
        ...prev.contentBank,
        words: prev.contentBank.words.filter((item) => item.id !== id),
      },
    }))
  }, [])

  const removePassageMaterial = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      contentBank: {
        ...prev.contentBank,
        passages: prev.contentBank.passages.filter((item) => item.id !== id),
      },
    }))
  }, [])

  const updateProfileAvatar = useCallback((profileId: string, avatarImage: string) => {
    setState((prev) => {
      const profile = prev.profiles[profileId]
      if (!profile) return prev
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [profileId]: {
            ...profile,
            avatarImage,
            updatedAt: new Date().toISOString(),
          },
        },
      }
    })
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      state,
      activeProfile,
      isAdmin,
      selectProfile,
      clearActiveProfile,
      loginAdmin,
      logoutAdmin,
      toggleSound,
      getGameProgress,
      completeLesson,
      resetAllProgress,
      playSound,
      addWordMaterial,
      addPassageMaterial,
      removeWordMaterial,
      removePassageMaterial,
      updateProfileAvatar,
    }),
    [
      ready,
      state,
      activeProfile,
      isAdmin,
      selectProfile,
      clearActiveProfile,
      loginAdmin,
      logoutAdmin,
      toggleSound,
      getGameProgress,
      completeLesson,
      resetAllProgress,
      playSound,
      addWordMaterial,
      addPassageMaterial,
      removeWordMaterial,
      removePassageMaterial,
      updateProfileAvatar,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de AppProvider')
  }
  return ctx
}
