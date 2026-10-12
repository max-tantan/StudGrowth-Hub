import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { MoodLevel } from '../../types'
import { MAJORS } from '../../config/majors'
import { cn } from '../../lib/cn'
import { useApp } from '../../store/AppContext'
import { uid } from '../../store/appState'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { TextArea, TextField } from '../../components/ui/Field'
import { Icon } from '../../components/ui/Icon'
import { MoodPicker } from '../../components/journal/MoodPicker'
import { DimensionTagPicker } from '../../components/journal/DimensionTagPicker'

export function JournalEditorScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentStudent, addJournal } = useApp()

  const initialPrompt =
    (location.state as { prompt?: string } | null)?.prompt ??
    MAJORS[currentStudent.major].reflectionPrompts[0]

  const [mood, setMood] = useState<MoodLevel>('baik')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [dimensions, setDimensions] = useState<string[]>([])
  const [evidence, setEvidence] = useState('')
  const [pkl, setPkl] = useState(currentStudent.pklStatus === 'sedang')
  const [touched, setTouched] = useState(false)

  const titleError =
    touched && title.trim().length < 3 ? 'Judul minimal 3 karakter.' : undefined
  const bodyError =
    touched && body.trim().length < 10
      ? 'Ceritakan sedikit lebih banyak, minimal 10 karakter.'
      : undefined
  const valid = title.trim().length >= 3 && body.trim().length >= 10

  const save = () => {
    setTouched(true)
    if (!valid) return
    addJournal({
      id: uid('j'),
      studentId: currentStudent.id,
      date: new Date().toISOString(),
      title: title.trim(),
      body: body.trim(),
      mood,
      dimensions,
      evidence: evidence.trim() || undefined,
      prompt: initialPrompt,
      pkl,
    })
    navigate('/jurnal', { replace: true })
  }

  return (
    <>
      <TopBar
        title="Jurnal baru"
        showBack
        backTo="/jurnal"
        right={
          <Button size="sm" onClick={save} disabled={!valid && touched}>
            Simpan
          </Button>
        }
      />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 lg:mx-auto lg:w-full lg:max-w-[720px] lg:px-8 lg:pb-14 lg:pt-6">
        <Card variant="accent" className="flex items-start gap-2.5">
          <Icon
            name="quote"
            size={18}
            weight="fill"
            className="mt-0.5 shrink-0 text-accent-strong"
          />
          <p className="text-[14px] font-medium text-fg text-pretty">
            {initialPrompt}
          </p>
        </Card>

        <div>
          <p className="mb-2 text-sm font-semibold text-fg">
            Bagaimana perasaanmu?
          </p>
          <MoodPicker value={mood} onChange={setMood} />
        </div>

        <TextField
          label="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Tamu marah, aku tetap tenang"
          error={titleError}
        />

        <TextArea
          label="Ceritakan"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Apa yang terjadi, apa yang kamu rasakan, dan apa yang kamu pelajari?"
          error={bodyError}
          helper="Tidak perlu sempurna. Jujur lebih berguna."
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-fg">
            Dimensi yang dilatih
          </p>
          <DimensionTagPicker value={dimensions} onChange={setDimensions} />
        </div>

        <TextField
          label="Bukti / tautan (opsional)"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="Contoh: foto tugas, tautan proyek, sertifikat"
          helper="Tautan bukti membuat resume lebih kuat."
        />

        {currentStudent.pklStatus !== 'belum' && (
          <button
            type="button"
            onClick={() => setPkl((v) => !v)}
            className={cn(
              'flex items-center gap-3 rounded-[var(--radius-card)] border p-3.5 text-left transition-colors',
              pkl ? 'border-accent bg-accent-tint' : 'border-border bg-surface',
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-md border',
                pkl
                  ? 'border-transparent bg-accent text-fg-on-accent'
                  : 'border-border-strong text-transparent',
              )}
            >
              <Icon name="check" size={14} weight="bold" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-fg">
                Tandai sebagai catatan PKL
              </span>
              <span className="block text-xs text-fg-muted">
                Masuk ke bagian Catatan PKL di resume mingguanmu.
              </span>
            </span>
          </button>
        )}
      </main>
    </>
  )
}
