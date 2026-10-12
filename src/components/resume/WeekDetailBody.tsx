import { Link } from 'react-router-dom'
import { MOOD_MAP, relativeLabel } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { MOOD_ICON } from '../ui/icons'
import type { ResumeWeek } from '../../types'

export function WeekDetailBody({ week }: { week: ResumeWeek }) {
  if (week.entries.length === 0) {
    return <p className="text-sm text-fg-muted">Tidak ada catatan minggu ini.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
          Suasana hati
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {week.moodSummary.map((m) => (
            <span
              key={m.mood}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                color: MOOD_MAP[m.mood].color,
                backgroundColor: MOOD_MAP[m.mood].tint,
              }}
            >
              <Icon name={MOOD_ICON[m.mood]} size={13} weight="fill" />
              {MOOD_MAP[m.mood].label} · {m.count}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
          Jurnal
        </p>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {week.entries.map((e) => (
            <li key={e.id}>
              <Link
                to={`/jurnal/${e.id}`}
                className="flex items-center gap-2 text-sm font-medium text-fg hover:text-accent-strong"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="min-w-0 flex-1 truncate">{e.title}</span>
                <span className="shrink-0 font-mono text-[10.5px] text-fg-subtle">
                  {relativeLabel(e.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {week.targetsTouched.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
            Target
          </p>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {week.targetsTouched.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-fg">
                <Icon
                  name={t.status === 'selesai' ? 'checkCircle' : 'target'}
                  size={15}
                  weight="fill"
                  className={
                    t.status === 'selesai' ? 'text-success' : 'text-accent-strong'
                  }
                />
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}