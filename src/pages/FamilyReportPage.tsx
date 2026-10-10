import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { useApp } from '@/context/AppContext'
import { skillTitleMap } from '@/data/games/reading/curriculum'
import { getReadingWorld } from '@/data/games/reading/levels'
import { familyNarrative, familySkillLines } from '@/domain/reading/report'
import type { ReadingStats } from '@/types'

export function FamilyReportPage() {
  const { ready, activeProfile, getGameProgress } = useApp()
  const [adult, setAdult] = useState(false)

  if (!ready) {
    return (
      <PageShell>
        <p className="font-display text-2xl font-bold">Cargando…</p>
      </PageShell>
    )
  }
  if (!activeProfile) return <Navigate to="/" replace />

  const stats = getGameProgress('reading')?.stats as ReadingStats | undefined
  const lines = familySkillLines(stats, skillTitleMap())
  const world = stats?.placement ? getReadingWorld(stats.placement.recommendedWorldId) : undefined

  return (
    <PageShell>
      <TopBar backTo="/games/aprende-a-leer" backLabel="Mapa" />
      <section className="rounded-[2rem] bg-white/90 p-6 ring-1 ring-ink/5">
        <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">Para la familia</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Informe de {activeProfile.name}</h1>
        <p className="mt-2 font-semibold text-ink-soft">
          Esto no es una evaluación clínica ni reemplaza a un docente. Describe la práctica dentro de Leo y Escribo.
        </p>
        {!adult ? (
          <Button className="mt-6" onClick={() => setAdult(true)}>
            Soy una persona adulta
          </Button>
        ) : (
          <div className="mt-6 space-y-5">
            <p className="text-lg font-semibold leading-relaxed text-ink">
              {familyNarrative(activeProfile.name, stats, skillTitleMap())}
            </p>
            {world ? (
              <p className="font-bold text-teal">
                Punto de partida sugerido: {world.icon} {world.title}
              </p>
            ) : (
              <p className="font-bold text-ink-soft">Todavía no hay un juego de inicio guardado.</p>
            )}
            <ul className="space-y-2">
              {lines.length === 0 ? (
                <li className="rounded-2xl bg-sand px-4 py-3 font-semibold">Aún no hay habilidades registradas.</li>
              ) : (
                lines.map((line) => (
                  <li key={line.id} className="flex items-center justify-between gap-3 rounded-2xl bg-sand px-4 py-3">
                    <span className="font-bold">{line.title}</span>
                    <span className="rounded-xl bg-white px-3 py-1 text-sm font-bold text-ink">{line.label}</span>
                  </li>
                ))
              )}
            </ul>
            <p className="text-sm font-semibold text-ink-soft">
              Lecciones hechas: {stats?.lessonsCompleted ?? 0}. Palabras practicadas:{' '}
              {stats?.wordsLearned.length ?? 0}.
            </p>
          </div>
        )}
      </section>
    </PageShell>
  )
}
