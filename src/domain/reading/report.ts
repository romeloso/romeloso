import { skillStatusLabel } from '@/domain/reading/mastery'
import type { ReadingStats, SkillMasteryStatus } from '@/types'

export interface FamilySkillLine {
  id: string
  title: string
  status: SkillMasteryStatus
  label: string
}

export function familySkillLines(
  stats: ReadingStats | undefined,
  titles: Record<string, string>,
): FamilySkillLine[] {
  const skills = stats?.skills ?? {}
  return Object.values(skills)
    .map((record) => ({
      id: record.skillId,
      title: titles[record.skillId] ?? record.skillId,
      status: record.status,
      label: skillStatusLabel(record.status),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'es'))
}

/** Informe breve para una familia, sin etiquetas negativas. */
export function familyNarrative(name: string, stats: ReadingStats | undefined, titles: Record<string, string>) {
  const lines = familySkillLines(stats, titles)
  const mastered = lines.filter((line) => line.status === 'mastered').map((line) => line.title)
  const support = lines.filter((line) => line.status === 'needs_support').map((line) => line.title)
  const developing = lines.filter((line) => line.status === 'developing').map((line) => line.title)

  if (lines.length === 0) {
    return `${name} todavía no tiene práctica guardada en Leo y Escribo. Un juego corto de inicio ayuda a elegir el primer mundo. Recomendamos unos minutos de sonidos o letras y volver a practicar mañana.`
  }

  const known = mastered.length > 0 ? `${name} ya domina: ${mastered.slice(0, 3).join(', ')}.` : `${name} está empezando el recorrido.`
  const practice =
    developing.length > 0
      ? ` Está practicando ${developing.slice(0, 2).join(' y ')}.`
      : ''
  const reinforce =
    support.length > 0
      ? ` Conviene dedicar unos minutos a ${support.slice(0, 2).join(' y ')}, con calma y sin prisa.`
      : ' Recomendamos una sesión corta y repetir mañana para afianzar lo aprendido.'
  const placement = stats?.placement?.summary ? ` ${stats.placement.summary}` : ''

  return `${known}${practice}${reinforce}${placement}`
}
