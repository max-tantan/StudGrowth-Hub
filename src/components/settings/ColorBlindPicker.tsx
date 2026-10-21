import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import {
  COLOR_BLIND_OPTIONS,
  type ColorBlindMode,
} from '../../lib/colorBlind'

export function ColorBlindPicker({
  mode,
  onChange,
}: {
  mode: ColorBlindMode
  onChange: (mode: ColorBlindMode) => void
}) {
  return (
    <div
      role="group"
      aria-label="Modus buta warna"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
    >
      {COLOR_BLIND_OPTIONS.map((opt) => {
        const active = opt.id === mode
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'rounded-[var(--radius-card)] border p-3 text-left transition-all duration-200',
              'hover:border-border-strong active:scale-[0.98]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong',
              active
                ? 'border-accent bg-accent-tint'
                : 'border-border bg-surface-2',
            )}
          >
            <span className="flex items-center justify-between gap-1">
              <span className="flex flex-wrap items-center gap-1">
                {opt.swatches.map((c) => (
                  <span
                    key={c}
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full ring-1 ring-black/5"
                    style={{ background: c }}
                  />
                ))}
              </span>
              {active && (
                <Icon
                  name="check"
                  size={14}
                  weight="bold"
                  className="shrink-0 text-accent-strong"
                />
              )}
            </span>
            <span className="mt-2 block text-[13px] font-bold text-fg">
              {opt.label}
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-fg-muted">
              {opt.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
