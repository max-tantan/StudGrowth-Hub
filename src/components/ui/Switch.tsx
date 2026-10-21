import { useId } from 'react'
import { cn } from '../../lib/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  className?: string
  id?: string
  disabled?: boolean
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  className,
  id,
  disabled = false,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: SwitchProps) {
  const autoId = useId()
  const controlId = id ?? autoId
  const labelId = `${controlId}-label`
  const descriptionId = `${controlId}-description`
  const labelledBy = ariaLabelledby ?? (label ? labelId : undefined)
  const describedBy = ariaDescribedby ?? (description ? descriptionId : undefined)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {(label || description) && (
        <label
          htmlFor={controlId}
          className={cn('min-w-0 flex-1', disabled ? '' : 'cursor-pointer')}
        >
          {label && (
            <span
              id={labelId}
              className="block text-sm font-semibold text-fg"
            >
              {label}
            </span>
          )}
          {description && (
            <span
              id={descriptionId}
              className="mt-0.5 block text-xs leading-snug text-fg-muted text-pretty"
            >
              {description}
            </span>
          )}
        </label>
      )}
      <button
        type="button"
        id={controlId}
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked
            ? 'border-transparent bg-accent'
            : 'border-border-strong bg-surface-2',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow-sm transition-[left] duration-200',
            checked
              ? 'left-[calc(100%-1.25rem-2px)]'
              : 'left-0.5',
          )}
        />
      </button>
    </div>
  )
}
