import { useNavigate } from 'react-router-dom'
import type { ChatMode } from '../../types'
import { MODE_META } from '../../lib/ai'
import { relativeLabel } from '../../lib/format'
import { cn } from '../../lib/cn'
import { useApp } from '../../store/AppContext'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { MODE_ICON } from '../../components/ui/icons'

const MODES: ChatMode[] = ['REFLEKSI', 'BELAJAR', 'SOSIAL', 'KARIER', 'PKL']

export function ConsultScreen() {
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
      <TopBar
        title="Konsultasi"
        subtitle="Asisten pendamping · simulasi (mock)"
      />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4">
        <Card variant="accent" className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent-strong">
            <Icon name="sparkle" size={20} weight="fill" />
          </span>
          <div>
            <p className="text-sm font-bold text-fg">
              Ngobrol santai, dibimbing dengan pertanyaan
            </p>
            <p className="mt-0.5 text-[13px] text-fg-muted text-pretty">
              Asisten menyesuaikan contoh dengan jurusan {currentStudent.major === 'PPLG' ? 'PPLG' : currentStudent.major.toLowerCase()}. Ia bertanya balik untuk membantumu berpikir, bukan menghakimi.
            </p>
          </div>
        </Card>

        <section>
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">
            Mulai topik baru
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map((mode) => {
              const meta = MODE_META[mode]
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => openMode(mode)}
                  className={cn(
                    'flex flex-col gap-2 rounded-[var(--radius-card)] border border-border bg-surface p-3.5 text-left transition-all duration-200',
                    'hover:border-accent hover:shadow-[var(--shadow-md)] active:scale-[0.98]',
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-tint text-accent-strong">
                    <Icon name={MODE_ICON[mode]} size={20} weight="fill" />
                  </span>
                  <span className="text-sm font-bold text-fg">{meta.label}</span>
                  <span className="text-[12px] leading-snug text-fg-muted text-pretty">
                    {meta.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">
            Percakapan terakhir
          </h2>
          {sessions.length === 0 ? (
            <EmptyState
              icon="consult"
              title="Belum ada percakapan"
              description="Pilih salah satu topik di atas untuk mulai berbincang."
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {sessions.map((s) => {
                const last = s.messages.at(-1)
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => navigate(`/konsultasi/${s.id}`)}
                    className="text-left"
                  >
                    <Card className="flex items-start gap-3 transition-all hover:border-border-strong active:scale-[0.995]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent-strong">
                        <Icon name={MODE_ICON[s.mode]} size={20} weight="duotone" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="min-w-0 flex-1 truncate text-sm font-bold text-fg">
                            {s.title}
                          </p>
                          <span className="shrink-0 font-mono text-[10.5px] text-fg-subtle">
                            {relativeLabel(s.lastAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[13px] text-fg-muted text-pretty">
                          {last?.text ?? MODE_META[s.mode].desc}
                        </p>
                        {s.escalated && (
                          <span className="mt-1.5 inline-block">
                            <Chip tone="danger" icon="shieldWarning">
                              Diteruskan ke guru
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
      </main>
    </>
  )
}
