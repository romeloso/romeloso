import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'sunny' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'md' | 'lg' | 'xl'
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-sky text-white shadow-[0_5px_0_#1e3a8a] hover:translate-y-px hover:shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none',
  secondary:
    'bg-white text-navy border-2 border-navy/10 shadow-[0_4px_0_rgba(30,58,138,0.14)] hover:bg-cream',
  ghost: 'bg-transparent text-navy hover:bg-white/70',
  sunny:
    'bg-sun text-navy shadow-[0_5px_0_#f59e0b] hover:translate-y-px active:translate-y-1 active:shadow-none',
  danger:
    'bg-pink text-white shadow-[0_5px_0_#ec4899] hover:translate-y-px active:translate-y-1 active:shadow-none',
}

const sizes = {
  md: 'min-h-12 px-5 text-base rounded-[1.25rem]',
  lg: 'min-h-14 px-6 text-lg rounded-[1.35rem]',
  xl: 'min-h-16 px-8 text-xl rounded-[1.6rem]',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display font-bold tracking-wide transition-transform disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
