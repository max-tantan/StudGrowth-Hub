import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'

type Tone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface StatTileProps {
  label: string
  value: ReactNode
  hint?: string
  icon: IconName
  tone?: Tone
  className?: string
}

const ICON_TONES: Record<Tone, string> = {
  accent: 'bg-accent-tint text-accent-strong',
  success: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
  danger: 'bg-danger-tint text-danger',
  info: 'bg-info-tint text-info',
  neutral: 'bg-surface-3 text-fg-muted',
}

/**
 * Double-bezel stat card: an outer tray + inner core for machined, physical depth.
 */
export function StatTile({
  label,
  value,
  hint,
  icon,
  tone = 'accent',
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-[24px] bg-surface-2/70 p-1.5 ring-1 ring-border transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3 rounded-[18px] bg-surface p-4 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              ICON_TONES[tone],
            )}
          >
            <Icon name={icon} size={20} weight="duotone" />
          </span>
        </div>
        <div>
          <p className="text-[30px] font-extrabold leading-none tracking-tight text-fg">
            {value}
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-fg-muted">{label}</p>
          {hint && <p className="mt-0.5 text-[11.5px] text-fg-subtle">{hint}</p>}
        </div>
      </div>
    </div>
  )
}
