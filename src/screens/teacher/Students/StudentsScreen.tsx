import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Grade, Major, PklStatus } from '../../../types'
import { Card } from '../../../components/ui/Card'
import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icon'
import { Button } from '../../../components/ui/Button'
import { Avatar } from '../../../components/ui/Avatar'
import { Sheet } from '../../../components/ui/Sheet'
import { SearchInput } from '../../../components/ui/SearchInput'
import { EmptyState } from '../../../components/ui/EmptyState'
import { MOOD_ICON } from '../../../components/ui/icons'
import { PageHeader } from '../../../components/teacher/PageHeader'
import { StatTile } from '../../../components/teacher/StatTile'
import { FilterPills } from '../../../components/teacher/FilterPills'
import { StudentRow, StudentTableHead } from '../../../components/teacher/StudentRow'
import { useApp } from '../../../store/AppContext'
import {
  allRiskAlerts,
  overviewsFor,
  rosterForTeacher,
  studentOverview,
} from '../../../lib/teacher'
import type { StudentOverview } from '../../../lib/teacher'
import { MAJORS } from '../../../config/majors'
import { MOOD_MAP, formatDate, relativeLabel } from '../../../lib/format'

type MajorFilter = Major | 'ALL'
type GradeFilter = Grade | 'ALL'
type PklFilter = PklStatus | 'ALL'

export function StudentsScreen() {
  const { state, currentTeacher } = useApp()
  const roster = rosterForTeacher(state, currentTeacher)
  const overviews = useMemo(() => overviewsFor(state, roster), [state, roster])
  const alerts = allRiskAlerts(state, roster)

  const [params, setParams] = useSearchParams()
  const [major, setMajor] = useState<MajorFilter>('ALL')
  const [grade, setGrade] = useState<GradeFilter>('ALL')
  const [pkl, setPkl] = useState<PklFilter>('ALL')
  const [query, setQuery] = useState('')

  const openId = params.get('murid')

  const filtered = overviews
    .filter((o) => major === 'ALL' || o.student.major === major)
    .filter((o) => grade === 'ALL' || o.student.grade === grade)
    .filter((o) => pkl === 'ALL' || o.student.pklStatus === pkl)
    .filter((o) => o.student.name.toLowerCase().includes(query.toLowerCase()))

  const openStudent = roster.find((s) => s.id === openId)
  const open = openStudent ? studentOverview(state, openStudent) : null

  const selectStudent = (id: string | null) => {
    setParams(id ? { murid: id } : {}, { replace: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="Data murid"
        title="Manajemen murid"
        description="Cari, filter, dan lihat ringkasan perkembangan setiap murid dalam lingkupmu."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatTile icon="users3" tone="accent" label="Total murid" value={roster.length} />
        <StatTile
          icon="briefcase"
          tone="warning"
          label="Sedang PKL"
          value={roster.filter((s) => s.pklStatus === 'sedang').length}
        />
        <StatTile
          icon="shieldWarning"
          tone={alerts.length ? 'danger' : 'success'}
          label="Dengan alert"
          value={new Set(alerts.map((a) => a.studentId)).size}
        />
        <StatTile
          icon="clipboard"
          tone="info"
          label="Perlu review"
          value={overviews.filter((o) => o.pendingReview).length}
        />
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-xs">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari nama murid" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPills<MajorFilter>
            value={major}
            onChange={setMajor}
            options={[
              { value: 'ALL', label: 'Semua jurusan' },
              { value: 'PERHOTELAN', label: 'Perhotelan' },
              { value: 'AKUNTANSI', label: 'Akuntansi' },
              { value: 'PPLG', label: 'PPLG' },
            ]}
          />
          <FilterPills<GradeFilter>
            value={grade}
            onChange={setGrade}
            options={[
              { value: 'ALL', label: 'Semua kelas' },
              { value: 'X', label: 'Kelas X' },
              { value: 'XI', label: 'Kelas XI' },
              { value: 'XII', label: 'Kelas XII' },
            ]}
          />
          <FilterPills<PklFilter>
            value={pkl}
            onChange={setPkl}
            options={[
              { value: 'ALL', label: 'Semua PKL' },
              { value: 'sedang', label: 'Sedang' },
              { value: 'selesai', label: 'Selesai' },
              { value: 'belum', label: 'Belum' },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="users3"
          title="Murid tidak ditemukan"
          description="Coba ubah kata kunci atau filter."
        />
      ) : (
        <Card padded={false} className="overflow-hidden">
          <StudentTableHead />
          {filtered.map((o) => (
            <StudentRow
              key={o.student.id}
              overview={o}
              onClick={() => selectStudent(o.student.id)}
            />
          ))}
        </Card>
      )}

      <StudentDetailSheet overview={open} onClose={() => selectStudent(null)} />
    </>
  )
}

function StudentDetailSheet({
  overview,
  onClose,
}: {
  overview: StudentOverview | null
  onClose: () => void
}) {
  const { state } = useApp()
  if (!overview) return null
  const { student } = overview
  const journals = state.journals
    .filter((j) => j.studentId === student.id)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5)

  return (
    <Sheet
      open
      onClose={onClose}
      title={student.name}
      description={`${MAJORS[student.major].fullName} · Kelas ${student.grade}`}
      footer={
        <Button block variant="secondary" icon="close" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Avatar name={student.name} initials={student.initials} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <Chip tone="accent">{MAJORS[student.major].name}</Chip>
              <Chip
                tone={
                  student.pklStatus === 'sedang'
                    ? 'warning'
                    : student.pklStatus === 'selesai'
                      ? 'success'
                      : 'neutral'
                }
              >
                {student.pklStatus === 'sedang'
                  ? 'Sedang PKL'
                  : student.pklStatus === 'selesai'
                    ? 'Selesai PKL'
                    : 'Belum PKL'}
              </Chip>
            </div>
            {student.pklPlacement && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-fg-muted">
                <Icon name="buildings" size={14} weight="duotone" />
                {student.pklPlacement}
              </p>
            )}
            <p className="mt-0.5 text-[11px] text-fg-subtle">
              Bergabung {formatDate(student.joinedAt, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Mini label="Jurnal" value={overview.journalCount} />
          <Mini label="Runtutan" value={overview.streak} />
          <Mini label="Karakter" value={overview.pppAverage} />
          <Mini label="Siap kerja" value={overview.wrAverage} />
        </div>

        {overview.riskCount > 0 && (
          <div className="flex items-center gap-3 rounded-[16px] border border-danger/25 bg-danger-tint/50 p-3.5">
            <Icon name="shieldWarning" size={20} weight="fill" className="text-danger" />
            <p className="text-[13px] text-fg-muted">
              <span className="font-bold text-fg">{overview.riskCount} sinyal risiko</span>{' '}
              terdeteksi dari konsultasi. Lihat di menu Alert Risiko.
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-[13px] font-bold text-fg">Jurnal terbaru</h3>
          {journals.length === 0 ? (
            <p className="text-[13px] text-fg-muted">Belum ada jurnal.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {journals.map((j) => (
                <li
                  key={j.id}
                  className="flex items-center gap-2.5 rounded-[14px] border border-border bg-surface-2/50 px-3 py-2.5"
                >
                  <Icon
                    name={MOOD_ICON[j.mood]}
                    size={16}
                    weight="fill"
                    style={{ color: MOOD_MAP[j.mood].color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-fg">
                    {j.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-fg-subtle">
                    {relativeLabel(j.date)}
                  </span>
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
