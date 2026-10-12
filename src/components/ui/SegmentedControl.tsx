import { cn } from '../../lib/cn'
import { Icon } from './Icon'
import type { IconName } from './icons'

interface Option<T extends string> {
  value: T
  label: string
  icon?: IconName
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  size?: 'sm' | 'md'
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex w-full items-center gap-1 rounded-full border border-border bg-surface-2 p-1',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200',
              size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
              active
                ? 'bg-surface text-fg shadow-[var(--shadow-sm)]'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            {opt.icon && (
              <Icon
                name={opt.icon}
                size={size === 'sm' ? 14 : 16}
                weight={active ? 'fill' : 'regular'}
              />
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
