import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { Avatar } from '../ui/Avatar'
import { Chip } from '../ui/Chip'
import { MAJORS } from '../../config/majors'
import { PKL_STATUS_META } from '../../lib/teacher'
import type { StudentOverview } from '../../lib/teacher'

interface StudentRowProps {
  overview: StudentOverview
  onClick?: () => void
  className?: string
}

export function StudentRow({ overview, onClick, className }: StudentRowProps) {
  const { student, pppAverage, wrAverage, pendingReview, riskCount } = overview
  const pkl = PKL_STATUS_META[student.pklStatus]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors duration-200 last:border-b-0 hover:bg-surface-2/60',
        className,
      )}
    >
      <Avatar name={student.name} initials={student.initials} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-fg">{student.name}</p>
          {riskCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-danger-tint px-2 py-0.5 text-[10.5px] font-bold text-danger">
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

      <div className="hidden items-center gap-4 sm:flex">
        <Metric label="Karakter" value={pppAverage} />
        <Metric label="Siap kerja" value={wrAverage} />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <Chip tone={pkl.tone}>{pkl.label}</Chip>
        {pendingReview && <Chip tone="accent">Perlu review</Chip>}
      </div>
    </button>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="w-14 text-right">
      <p className="text-sm font-extrabold text-fg">{value}</p>
      <p className="text-[10.5px] font-medium text-fg-subtle">{label}</p>
    </div>
  )
}
