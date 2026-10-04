import { APP_CONFIG } from '@/config/app'
import { consumeRateLimit } from '@/lib/rateLimit'
import type { AppState } from '@/types'
import type { AppStoreRepository } from './types'

type SaveListener = (ok: boolean, error?: string) => void

/**
 * Persistencia local con:
 * - guardado diferido (debounce + idle)
 * - rate limit de escrituras
 * - cola async para no bloquear el hilo principal
 */
export class LocalAppStore implements AppStoreRepository {
  private readonly key: string
  private pending: AppState | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private idleHandle: number | null = null
  private writing = false
  private readonly debounceMs: number
  private listeners = new Set<SaveListener>()

  constructor(key = APP_CONFIG.storageKey, debounceMs = 250) {
    this.key = key
    this.debounceMs = debounceMs
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

  /** Encola un guardado asíncrono (no bloquea el render). */
  save(state: AppState): void {
    this.pending = state
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.timer = null
      this.scheduleFlush()
    }, this.debounceMs)
  }

  /** Fuerza flush inmediato (p.ej. antes de cerrar). */
  flushSync(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.idleHandle != null && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(this.idleHandle)
      this.idleHandle = null
    }
    this.writePending()
  }

  clear(): void {
    this.pending = null
    localStorage.removeItem(this.key)
  }

  onSave(listener: SaveListener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private scheduleFlush() {
    if (typeof requestIdleCallback === 'function') {
      this.idleHandle = requestIdleCallback(
        () => {
          this.idleHandle = null
          this.writePending()
        },
        { timeout: 500 },
      )
      return
    }
    void Promise.resolve().then(() => this.writePending())
  }

  private writePending() {
    if (this.writing || !this.pending) return
    const limit = consumeRateLimit('saveState')
    if (!limit.allowed) {
      // Reintentar cuando expire el cupo.
      this.timer = setTimeout(() => this.scheduleFlush(), Math.min(limit.retryAfterMs, 2000))
      this.notify(false, limit.reason)
      return
    }

    this.writing = true
    const snapshot = this.pending
    this.pending = null
    try {
      // JSON.stringify puede ser pesado con avatares base64: lo hacemos en microtask.
      const payload = JSON.stringify(snapshot)
      localStorage.setItem(this.key, payload)
      this.notify(true)
    } catch (error) {
      this.pending = snapshot
      this.notify(false, error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      this.writing = false
      if (this.pending) this.scheduleFlush()
    }
  }

  private notify(ok: boolean, error?: string) {
    for (const listener of this.listeners) listener(ok, error)
  }
}

export const localAppStore = new LocalAppStore()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    localAppStore.flushSync()
  })
}
