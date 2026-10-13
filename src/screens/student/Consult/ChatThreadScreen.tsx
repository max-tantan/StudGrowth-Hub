import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ChatMode } from '../../../types'
import type { AiTurn } from '../../../lib/ai'
import { MODE_META } from '../../../lib/ai'
import { cn } from '../../../lib/cn'
import { useApp } from '../../../store/AppContext'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Icon } from '../../../components/ui/Icon'
import { MODE_ICON } from '../../../components/ui/icons'
import { Composer } from '../../../components/chat/Composer'
import { MessageBubble } from '../../../components/chat/MessageBubble'

const QUICK_PROMPTS: Record<ChatMode, string[]> = {
  REFLEKSI: ['Hari ini terasa biasa saja', 'Ada satu hal yang bikin bangga', 'Ada yang mengganggu pikiranku'],
  BELAJAR: ['Aku bingung di satu materi', 'Praktik hari ini seru', 'Proyek kelompokku sedang tersangkut'],
  SOSIAL: ['Ada masalah dengan teman', 'Aku sedang capek secara emosi', 'Aku gugup saat presentasi'],
  KARIER: ['Kerja atau kuliah ya?', 'Aku belum punya portofolio', 'Orang tuaku punya harapan lain'],
  PKL: ['Besok aku mulai PKL', 'Ada kendala di tempat PKL', 'Aku belajar banyak hal baru'],
}

export function ChatThreadScreen() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { state, addUserMessage, addAiMessage } = useApp()
  const [typing, setTyping] = useState(false)
  const timer = useRef<number | null>(null)
  const pending = useRef<{ sessionId: string; turn: AiTurn } | null>(null)
  const addAiRef = useRef(addAiMessage)
  const endRef = useRef<HTMLDivElement>(null)

  const session = state.chats.find((c) => c.id === sessionId)
  const messages = session?.messages ?? []

  useEffect(() => {
    addAiRef.current = addAiMessage
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, typing])

  useEffect(
    () => () => {
      if (timer.current) {
        window.clearTimeout(timer.current)
        if (pending.current) {
          addAiRef.current(
            pending.current.sessionId,
            pending.current.turn,
            new Date().toISOString(),
          )
        }
      }
    },
    [],
  )

  if (!session) {
    return (
      <>
        <TopBar title="Konsultasi" showBack backTo="/konsultasi" />
        <main className="flex flex-1 items-center px-4">
          <EmptyState
            icon="consult"
            title="Percakapan tidak ditemukan"
            description="Sesi ini mungkin sudah tidak tersedia."
            action={
              <Button onClick={() => navigate('/konsultasi')}>
                Kembali ke konsultasi
              </Button>
            }
          />
        </main>
      </>
    )
  }

  const meta = MODE_META[session.mode]

  const send = (text: string) => {
    if (typing) return
    const turn = addUserMessage(session.id, text)
    setTyping(true)
    pending.current = { sessionId: session.id, turn }
    timer.current = window.setTimeout(() => {
      addAiMessage(session.id, turn, new Date().toISOString())
      pending.current = null
      timer.current = null
      setTyping(false)
    }, 700 + Math.random() * 600)
  }

  return (
    <>
      <TopBar
        title={meta.label}
        subtitle={session.title}
        showBack
        backTo="/konsultasi"
        right={
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-tint text-accent-strong">
            <Icon name={MODE_ICON[session.mode]} size={18} weight="fill" />
          </span>
        }
      />

      <div className="flex min-w-0 flex-1 flex-col lg:mx-auto lg:w-full lg:max-w-[820px]">

      <main className="flex flex-1 flex-col gap-3.5 px-4 pb-4 pt-4 lg:px-8 lg:pb-6">
        {session.escalated && (
          <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-warning/30 bg-warning-tint px-3.5 py-3">
            <Icon
              name="shieldWarning"
              size={18}
              weight="fill"
              className="mt-0.5 shrink-0 text-warning"
            />
            <p className="text-[13px] text-fg-muted text-pretty">
              Percakapan ini ditandai dan diteruskan ke pendamping (Guru BK /
              Pembimbing PKL) karena ada hal yang butuh bantuan nyata.
            </p>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col gap-3.5">
            <div className="max-w-[87%]">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-fg-subtle">
                <Icon name="sparkle" size={13} weight="fill" />
                Asisten Ruang Tumbuh
              </div>
              <div className="rounded-2xl rounded-tl-md border border-border bg-surface px-3.5 py-2.5 text-[15px] leading-relaxed text-fg">
                {meta.intro}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS[session.mode].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'h-2 w-2 animate-soft-pulse rounded-full bg-fg-subtle',
                  )}
                  style={{ animationDelay: `${i * 220}ms` }}
                />
              ))}
              <span className="ml-1 text-xs text-fg-subtle">
                Asisten sedang menulis…
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </main>

      <Composer onSend={send} disabled={typing} />
      </div>
    </>
  )
}