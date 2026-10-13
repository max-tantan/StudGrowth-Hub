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
import {
  buildWeekSummary,
  rosterForTeacher,
} from '../../../lib/teacher'
import type { WeekSummary } from '../../../lib/teacher'
import { MAJORS, MAJOR_LIST } from '../../../config/majors'
import { getDimension } from '../../../config/dimensions'
import { MOOD_MAP, formatShort, relativeLabel } from '../../../lib/format'

type MajorFilter = Major | 'ALL'

export function ReviewResumeScreen() {
  const { state, currentTeacher } = useApp()
  const roster = rosterForTeacher(state, currentTeacher)

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
  const open = rows.find((r) => r.student.id === openId) ?? null

  const pendingCount = withEntries.filter(
    (r) => !reviewed[`${r.student.id}:${r.week.id}`],
  ).length

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

      {withEntries.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="Belum ada resume"
          description="Tidak ada jurnal pada periode ini untuk filter yang dipilih."
        />
      ) : (
        <Card padded={false} className="overflow-hidden">
          <ul>
            {withEntries.map(({ student, week }) => {
              const key = `${student.id}:${week.id}`
              const done = reviewed[key]
              const topMood = week.moodSummary[0]
              return (
                <li
                  key={student.id}
                  className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0"
                >
                  <Avatar name={student.name} initials={student.initials} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-fg">{student.name}</p>
                    <p className="truncate text-[12px] text-fg-subtle">
                      {MAJORS[student.major].name} · Kelas {student.grade} ·{' '}
                      {week.entries.length} jurnal · {week.chatCount} obrolan
                    </p>
                  </div>

                  {topMood && (
                    <span
                      className="hidden h-8 w-8 items-center justify-center rounded-full sm:flex"
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
                  <Button
                    size="sm"
                    variant={done ? 'secondary' : 'primary'}
                    icon="eye"
                    onClick={() => setOpenId(student.id)}
                  >
                    Tinjau
                  </Button>
                </li>
              )
            })}
          </ul>
        </Card>
      )}

      <ReviewSheet
        open={Boolean(open)}
        onClose={() => setOpenId(null)}
        week={open?.week ?? null}
        studentName={open?.student.name ?? ''}
        reviewed={Boolean(open && reviewed[`${open.student.id}:${open.week.id}`])}
        onReview={() => {
          if (!open) return
          setReviewed((prev) => ({ ...prev, [`${open.student.id}:${open.week.id}`]: true }))
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
  const [note, setNote] = useState('')

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
      {week && (
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
      )}
    </Sheet>
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
