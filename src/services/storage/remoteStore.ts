import type { AppState } from '@/types'

const STATE_PATH = '/api/state'

/** Lee el estado compartido. Devuelve null si la API o la base no responden. */
export async function loadRemoteState(): Promise<AppState | null> {
  if (typeof fetch !== 'function') return null
  try {
    const response = await fetch(STATE_PATH, { signal: AbortSignal.timeout(2500) })
    if (!response.ok) return null
    const body = (await response.json()) as { state?: AppState | null }
    return body.state ?? null
  } catch {
    return null
  }
}

let timer: ReturnType<typeof setTimeout> | null = null
let pending: AppState | null = null

function sendState(state: AppState, keepalive = false) {
  void fetch(STATE_PATH, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(state),
    keepalive,
  }).catch(() => {})
}

/** Encola el estado para guardarlo en PostgreSQL. */
export function saveRemoteState(state: AppState) {
  pending = state
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const snapshot = pending
    pending = null
    timer = null
    if (snapshot) sendState(snapshot)
  }, 400)
}

export function flushRemoteState() {
  if (timer) clearTimeout(timer)
  timer = null
  const snapshot = pending
  pending = null
  if (snapshot) sendState(snapshot, true)
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    flushRemoteState()
  })
}
