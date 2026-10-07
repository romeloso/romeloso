import { useEffect, useState } from 'react'
import { APP_CONFIG, BRAND_COLORS } from '@/config/app'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { SmilingStar } from '@/components/brand/SmilingStar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const INTRO_KEY = 'sorovagames.lobby-intro.seen'

const SPLASHES = [
  { color: BRAND_COLORS.pink, left: '8%', top: '16%', delay: '0.05s', size: '4.5rem' },
  { color: BRAND_COLORS.cyan, left: '84%', top: '18%', delay: '0.2s', size: '3.5rem' },
  { color: BRAND_COLORS.violet, left: '78%', top: '72%', delay: '0.3s', size: '4rem' },
  { color: BRAND_COLORS.yellow, left: '12%', top: '70%', delay: '0.15s', size: '3rem' },
  { color: BRAND_COLORS.emerald, left: '48%', top: '10%', delay: '0.25s', size: '2.5rem' },
]

export function shouldShowLobbyIntro() {
  try {
    if (sessionStorage.getItem(INTRO_KEY) === '1') return false
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
          'radial-gradient(circle at 20% 20%, rgba(253,224,71,0.45) 0%, transparent 38%), radial-gradient(circle at 85% 15%, rgba(244,114,182,0.35) 0%, transparent 34%), radial-gradient(circle at 70% 85%, rgba(6,182,212,0.3) 0%, transparent 40%), linear-gradient(180deg, #dbeafe 0%, #f0f9ff 55%, #ffffff 100%)',
      }}
      role="dialog"
      aria-label={`Introducción ${APP_CONFIG.name}`}
    >
      {SPLASHES.map((item, index) => (
        <span
          key={index}
          className="animate-blob pointer-events-none absolute rounded-full opacity-70 blur-[1px]"
          style={{
            background: `radial-gradient(circle at 30% 30%, #fff8, transparent 55%), ${item.color}`,
            left: item.left,
            top: item.top,
            width: item.size,
            height: item.size,
            animationDelay: item.delay,
          }}
        />
      ))}

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <div className="animate-star-fly mb-1">
          <SmilingStar size={96} />
        </div>

        <div className="animate-logo-pop">
          <BrandLogo size="hero" showTagline />
        </div>

        <p
          className="animate-fade-up mt-5 max-w-lg font-display text-xl font-bold text-navy sm:text-2xl"
          style={{ animationDelay: '0.55s' }}
        >
          {APP_CONFIG.slogan}
        </p>

        <div
          className={cn(
            'animate-fade-up mt-7 transition',
            ready ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          style={{ animationDelay: '0.9s' }}
        >
          <Button className="brand-gloss min-w-56" onClick={finish}>
            ¡Empezar la aventura!
          </Button>
          <p className="mt-3 text-sm font-semibold text-ink-soft">Toca para entrar al lobby</p>
        </div>
      </div>
    </div>
  )
}
