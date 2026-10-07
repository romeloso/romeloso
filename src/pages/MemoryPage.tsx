import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { PageShell } from '@/components/ui/PageShell'
import { useApp } from '@/context/AppContext'
import { getMemoryRound } from '@/data/games/memory/levels'
import { MemoryBoard } from '@/games/memory/MemoryBoard'
import { ageFromBirthDate } from '@/lib/age'
import { effectiveLearningAge } from '@/lib/grade'
import type { ActivityAttemptResult, LessonSessionResult, RewardPayload, AdaptiveHint } from '@/types'

export function MemoryPage() {
  const { roundId } = useParams()
  const { activeProfile, completeLesson } = useApp()
  const [finished, setFinished] = useState<{
    result: LessonSessionResult
    reward: RewardPayload
    adaptive: AdaptiveHint
  } | null>(null)

  const age = effectiveLearningAge(
    ageFromBirthDate(activeProfile?.birthDate),
    activeProfile?.grade ?? null,
  )
  const grade = activeProfile?.grade ?? null
  const round = useMemo(
    () => (roundId ? getMemoryRound(roundId, age, grade) : undefined),
    [age, grade, roundId],
  )

  if (!activeProfile) return <Navigate to="/" replace />
  if (!round) {
    return (
      <PageShell>
        <TopBar backTo="/games/memoria" />
        <p className="font-display text-2xl font-bold">Ronda de memoria no encontrada</p>
      </PageShell>
    )
  }

  if (finished) {
    return <Navigate to="/result" replace state={finished} />
  }

  return (
    <PageShell>
      <TopBar backTo="/games/memoria" backLabel="Niveles" />
      <section className="mb-5 rounded-[1.75rem] bg-violet px-5 py-4 text-white">
        <h1 className="font-display text-3xl font-bold">{round.title}</h1>
        <p className="mt-1 font-semibold text-white/90">
          Encuentra {round.pairs.length} parejas. ¡Menos movimientos = mejor!
        </p>
      </section>
      <MemoryBoard
        round={round}
        onComplete={({ moves, pairs, durationMs }) => {
          const perfectMoves = pairs
          const accuracy = Math.max(0.35, Math.min(1, perfectMoves / Math.max(moves, 1)))
          const results: ActivityAttemptResult[] = Array.from({ length: pairs }, (_, index) => ({
            activityId: `${round.id}-pair-${index}`,
            correct: true,
            attempts: 1,
            timeMs: Math.round(durationMs / pairs),
          }))

          const session: LessonSessionResult = {
            gameId: 'memory',
            levelId: round.levelId,
            lessonId: round.id,
            results,
            accuracy,
            stars: 0,
            durationMs,
            words: round.pairs,
          }

          const response = completeLesson(session)
          if (!response) return
          setFinished({ result: { ...session, stars: accuracy >= 0.95 ? 3 : accuracy >= 0.8 ? 2 : 1 }, ...response })
        }}
      />
    </PageShell>
  )
}
