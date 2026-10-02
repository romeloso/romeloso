import { Navigate, useNavigate } from 'react-router-dom'
import { GameCard } from '@/components/game/GameCard'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatPill } from '@/components/ui/StatPill'
import { useApp } from '@/context/AppContext'
import { GAME_DEFINITIONS } from '@/data/games/registry'
import { ACHIEVEMENTS } from '@/data/achievements'
import { overallGameCompletion } from '@/domain/progress'
import { formatNumber } from '@/lib/format'
import { xpProgressWithinLevel } from '@/lib/xp'
import type { ReadingStats, TypingStats } from '@/types'

export function DashboardPage() {
  const navigate = useNavigate()
  const { activeProfile, getGameProgress, state } = useApp()

  if (!activeProfile) {
    return <Navigate to="/" replace />
  }

  const xpInfo = xpProgressWithinLevel(activeProfile.xp)
  const reading = getGameProgress('reading')
  const typing = getGameProgress('typing')
  const readingStats = reading?.stats as ReadingStats | undefined
  const typingStats = typing?.stats as TypingStats | undefined
  const ownedAchievements = ACHIEVEMENTS.filter((item) =>
    activeProfile.achievements.includes(item.id),
  )

  return (
    <PageShell wide>
      <TopBar showBackToProfiles />

      <section className="mb-8 rounded-[2rem] bg-white/80 p-5 shadow-[0_12px_30px_rgba(31,42,55,0.08)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            className="grid h-28 w-28 shrink-0 place-items-center rounded-full text-6xl ring-4 ring-white"
            style={{ backgroundColor: `${activeProfile.accent}33` }}
          >
            {activeProfile.avatar}
          </div>
          <div className="flex-1 space-y-3">
            <h1 className="font-display text-4xl font-bold text-ink">
              ¡Hola, {activeProfile.name}!
            </h1>
            <p className="text-lg font-bold text-ink-soft">Nivel {activeProfile.level}</p>
            <ProgressBar
              value={xpInfo.ratio}
              label={`${formatNumber(xpInfo.current)} / ${formatNumber(xpInfo.needed)} XP`}
              colorClassName="bg-coral"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatPill icon="⭐" label="XP" value={formatNumber(activeProfile.xp)} />
          <StatPill icon="🪙" label="Monedas" value={formatNumber(activeProfile.coins)} />
          <StatPill icon="🔥" label="Racha" value={`${activeProfile.streakDays} días`} />
          <StatPill icon="🏆" label="Logros" value={ownedAchievements.length} />
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] bg-white/75 p-5 ring-1 ring-ink/5">
          <h2 className="font-display text-2xl font-bold">📚 Lectura</h2>
          <p className="mt-2 font-semibold text-ink-soft">
            Palabras aprendidas: {readingStats?.wordsLearned.length ?? 0}
          </p>
          <p className="font-semibold text-ink-soft">
            Lecciones: {readingStats?.lessonsCompleted ?? 0}
          </p>
          <ProgressBar
            className="mt-3"
            value={reading ? overallGameCompletion(reading) : 0}
            colorClassName="bg-coral"
          />
        </div>
        <div className="rounded-[1.75rem] bg-white/75 p-5 ring-1 ring-ink/5">
          <h2 className="font-display text-2xl font-bold">⌨️ Tecleo</h2>
          <p className="mt-2 font-semibold text-ink-soft">
            Mejor velocidad: {Math.round(typingStats?.bestWpm ?? 0)} PPM
          </p>
          <p className="font-semibold text-ink-soft">
            Mejor precisión: {Math.round((typingStats?.bestAccuracy ?? 0) * 100)}%
          </p>
          <ProgressBar
            className="mt-3"
            value={typing ? overallGameCompletion(typing) : 0}
            colorClassName="bg-teal"
          />
        </div>
      </section>

      <div className="mb-4 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => navigate('/progress')}>
          🌟 Mi aventura
        </Button>
        <Button variant="secondary" onClick={() => navigate('/achievements')}>
          🏆 Logros
        </Button>
      </div>

      <section>
        <h2 className="mb-4 font-display text-3xl font-bold">Juegos disponibles</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {GAME_DEFINITIONS.map((game) => {
            const progress = state.progress[activeProfile.id]?.[game.id]
            return (
              <GameCard
                key={game.id}
                game={game}
                progressRatio={progress ? overallGameCompletion(progress) : 0}
                onClick={() => navigate(`/games/${game.slug}`)}
              />
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}
