import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'
import type { IconName } from './icons'

interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon = 'sparkle',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-border-strong bg-surface-2/60 px-6 py-10 text-center',
        className,
      )}
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint text-accent-strong">
        <Icon name={icon} size={24} weight="duotone" />
      </span>
      <h3 className="text-base font-bold text-fg">{title}</h3>
      {description && (
        <p className="mt-1 max-w-[34ch] text-sm text-fg-muted text-pretty">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
