import type { MoodLevel } from '../../types'
import { MOODS } from '../../lib/format'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { MOOD_ICON } from '../ui/icons'

interface MoodPickerProps {
  value: MoodLevel
  onChange: (value: MoodLevel) => void
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div role="radiogroup" aria-label="Suasana hati" className="flex gap-2">
      {MOODS.map((mood) => {
        const active = mood.id === value
        return (
          <button
            key={mood.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(mood.id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-2xl border px-1 py-2.5 transition-all duration-200 active:scale-[0.97]',
              active
                ? 'border-accent bg-accent-tint'
                : 'border-border bg-surface hover:bg-surface-2',
            )}
          >
            <Icon
              name={MOOD_ICON[mood.id]}
              size={24}
              weight={active ? 'fill' : 'regular'}
              style={{ color: mood.color }}
            />
            <span
              className={cn(
                'text-[10.5px] font-semibold leading-tight',
                active ? 'text-accent-strong' : 'text-fg-muted',
              )}
            >
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
