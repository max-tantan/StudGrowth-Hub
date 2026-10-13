import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDimension } from '../../../config/dimensions'
import { formatDay, MOOD_MAP, relativeLabel } from '../../../lib/format'
import { useApp } from '../../../store/AppContext'
import { TopBar } from '../../../components/layout/TopBar'
import { Button, IconButton } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Chip } from '../../../components/ui/Chip'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Icon } from '../../../components/ui/Icon'
import { MOOD_ICON, DIMENSION_ICON } from '../../../components/ui/icons'
import { Sheet } from '../../../components/ui/Sheet'

export function JournalDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, deleteJournal } = useApp()
  const [confirm, setConfirm] = useState(false)

  const entry = state.journals.find((j) => j.id === id)

  if (!entry) {
    return (
      <>
        <TopBar title="Jurnal" showBack backTo="/jurnal" />
        <main className="flex flex-1 items-center px-4">
          <EmptyState
            icon="search"
            title="Jurnal tidak ditemukan"
            description="Catatan ini mungkin sudah dihapus."
            action={
              <Button onClick={() => navigate('/jurnal')}>Kembali ke jurnal</Button>
            }
          />
        </main>
      </>
    )
  }

  const mood = MOOD_MAP[entry.mood]

  return (
    <>
      <TopBar
        title="Jurnal"
        showBack
        backTo="/jurnal"
        right={
          <IconButton
            name="trash"
            label="Hapus jurnal"
            tone="ghost"
            onClick={() => setConfirm(true)}
          />
        }
      />

      <main className="flex flex-1 flex-col gap-4 px-4 pb-10 pt-4 lg:mx-auto lg:w-full lg:max-w-[720px] lg:px-8 lg:pb-14 lg:pt-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ color: mood.color, backgroundColor: mood.tint }}
          >
            <Icon name={MOOD_ICON[entry.mood]} size={24} weight="fill" />
          </span>
          <div>
            <p className="text-sm font-semibold text-fg">{mood.label}</p>
            <p className="text-xs text-fg-subtle">
              {formatDay(entry.date)} · {relativeLabel(entry.date)}
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-fg text-balance">
          {entry.title}
        </h1>

        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-fg-muted text-pretty">
          {entry.body}
        </p>

        {entry.evidence && (
          <Card variant="sunken" className="flex items-center gap-2.5">
            <Icon name="link" size={18} className="shrink-0 text-info" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
                Bukti
              </p>
              <p className="truncate text-sm text-fg">{entry.evidence}</p>
            </div>
          </Card>
        )}

        {entry.prompt && (
          <Card variant="accent">
            <p className="text-[11px] font-bold uppercase tracking-wide text-accent-strong">
              Prompt refleksi
            </p>
            <p className="mt-1 text-sm text-fg text-pretty">{entry.prompt}</p>
          </Card>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold text-fg-subtle">
            Dimensi yang dilatih
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entry.pkl && <Chip tone="info" icon="briefcase">Catatan PKL</Chip>}
            {entry.dimensions.map((dimId) => {
              const dim = getDimension(dimId)
              if (!dim) return null
              return (
                <span
                  key={dimId}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    color: dim.color,
                    backgroundColor: `color-mix(in oklab, ${dim.color} 15%, var(--surface))`,
                  }}
                >
                  <Icon
                    name={DIMENSION_ICON[dim.id] ?? 'sparkle'}
                    size={13}
                    weight="bold"
                  />
                  {dim.label}
                </span>
              )
            })}
          </div>
        </div>
      </main>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Hapus jurnal ini?"
        description="Tindakan ini tidak bisa dibatalkan."
        footer={
          <div className="flex gap-2">
            <Button
              block
              variant="secondary"
              onClick={() => setConfirm(false)}
            >
              Batal
            </Button>
            <Button
              block
              variant="danger"
              onClick={() => {
                deleteJournal(entry.id)
                navigate('/jurnal', { replace: true })
              }}
            >
              Hapus
            </Button>
          </div>
        }
      >
        <p className="text-sm text-fg-muted">
          "{entry.title}" akan dihapus dari jurnalmu.
        </p>
      </Sheet>
    </>
  )
}
