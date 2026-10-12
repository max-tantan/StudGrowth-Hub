import type { DimensionScore } from '../../types'
import { Icon } from '../ui/Icon'
import { DIMENSION_ICON } from '../ui/icons'

interface DimensionBarsProps {
  scores: DimensionScore[]
}

export function DimensionBars({ scores }: DimensionBarsProps) {
  return (
    <ul className="flex flex-col gap-3.5">
      {scores.map((s) => (
        <li key={s.dimension.id}>
          <div className="mb-1.5 flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{
                color: s.dimension.color,
                backgroundColor: `color-mix(in oklab, ${s.dimension.color} 16%, var(--surface))`,
              }}
            >
              <Icon
                name={DIMENSION_ICON[s.dimension.id] ?? 'sparkle'}
                size={16}
                weight="bold"
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg">
              {s.dimension.label}
            </span>
            <span className="font-mono text-sm font-medium text-fg-muted">
              {s.score}
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuenow={s.score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={s.dimension.label}
          >
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${s.score}%`, backgroundColor: s.dimension.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
