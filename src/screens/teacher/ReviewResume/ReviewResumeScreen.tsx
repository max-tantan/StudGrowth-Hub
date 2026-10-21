import { useMemo, useState } from 'react'
import type { Major, PklStatus } from '../../../types'
import { Icon } from '../../../components/ui/Icon'
import { Card } from '../../../components/ui/Card'
import { Chip } from '../../../components/ui/Chip'
import { Avatar } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'
import { Sheet } from '../../../components/ui/Sheet'
import { TextArea } from '../../../components/ui/Field'
import { SearchInput } from '../../../components/ui/SearchInput'
import { SegmentedControl } from '../../../components/ui/SegmentedControl'
import { EmptyState } from '../../../components/ui/EmptyState'
import { MOOD_ICON } from '../../../components/ui/icons'
import { PageHeader } from '../../../components/teacher/PageHeader'
import { FilterPills } from '../../../components/teacher/FilterPills'
import { useApp } from '../../../store/AppContext'
import { buildWeekSummary, rosterForTeacher } from '../../../lib/teacher'
import type { WeekSummary } from '../../../lib/teacher'
import { MAJORS, MAJOR_LIST } from '../../../config/majors'
import { getDimension } from '../../../config/dimensions'
import { useIsDesktop } from '../../../lib/media'
import { MOOD_MAP, formatShort, relativeLabel } from '../../../lib/format'
import { cn } from '../../../lib/cn'

type MajorFilter = Major | 'ALL'

