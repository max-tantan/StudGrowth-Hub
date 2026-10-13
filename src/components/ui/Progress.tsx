import { motion } from 'motion/react'
import { cn } from '../../lib/cn'
import { clamp } from '../../lib/format'
import { EASE_SETTLE } from '../motion/transitions'
import { useMotionEnabled } from '../motion/useMotionEnabled'

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
  const animate = useMotionEnabled()
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-surface-3', size === 'sm' ? 'h-1.5' : 'h-2', className)}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <motion.div
        className={cn('h-full rounded-full', TONES[tone])}
        initial={animate ? { width: 0 } : false}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.6, ease: EASE_SETTLE }}
      />
    </div>
  )
}
