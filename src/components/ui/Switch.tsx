import { cn } from '../../lib/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  className?: string
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  className,
}: SwitchProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-3', className)}>
      {(label || description) && (
        <span className="min-w-0 flex-1">
          {label && (
            <span className="block text-sm font-semibold text-fg">{label}</span>
          )}
          {description && (
            <span className="mt-0.5 block text-xs leading-snug text-fg-muted">
              {description}
            </span>
          )}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200',
          checked
            ? 'border-transparent bg-accent'
            : 'border-border-strong bg-surface-2',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow-sm transition-[left] duration-200',
            checked
              ? 'left-[calc(100%-1.25rem-2px)]'
              : 'left-0.5',
          )}
        />
      </button>
    </label>
  )
}