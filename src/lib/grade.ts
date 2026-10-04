import type { AgeBand } from '@/lib/age'
import type { SchoolGrade } from '@/types'

export type { SchoolGrade }

export interface SchoolGradeOption {
  id: SchoolGrade
  label: string
  shortLabel: string
  /** Edad típica asociada al grado (para adaptar contenido con rango de edad). */
  typicalAge: number
  difficulty: AgeBand
}

export const SCHOOL_GRADES: SchoolGradeOption[] = [
  { id: 0, label: 'Preescolar', shortLabel: 'Preescolar', typicalAge: 5, difficulty: 'early' },
  { id: 1, label: '1° grado', shortLabel: '1°', typicalAge: 6, difficulty: 'early' },
  { id: 2, label: '2° grado', shortLabel: '2°', typicalAge: 7, difficulty: 'primary' },
  { id: 3, label: '3° grado', shortLabel: '3°', typicalAge: 8, difficulty: 'primary' },
  { id: 4, label: '4° grado', shortLabel: '4°', typicalAge: 9, difficulty: 'upper' },
  { id: 5, label: '5° grado', shortLabel: '5°', typicalAge: 10, difficulty: 'upper' },
  { id: 6, label: '6° grado', shortLabel: '6°', typicalAge: 11, difficulty: 'upper' },
]

export function isSchoolGrade(value: unknown): value is SchoolGrade {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6
}

export function parseSchoolGrade(value: string | number | null | undefined): SchoolGrade | null {
  if (value == null || value === '') return null
  const n = typeof value === 'number' ? value : Number(value)
  return isSchoolGrade(n) ? n : null
}

export function gradeOption(grade: SchoolGrade | null | undefined): SchoolGradeOption | null {
  if (grade == null) return null
  return SCHOOL_GRADES.find((item) => item.id === grade) ?? null
}

export function formatGrade(grade: SchoolGrade | null | undefined): string {
  return gradeOption(grade)?.label ?? 'Grado sin definir'
}

export function typicalAgeFromGrade(grade: SchoolGrade | null | undefined): number | null {
  return gradeOption(grade)?.typicalAge ?? null
}

export function difficultyFromGrade(grade: SchoolGrade | null | undefined): AgeBand {
  return gradeOption(grade)?.difficulty ?? 'primary'
}

export function topicFitsGrade(
  topic: { minGrade?: number; maxGrade?: number },
  grade: SchoolGrade | null,
): boolean {
  if (grade == null) return true
  const min = topic.minGrade ?? 0
  const max = topic.maxGrade ?? 6
  return grade >= min && grade <= max
}

/** Edad efectiva: fecha de nacimiento, o edad típica del grado. */
export function effectiveLearningAge(
  birthAge: number | null,
  grade: SchoolGrade | null,
): number | null {
  if (birthAge != null) return birthAge
  return typicalAgeFromGrade(grade)
}

/** Contenido apto por edad y/o grado del niño. */
export function contentFitsLearner(
  item: { minAge: number; maxAge: number; minGrade?: number; maxGrade?: number },
  learner: { age: number | null; grade: SchoolGrade | null },
): boolean {
  const ageOk =
    learner.age == null || (learner.age >= item.minAge && learner.age <= item.maxAge)
  const gradeOk = topicFitsGrade(item, learner.grade)
  if (learner.grade != null && learner.age != null) return ageOk && gradeOk
  if (learner.grade != null) return gradeOk
  if (learner.age != null) return ageOk
  return true
}
