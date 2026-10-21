import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Icon } from '../../../components/ui/Icon'
import type { IconName } from '../../../components/ui/icons'
import { Card } from '../../../components/ui/Card'
import { Chip } from '../../../components/ui/Chip'
import { Avatar } from '../../../components/ui/Avatar'
import { Button } from '../../../components/ui/Button'
import { PageHeader } from '../../../components/teacher/PageHeader'
import { StatTile } from '../../../components/teacher/StatTile'
import { useApp } from '../../../store/AppContext'
import {
  allRiskAlerts,
  overviewsFor,
  rosterForTeacher,
  teacherStats,
} from '../../../lib/teacher'
import { MAJORS, MAJOR_LIST } from '../../../config/majors'
import { TEACHER_ROLE_META } from '../../../config/teacherRoles'
import { formatDate, greeting, relativeLabel } from '../../../lib/format'
import { MAJOR_ICON } from '../../../components/ui/icons'

export function TeacherDashboard() {
  const { state, currentTeacher } = useApp()
  const students = rosterForTeacher(state, currentTeacher)
  const stats = teacherStats(state, students)
  const overviews = overviewsFor(state, students)
  const alerts = allRiskAlerts(state, students)
  const role = TEACHER_ROLE_META[currentTeacher.role]

  const pending = overviews
    .filter((o) => o.pendingReview)
    .sort((a, b) => b.thisWeekEntries - a.thisWeekEntries)
    .slice(0, 4)

  const recentJournals = state.journals
    .filter((j) => students.some((s) => s.id === j.studentId))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5)

  const byMajor = MAJOR_LIST.map((m) => ({
    ...m,
    count: students.filter((s) => s.major === m.id).length,
  }))
  const maxMajor = Math.max(1, ...byMajor.map((m) => m.count))

  return (
    <>
      <PageHeader
        eyebrow={role.tagline}
        title={`${greeting()}, ${currentTeacher.name}`}
        description={`${role.description} · ${formatDate(new Date().toISOString(), {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}`}
        actions={
          <Chip tone="accent" icon={role.icon}>
            {role.label}
          </Chip>
        }
      />

      <div className="mb-5 hidden items-center gap-2 lg:flex">
        <span className="mr-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
          Aksi cepat
        </span>
        <Link to="/guru/review">
          <Button size="sm" icon="clipboard">
            Tinjau antrean ({stats.pendingReview})
          </Button>
        </Link>
        <Link to="/guru/alert">
          <Button size="sm" variant="secondary" icon="shieldWarning">
            Lihat alert ({stats.activeAlerts})
          </Button>
        </Link>
        <Link to="/guru/murid">
          <Button size="sm" variant="ghost" icon="users3">
            Kelola murid
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
        <Link to="/guru/murid" className="col-span-1 lg:col-span-3">
          <StatTile
            icon="users3"
            tone="accent"
            label="Murid binaan"
            value={stats.totalStudents}
            hint="Dalam lingkupmu"
          />
        </Link>
        <Link to="/guru/review" className="col-span-1 lg:col-span-3">
          <StatTile
            icon="clipboard"
            tone="info"
            label="Menunggu review"
            value={stats.pendingReview}
            hint="Resume minggu ini"
          />
        </Link>
        <Link to="/guru/alert" className="col-span-1 lg:col-span-3">
          <StatTile
            icon="shieldWarning"
            tone={stats.activeAlerts ? 'danger' : 'success'}
            label="Alert risiko"
            value={stats.activeAlerts}
            hint={stats.highAlerts ? `${stats.highAlerts} prioritas tinggi` : 'Semua aman'}
          />
        </Link>
        <Link to="/guru/pkl" className="col-span-1 lg:col-span-3">
          <StatTile
            icon="briefcase"
            tone="warning"
            label="PKL berjalan"
            value={stats.pklOngoing}
            hint="Sedang di industri"
          />
        </Link>

        {/* Review queue */}
        <Card
          padded={false}
          className="col-span-2 overflow-hidden lg:col-span-8 lg:row-start-2"
          data-tour="teacher-antrean"
        >
          <PanelHead
            icon="clipboard"
            title="Antrean review resume"
            subtitle="Minggu ini"
            action={
              <Link to="/guru/review">
                <Button size="sm" variant="ghost" iconRight="arrowRight">
                  Semua
                </Button>
              </Link>
            }
          />
          {pending.length === 0 ? (
            <EmptyHint text="Belum ada resume yang perlu direview minggu ini." />
          ) : (
            <ul>
              {pending.map((o) => (
                <li key={o.student.id}>
                  <Link
                    to="/guru/review"
                    className="flex items-center gap-3 border-t border-border px-4 py-3 transition-colors duration-200 hover:bg-surface-2/60"
                  >
                    <Avatar
                      name={o.student.name}
                      initials={o.student.initials}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-fg">
                        {o.student.name}
                      </p>
                      <p className="truncate text-[12px] text-fg-subtle">
                        {MAJORS[o.student.major].name} · {o.thisWeekEntries} jurnal minggu ini
                      </p>
                    </div>
                    <div className="hidden items-center gap-3 sm:flex">
                      <MiniStat label="Karakter" value={o.pppAverage} />
                      <MiniStat label="Siap kerja" value={o.wrAverage} />
                    </div>
                    <Chip tone="accent">Tinjau</Chip>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Alerts */}
        <Card
          padded={false}
          className="col-span-2 overflow-hidden lg:col-span-4 lg:row-start-2"
          data-tour="teacher-alert-kartu"
        >
          <PanelHead
            icon="shieldWarning"
            title="Alert risiko"
            subtitle="Terbaru"
            action={
              <Link to="/guru/alert">
                <Button size="sm" variant="ghost" iconRight="arrowRight">
                  Semua
                </Button>
              </Link>
            }
          />
          {alerts.length === 0 ? (
            <EmptyHint text="Tidak ada alert risiko. Kerja bagus!" />
          ) : (
            <ul className="flex flex-col">
              {alerts.slice(0, 3).map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 border-t border-border px-4 py-3"
                >
                  <span
                    className={
                      a.flag.severity === 'tinggi'
                        ? 'mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-danger'
                        : 'mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-warning'
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-fg">
                      {a.student.name}
                    </p>
                    <p className="text-[12px] text-fg-muted">{a.flag.label}</p>
                    <p className="mt-0.5 text-[11px] text-fg-subtle">
                      {relativeLabel(a.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Major distribution */}
        <Card className="col-span-2 lg:col-span-5 lg:row-start-3">
          <h2 className="text-[15px] font-bold text-fg">Sebaran murid per jurusan</h2>
          <div className="mt-4 flex flex-col gap-4">
            {byMajor.map((m) => (
              <div key={m.id}>
                <div className="mb-1.5 flex items-center gap-2">
                  <Icon
                    name={MAJOR_ICON[m.id]}
                    size={16}
                    weight="duotone"
                    className="text-fg-muted"
                  />
                  <span className="text-[13px] font-semibold text-fg">
                    {m.name}
                  </span>
                  <span className="ml-auto text-[13px] font-bold text-fg-muted">
                    {m.count}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{ width: `${(m.count / maxMajor) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
            <ScorePill label="Rata-rata karakter" value={stats.pppAverage} tone="accent" />
            <ScorePill label="Rata-rata siap kerja" value={stats.wrAverage} tone="success" />
          </div>
        </Card>

        {/* Recent activity */}
        <Card
          padded={false}
          className="col-span-2 lg:col-span-7 lg:row-start-3"
          data-tour="teacher-aktivitas"
        >
          <PanelHead icon="journal" title="Aktivitas terbaru" subtitle="Jurnal murid" />
          {recentJournals.length === 0 ? (
            <EmptyHint text="Belum ada aktivitas jurnal." />
          ) : (
            <ul>
              {recentJournals.map((j) => {
                const student = students.find((s) => s.id === j.studentId)
                return (
                  <li
                    key={j.id}
                    className="flex items-start gap-3 border-t border-border px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
                      <Icon name="journal" size={16} weight="duotone" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-fg">
                        {j.title}
                      </p>
                      <p className="truncate text-[11.5px] text-fg-subtle">
                        {student?.name ?? 'Murid'} · {relativeLabel(j.date)}
                      </p>
                    </div>
                    {j.pkl && <Chip tone="warning">PKL</Chip>}
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

function PanelHead({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: IconName
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-fg-muted">
        <Icon name={icon} size={18} weight="duotone" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[15px] font-bold text-fg">{title}</h2>
        {subtitle && <p className="text-[11.5px] text-fg-subtle">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="border-t border-border px-4 py-6 text-center text-[13px] text-fg-muted">
      {text}
    </p>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="w-14 text-right">
      <p className="text-sm font-extrabold text-fg">{value}</p>
      <p className="text-[10.5px] text-fg-subtle">{label}</p>
    </div>
  )
}

function ScorePill({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'accent' | 'success'
}) {
  return (
    <div className="flex-1 rounded-[14px] border border-border bg-surface-2/50 px-3.5 py-2.5">
      <p
        className={
          tone === 'accent'
            ? 'text-xl font-extrabold text-accent-strong'
            : 'text-xl font-extrabold text-success'
        }
      >
        {value}
      </p>
      <p className="text-[11px] text-fg-subtle">{label}</p>
    </div>
  )
}
