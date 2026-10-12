import { Link } from 'react-router-dom'
import type { JournalEntry } from '../../types'
import { getDimension } from '../../config/dimensions'
import { MOOD_MAP, relativeLabel } from '../../lib/format'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { MOOD_ICON } from '../ui/icons'
import { Chip } from '../ui/Chip'

export function JournalCard({ entry }: { entry: JournalEntry }) {
  const mood = MOOD_MAP[entry.mood]
  return (
    <Link to={`/jurnal/${entry.id}`} className="block">
      <Card className="transition-all duration-200 hover:border-border-strong hover:shadow-[var(--shadow-md)] active:scale-[0.995]">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ color: mood.color, backgroundColor: mood.tint }}
          >
            <Icon name={MOOD_ICON[entry.mood]} size={20} weight="fill" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold text-fg">
                {entry.title}
              </h3>
              <span className="shrink-0 font-mono text-[11px] text-fg-subtle">
                {relativeLabel(entry.date)}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-fg-muted text-pretty">
              {entry.body}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {entry.pkl && <Chip tone="info" icon="briefcase">PKL</Chip>}
              {entry.dimensions.slice(0, 3).map((id) => {
                const dim = getDimension(id)
                if (!dim) return null
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      color: dim.color,
                      backgroundColor: `color-mix(in oklab, ${dim.color} 14%, var(--surface))`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: dim.color }}
                    />
                    {dim.short}
                  </span>
                )
              })}
              {entry.dimensions.length > 3 && (
                <span className="text-[11px] font-semibold text-fg-subtle">
                  +{entry.dimensions.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
