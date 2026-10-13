import { cn } from '../../lib/cn'
import { Avatar } from '../ui/Avatar'
import { Chip } from '../ui/Chip'
import { Button } from '../ui/Button'
import { relativeLabel } from '../../lib/format'
import { RISK_CATEGORY_LABEL } from '../../config/teacherRoles'
import type { RiskAlert } from '../../lib/teacher'

interface RiskAlertCardProps {
  alert: RiskAlert
  resolved: boolean
  onToggleResolved: () => void
  onOpen: () => void
}

export function RiskAlertCard({
  alert,
  resolved,
  onToggleResolved,
  onOpen,
}: RiskAlertCardProps) {
  const high = alert.flag.severity === 'tinggi'

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[18px] border bg-surface shadow-[var(--shadow-sm)] transition-colors duration-300',
        high ? 'border-danger/30' : 'border-border',
        resolved && 'opacity-60',
      )}
    >
      <span
        className={cn(
          'absolute inset-y-0 left-0 w-1.5',
          high ? 'bg-danger' : 'bg-warning',
        )}
      />
      <div className="flex flex-col gap-3 pl-5 pr-4 py-4">
        <div className="flex items-start gap-3">
          <Avatar name={alert.student.name} initials={alert.student.initials} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-fg">{alert.student.name}</p>
              <Chip tone={high ? 'danger' : 'warning'} icon="shieldWarning">
                {high ? 'Prioritas tinggi' : 'Perlu dipantau'}
              </Chip>
            </div>
            <p className="mt-0.5 text-[11.5px] text-fg-subtle">
              {RISK_CATEGORY_LABEL[alert.flag.category] ?? alert.flag.label} ·{' '}
              {relativeLabel(alert.at)} · {alert.sessionTitle}
            </p>
          </div>
          {resolved ? (
            <Chip tone="success" icon="checkCircle">
              Ditindaklanjuti
            </Chip>
          ) : null}
        </div>

        <blockquote className="rounded-[14px] border border-border bg-surface-2/50 px-3.5 py-3 text-[13px] leading-relaxed text-fg-muted text-pretty">
          “{alert.excerpt}”
        </blockquote>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
            Eskalasi
          </span>
          {alert.targets.map((t) => (
            <Chip key={t} tone="info" icon="users3">
              {t}
            </Chip>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="ghost" icon="eye" onClick={onOpen}>
              Lihat transkrip
            </Button>
            <Button
              size="sm"
              variant={resolved ? 'secondary' : 'primary'}
              icon={resolved ? 'rotate' : 'checkSquare'}
              onClick={onToggleResolved}
            >
              {resolved ? 'Buka lagi' : 'Tindak lanjuti'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
