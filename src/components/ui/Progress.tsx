import { cn } from '../../lib/cn'
import { clamp } from '../../lib/format'

interface ProgressProps {
  value: number
  tone?: 'accent' | 'success' | 'info' | 'warning'
  size?: 'sm' | 'md'
  className?: string
  label?: string
}

const TONES = {
  accent: 'bg-accent',
  success: 'bg-success',
  info: 'bg-info',
  warning: 'bg-warning',
} as const

export function Progress({
  value,
  tone = 'accent',
  size = 'md',
  className,
  label,
}: ProgressProps) {
  const v = clamp(value)
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-surface-3', size === 'sm' ? 'h-1.5' : 'h-2', className)}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500 ease-out', TONES[tone])}
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
