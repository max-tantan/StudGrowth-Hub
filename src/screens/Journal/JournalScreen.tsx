import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MOODS } from '../../lib/format'
import { cn } from '../../lib/cn'
import { useApp } from '../../store/AppContext'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { SearchInput } from '../../components/ui/SearchInput'
import { JournalCard } from '../../components/journal/JournalCard'
import { MOOD_ICON } from '../../components/ui/icons'
import type { MoodLevel } from '../../types'

export function JournalScreen() {
  const { state, currentStudent, streak } = useApp()
  const [query, setQuery] = useState('')
  const [moodFilter, setMoodFilter] = useState<MoodLevel | null>(null)

  const entries = useMemo(() => {
    const list = state.journals
      .filter((j) => j.studentId === currentStudent.id)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    const q = query.trim().toLowerCase()
    return list.filter((j) => {
      if (moodFilter && j.mood !== moodFilter) return false
      if (!q) return true
      return (
        j.title.toLowerCase().includes(q) || j.body.toLowerCase().includes(q)
      )
    })
  }, [state.journals, currentStudent.id, query, moodFilter])

  const total = state.journals.filter(
    (j) => j.studentId === currentStudent.id,
  ).length

  return (
    <>
      <TopBar
        title="Jurnal"
        subtitle={`${total} catatan · runtutan ${streak} hari`}
        right={
          <Link to="/jurnal/baru">
            <Button size="sm" icon="plus">
              Tulis
            </Button>
          </Link>
        }
      />

      <main className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari di jurnalmu…"
        />

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <FilterChip active={!moodFilter} onClick={() => setMoodFilter(null)}>
            Semua
          </FilterChip>
          {MOODS.map((m) => (
            <FilterChip
              key={m.id}
              active={moodFilter === m.id}
              onClick={() => setMoodFilter(moodFilter === m.id ? null : m.id)}
            >
              <Icon
                name={MOOD_ICON[m.id]}
                size={14}
                weight="fill"
                style={{ color: m.color }}
              />
              {m.label}
            </FilterChip>
          ))}
        </div>

        {entries.length === 0 ? (
          total === 0 ? (
            <EmptyState
              icon="journal"
              title="Jurnalmu masih kosong"
              description="Mulai mencatat. Setiap entri adalah bukti pertumbuhanmu dari waktu ke waktu."
              action={
                <Link to="/jurnal/baru">
                  <Button icon="plus">Tulis jurnal pertama</Button>
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon="search"
              title="Tidak ada hasil"
              description="Coba kata kunci lain atau hapus filter suasana hati."
            />
          )
        ) : (
          <div className="flex flex-col gap-2.5">
            {entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'border-accent bg-accent-tint text-accent-strong'
          : 'border-border-strong bg-surface text-fg-muted hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
