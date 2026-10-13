import { useMemo, useState } from 'react'
import type { MoodLevel, ResumeWeek } from '../../../types'
import { MAJORS } from '../../../config/majors'
import { MOOD_MAP, formatShort, startOfWeek } from '../../../lib/format'
import { resumeHighlights } from '../../../lib/scoring'
import { cn } from '../../../lib/cn'
import { useApp } from '../../../store/AppContext'
import { uid } from '../../../store/appState'
import type { AppState } from '../../../store/appState'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Chip } from '../../../components/ui/Chip'
import { Icon } from '../../../components/ui/Icon'
import { MOOD_ICON } from '../../../components/ui/icons'
import { Sheet } from '../../../components/ui/Sheet'
import { TextArea, TextField } from '../../../components/ui/Field'
import { MoodPicker } from '../../../components/journal/MoodPicker'
import { WeekTimeline } from '../../../components/resume/WeekTimeline'
import { WeekDetailBody } from '../../../components/resume/WeekDetailBody'

const WEEKS = 6

function buildWeeks(studentId: string, state: AppState): ResumeWeek[] {
  const mine = state.journals.filter((j) => j.studentId === studentId)
  const weeks: ResumeWeek[] = []

  for (let i = 0; i < WEEKS; i++) {
    const start = startOfWeek()
    start.setDate(start.getDate() - i * 7)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    const entries = mine
      .filter((j) => {
        const t = +new Date(j.date)
        return t >= +start && t <= +end
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))

    const moodCount = new Map<MoodLevel, number>()
    for (const e of entries) moodCount.set(e.mood, (moodCount.get(e.mood) ?? 0) + 1)
    const moodSummary = [...moodCount.entries()]
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)

    const targetsTouched = state.targets.filter(
      (t) =>
        t.studentId === studentId &&
        t.due &&
        +new Date(t.due) >= +start &&
        +new Date(t.due) <= +end,
    )

    const chatCount = state.chats.filter(
      (c) =>
        c.studentId === studentId &&
        c.messages.some((m) => {
          const t = +new Date(m.at)
          return t >= +start && t <= +end
        }),
    ).length

    weeks.push({
      id: start.toISOString(),
      label:
        i === 0
          ? 'Minggu ini'
          : `${formatShort(start.toISOString())} – ${formatShort(end.toISOString())}`,
      rangeStart: start.toISOString(),
      rangeEnd: end.toISOString(),
      entries,
      moodSummary,
      targetsTouched,
      chatCount,
      highlights: entries.slice(0, 3).map((e) => e.title),
      pklNotes: entries
        .filter((e) => e.pkl)
        .map((e) => ({
          activity: e.title,
          learned: e.evidence ?? e.body.slice(0, 150),
        })),
      status: i === 0 ? 'menunggu-review' : 'direview',
    })
  }
  return weeks
}

