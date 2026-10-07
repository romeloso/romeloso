import { APP_CONFIG, BRAND_COLORS } from '@/config/app'
import { cn } from '@/lib/cn'
import { SmilingStar } from './SmilingStar'

const GAME_LETTER_COLORS = [
  BRAND_COLORS.pink,
  BRAND_COLORS.amber,
  BRAND_COLORS.emerald,
  BRAND_COLORS.cyan,
  BRAND_COLORS.violet,
]

export function BrandLogo({
  size = 'md',
  showTagline = false,
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  showTagline?: boolean
  className?: string
}) {
  const titleClass =
    size === 'hero'
      ? 'text-5xl sm:text-7xl'
      : size === 'lg'
        ? 'text-4xl sm:text-5xl'
        : size === 'sm'
          ? 'text-xl'
          : 'text-2xl sm:text-3xl'

  const starSize = size === 'hero' ? 56 : size === 'lg' ? 40 : size === 'sm' ? 22 : 28
  const stroke = size === 'hero' || size === 'lg' ? '2px' : size === 'sm' ? '1px' : '1.5px'

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <div className="relative pr-6">
        <p className={cn('font-display font-extrabold leading-none tracking-tight', titleClass)}>
          <span
            className="brand-sorova-word"
            style={{ WebkitTextStrokeWidth: stroke }}
          >
            Sorova
          </span>{' '}
          <span aria-label="Games">
            {'Games'.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="brand-games-letter"
                style={{
                  color: GAME_LETTER_COLORS[index % GAME_LETTER_COLORS.length],
                  WebkitTextStroke: `${stroke} ${BRAND_COLORS.navy}`,
                  paintOrder: 'stroke fill',
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </p>
        <span className="absolute -right-1 -top-3 sm:-right-2 sm:-top-4">
          <SmilingStar size={starSize} className="animate-float" />
        </span>
      </div>
      {showTagline ? (
        <p className="mt-3 font-display text-base font-bold text-navy sm:text-lg">
          {APP_CONFIG.tagline}
          <span className="mx-auto mt-1 block h-1.5 w-28 rounded-full bg-gradient-to-r from-amber via-yellow to-pink" />
        </p>
      ) : null}
    </div>
  )
}
