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
      className={cn('drop-shadow-lg', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="starFill" x1="20" y1="10" x2="100" y2="110">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M60 8 72 42h36L80 64l12 36-32-22-32 22 12-36L24 42h36z"
        fill="url(#starFill)"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="52" r="4" fill="#0F172A" />
      <circle cx="72" cy="52" r="4" fill="#0F172A" />
      <path
        d="M48 68c4 8 20 8 24 0"
        fill="none"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="40" cy="60" r="5" fill="#F9A8D4" opacity="0.85" />
      <circle cx="80" cy="60" r="5" fill="#F9A8D4" opacity="0.85" />
    </svg>
  )
}