export function ResumeScreen() {
  const app = useApp()
  const { state, currentStudent, badges, streak, journalCount } = app
  const major = MAJORS[currentStudent.major]

  const weeks = useMemo(
    () => buildWeeks(currentStudent.id, state),
    [state, currentStudent.id],
  )
  const [openWeek, setOpenWeek] = useState<string | null>(weeks[0]?.id ?? null)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

  const highlights = resumeHighlights(state.journals, currentStudent.id)
  const current = weeks[0]

  const summaryText = [
    `Resume Digital — ${currentStudent.name}`,
    `${major.fullName} · Kelas ${currentStudent.grade}`,
    currentStudent.pklPlacement ? `PKL: ${currentStudent.pklPlacement}` : '',
    '',
    `Jurnal: ${journalCount} entri · Runtutan: ${streak} hari`,
    `Lencana: ${badges.length} terbuka`,
    '',
    'Sorotan terbaru:',
    ...highlights.map((h) => `- ${h}`),
  ]
    .filter(Boolean)
    .join('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <TopBar
        title="Resume Digital"
        subtitle="Rekap mingguan untuk guru & pembimbing PKL"
        right={
          <Button size="sm" variant="secondary" icon="download" onClick={() => setPdfOpen(true)}>
            Ekspor
          </Button>
        }
      />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-8 lg:pb-14 lg:pt-6">
        <Card className="relative overflow-hidden lg:col-span-12 lg:col-start-1 lg:row-start-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold text-fg">
                {currentStudent.name}
              </p>
              <p className="text-[13px] text-fg-muted">
                {major.name} · Kelas {currentStudent.grade}
              </p>
              {currentStudent.pklPlacement && (
                <p className="mt-0.5 text-[12px] text-fg-subtle">
                  {currentStudent.pklPlacement}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Chip tone="accent" icon="journal">
                {journalCount} jurnal
              </Chip>
              <Chip tone="warning" icon="medal">
                {badges.length} lencana
              </Chip>
            </div>
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
              Sorotan
            </p>
            {highlights.length === 0 ? (
              <p className="mt-1 text-sm text-fg-muted">
                Belum ada sorotan. Tulis jurnal untuk mulai mengisi resume.
              </p>
            ) : (
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-fg">
                    <Icon
                      name="checkCircle"
                      size={16}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-success"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <section className="lg:col-span-12 lg:col-start-1 lg:row-start-2">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-fg">Rekap mingguan</h2>
            <span className="text-xs text-fg-subtle">{WEEKS} minggu terakhir</span>
          </div>

          <div className="hidden lg:block">
            <WeekTimeline weeks={weeks} />
          </div>

          <div className="flex flex-col gap-2.5 lg:hidden">
            {weeks.map((week) => (
              <WeekCard
                key={week.id}
                week={week}
                open={openWeek === week.id}
                onToggle={() =>
                  setOpenWeek(openWeek === week.id ? null : week.id)
                }
              />
            ))}
          </div>
        </section>

        <section className="lg:col-span-7 lg:col-start-1 lg:row-start-3">
          <div className="mb-2.5 flex items-center gap-2">
            <h2 className="flex-1 text-[15px] font-bold text-fg">
              Catatan PKL
            </h2>
            {currentStudent.pklStatus !== 'belum' && (
              <Button size="sm" variant="secondary" icon="plus" onClick={() => setNoteOpen(true)}>
                Tambah
              </Button>
            )}
          </div>
          {current.pklNotes && current.pklNotes.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {current.pklNotes.map((n, i) => (
                <Card key={i} variant="sunken">
                  <p className="text-sm font-bold text-fg">{n.activity}</p>
                  <p className="mt-1 text-[13px] text-fg-muted text-pretty">
                    {n.learned}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="sunken" className="text-center">
              <p className="text-sm text-fg-muted">
                Belum ada catatan PKL minggu ini. Tandai jurnalmu sebagai
                catatan PKL saat menulis.
              </p>
            </Card>
          )}
        </section>

        <Card variant="outline" className="flex items-start gap-2.5 lg:col-span-5 lg:col-start-6 lg:row-start-3">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-info" />
          <p className="text-[12.5px] text-fg-muted text-pretty">
            Resume ini dirangkum otomatis dari jurnal dan targetmu. Ekspor PDF
            masih berupa simulasi (mock) pada prototipe ini.
          </p>
        </Card>
      </main>

      <Sheet
        open={pdfOpen}
        onClose={() => {
          setPdfOpen(false)
          setCopied(false)
        }}
        title="Ekspor resume"
        description="Pada prototipe ini, ekspor PDF disimulasikan. Kamu bisa menyalin ringkasannya."
      >
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-[var(--radius-input)] border border-border bg-surface-2 p-3.5 font-mono text-[12px] leading-relaxed text-fg-muted">
          {summaryText}
        </pre>
        <div className="mt-4 flex gap-2">
          <Button block variant="secondary" icon="download" onClick={() => setPdfOpen(false)}>
            Tutup
          </Button>
          <Button block icon={copied ? 'check' : 'resume'} onClick={copy}>
            {copied ? 'Tersalin!' : 'Salin ringkasan'}
          </Button>
        </div>
      </Sheet>

      <PklNoteSheet open={noteOpen} onClose={() => setNoteOpen(false)} />
    </>
  )
}

function WeekCard({
  week,
  open,
  onToggle,
}: {
  week: ResumeWeek
  open: boolean
  onToggle: () => void
}) {
  const topMood = week.moodSummary[0]
  return (
    <Card padded={false} className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-fg">{week.label}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {week.entries.length} jurnal · {week.chatCount} obrolan ·{' '}
            {week.targetsTouched.length} target
          </p>
        </div>
        {topMood && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              color: MOOD_MAP[topMood.mood].color,
              backgroundColor: MOOD_MAP[topMood.mood].tint,
            }}
            title={MOOD_MAP[topMood.mood].label}
          >
            <Icon name={MOOD_ICON[topMood.mood]} size={18} weight="fill" />
          </span>
        )}
        <Chip tone={week.status === 'direview' ? 'success' : 'neutral'}>
          {week.status === 'direview' ? 'Direview' : 'Menunggu review'}
        </Chip>
        <Icon
          name="caretRight"
          size={16}
          weight="bold"
          className={cn(
            'shrink-0 text-fg-subtle transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-surface-2/50 px-4 py-3.5">
          <WeekDetailBody week={week} />
        </div>
      )}
    </Card>
  )
}

function PklNoteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentStudent, addJournal } = useApp()
  const [activity, setActivity] = useState('')
  const [learned, setLearned] = useState('')
  const [obstacle, setObstacle] = useState('')
  const [mood, setMood] = useState<MoodLevel>('baik')

  const valid = activity.trim().length >= 3 && learned.trim().length >= 3

  const save = () => {
    if (!valid) return
    addJournal({
      id: uid('j'),
      studentId: currentStudent.id,
      date: new Date().toISOString(),
      title: `Catatan PKL: ${activity.trim()}`,
      body: `Yang dipelajari: ${learned.trim()}${
        obstacle.trim() ? `\nKendala: ${obstacle.trim()}` : ''
      }`,
      mood,
      dimensions: ['disiplin', 'tanggung-jawab', 'adaptasi'],
      pkl: true,
    })
    setActivity('')
    setLearned('')
    setObstacle('')
    setMood('baik')
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Catatan PKL baru"
      description="Rekam kegiatan, pelajaran, dan kendala hari ini."
      footer={
        <Button block onClick={save} disabled={!valid}>
          Simpan catatan PKL
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <MoodPicker value={mood} onChange={setMood} />
        <TextField
          label="Aktivitas"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Contoh: Membantu rekap arsip berkas"
        />
        <TextArea
          label="Yang dipelajari"
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
          placeholder="Hal baru atau keterampilan yang kamu latih"
          className="min-h-[90px]"
        />
        <TextArea
          label="Kendala (opsional)"
          value={obstacle}
          onChange={(e) => setObstacle(e.target.value)}
          placeholder="Apa yang masih sulit? Siapa yang membantumu?"
          className="min-h-[80px]"
        />
      </div>
    </Sheet>
  )
}