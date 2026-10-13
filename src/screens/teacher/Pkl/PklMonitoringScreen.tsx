import { useMemo, useState } from 'react'
import type { PklStatus } from '../../../types'
import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icon'
import { Button } from '../../../components/ui/Button'
import { Avatar } from '../../../components/ui/Avatar'
import { Sheet } from '../../../components/ui/Sheet'
import { EmptyState } from '../../../components/ui/EmptyState'
import { MOOD_ICON } from '../../../components/ui/icons'
import { PageHeader } from '../../../components/teacher/PageHeader'
import { StatTile } from '../../../components/teacher/StatTile'
import { FilterPills } from '../../../components/teacher/FilterPills'
import { useApp } from '../../../store/AppContext'
import { allRiskAlerts, rosterForTeacher, studentOverview } from '../../../lib/teacher'
import type { StudentOverview } from '../../../lib/teacher'
import { MAJORS } from '../../../config/majors'
import { MOOD_MAP, relativeLabel } from '../../../lib/format'

type PklFilter = PklStatus | 'ALL'

export function PklMonitoringScreen() {
  const { state, currentTeacher } = useApp()
  const roster = rosterForTeacher(state, currentTeacher)
  const alerts = allRiskAlerts(state, roster)
  const pklAlerts = alerts.filter((a) => a.flag.category.startsWith('pkl-'))

  const [filter, setFilter] = useState<PklFilter>('ALL')

  const students = useMemo(() => {
    const base =
      currentTeacher.role === 'PEMBIMBING_PKL'
        ? roster
        : roster.filter((s) => s.pklStatus !== 'belum')
    return base
      .filter((s) => filter === 'ALL' || s.pklStatus === filter)
      .map((s) => studentOverview(state, s))
      .sort((a, b) => b.thisWeekEntries - a.thisWeekEntries)
  }, [roster, filter, state, currentTeacher.role])

  return (
    <>
      <PageHeader
        eyebrow="Pembimbing PKL"
        title="Monitoring PKL"
        description="Pantau murid yang sedang menjalani PKL, penempatan industri, catatan harian, dan sinyal risiko terkait."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatTile
          icon="briefcase"
          tone="accent"
          label="Total PKL"
          value={roster.filter((s) => s.pklStatus !== 'belum').length}
        />
        <StatTile
          icon="buildings"
          tone="warning"
          label="Sedang berjalan"
          value={roster.filter((s) => s.pklStatus === 'sedang').length}
        />
        <StatTile
          icon="checkCircle"
          tone="success"
          label="Selesai"
          value={roster.filter((s) => s.pklStatus === 'selesai').length}
        />
        <StatTile
          icon="shieldWarning"
          tone={pklAlerts.length ? 'danger' : 'success'}
          label="Alert PKL"
          value={pklAlerts.length}
          hint={pklAlerts.length ? 'Butuh tindak lanjut' : 'Aman'}
        />
      </div>

      <div className="mb-4">
        <FilterPills<PklFilter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'ALL', label: 'Semua' },
            { value: 'sedang', label: 'Sedang PKL' },
            { value: 'selesai', label: 'Selesai PKL' },
          ]}
        />
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon="briefcase"
          title="Belum ada murid PKL"
          description="Tidak ada murid dengan status PKL pada filter ini."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {students.map((o) => (
            <PklCard key={o.student.id} overview={o} />
          ))}
        </div>
      )}
    </>
  )
}

