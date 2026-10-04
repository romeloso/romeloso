import { useEffect, useState } from 'react'
import { APP_CONFIG } from '@/config/app'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const INTRO_KEY = 'sorova.lobby-intro.seen'

export function shouldShowLobbyIntro() {
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  } catch {
    return true
  }
}

export function markLobbyIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function LobbyIntro({ onDone }: { onDone: () => void }) {
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1400)
    return () => window.clearTimeout(timer)
  }, [])

  const finish = () => {
    if (leaving) return
    setLeaving(true)
    markLobbyIntroSeen()
    window.setTimeout(onDone, 420)
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4 transition-opacity duration-400',
        leaving ? 'opacity-0' : 'opacity-100',
      )}
      style={{
        background:
          'radial-gradient(circle at 18% 12%, #fff7ed 0%, transparent 42%), radial-gradient(circle at 82% 18%, #eff6ff 0%, transparent 38%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
      role="dialog"
      aria-label={`Introducción ${APP_CONFIG.name}`}
    >
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <img
          src={APP_CONFIG.brandImage}
          alt={`${APP_CONFIG.name} — ${APP_CONFIG.tagline}`}
          className="animate-brand-hero w-full max-w-xl select-none object-contain drop-shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:max-w-2xl"
          width={933}
          height={797}
          decoding="async"
          fetchPriority="high"
        />

        <div
          className={cn(
            'animate-fade-up mt-8 transition',
            ready ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          style={{ animationDelay: '0.95s' }}
        >
          <Button className="min-w-52" onClick={finish}>
            ¡Empezar la aventura!
          </Button>
          <p className="mt-3 text-sm font-semibold text-ink-soft">Toca para entrar al lobby</p>
        </div>
      </div>
    </div>
  )
}
