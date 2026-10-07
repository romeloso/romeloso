import { cn } from '@/lib/cn'

export function SmilingStar({
  className,
  size = 72,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={cn('drop-shadow-[0_8px_16px_rgba(30,58,138,0.25)]', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="starFill" x1="20" y1="10" x2="100" y2="110">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="55%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="starShine" cx="35%" cy="30%" r="45%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="88" r="10" fill="#F472B6" opacity="0.55" />
      <circle cx="96" cy="30" r="8" fill="#06B6D4" opacity="0.5" />
      <circle cx="98" cy="78" r="9" fill="#8B5CF6" opacity="0.45" />
      <path
        d="M60 8 72 42h36L80 64l12 36-32-22-32 22 12-36L24 42h36z"
        fill="url(#starFill)"
        stroke="#1E3A8A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M60 8 72 42h36L80 64l12 36-32-22-32 22 12-36L24 42h36z"
        fill="url(#starShine)"
      />
      <circle cx="48" cy="52" r="4.5" fill="#1E3A8A" />
      <circle cx="72" cy="52" r="4.5" fill="#1E3A8A" />
      <circle cx="46.5" cy="50.5" r="1.4" fill="#fff" />
      <circle cx="70.5" cy="50.5" r="1.4" fill="#fff" />
      <path
        d="M48 68c4 8 20 8 24 0"
        fill="none"
        stroke="#1E3A8A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="40" cy="60" r="5" fill="#F9A8D4" opacity="0.9" />
      <circle cx="80" cy="60" r="5" fill="#F9A8D4" opacity="0.9" />
    </svg>
  )
}
