import { defaultAvatarFor } from '@/config/avatars'
import type { ChildProfileSeed } from '@/types'

/** Semilla inicial. Luego se administran dinámicamente desde el panel. */
export const PROFILE_SEEDS: ChildProfileSeed[] = [
  {
    id: 'isabella',
    name: 'Isabella',
    avatar: '🦊',
    avatarImage: defaultAvatarFor('isabella'),
    accent: '#ff6b6b',
    birthDate: null,
  },
  {
    id: 'sophia',
    name: 'Sophia',
    avatar: '🐰',
    avatarImage: defaultAvatarFor('sophia'),
    accent: '#ff8fab',
    birthDate: null,
  },
  {
    id: 'valentina',
    name: 'Valentina',
    avatar: '🐱',
    avatarImage: defaultAvatarFor('valentina'),
    accent: '#4cc9f0',
    birthDate: null,
  },
]

export const ACCENT_PALETTE = [
  '#ff6b6b',
  '#ff8fab',
  '#4cc9f0',
  '#0f9b8e',
  '#ffd166',
  '#b8a1ff',
  '#90e0b2',
] as const

/** Acceso al módulo administrador (MVP local). */
export const ADMIN_CONFIG = {
  roleLabel: 'Administrador',
  /** PIN simple para padres/admin en el MVP local. */
  pin: '2468',
} as const
