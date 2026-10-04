import type { AppState } from '@/types'

export interface AppStoreRepository {
  load(): AppState | null
  save(state: AppState): void
  clear(): void
}
