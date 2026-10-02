import type { ChildProfileSeed } from '@/types'

/** Semilla inicial. Luego puede venir de Supabase / panel admin. */
export const PROFILE_SEEDS: ChildProfileSeed[] = [
  {
    id: 'isabella',
    name: 'Isabella',
    avatar: '🦊',
    avatarImage: '/avatars/isabella.png',
    accent: '#ff6b6b',
  },
  {
    id: 'sophia',
    name: 'Sophia',
    avatar: '🐰',
    avatarImage: '/avatars/sophia.png',
    accent: '#ff8fab',
  },
  {
    id: 'valentina',
    name: 'Valentina',
    avatar: '🐱',
    avatarImage: '/avatars/valentina.png',
    accent: '#4cc9f0',
  },
]

/** Acceso al módulo administrador (MVP local). */
export const ADMIN_CONFIG = {
  roleLabel: 'Administrador',
  /** PIN simple para padres/admin en el MVP local. */
  pin: '2468',
} as const
