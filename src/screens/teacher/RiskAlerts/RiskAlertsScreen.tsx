import { useMemo, useState } from 'react'
import type { Major } from '../../../types'
import { Chip } from '../../../components/ui/Chip'
import { Button } from '../../../components/ui/Button'
import { Sheet } from '../../../components/ui/Sheet'
import { Avatar } from '../../../components/ui/Avatar'
import { Icon } from '../../../components/ui/Icon'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageHeader } from '../../../components/teacher/PageHeader'
import { StatTile } from '../../../components/teacher/StatTile'
import { FilterPills } from '../../../components/teacher/FilterPills'
import { RiskAlertCard } from '../../../components/teacher/RiskAlertCard'
import { useApp } from '../../../store/AppContext'
import { allRiskAlerts, rosterForTeacher } from '../../../lib/teacher'
import type { RiskAlert } from '../../../lib/teacher'
import { RISK_CATEGORY_LABEL } from '../../../config/teacherRoles'
import { relativeLabel } from '../../../lib/format'

type Severity = 'ALL' | 'tinggi' | 'sedang'
type MajorFilter = Major | 'ALL'

export function RiskAlertsScreen() {
  const { state, currentTeacher } = useApp()
  const students = rosterForTeacher(state, currentTeacher)
  const alerts = useMemo(
    () => allRiskAlerts(state, students),
    [state, students],
  )

  const [severity, setSeverity] = useState<Severity>('ALL')
  const [major, setMajor] = useState<MajorFilter>('ALL')
  const [resolved, setResolved] = useState<Record<string, boolean>>({})
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = alerts
    .filter((a) => severity === 'ALL' || a.flag.severity === severity)
    .filter((a) => major === 'ALL' || a.student.major === major)

  const openAlert = alerts.find((a) => a.id === openId) ?? null

  return (
    <>
      <PageHeader
        eyebrow="Guru BK · eskalasi"
        title="Alert risiko"
        description="Sinyal risiko dari konsultasi murid. Tindak lanjuti dengan pendampingan yang tepat dan tidak menghakimi."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatTile
          icon="warning"
          tone="neutral"
          label="Total alert"
          value={alerts.length}
        />
        <StatTile
          icon="shieldWarning"
          tone="danger"
          label="Prioritas tinggi"
          value={alerts.filter((a) => a.flag.severity === 'tinggi').length}
        />
        <StatTile
          icon="eye"
          tone="warning"
          label="Perlu dipantau"
          value={alerts.filter((a) => a.flag.severity === 'sedang').length}
        />
        <StatTile
          icon="checkCircle"
          tone="success"
          label="Ditindaklanjuti"
          value={Object.values(resolved).filter(Boolean).length}
        />
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <FilterPills<Severity>
          value={severity}
          onChange={setSeverity}
          options={[
            { value: 'ALL', label: 'Semua tingkat' },
            { value: 'tinggi', label: 'Prioritas tinggi' },
            { value: 'sedang', label: 'Perlu dipantau' },
          ]}
        />
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
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="shieldCheck"
          title="Tidak ada alert"
          description="Belum ada sinyal risiko dari konsultasi murid pada filter ini."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => (
            <RiskAlertCard
              key={a.id}
              alert={a}
              resolved={Boolean(resolved[a.id])}
              onToggleResolved={() =>
                setResolved((prev) => ({ ...prev, [a.id]: !prev[a.id] }))
              }
              onOpen={() => setOpenId(a.id)}
            />
          ))}
        </div>
      )}

      <TranscriptSheet
        alert={openAlert}
        onClose={() => setOpenId(null)}
      />
    </>
  )
}

function TranscriptSheet({
  alert,
  onClose,
}: {
  alert: RiskAlert | null
  onClose: () => void
}) {
  const { state } = useApp()
  const session = alert
    ? state.chats.find((c) => c.id === alert.sessionId)
    : undefined

  return (
    <Sheet
      open={Boolean(alert)}
      onClose={onClose}
      title={alert ? `Transkrip · ${alert.student.name}` : ''}
      description={alert ? session?.title : ''}
      footer={
        <Button block icon="checkSquare" onClick={onClose}>
          Mengerti, tutup
        </Button>
      }
    >
      {alert && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-[16px] border border-danger/25 bg-danger-tint/50 p-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-tint text-danger">
              <Icon name="shieldWarning" size={20} weight="fill" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-fg">
                {RISK_CATEGORY_LABEL[alert.flag.category] ?? alert.flag.label}
              </p>
              <p className="text-[12px] text-fg-muted">
                {alert.flag.severity === 'tinggi' ? 'Prioritas tinggi' : 'Perlu dipantau'} ·{' '}
                {relativeLabel(alert.at)}
              </p>
            </div>
            <Avatar name={alert.student.name} initials={alert.student.initials} size="sm" />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
              Eskalasi ke
            </span>
            {alert.targets.map((t) => (
              <Chip key={t} tone="info" icon="users3">
                {t}
              </Chip>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {session?.messages.map((m) => {
              const risky = m.id === alert.id.split(':')[1]
              return (
                <div
                  key={m.id}
                  className={
                    m.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-[16px] rounded-br-md bg-accent px-3.5 py-2.5 text-sm text-fg-on-accent'
                      : 'max-w-[85%] rounded-[16px] rounded-bl-md bg-surface-2 px-3.5 py-2.5 text-sm text-fg'
                  }
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <Icon
                      name={m.role === 'user' ? 'users3' : 'robot'}
                      size={13}
                      weight="fill"
                      className={m.role === 'user' ? 'opacity-80' : 'text-accent-strong'}
                    />
                    <span className="text-[10.5px] font-bold uppercase tracking-wide opacity-80">
                      {m.role === 'user' ? alert.student.name : 'Ruang Tumbuh'}
                    </span>
                  </div>
                  <p className="leading-relaxed text-pretty">{m.text}</p>
                  {risky && (
                    <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-danger-tint/70 px-2 py-1 text-[11px] font-bold text-danger">
                      <Icon name="flag" size={12} weight="fill" />
                      Terdeteksi: {m.risk?.label}
                    </p>
                  )}
                  {m.suggestion && (
                    <p className="mt-2 flex items-start gap-1.5 text-[12px] text-fg-muted">
                      <Icon name="bulb" size={13} weight="fill" className="mt-0.5 shrink-0" />
                      {m.suggestion.text}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Sheet>
  )
}
