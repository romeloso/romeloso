import { defaultAvatarFor } from '@/config/avatars'
import type { ChildProfileSeed } from '@/types'

/** Semilla inicial. Luego se administran dinámicamente desde el panel. */
export const PROFILE_SEEDS: ChildProfileSeed[] = [
  {
    id: 'isabella',
    name: 'Isabella',
    avatar: '🦊',
    avatarImage: defaultAvatarFor('isabella'),
    accent: '#EC4899',
    birthDate: null,
    grade: null,
  },
  {
    id: 'sophia',
    name: 'Sophia',
    avatar: '🐰',
    avatarImage: defaultAvatarFor('sophia'),
    accent: '#F59E0B',
    birthDate: null,
    grade: null,
  },
  {
    id: 'valentina',
    name: 'Valentina',
    avatar: '🐱',
    avatarImage: defaultAvatarFor('valentina'),
    accent: '#3B82F6',
    birthDate: null,
    grade: null,
  },
]

export const ACCENT_PALETTE = [
  '#EC4899',
  '#6366F1',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#FDE047',
] as const

/** Acceso al módulo administrador (MVP local). */
export const ADMIN_CONFIG = {
  roleLabel: 'Administrador',
  /** PIN simple para padres/admin en el MVP local. */
  pin: '2468',
} as const
