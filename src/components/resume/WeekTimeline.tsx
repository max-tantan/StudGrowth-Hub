import { useState } from 'react'
import { MOOD_MAP } from '../../lib/format'
import { cn } from '../../lib/cn'
import { Card } from '../ui/Card'
import { WeekDetailBody } from './WeekDetailBody'
import type { MoodLevel, ResumeWeek } from '../../types'

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

function dayMood(
  week: ResumeWeek,
  dayIndex: number,
): { color: string; count: number; date: Date } | null {
  const start = new Date(week.rangeStart)
  const day = new Date(start)
  day.setDate(start.getDate() + dayIndex)
  const key = day.toDateString()
  const dayEntries = week.entries.filter(
    (e) => new Date(e.date).toDateString() === key,
  )
  if (dayEntries.length === 0) return null

  const counts = new Map<MoodLevel, number>()
  for (const e of dayEntries) counts.set(e.mood, (counts.get(e.mood) ?? 0) + 1)
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
  return { color: MOOD_MAP[top].color, count: dayEntries.length, date: day }
}

export function WeekTimeline({ weeks }: { weeks: ResumeWeek[] }) {
  const [selected, setSelected] = useState(weeks[0]?.id ?? null)
  const active = weeks.find((w) => w.id === selected) ?? weeks[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-6 gap-2.5">
        {weeks.map((week) => {
          const isActive = week.id === selected
          return (
            <button
              key={week.id}
              type="button"
              onClick={() => setSelected(week.id)}
              className={cn(
                'flex flex-col gap-2 rounded-2xl border p-2.5 text-left transition-colors',
                isActive
                  ? 'border-accent bg-accent-tint/50'
                  : 'border-border bg-surface hover:border-border-strong',
              )}
            >
              <span
                className={cn(
                  'truncate text-[11px] font-bold',
                  isActive ? 'text-accent-strong' : 'text-fg',
                )}
              >
                {week.label}
              </span>
              <div className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, d) => {
                  const m = dayMood(week, d)
                  return (
                    <span
                      key={d}
                      className="h-3.5 w-full rounded-[5px] border border-border bg-surface-2"
                      style={
                        m
                          ? {
                              backgroundColor: m.color,
                              borderColor: m.color,
                              opacity: m.count > 1 ? 1 : 0.42,
                            }
                          : undefined
                      }
                      title={
                        m
                          ? `${DAY_LABELS[d]} · ${m.count} jurnal`
                          : `${DAY_LABELS[d]} · kosong`
                      }
                    />
                  )
                })}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] text-fg-subtle">
                  {week.entries.length} jurnal
                </span>
                {week.status === 'direview' ? (
                  <span className="text-[10px] font-semibold text-success">
                    Direview
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-warning">
                    Menunggu
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {active && (
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="flex-1 text-sm font-bold text-fg">{active.label}</h3>
            <span className="text-xs text-fg-subtle">
              {active.chatCount} obrolan · {active.targetsTouched.length} target
            </span>
          </div>
          <WeekDetailBody week={active} />
        </Card>
      )}
    </div>
  )
}