export function ReviewResumeScreen() {
  const { state, currentTeacher } = useApp()
  const roster = rosterForTeacher(state, currentTeacher)
  const isDesktop = useIsDesktop()

  const [major, setMajor] = useState<MajorFilter>('ALL')
  const [pkl, setPkl] = useState<PklStatus | 'ALL'>('ALL')
  const [query, setQuery] = useState('')
  const [weekOffset, setWeekOffset] = useState<0 | 1>(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({})

  const rows = useMemo(() => {
    return roster
      .filter((s) => major === 'ALL' || s.major === major)
      .filter((s) => pkl === 'ALL' || s.pklStatus === pkl)
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .map((s) => ({ student: s, week: buildWeekSummary(s.id, state, weekOffset) }))
      .sort((a, b) => b.week.entries.length - a.week.entries.length)
  }, [roster, major, pkl, query, state, weekOffset])

  const withEntries = rows.filter((r) => r.week.entries.length > 0)
  const explicit = openId ? (rows.find((r) => r.student.id === openId) ?? null) : null
  const selected = explicit ?? withEntries[0] ?? null

  const pendingCount = withEntries.filter(
    (r) => !reviewed[`${r.student.id}:${r.week.id}`],
  ).length

  const markReviewed = (row: { student: { id: string }; week: WeekSummary }) => {
    const key = `${row.student.id}:${row.week.id}`
    setReviewed((prev) => ({ ...prev, [key]: true }))
    const next = withEntries.find((r) => !reviewed[`${r.student.id}:${r.week.id}`] && r.student.id !== row.student.id)
    setOpenId(next ? next.student.id : row.student.id)
  }

  return (
    <>
      <PageHeader
        eyebrow="Wali kelas · alur mingguan"
        title="Review resume murid"
        description="Tinjau rekap mingguan murid binaanmu, beri catatan, lalu tandai selesai direview."
        actions={
          <Chip tone={pendingCount ? 'accent' : 'success'} icon="clipboard">
            {pendingCount} menunggu
          </Chip>
        }
      />

      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari nama murid" />
          </div>
          <SegmentedControl<'0' | '1'>
            className="sm:w-auto"
            value={String(weekOffset) as '0' | '1'}
            onChange={(v) => setWeekOffset(v === '0' ? 0 : 1)}
            options={[
              { value: '0', label: 'Minggu ini', icon: 'calendar' },
              { value: '1', label: 'Minggu lalu', icon: 'rotate' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
          <FilterPills<MajorFilter>
            value={major}
            onChange={setMajor}
            options={[
              { value: 'ALL', label: 'Semua jurusan', count: roster.length },
              ...MAJOR_LIST.map((m) => ({
                value: m.id as MajorFilter,
                label: m.name,
                count: roster.filter((s) => s.major === m.id).length,
              })),
            ]}
          />
          <FilterPills<PklStatus | 'ALL'>
            value={pkl}
            onChange={setPkl}
            options={[
              { value: 'ALL', label: 'Semua status PKL' },
              { value: 'sedang', label: 'Sedang PKL' },
              { value: 'selesai', label: 'Selesai PKL' },
              { value: 'belum', label: 'Belum PKL' },
            ]}
          />
        </div>
      </div>

      {withEntries.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="Belum ada resume"
          description="Tidak ada jurnal pada periode ini untuk filter yang dipilih."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          <Card padded={false} className="overflow-hidden lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center justify-between border-b border-border bg-surface-2/40 px-4 py-2.5">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
                Antrean review
              </p>
              <p className="text-[11px] font-semibold text-fg-muted">
                {withEntries.length} murid
              </p>
            </div>
            <ul>
              {withEntries.map(({ student, week }) => {
                const key = `${student.id}:${week.id}`
                const done = reviewed[key]
                const topMood = week.moodSummary[0]
                const active = selected?.student.id === student.id
                return (
                  <li key={student.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(student.id)}
                      className={cn(
                        'relative flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors duration-200 last:border-b-0',
                        active ? 'bg-accent-tint/60' : 'hover:bg-surface-2/60',
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-accent" />
                      )}
                      <Avatar name={student.name} initials={student.initials} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-fg">{student.name}</p>
                          {done && (
                            <Icon
                              name="checkCircle"
                              size={14}
                              weight="fill"
                              className="shrink-0 text-success"
                            />
                          )}
                        </div>
                        <p className="truncate text-[12px] text-fg-subtle">
                          {MAJORS[student.major].name} · Kelas {student.grade} ·{' '}
                          {week.entries.length} jurnal
                        </p>
                      </div>
                      {topMood && (
                        <span
                          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full sm:flex"
                          style={{
                            color: MOOD_MAP[topMood.mood].color,
                            backgroundColor: MOOD_MAP[topMood.mood].tint,
                          }}
                          title={MOOD_MAP[topMood.mood].label}
                        >
                          <Icon name={MOOD_ICON[topMood.mood]} size={18} weight="fill" />
                        </span>
                      )}
                      <Chip tone={done ? 'success' : 'warning'}>
                        {done ? 'Direview' : 'Perlu review'}
                      </Chip>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>

          <div className="hidden lg:block">
            {selected ? (
              <div className="rounded-[22px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
                      Resume {selected.student.name}
                    </p>
                    <p className="mt-1 text-[13px] text-fg-muted">
                      {selected.week.label} · {formatShort(selected.week.rangeStart)} –{' '}
                      {formatShort(selected.week.rangeEnd)}
                    </p>
                  </div>
                  <Chip
                    tone={
                      reviewed[`${selected.student.id}:${selected.week.id}`]
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {reviewed[`${selected.student.id}:${selected.week.id}`]
                      ? 'Direview'
                      : 'Perlu review'}
                  </Chip>
                </div>

                <ReviewDetailBody
                  key={`${selected.student.id}:${selected.week.id}`}
                  week={selected.week}
                />

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button
                    icon="checkSquare"
                    onClick={() => markReviewed(selected)}
                    disabled={Boolean(reviewed[`${selected.student.id}:${selected.week.id}`])}
                  >
                    {reviewed[`${selected.student.id}:${selected.week.id}`]
                      ? 'Sudah direview'
                      : 'Tandai direview'}
                  </Button>
                  <Button
                    variant="secondary"
                    icon="arrowRight"
                    onClick={() => {
                      const idx = withEntries.findIndex(
                        (r) => r.student.id === selected.student.id,
                      )
                      const next = withEntries[(idx + 1) % withEntries.length]
                      if (next) setOpenId(next.student.id)
                    }}
                  >
                    Murid berikutnya
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon="clipboard"
                title="Pilih murid"
                description="Pilih salah satu murid di antrean untuk membaca resume mingguan."
              />
            )}
          </div>
        </div>
      )}

      <ReviewSheet
        open={!isDesktop && Boolean(explicit)}
        onClose={() => setOpenId(null)}
        week={explicit?.week ?? null}
        studentName={explicit?.student.name ?? ''}
        reviewed={Boolean(
          explicit && reviewed[`${explicit.student.id}:${explicit.week.id}`],
        )}
        onReview={() => {
          if (!explicit) return
          setReviewed((prev) => ({
            ...prev,
            [`${explicit.student.id}:${explicit.week.id}`]: true,
          }))
          setOpenId(null)
        }}
      />
    </>
  )
}

function ReviewSheet({
  open,
  onClose,
  week,
  studentName,
  reviewed,
  onReview,
}: {
  open: boolean
  onClose: () => void
  week: WeekSummary | null
  studentName: string
  reviewed: boolean
  onReview: () => void
}) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Resume ${studentName}`}
      description={week ? `${week.label} · ${formatShort(week.rangeStart)} – ${formatShort(week.rangeEnd)}` : ''}
      footer={
        <div className="flex gap-2">
          <Button block variant="secondary" icon="note" onClick={onClose}>
            Simpan catatan
          </Button>
          <Button block icon="checkSquare" onClick={onReview} disabled={reviewed}>
            {reviewed ? 'Sudah direview' : 'Tandai direview'}
          </Button>
        </div>
      }
    >
      {week && <ReviewDetailBody key={week.id} week={week} />}
    </Sheet>
  )
}

function ReviewDetailBody({ week }: { week: WeekSummary }) {
  const [note, setNote] = useState('')

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2.5">
        <MiniBox label="Jurnal" value={week.entries.length} />
        <MiniBox label="Obrolan" value={week.chatCount} />
        <MiniBox label="Target" value={week.targetsTouched.length} />
      </div>

      {week.moodSummary.length > 0 && (
        <div>
          <h3 className="mb-2 text-[13px] font-bold text-fg">Ringkasan mood</h3>
          <div className="flex flex-wrap gap-2">
            {week.moodSummary.map((m) => (
              <span
                key={m.mood}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  color: MOOD_MAP[m.mood].color,
                  backgroundColor: MOOD_MAP[m.mood].tint,
                }}
              >
                <Icon name={MOOD_ICON[m.mood]} size={14} weight="fill" />
                {MOOD_MAP[m.mood].label} · {m.count}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-[13px] font-bold text-fg">Jurnal minggu ini</h3>
        <ul className="flex flex-col gap-2.5">
          {week.entries.map((e) => (
            <li
              key={e.id}
              className="rounded-[14px] border border-border bg-surface-2/50 p-3.5"
            >
              <div className="flex items-center gap-2">
                <Icon
                  name={MOOD_ICON[e.mood]}
                  size={16}
                  weight="fill"
                  style={{ color: MOOD_MAP[e.mood].color }}
                />
                <p className="text-[13px] font-bold text-fg">{e.title}</p>
                <span className="ml-auto text-[11px] text-fg-subtle">
                  {relativeLabel(e.date)}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-fg-muted text-pretty">
                {e.body}
              </p>
              {e.dimensions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.dimensions.map((d) => {
                    const dim = getDimension(d)
                    if (!dim) return null
                    return (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[10.5px] font-semibold text-fg-muted ring-1 ring-border"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: dim.color }}
                        />
                        {dim.short}
                      </span>
                    )
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <TextArea
        label="Catatan untuk murid"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Apresiasi atau saran yang membangun…"
        className="min-h-[90px]"
      />
    </div>
  )
}

function MiniBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface-2/50 px-3 py-2.5 text-center">
      <p className="text-xl font-extrabold text-fg">{value}</p>
      <p className="text-[11px] text-fg-subtle">{label}</p>
    </div>
  )
}
