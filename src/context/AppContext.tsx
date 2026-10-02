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
import { evaluateAchievements } from '@/data/achievements'
import { READING_LEVELS } from '@/data/games/reading/levels'
import { TYPING_LEVELS } from '@/data/games/typing/levels'
import { evaluateAdaptiveDifficulty } from '@/domain/adaptive'
import { applyLessonResult } from '@/domain/progress'
import { computeLessonRewards } from '@/domain/rewards'
import { createInitialAppState } from '@/services/profileFactory'
import { localAppStore } from '@/services/storage/localStore'
import { soundService } from '@/services/soundService'
import type {
  AdaptiveHint,
  AppState,
  ChildProfile,
  GameId,
  GameProgress,
  LessonSessionResult,
  RewardPayload,
} from '@/types'

interface CompleteLessonResponse {
  reward: RewardPayload
  adaptive: AdaptiveHint
}

interface AppContextValue {
  ready: boolean
  state: AppState
  activeProfile: ChildProfile | null
  selectProfile: (profileId: string) => void
  clearActiveProfile: () => void
  toggleSound: () => void
  getGameProgress: (gameId: GameId) => GameProgress | null
  completeLesson: (result: LessonSessionResult) => CompleteLessonResponse | null
  resetAllProgress: () => void
  playSound: (name: 'correct' | 'wrong' | 'reward' | 'levelup') => void
}

const AppContext = createContext<AppContextValue | null>(null)

function migrateState(raw: AppState | null): AppState {
  const base = createInitialAppState(APP_CONFIG.defaultSoundEnabled)
  if (!raw) return base

  return {
    ...base,
    ...raw,
    profiles: { ...base.profiles, ...raw.profiles },
    progress: {
      ...base.progress,
      ...Object.fromEntries(
        Object.entries(raw.progress ?? {}).map(([childId, games]) => [
          childId,
          { ...base.progress[childId], ...games },
        ]),
      ),
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

  const selectProfile = useCallback((profileId: string) => {
    setState((prev) => ({ ...prev, activeProfileId: profileId }))
  }, [])

  const clearActiveProfile = useCallback(() => {
    setState((prev) => ({ ...prev, activeProfileId: null }))
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
    (gameId: GameId) => {
      if (!state.activeProfileId) return null
      return state.progress[state.activeProfileId]?.[gameId] ?? null
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
          ? READING_LEVELS.filter((level) => level.lessonIds.length > 0)
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
    [recentResults, state.activeProfileId, state.profiles, state.progress, state.soundEnabled],
  )

  const resetAllProgress = useCallback(() => {
    const fresh = createInitialAppState(state.soundEnabled)
    setState(fresh)
    setRecentResults([])
  }, [state.soundEnabled])

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      state,
      activeProfile,
      selectProfile,
      clearActiveProfile,
      toggleSound,
      getGameProgress,
      completeLesson,
      resetAllProgress,
      playSound,
    }),
    [
      ready,
      state,
      activeProfile,
      selectProfile,
      clearActiveProfile,
      toggleSound,
      getGameProgress,
      completeLesson,
      resetAllProgress,
      playSound,
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
