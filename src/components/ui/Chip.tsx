import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'
import type { IconName } from './icons'

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

interface ChipProps {
  children: ReactNode
  tone?: Tone
  icon?: IconName
  className?: string
}

const TONES: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-fg-muted',
  accent: 'bg-accent-tint text-accent-strong',
  success: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
  danger: 'bg-danger-tint text-danger',
  info: 'bg-info-tint text-info',
}

export function Chip({ children, tone = 'neutral', icon, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        TONES[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} weight="bold" />}
      {children}
    </span>
  )
}
