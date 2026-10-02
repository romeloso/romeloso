import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function PageShell({
  children,
  className,
  wide = false,
}: {
  children: ReactNode
  className?: string
  wide?: boolean
}) {
  return (
    <div className="min-h-dvh px-4 py-5 safe-pb sm:px-6 sm:py-8">
      <div className={cn('mx-auto', wide ? 'max-w-6xl' : 'max-w-3xl', className)}>
        {children}
      </div>
    </div>
  )
}
