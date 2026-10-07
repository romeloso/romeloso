import { cn } from '@/lib/cn'

type IconProps = { className?: string; size?: number }

export function IconStar({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <defs>
        <linearGradient id="sg-star" x1="10" y1="8" x2="54" y2="56">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M32 6 39 24h19L43 35l6 19-17-12-17 12 6-19L13 24h19z"
        fill="url(#sg-star)"
        stroke="#1E3A8A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconCoin({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <defs>
        <linearGradient id="sg-coin" x1="12" y1="10" x2="52" y2="54">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" fill="url(#sg-coin)" stroke="#1E3A8A" strokeWidth="3" />
      <circle cx="32" cy="32" r="14" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
      <path
        d="M32 22 35 29h7l-5.5 4.2 2.1 7-5.6-3.8-5.6 3.8 2.1-7L25 29h7z"
        fill="#FDE047"
        stroke="#1E3A8A"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function IconTrophy({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <path d="M18 14h28v10c0 10-6 18-14 18s-14-8-14-18V14z" fill="#F59E0B" stroke="#1E3A8A" strokeWidth="3" />
      <path d="M18 18H10c0 8 4 12 8 14M46 18h8c0 8-4 12-8 14" fill="none" stroke="#1E3A8A" strokeWidth="3" />
      <rect x="24" y="42" width="16" height="6" rx="2" fill="#FDE047" stroke="#1E3A8A" strokeWidth="2" />
      <rect x="20" y="48" width="24" height="6" rx="2" fill="#F59E0B" stroke="#1E3A8A" strokeWidth="2" />
      <path d="M32 24 34 29h5l-4 3 1.5 5L32 34l-4.5 3 1.5-5-4-3h5z" fill="#FDE047" />
    </svg>
  )
}

export function IconHeart({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <path
        d="M32 54S10 40 10 24c0-8 6-14 14-14 5 0 8 3 8 3s3-3 8-3c8 0 14 6 14 14 0 16-22 30-22 30z"
        fill="#F472B6"
        stroke="#1E3A8A"
        strokeWidth="3"
      />
      <ellipse cx="22" cy="24" rx="5" ry="3" fill="#fff" opacity="0.5" />
    </svg>
  )
}

export function IconFlame({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <path
        d="M32 8c4 10-4 14-2 22 8-6 14 2 14 12 0 12-8 20-14 20s-14-8-14-20c0-8 4-14 8-18 0 6 2 10 4 12 0-10 2-18 4-28z"
        fill="#F59E0B"
        stroke="#1E3A8A"
        strokeWidth="3"
      />
      <path d="M32 34c2 4 0 8 0 12 4-2 6 2 6 6 0 6-3 10-6 10s-6-4-6-10c0-4 2-8 6-18z" fill="#FDE047" />
    </svg>
  )
}

export function IconBook({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <path d="M10 16h20c6 0 10 4 10 10v26H20c-6 0-10-4-10-10V16z" fill="#8B5CF6" stroke="#1E3A8A" strokeWidth="3" />
      <path d="M54 16H34c-6 0-10 4-10 10v26h20c6 0 10-4 10-10V16z" fill="#F472B6" stroke="#1E3A8A" strokeWidth="3" />
      <path d="M32 26v26" stroke="#1E3A8A" strokeWidth="3" />
    </svg>
  )
}

export function IconKeyboard({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <rect x="6" y="18" width="52" height="32" rx="8" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="3" />
      <rect x="14" y="26" width="8" height="8" rx="2" fill="#FDE047" />
      <rect x="28" y="26" width="8" height="8" rx="2" fill="#FDE047" />
      <rect x="42" y="26" width="8" height="8" rx="2" fill="#FDE047" />
      <rect x="18" y="38" width="28" height="6" rx="2" fill="#fff" />
    </svg>
  )
}

export function IconGamepad({ className, size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <path
        d="M12 28c0-8 6-14 14-14h12c8 0 14 6 14 14v8c0 8-6 12-12 12-4 0-6-2-8-2s-4 2-8 2c-6 0-12-4-12-12v-8z"
        fill="#8B5CF6"
        stroke="#1E3A8A"
        strokeWidth="3"
      />
      <path d="M22 30v12M16 36h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42" cy="32" r="3" fill="#F472B6" />
      <circle cx="48" cy="38" r="3" fill="#06B6D4" />
    </svg>
  )
}
