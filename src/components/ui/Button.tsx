import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'
import type { IconName } from './icons'

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  icon?: IconName
  iconRight?: IconName
  children?: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-fg-on-accent hover:bg-accent-hover shadow-[var(--shadow-sm)]',
  secondary:
    'bg-surface text-fg border border-border-strong hover:bg-surface-2',
  ghost: 'text-fg-muted hover:bg-surface-2 hover:text-fg',
  soft: 'bg-accent-tint text-accent-strong hover:brightness-[0.97]',
  danger: 'bg-danger-tint text-danger border border-danger/25 hover:brightness-[0.97]',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  iconRight,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap select-none',
        'transition-[transform,background-color,border-color,filter] duration-200',
        'active:translate-y-[1px] active:scale-[0.99]',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} weight="bold" />}
      {children}
      {iconRight && (
        <Icon name={iconRight} size={size === 'sm' ? 16 : 18} weight="bold" />
      )}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: IconName
  label: string
  variant?: Variant
  size?: number
  weight?: 'regular' | 'bold' | 'fill'
  tone?: 'default' | 'ghost'
}

export function IconButton({
  name,
  label,
  variant = 'secondary',
  size = 18,
  weight = 'bold',
  tone = 'default',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        'transition-[transform,background-color,border-color] duration-200',
        'active:scale-[0.94]',
        'disabled:pointer-events-none disabled:opacity-50',
        tone === 'ghost'
          ? 'text-fg-muted hover:bg-surface-2 hover:text-fg'
          : cn(
              variant === 'primary'
                ? 'bg-accent text-fg-on-accent'
                : 'border border-border-strong bg-surface text-fg hover:bg-surface-2',
            ),
        className,
      )}
      {...rest}
    >
      <Icon name={name} size={size} weight={weight} />
    </button>
  )
}
