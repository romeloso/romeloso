import { APP_CONFIG } from '@/config/app'
import type { AppState } from '@/types'
import type { AppStoreRepository } from './types'

export class LocalAppStore implements AppStoreRepository {
  private readonly key: string

  constructor(key = APP_CONFIG.storageKey) {
    this.key = key
  }

  load(): AppState | null {
    try {
      const raw = localStorage.getItem(this.key)
      if (!raw) return null
      return JSON.parse(raw) as AppState
    } catch {
      return null
    }
  }

  save(state: AppState): void {
    localStorage.setItem(this.key, JSON.stringify(state))
  }

  clear(): void {
    localStorage.removeItem(this.key)
  }
}

export const localAppStore = new LocalAppStore()
