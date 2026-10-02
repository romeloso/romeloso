import type { ChildProfileSeed } from '@/types'

/** Semilla inicial. Luego puede venir de Supabase / panel admin. */
export const PROFILE_SEEDS: ChildProfileSeed[] = [
  {
    id: 'isabella',
    name: 'Isabella',
    avatar: '🦊',
    accent: '#ff6b6b',
  },
  {
    id: 'sophia',
    name: 'Sophia',
    avatar: '🐰',
    accent: '#0f9b8e',
  },
  {
    id: 'valentina',
    name: 'Valentina',
    avatar: '🐱',
    accent: '#4cc9f0',
  },
]
