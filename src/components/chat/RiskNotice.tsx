import type { ChatMessage } from '../../types'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { Chip } from '../ui/Chip'

export function RiskNotice({ message }: { message: ChatMessage }) {
  if (!message.risk) return null
  const targets = message.escalatedTo ?? ['Guru BK']
  const high = message.risk.severity === 'tinggi'
  return (
    <Card
      variant="outline"
      className="mt-2 border-danger/35 bg-danger-tint"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-danger">
          <Icon name="shieldWarning" size={18} weight="fill" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-danger">
              Perhatian: {message.risk.label}
            </p>
            <Chip tone={high ? 'danger' : 'warning'}>
              {high ? 'Prioritas tinggi' : 'Perlu ditindaklanjuti'}
            </Chip>
          </div>
          <p className="mt-1 text-[13px] text-fg-muted text-pretty">
            Kamu tidak sendirian. Ceritamu ini diteruskan ke orang yang berwenang
            supaya kamu benar-benar terbantu:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {targets.map((t) => (
              <Chip key={t} tone="neutral" icon="users">
                {t}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-fg-subtle">
            Kamu tetap bisa bercerita di sini dengan aman. Kalau kamu merasa
            terancam, segera cari orang dewasa yang kamu percaya.
          </p>
        </div>
      </div>
    </Card>
  )
}
