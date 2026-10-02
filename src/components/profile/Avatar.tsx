import { cn } from '@/lib/cn'

export function Avatar({
  name,
  src,
  size = 'lg',
  className,
  accent = '#0f9b8e',
}: {
  name: string
  src: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  accent?: string
}) {
  const sizes = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
    xl: 'h-36 w-36',
  }

  return (
    <span
      className={cn(
        'inline-block overflow-hidden rounded-full bg-white shadow-inner ring-4 ring-white',
        sizes[size],
        className,
      )}
      style={{ boxShadow: `0 0 0 3px ${accent}55` }}
    >
      <img
        src={src}
        alt={`Avatar de ${name}`}
        className="h-full w-full object-cover object-top"
        draggable={false}
      />
    </span>
  )
}
