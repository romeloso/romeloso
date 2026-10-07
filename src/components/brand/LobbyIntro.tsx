import { useEffect, useState } from 'react'
import { APP_CONFIG, BRAND_COLORS } from '@/config/app'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { SmilingStar } from '@/components/brand/SmilingStar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const INTRO_KEY = 'sorovagames.lobby-intro.seen'

const CONFETTI = [
  { color: BRAND_COLORS.pink, left: '12%', delay: '0.1s', top: '18%' },
  { color: BRAND_COLORS.sky, left: '22%', delay: '0.25s', top: '28%' },
  { color: BRAND_COLORS.amber, left: '78%', delay: '0.15s', top: '16%' },
  { color: BRAND_COLORS.emerald, left: '86%', delay: '0.35s', top: '30%' },
  { color: BRAND_COLORS.violet, left: '68%', delay: '0.45s', top: '22%' },
  { color: BRAND_COLORS.yellow, left: '40%', delay: '0.2s', top: '12%' },
]

export function shouldShowLobbyIntro() {
  try {
    if (sessionStorage.getItem(INTRO_KEY) === '1') return false
    // Compat con la clave anterior del intro.
    if (sessionStorage.getItem('sorova.lobby-intro.seen') === '1') {
      sessionStorage.setItem(INTRO_KEY, '1')
      return false
    }
    return true
  } catch {
    return true
  }
}

export function markLobbyIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
    sessionStorage.removeItem('sorova.lobby-intro.seen')
  } catch {
    /* ignore */
  }
}

export function LobbyIntro({ onDone }: { onDone: () => void }) {
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1600)
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
          'radial-gradient(circle at 20% 20%, #e0e7ff 0%, transparent 40%), radial-gradient(circle at 80% 15%, #fce7f3 0%, transparent 35%), radial-gradient(circle at 70% 80%, #d1fae5 0%, transparent 40%), linear-gradient(180deg, #ffffff 0%, #eef2ff 100%)',
      }}
      role="dialog"
      aria-label={`Introducción ${APP_CONFIG.name}`}
    >
      {CONFETTI.map((item, index) => (
        <span
          key={index}
          className="animate-confetti pointer-events-none absolute h-3 w-8 rounded-full"
          style={{
            backgroundColor: item.color,
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
          }}
        />
      ))}

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="animate-star-fly mb-2">
          <SmilingStar size={88} />
        </div>

        <div className="animate-logo-pop">
          <BrandLogo size="hero" showTagline />
        </div>

        <div
          className="animate-fade-up mt-6 w-full overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(15,23,42,0.18)] ring-4 ring-white"
          style={{ animationDelay: '0.55s' }}
        >
          <img
            src={APP_CONFIG.brandImage}
            alt={`Línea gráfica ${APP_CONFIG.name}`}
            className="h-44 w-full object-cover object-[50%_18%] sm:h-56"
          />
        </div>

        <p
          className="animate-fade-up mt-5 font-display text-xl font-bold text-violet sm:text-2xl"
          style={{ animationDelay: '0.85s' }}
        >
          {APP_CONFIG.slogan}
        </p>

        <div
          className={cn(
            'animate-fade-up mt-6 transition',
            ready ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          style={{ animationDelay: '1.1s' }}
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
