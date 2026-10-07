import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function StatPill({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-w-[7.5rem] flex-col rounded-[1.35rem] bg-white/90 px-4 py-3 shadow-[0_8px_20px_rgba(30,58,138,0.1)] ring-1 ring-navy/10',
        className,
      )}
    >
      <span className="text-sm font-bold text-ink-soft">
        <span aria-hidden="true">{icon}</span> {label}
      </span>
      <span className="font-display text-2xl font-bold text-ink">{value}</span>
    </div>
  )
}