function PklCard({ overview }: { overview: StudentOverview }) {
  const { state } = useApp()
  const [open, setOpen] = useState(false)
  const { student } = overview

  const pklJournals = state.journals
    .filter((j) => j.studentId === student.id && j.pkl)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  const alerts = allRiskAlerts(state, [student]).filter((a) =>
    a.flag.category.startsWith('pkl-'),
  )

  return (
    <>
      <div className="rounded-[24px] bg-surface-2/70 p-1.5 ring-1 ring-border transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5">
        <div className="flex h-full flex-col rounded-[18px] bg-surface p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-start gap-3">
            <Avatar name={student.name} initials={student.initials} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-fg">{student.name}</p>
              <p className="truncate text-[12px] text-fg-subtle">
                {MAJORS[student.major].name} · Kelas {student.grade}
              </p>
            </div>
            <Chip tone={student.pklStatus === 'sedang' ? 'warning' : 'success'}>
              {student.pklStatus === 'sedang' ? 'Sedang' : 'Selesai'}
            </Chip>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-[14px] border border-border bg-surface-2/50 px-3 py-2">
            <Icon name="buildings" size={16} weight="duotone" className="text-fg-muted" />
            <span className="truncate text-[12.5px] font-semibold text-fg">
              {student.pklPlacement ?? 'Penempatan belum diisi'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-[12px] text-fg-subtle">
            <span className="flex items-center gap-1">
              <Icon name="journal" size={14} weight="duotone" />
              {pklJournals.length} catatan PKL
            </span>
            <span className="flex items-center gap-1">
              <Icon name="fire" size={14} weight="duotone" />
              {overview.streak} hari
            </span>
            {alerts.length > 0 && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-danger-tint px-2 py-0.5 font-bold text-danger">
                <Icon name="shieldWarning" size={11} weight="fill" />
                {alerts.length}
              </span>
            )}
          </div>

          <div className="mt-3 flex-1">
            {pklJournals[0] ? (
              <div className="rounded-[14px] border border-border bg-surface-2/40 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon
                    name={MOOD_ICON[pklJournals[0].mood]}
                    size={14}
                    weight="fill"
                    style={{ color: MOOD_MAP[pklJournals[0].mood].color }}
                  />
                  <span className="text-[11px] text-fg-subtle">
                    {relativeLabel(pklJournals[0].date)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[12.5px] font-semibold text-fg">
                  {pklJournals[0].title}
                </p>
              </div>
            ) : (
              <p className="text-[12.5px] text-fg-subtle">Belum ada catatan PKL.</p>
            )}
          </div>

          <Button
            className="mt-3"
            block
            size="sm"
            variant="secondary"
            icon="eye"
            onClick={() => setOpen(true)}
          >
            Lihat detail
          </Button>
        </div>
      </div>

      <PklDetailSheet overview={overview} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function PklDetailSheet({
  overview,
  open,
  onClose,
}: {
  overview: StudentOverview
  open: boolean
  onClose: () => void
}) {
  const { state } = useApp()
  const { student } = overview
  const pklJournals = state.journals
    .filter((j) => j.studentId === student.id && j.pkl)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  const alerts = allRiskAlerts(state, [student]).filter((a) =>
    a.flag.category.startsWith('pkl-'),
  )

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={student.name}
      description={student.pklPlacement ?? 'Penempatan belum diisi'}
      footer={
        <Button block variant="secondary" icon="close" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Mini label="Catatan" value={pklJournals.length} />
          <Mini label="Runtutan" value={overview.streak} />
          <Mini label="Karakter" value={overview.pppAverage} />
          <Mini label="Siap kerja" value={overview.wrAverage} />
        </div>

        {alerts.length > 0 && (
          <div className="rounded-[16px] border border-danger/25 bg-danger-tint/50 p-3.5">
            <p className="flex items-center gap-2 text-[13px] font-bold text-danger">
              <Icon name="shieldWarning" size={16} weight="fill" />
              {alerts.length} sinyal risiko terkait PKL
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {alerts.map((a) => (
                <li key={a.id} className="text-[12.5px] text-fg-muted">
                  {a.flag.label} · {relativeLabel(a.at)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-[13px] font-bold text-fg">Catatan PKL</h3>
          {pklJournals.length === 0 ? (
            <p className="text-[13px] text-fg-muted">Belum ada catatan PKL.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {pklJournals.map((j) => (
                <li
                  key={j.id}
                  className="rounded-[14px] border border-border bg-surface-2/50 p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      name={MOOD_ICON[j.mood]}
                      size={16}
                      weight="fill"
                      style={{ color: MOOD_MAP[j.mood].color }}
                    />
                    <p className="text-[13px] font-bold text-fg">{j.title}</p>
                    <span className="ml-auto text-[11px] text-fg-subtle">
                      {relativeLabel(j.date)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg-muted text-pretty">
                    {j.body}
                  </p>
                  {j.evidence && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-fg-subtle">
                      <Icon name="link" size={12} weight="bold" />
                      {j.evidence}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Sheet>
  )
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface-2/50 px-3 py-2.5 text-center">
      <p className="text-xl font-extrabold text-fg">{value}</p>
      <p className="text-[11px] text-fg-subtle">{label}</p>
    </div>
  )
}
