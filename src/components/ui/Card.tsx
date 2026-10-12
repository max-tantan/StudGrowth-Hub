import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sunken' | 'outline' | 'accent'
  padded?: boolean
}

const VARIANTS: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-surface border border-border shadow-[var(--shadow-sm)]',
  sunken: 'bg-surface-2 border border-transparent',
  outline: 'bg-transparent border border-border',
  accent: 'bg-accent-tint border border-accent/20',
}

export function Card({
  variant = 'default',
  padded = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)]',
        VARIANTS[variant],
        padded && 'p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
