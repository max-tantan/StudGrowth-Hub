import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { Avatar } from '../ui/Avatar'
import { Chip } from '../ui/Chip'
import { MAJORS } from '../../config/majors'
import { PKL_STATUS_META } from '../../lib/teacher'
import type { StudentOverview } from '../../lib/teacher'

export const STUDENT_GRID_COLS =
  'lg:grid-cols-[minmax(0,1fr)_76px_76px_62px_104px_112px]'

interface StudentRowProps {
  overview: StudentOverview
  onClick?: () => void
  className?: string
}

export function StudentRow({ overview, onClick, className }: StudentRowProps) {
  const {
    student,
    pppAverage,
    wrAverage,
    pendingReview,
    riskCount,
    journalCount,
  } = overview
  const pkl = PKL_STATUS_META[student.pklStatus]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors duration-200 last:border-b-0 hover:bg-surface-2/60 lg:gap-4',
        STUDENT_GRID_COLS,
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={student.name} initials={student.initials} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-fg">{student.name}</p>
            {riskCount > 0 && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-danger-tint px-2 py-0.5 text-[10.5px] font-bold text-danger">
                <Icon name="shieldWarning" size={11} weight="fill" />
                {riskCount}
              </span>
            )}
          </div>
          <p className="truncate text-[12px] text-fg-subtle">
            {MAJORS[student.major].name} · Kelas {student.grade}
            {student.pklPlacement ? ` · ${student.pklPlacement}` : ''}
          </p>
        </div>
      </div>

      <div className="hidden lg:contents">
        <Metric label="Karakter" value={pppAverage} />
        <Metric label="Siap kerja" value={wrAverage} />
        <Metric label="Jurnal" value={journalCount} />
      </div>

      <div className="hidden lg:block">
        <Chip tone={pkl.tone}>{pkl.label}</Chip>
      </div>

      <div className="hidden lg:flex items-center">
        {pendingReview ? (
          <Chip tone="accent">Perlu review</Chip>
        ) : (
          <span className="text-[11px] font-medium text-fg-subtle">Terpantau</span>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 lg:hidden">
        <Chip tone={pkl.tone}>{pkl.label}</Chip>
        {pendingReview && <Chip tone="accent">Perlu review</Chip>}
      </div>
    </button>
  )
}

export function StudentTableHead({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'hidden items-center gap-4 border-b border-border bg-surface-2/40 px-4 py-2.5 lg:grid',
        STUDENT_GRID_COLS,
        className,
      )}
    >
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
        Murid
      </p>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
        Karakter
      </p>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
        Siap kerja
      </p>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
        Jurnal
      </p>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
        PKL
      </p>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-subtle">
        Status
      </p>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-fg">{value}</p>
      <p className="text-[10.5px] font-medium text-fg-subtle">{label}</p>
    </div>
  )
}
