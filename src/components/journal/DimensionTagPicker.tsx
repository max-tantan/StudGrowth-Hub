import { cn } from '../../lib/cn'
import {
  PPP_DIMENSIONS,
  WORK_READINESS_DIMENSIONS,
} from '../../config/dimensions'
import { DIMENSION_ICON } from '../ui/icons'
import { Icon } from '../ui/Icon'

interface DimensionTagPickerProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function DimensionTagPicker({ value, onChange }: DimensionTagPickerProps) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])

  return (
    <div className="flex flex-col gap-3">
      <Group
        title="Karakter"
        dims={PPP_DIMENSIONS}
        value={value}
        onToggle={toggle}
      />
      <Group
        title="Kesiapan Kerja"
        dims={WORK_READINESS_DIMENSIONS}
        value={value}
        onToggle={toggle}
      />
    </div>
  )
}

function Group({
  title,
  dims,
  value,
  onToggle,
}: {
  title: string
  dims: typeof PPP_DIMENSIONS
  value: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-fg-subtle">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {dims.map((dim) => {
          const active = value.includes(dim.id)
          return (
            <button
              key={dim.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(dim.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-[0.97]',
                active
                  ? 'border-transparent text-fg'
                  : 'border-border-strong bg-surface text-fg-muted hover:text-fg',
              )}
              style={
                active
                  ? {
                      backgroundColor: `color-mix(in oklab, ${dim.color} 18%, var(--surface))`,
                    }
                  : undefined
              }
            >
              <Icon
                name={DIMENSION_ICON[dim.id] ?? 'sparkle'}
                size={13}
                weight="bold"
                style={{ color: dim.color }}
              />
              {dim.short}
            </button>
          )
        })}
      </div>
    </div>
  )
}
