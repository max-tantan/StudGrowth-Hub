import { useNavigate } from 'react-router-dom'
import type { ChatMode } from '../../../types'
import { MODE_META } from '../../../lib/ai'
import { relativeLabel } from '../../../lib/format'
import { cn } from '../../../lib/cn'
import { useApp } from '../../../store/AppContext'
import { Card } from '../../../components/ui/Card'
import { Chip } from '../../../components/ui/Chip'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Icon } from '../../../components/ui/Icon'
import { MODE_ICON } from '../../../components/ui/icons'

const MODES: ChatMode[] = ['REFLEKSI', 'BELAJAR', 'SOSIAL', 'KARIER', 'PKL']

export function ConsultList() {
  const navigate = useNavigate()
  const { state, currentStudent, startChat } = useApp()

  const sessions = state.chats
    .filter((c) => c.studentId === currentStudent.id)
    .sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt))

  const openMode = (mode: ChatMode) => {
    const session = startChat(mode)
    navigate(`/konsultasi/${session.id}`)
  }

  return (
    <>
      {/* Header & modes only on desktop panel */}
      <div className="border-b border-border px-4 py-4">
        <h1 className="text-lg font-bold text-fg">Konsultasi</h1>
        <p className="text-xs text-fg-muted">
          Asisten simulasi (mock)
        </p>
      </div>

      {/* Modes grid */}
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        {MODES.map((mode) => {
          const meta = MODE_META[mode]
          return (
            <button
              key={mode}
              type="button"
              onClick={() => openMode(mode)}
              className={cn(
                'flex flex-col gap-1 rounded-xl border border-border bg-surface p-2.5 text-left transition-all duration-200',
                'hover:border-accent hover:shadow-[var(--shadow-sm)] active:scale-[0.98]',
              )}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
                <Icon name={MODE_ICON[mode]} size={16} weight="fill" />
              </span>
              <span className="text-xs font-bold text-fg">{meta.label}</span>
              <span className="text-[10.5px] leading-snug text-fg-muted text-pretty line-clamp-2">
                {meta.desc}
              </span>
            </button>
          )
        })}
      </div>

      {/* Sessions list */}
      <section className="flex flex-col gap-1 px-4 pb-4">
        <h2 className="px-1 text-[13px] font-bold text-fg-subtle uppercase tracking-wide">
          Percakapan terakhir
        </h2>
        {sessions.length === 0 ? (
          <EmptyState
            icon="consult"
            title="Belum ada percakapan"
            description="Pilih salah satu topik di atas."
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            {sessions.map((s) => {
              const last = s.messages.at(-1)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => navigate(`/konsultasi/${s.id}`)}
                  className="text-left"
                >
                  <Card className="flex items-start gap-2.5 px-3 py-2.5 transition-all active:scale-[0.995]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent-strong">
                      <Icon name={MODE_ICON[s.mode]} size={16} weight="duotone" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="min-w-0 flex-1 truncate text-sm font-bold text-fg">
                          {s.title}
                        </p>
                        <span className="shrink-0 font-mono text-[10px] text-fg-subtle">
                          {relativeLabel(s.lastAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted text-pretty">
                        {last?.text ?? MODE_META[s.mode].desc}
                      </p>
                      {s.escalated && (
                        <span className="mt-1 inline-block">
                          <Chip tone="danger" icon="shieldWarning">
                            Diteruskan
                          </Chip>
                        </span>
                      )}
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
