import { APP_CONFIG, BRAND_COLORS } from '@/config/app'
import { cn } from '@/lib/cn'
import { SmilingStar } from './SmilingStar'

const GAME_LETTER_COLORS = [
  BRAND_COLORS.pink,
  BRAND_COLORS.emerald,
  BRAND_COLORS.amber,
  BRAND_COLORS.violet,
  BRAND_COLORS.sky,
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

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <div className="relative pr-6">
        <p
          className={cn(
            'font-display font-bold leading-none tracking-tight text-navy',
            titleClass,
          )}
          style={{
            WebkitTextStroke: size === 'hero' || size === 'lg' ? '1px #0F172A' : undefined,
            textShadow: '2px 3px 0 rgba(15,23,42,0.12)',
          }}
        >
          Sorova{' '}
          <span aria-label="Games">
            {'Games'.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="brand-games-letter"
                style={{ color: GAME_LETTER_COLORS[index % GAME_LETTER_COLORS.length] }}
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
          <span className="mx-auto mt-1 block h-1.5 w-28 rounded-full bg-sun" />
        </p>
      ) : null}
    </div>
  )
}
