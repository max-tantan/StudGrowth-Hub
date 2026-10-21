import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
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
  label?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
  label,
}: SegmentedControlProps<T>) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = options.findIndex((opt) => opt.value === value)
  const tabbableIndex = activeIndex === -1 ? 0 : activeIndex

  const focusAt = (index: number) => {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    buttons.current[index]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusAt((index + 1) % options.length)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusAt((index - 1 + options.length) % options.length)
        break
      case 'Home':
        event.preventDefault()
        focusAt(0)
        break
      case 'End':
        event.preventDefault()
        focusAt(options.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex w-full items-center gap-1 rounded-full border border-border bg-surface-2 p-1',
        className,
      )}
    >
      {options.map((opt, index) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            ref={(el) => {
              buttons.current[index] = el
            }}
            role="radio"
            type="button"
            aria-checked={active}
            tabIndex={index === tabbableIndex ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-200',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong',
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
