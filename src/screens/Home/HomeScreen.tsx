import { Link } from 'react-router-dom'
import { MAJORS } from '../../config/majors'
import { formatDate, greeting } from '../../lib/format'
import { cn } from '../../lib/cn'
import { useApp } from '../../store/AppContext'
import { TopBar } from '../../components/layout/TopBar'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { MAJOR_ICON } from '../../components/ui/icons'
import { GrowthBloom } from '../../components/charts/GrowthBloom'
import { JournalCard } from '../../components/journal/JournalCard'
import { TargetSection } from '../../components/progress/TargetSection'

const PKL_LABEL: Record<string, string> = {
  belum: 'Belum PKL',
  sedang: 'Sedang PKL',
  selesai: 'Selesai PKL',
}

export function HomeScreen() {
  const {
    currentStudent,
    state,
    streak,
    journalCount,
    pppAverage,
    wrAverage,
    characterScores,
  } = useApp()

  const major = MAJORS[currentStudent.major]
  const firstName = currentStudent.name.split(' ')[0]
  const day = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000,
  )
  const prompt = major.reflectionPrompts[day % major.reflectionPrompts.length]
  const action = major.smallActions[day % major.smallActions.length]

  const recent = state.journals
    .filter((j) => j.studentId === currentStudent.id)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 2)

  const petals = characterScores.map((s) => ({
    color: s.dimension.color,
    score: s.score,
    label: s.dimension.short,
  }))

  return (
    <>
      <TopBar
        title={`${greeting()}, ${firstName}`}
        subtitle={formatDate(new Date().toISOString(), {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
        right={
          <Link to="/profil" aria-label="Profil">
            <Avatar name={currentStudent.name} initials={currentStudent.initials} size="md" />
          </Link>
        }
      />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-8 lg:pb-14 lg:pt-6">
        {/* Right column (mobile order: first items appear here) */}
        <div className="flex flex-col gap-5 lg:col-start-8 lg:col-span-5 lg:row-start-1">
          {/* Konteks jurusan */}
          <Card className="overflow-hidden p-0">
            <div className="flex items-start gap-3 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-accent-strong">
                <Icon name={MAJOR_ICON[currentStudent.major]} size={24} weight="fill" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-extrabold text-fg">
                    {major.name}
                  </p>
                  <Chip
                    tone={
                      currentStudent.pklStatus === 'sedang' ? 'info' : 'neutral'
                    }
                    icon="briefcase"
                  >
                    {PKL_LABEL[currentStudent.pklStatus]}
                  </Chip>
                </div>
                <p className="text-xs text-fg-muted">{major.fullName}</p>
                <p className="mt-0.5 text-[13px] text-fg-subtle text-pretty">
                  {major.tagline}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-border bg-surface-2/50 px-4 py-2.5">
              {major.values.slice(0, 4).map((v) => (
                <Chip key={v} tone="accent">
                  {v}
                </Chip>
              ))}
            </div>
          </Card>

          {/* Strip statistik */}
          <div className="grid grid-cols-4 divide-x divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            <Stat icon="fire" value={String(streak)} label="Runtutan" />
            <Stat icon="journal" value={String(journalCount)} label="Jurnal" />
            <Stat icon="sparkle" value={String(pppAverage)} label="Karakter" />
            <Stat icon="briefcase" value={String(wrAverage)} label="Siap kerja" />
          </div>

          {/* Jurnal terbaru */}
          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-fg">Jurnal terbaru</h2>
              <Link
                to="/jurnal"
                className="text-xs font-semibold text-accent-strong"
              >
                Lihat semua
              </Link>
            </div>
            {recent.length === 0 ? (
              <EmptyState
                icon="journal"
                title="Belum ada jurnal"
                description="Tulis momen pertamamu hari ini. Tidak perlu panjang, yang jujur lebih berharga."
                action={
                  <Link to="/jurnal/baru">
                    <Button size="sm" icon="plus">
                      Tulis jurnal pertama
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {recent.map((entry) => (
                  <JournalCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Left column (mobile order continues here, but on lg appears first column) */}
        <div className="flex flex-col gap-5 lg:col-start-1 lg:col-span-7 lg:row-start-1">
          {/* Prompt refleksi hari ini */}
          <Card variant="accent" className="relative">
            <div className="flex items-center gap-2 text-accent-strong">
              <Icon name="quote" size={16} weight="fill" />
              <span className="text-[11px] font-bold uppercase tracking-wide">
                Refleksi hari ini
              </span>
            </div>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-fg text-pretty">
              {prompt}
            </p>
            <div className="mt-3.5 flex gap-2">
              <Link to="/jurnal/baru" state={{ prompt }} className="flex-1">
                <Button block size="sm" icon="note">
                  Tulis jurnal
                </Button>
              </Link>
              <Link to="/konsultasi" className="flex-1">
                <Button block size="sm" variant="secondary" icon="consult">
                  Tanya asisten
                </Button>
              </Link>
            </div>
          </Card>

          {/* Bunga tumbuh */}
          <Card className="flex items-center gap-4">
            <Link to="/perkembangan" className="shrink-0" aria-label="Lihat perkembangan">
              <GrowthBloom petals={petals} size={104} />
            </Link>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-bold text-fg">Bunga Tumbuhmu</h2>
              <p className="mt-1 text-[13px] text-fg-muted text-pretty">
                Setiap kelopak mewakili satu dimensi karakter. Makin sering kamu
                berefleksi, makin mekar.
              </p>
              <Link
                to="/perkembangan"
                className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-strong"
              >
                Lihat perkembangan
                <Icon name="caretRight" size={13} weight="bold" />
              </Link>
            </div>
          </Card>

          {/* Aksi kecil */}
          <Card className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-tint text-success">
              <Icon name="lightning" size={18} weight="fill" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
                Aksi kecil hari ini
              </p>
              <p className="mt-0.5 text-sm font-medium text-fg text-pretty">
                {action}
              </p>
            </div>
          </Card>

          {/* Target */}
          <TargetSection
            studentId={currentStudent.id}
            targets={state.targets}
            limit={3}
          />
        </div>
      </main>
    </>
  )
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: 'fire' | 'journal' | 'sparkle' | 'briefcase'
  value: string
  label: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-1 px-1 py-3')}>
      <Icon name={icon} size={18} weight="duotone" className="text-accent-strong" />
      <span className="font-mono text-lg font-semibold leading-none text-fg">
        {value}
      </span>
      <span className="text-[10px] font-semibold text-fg-subtle">{label}</span>
    </div>
  )
}
