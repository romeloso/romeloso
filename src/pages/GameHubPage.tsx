import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { useApp } from '@/context/AppContext'
import { getGameBySlug } from '@/data/games/registry'
import { READING_LEVELS, getReadingLesson } from '@/data/games/reading/levels'
import { TYPING_LEVELS, getTypingLesson } from '@/data/games/typing/levels'
import { getLevelProgress } from '@/domain/progress'
import { cn } from '@/lib/cn'
import type { GameLevelMeta } from '@/types'

export function GameHubPage() {
  const { gameSlug } = useParams()
  const navigate = useNavigate()
  const { activeProfile, getGameProgress } = useApp()

  if (!activeProfile) return <Navigate to="/" replace />

  const game = gameSlug ? getGameBySlug(gameSlug) : undefined
  if (!game) {
    return (
      <PageShell>
        <TopBar backTo="/dashboard" />
        <p className="font-display text-2xl font-bold">Juego no encontrado</p>
      </PageShell>
    )
  }

  if (game.status !== 'available') {
    return (
      <PageShell>
        <TopBar backTo="/dashboard" />
        <div className="rounded-[2rem] bg-white/80 p-8 text-center">
          <p className="text-6xl">{game.icon}</p>
          <h1 className="mt-4 font-display text-4xl font-bold">{game.title}</h1>
          <p className="mt-3 text-lg font-semibold text-ink-soft">
            Este juego llegará pronto. ¡Mientras tanto practica lectura y tecleo!
          </p>
          <Button className="mt-6" onClick={() => navigate('/dashboard')}>
            Volver al dashboard
          </Button>
        </div>
      </PageShell>
    )
  }

  const levels: GameLevelMeta[] =
    game.id === 'reading'
      ? READING_LEVELS
      : game.id === 'typing'
        ? TYPING_LEVELS
        : []
  const progress = getGameProgress(game.id)

  return (
    <PageShell>
      <TopBar backTo="/dashboard" backLabel="Dashboard" />
      <section className="mb-6 rounded-[2rem] p-6 text-white" style={{ backgroundColor: game.accent }}>
        <p className="text-5xl" aria-hidden="true">
          {game.icon}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">{game.title}</h1>
        <p className="mt-2 text-lg font-semibold text-white/90">{game.description}</p>
      </section>

      <div className="space-y-4">
        {levels.map((level) => {
          const levelProgress = progress ? getLevelProgress(progress, level) : null
          const comingSoon = level.lessonIds.length === 0
          const unlocked = Boolean(levelProgress?.unlocked) && !comingSoon

          return (
            <article
              key={level.id}
              className={cn(
                'rounded-[1.75rem] bg-white/85 p-5 ring-1 ring-ink/5',
                !unlocked && 'opacity-75',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    {level.icon} Nivel {level.order}: {level.title}
                  </h2>
                  <p className="font-semibold text-ink-soft">{level.subtitle}</p>
                  {levelProgress && !comingSoon ? (
                    <p className="mt-2 text-sm font-bold text-teal">
                      {levelProgress.completedLessons}/{levelProgress.totalLessons} lecciones ·{' '}
                      {levelProgress.stars} estrellas
                    </p>
                  ) : null}
                </div>
                <span className="rounded-xl bg-sand px-3 py-1 text-sm font-bold">
                  {comingSoon ? 'Próximamente' : unlocked ? 'Disponible' : 'Bloqueado'}
                </span>
              </div>

              {!comingSoon ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {level.lessonIds.map((lessonId) => {
                    const lesson =
                      game.id === 'reading'
                        ? getReadingLesson(lessonId)
                        : getTypingLesson(lessonId)
                    const lessonProgress = progress?.lessonProgress[lessonId]
                    const lessonUnlocked = Boolean(lessonProgress?.unlocked) && unlocked

                    return (
                      <Button
                        key={lessonId}
                        variant={lessonUnlocked ? 'primary' : 'secondary'}
                        disabled={!lessonUnlocked}
                        onClick={() =>
                          navigate(`/games/${game.slug}/lesson/${lessonId}`)
                        }
                      >
                        {lesson?.title ?? lessonId}
                        {lessonProgress && lessonProgress.stars > 0
                          ? ` · ${'⭐'.repeat(lessonProgress.stars)}`
                          : ''}
                      </Button>
                    )
                  })}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </PageShell>
  )
}
