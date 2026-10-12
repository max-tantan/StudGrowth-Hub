import { cn } from '../../lib/cn'

interface AvatarProps {
  name: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const DIMS = 6

function hash(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

export function Avatar({ name, initials, size = 'md', className }: AvatarProps) {
  const text =
    initials ??
    name
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
  const color = `var(--dim-${(hash(name) % DIMS) + 1})`
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        SIZES[size],
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in oklab, ${color} 18%, var(--surface))`,
      }}
    >
      {text}
    </span>
  )
}
