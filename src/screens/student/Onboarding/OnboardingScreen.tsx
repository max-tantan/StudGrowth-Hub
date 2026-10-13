import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Grade, Major, PklStatus } from '../../../types'
import { GRADE_LIST, MAJOR_LIST } from '../../../config/majors'
import { cn } from '../../../lib/cn'
import { useApp } from '../../../store/AppContext'
import { PhoneFrame } from '../../../components/layout/PhoneFrame'
import { Button, IconButton } from '../../../components/ui/Button'
import { TextField } from '../../../components/ui/Field'
import { Icon } from '../../../components/ui/Icon'
import { MAJOR_ICON } from '../../../components/ui/icons'
import type { IconName } from '../../../components/ui/icons'

const PKL_OPTIONS: { id: PklStatus; label: string; hint: string }[] = [
  { id: 'belum', label: 'Belum PKL', hint: 'Masih fokus belajar di sekolah.' },
  { id: 'sedang', label: 'Sedang PKL', hint: 'Sedang praktik di dunia usaha/industri.' },
  { id: 'selesai', label: 'Sudah selesai', hint: 'PKL sudah dilalui, siap menyusun portofolio.' },
]

const STEP_LABELS: Record<number, string> = {
  0: 'Selamat datang',
  1: 'Nama',
  2: 'Jurusan',
  3: 'Kelas',
  4: 'Status PKL',
  5: 'Privasi',
}

const STEP_HEAD: Record<number, { eyebrow: string; title: string; desc: string }> = {
  0: {
    eyebrow: 'Selamat datang',
    title: 'Tumbuh terarah, siap berkarya.',
    desc: 'Ruang refleksi, konsultasi, dan pendampingan untuk murid SMK — dari praktik di lab sampai PKL di dunia industri.',
  },
  1: {
    eyebrow: 'Langkah 1 · Perkenalan',
    title: 'Kamu siapa?',
    desc: 'Kami pakai nama ini untuk menyapa kamu. Perlakukan dirimu sebagai calon profesional muda.',
  },
  2: {
    eyebrow: 'Langkah 2 · Jurusan',
    title: 'Pilih jurusanmu',
    desc: 'Ini menyesuaikan prompt jurnal, saran aksi, dan lencana untukmu.',
  },
  3: {
    eyebrow: 'Langkah 3 · Kelas',
    title: 'Kelas berapa?',
    desc: 'Kami sesuaikan konten, terutama soal PKL dan persiapan lulus.',
  },
  4: {
    eyebrow: 'Langkah 4 · PKL',
    title: 'Status PKL kamu',
    desc: 'PKL biasanya di kelas XI–XII. Ini menentukan bagian Catatan PKL di resume.',
  },
  5: {
    eyebrow: 'Langkah terakhir · Privasi',
    title: 'Privasi & izin',
    desc: 'Kami jaga ceritamu. Ini cara kerjanya:',
  },
}

const STEP_ICON: Record<number, IconName> = {
  0: 'sparkle',
  1: 'users',
  2: 'compass',
  3: 'grad',
  4: 'briefcase',
  5: 'lock',
}

export function OnboardingScreen() {
  const navigate = useNavigate()
  const { completeOnboarding, enterDemo } = useApp()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [major, setMajor] = useState<Major | null>(null)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [pklStatus, setPklStatus] = useState<PklStatus>('belum')
  const [placement, setPlacement] = useState('')
  const [agreed, setAgreed] = useState(false)

  const needsPklStep = grade !== null && grade !== 'X'
  const flow: number[] = needsPklStep ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 5]
  const current = flow[step]
  const isLast = step === flow.length - 1

  const canNext = (): boolean => {
    switch (current) {
      case 0:
        return true
      case 1:
        return name.trim().length >= 2
      case 2:
        return major !== null
      case 3:
        return grade !== null
      case 4:
        return pklStatus === 'belum' || placement.trim().length >= 2
      case 5:
        return agreed
      default:
        return true
    }
  }

  const finish = () => {
    if (!major || !grade) return
    completeOnboarding({
      name: name.trim() || 'Murid Baru',
      major,
      grade,
      pklStatus,
      pklPlacement:
        pklStatus === 'belum' ? undefined : placement.trim() || undefined,
    })
    navigate('/beranda', { replace: true })
  }

  const next = () => {
    if (!canNext()) return
    if (isLast) finish()
    else setStep((s) => s + 1)
  }

  const back = () => setStep((s) => Math.max(0, s - 1))

  const goDemo = () => {
    enterDemo('anisa')
    navigate('/beranda', { replace: true })
  }

  const majorBody = (
    <div className="flex flex-col gap-2.5">
      {MAJOR_LIST.map((m) => {
        const active = major === m.id
        return (
          <button
            key={m.id}
            type="button"
            aria-pressed={active}
            onClick={() => setMajor(m.id)}
            className={cn(
              'flex items-center gap-3 rounded-[var(--radius-card)] border p-3.5 text-left transition-all duration-200 active:scale-[0.99]',
              active
                ? 'border-accent bg-accent-tint'
                : 'border-border bg-surface hover:border-border-strong',
            )}
          >
            <span
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                active
                  ? 'bg-surface text-accent-strong'
                  : 'bg-surface-2 text-fg-muted',
              )}
            >
              <Icon
                name={MAJOR_ICON[m.id]}
                size={22}
                weight={active ? 'fill' : 'regular'}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-fg">
                {m.name}
              </span>
              <span className="block text-xs text-fg-muted">{m.fullName}</span>
              <span className="mt-0.5 block text-xs text-fg-subtle text-pretty">
                {m.tagline}
              </span>
            </span>
            {active && (
              <Icon
                name="checkCircle"
                size={22}
                weight="fill"
                className="shrink-0 text-accent"
              />
            )}
          </button>
        )
      })}
    </div>
  )

  const gradeBody = (
    <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-3">
      {GRADE_LIST.map((g) => {
        const active = grade === g.id
        return (
          <button
            key={g.id}
            type="button"
            aria-pressed={active}
            onClick={() => {
              setGrade(g.id)
              if (g.id === 'X') setPklStatus('belum')
            }}
            className={cn(
              'flex items-center justify-between gap-3 rounded-[var(--radius-card)] border p-4 text-left transition-all duration-200 active:scale-[0.99]',
              active
                ? 'border-accent bg-accent-tint'
                : 'border-border bg-surface hover:border-border-strong',
            )}
          >
            <span>
              <span className="block text-[15px] font-bold text-fg">
                {g.label}
              </span>
              <span className="block text-xs text-fg-muted text-pretty">
                {g.hint}
              </span>
            </span>
            {active && (
              <Icon
                name="checkCircle"
                size={22}
                weight="fill"
                className="shrink-0 text-accent"
              />
            )}
          </button>
        )
      })}
    </div>
  )

  const pklBody = (
    <>
      <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-3">
        {PKL_OPTIONS.map((o) => {
          const active = pklStatus === o.id
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPklStatus(o.id)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-[var(--radius-card)] border p-4 text-left transition-all duration-200 active:scale-[0.99]',
                active
                  ? 'border-accent bg-accent-tint'
                  : 'border-border bg-surface hover:border-border-strong',
              )}
            >
              <span>
                <span className="block text-[15px] font-bold text-fg">
                  {o.label}
                </span>
                <span className="block text-xs text-fg-muted">{o.hint}</span>
              </span>
              {active && (
                <Icon
                  name="checkCircle"
                  size={22}
                  weight="fill"
                  className="shrink-0 text-accent"
                />
              )}
            </button>
          )
        })}
      </div>
      {pklStatus !== 'belum' && (
        <TextField
          label="Tempat PKL"
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
          placeholder="Contoh: Hotel Santika Premiere"
          helper="Nama perusahaan atau instansi tempatmu PKL."
          className="mt-3"
        />
      )}
    </>
  )

  const privacyBody = (
    <>
      <ul className="flex flex-col gap-2.5">
        <PrivacyItem
          icon="lock"
          title="Jurnal & chat bersifat pribadi"
          body="Isi jurnal dan chat tidak ditampilkan ke guru secara otomatis."
        />
        <PrivacyItem
          icon="eye"
          title="Resume direview sebelum dibagikan"
          body="Guru hanya me-review resume yang kamu izinkan, dan kamu bisa menandai bagian yang kurang akurat."
        />
        <PrivacyItem
          icon="shieldWarning"
          title="Keselamatan diutamakan"
          body="Jika ada hal yang berkaitan dengan keselamatanmu — terutama saat PKL (pelecehan, eksploitasi, kecelakaan kerja) — hal itu bisa diteruskan ke guru yang berwenang seperti Guru BK dan Pembimbing PKL."
        />
        <PrivacyItem
          icon="robot"
          title="Asisten AI masih simulasi"
          body="Balasan asisten pada prototipe ini masih mock, bukan model AI sungguhan, dan bukan pengganti bantuan profesional."
        />
      </ul>
      <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-[var(--radius-card)] border border-border bg-surface p-3.5">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent-strong)]"
        />
        <span className="text-sm text-fg text-pretty">
          Saya mengerti dan setuju dengan cara kerja di atas.
        </span>
      </label>
    </>
  )

  const bodyFor = (c: number): ReactNode => {
    switch (c) {
      case 1:
        return (
          <TextField
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Anisa Rahmawati"
            helper="Nama panggilan juga boleh."
            autoFocus
          />
        )
      case 2:
        return majorBody
      case 3:
        return gradeBody
      case 4:
        return pklBody
      case 5:
        return privacyBody
      default:
        return null
    }
  }

  const ctaLabel = current === 0 ? 'Mulai' : isLast ? 'Masuk ke Ruang Tumbuh' : 'Lanjut'

  const tracker = flow.map((f, i) => ({
    label: STEP_LABELS[f],
    done: i < step,
    active: i === step,
  }))
  const head = STEP_HEAD[current]

  return (
    <>
      {/* ---------------------------------- Mobile ---------------------------------- */}
      <div className="lg:hidden">
        <PhoneFrame>
          <div className="flex flex-1 flex-col">
            <header className="flex h-16 items-center gap-2 px-4 pt-[env(safe-area-inset-top)]">
              {step > 0 && current !== 5 ? (
                <IconButton
                  name="arrowLeft"
                  label="Kembali"
                  tone="ghost"
                  onClick={back}
                  className="-ml-2"
                />
              ) : (
                <span className="w-10" />
              )}
              <div className="flex flex-1 justify-center gap-1.5">
                {flow.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i === step
                        ? 'w-6 bg-accent'
                        : i < step
                          ? 'w-1.5 bg-accent/50'
                          : 'w-1.5 bg-border-strong',
                    )}
                  />
                ))}
              </div>
              <span className="w-10 text-right font-mono text-xs text-fg-subtle">
                {step + 1}/{flow.length}
              </span>
            </header>

            <main className="flex flex-1 flex-col px-5 pb-4">
              {current === 0 ? (
                <WelcomeStep />
              ) : (
                <StepShell current={current}>{bodyFor(current)}</StepShell>
              )}
            </main>

            <footer className="sticky bottom-0 border-t border-border bg-bg/90 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
              <Button block size="lg" onClick={next} disabled={!canNext()}>
                {ctaLabel}
              </Button>
              {current === 0 && (
                <Button
                  block
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                  onClick={goDemo}
                >
                  Lihat contoh data siswa
                </Button>
              )}
            </footer>
          </div>
        </PhoneFrame>
      </div>

      {/* --------------------------------- Desktop --------------------------------- */}
      <div className="ambient-bg hidden min-h-dvh w-full bg-bg lg:flex">
        <aside className="relative flex w-[44%] shrink-0 flex-col justify-between overflow-hidden border-r border-border px-12 py-12 xl:px-16 xl:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 bottom-12 h-64 w-64 rounded-full bg-info/10 blur-3xl"
          />
          <Icon
            name={STEP_ICON[current]}
            size={340}
            weight="duotone"
            className="pointer-events-none absolute -bottom-16 -right-12 text-accent/5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          />

          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-strong ring-1 ring-accent/15">
              <Icon name="sparkle" size={24} weight="fill" />
            </span>
            <div>
              <p className="text-[15px] font-extrabold text-fg">Ruang Tumbuh</p>
              <p className="text-[11px] font-medium text-fg-subtle">
                StudGrowth Hub
              </p>
            </div>
          </div>

          <div key={current} className="animate-rise relative max-w-[34ch]">
            <span className="inline-flex items-center rounded-full bg-surface/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-strong ring-1 ring-border">
              {head.eyebrow}
            </span>
            <h1 className="mt-5 text-[40px] font-extrabold leading-[1.05] tracking-tight text-fg xl:text-[52px]">
              {head.title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted text-pretty">
              {head.desc}
            </p>
          </div>

          <ol className="relative flex flex-col gap-1">
            {tracker.map((t, i) => (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-3 rounded-full px-3 py-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
                  t.active && 'bg-surface shadow-[var(--shadow-sm)]',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
                    t.done || t.active
                      ? 'bg-accent text-fg-on-accent'
                      : 'bg-surface-2 text-fg-subtle',
                  )}
                >
                  {t.done ? <Icon name="check" size={12} weight="bold" /> : i + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    t.active ? 'text-fg' : 'text-fg-subtle',
                  )}
                >
                  {t.label}
                </span>
              </li>
            ))}
          </ol>
        </aside>

        <section className="flex min-h-dvh flex-1 flex-col">
          <header className="flex items-center justify-between px-12 py-6 xl:px-20">
            {step > 0 ? (
              <IconButton
                name="arrowLeft"
                label="Kembali"
                tone="ghost"
                onClick={back}
                className="-ml-3"
              />
            ) : (
              <span className="w-10" />
            )}
            <span className="font-mono text-xs text-fg-subtle">
              {step + 1} / {flow.length}
            </span>
          </header>

          <div className="flex flex-1 items-center px-12 xl:px-20">
            <div key={current} className="animate-rise w-full max-w-[660px]">
              {current === 0 ? <DesktopWelcome /> : bodyFor(current)}
            </div>
          </div>

          <footer className="flex items-center gap-3 px-12 py-6 xl:px-20">
            <Button
              size="lg"
              onClick={next}
              disabled={!canNext()}
              iconRight={current === 0 || isLast ? undefined : 'arrowRight'}
            >
              {ctaLabel}
            </Button>
            {current === 0 && (
              <Button variant="ghost" size="lg" onClick={goDemo}>
                Lihat contoh data siswa
              </Button>
            )}
          </footer>
        </section>
      </div>
    </>
  )
}

function WelcomeStep() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-accent-tint" />
        <span className="absolute inset-4 rounded-full bg-accent/15" />
        <Icon
          name="sparkle"
          size={52}
          weight="fill"
          className="relative text-accent"
        />
      </div>
      <h1 className="text-3xl font-extrabold text-fg">Ruang Tumbuh</h1>
      <p className="mt-2 max-w-[30ch] text-[15px] text-fg-muted text-pretty">
        Tempatmu mencatat refleksi, menumbuhkan karakter, dan menyiapkan diri
        jadi profesional muda.
      </p>
      <div className="mt-6 grid w-full grid-cols-3 gap-2.5">
        <MiniFeature icon="journal" label="Jurnal & mood" />
        <MiniFeature icon="consult" label="Konsultasi" />
        <MiniFeature icon="briefcase" label="Siap PKL" />
      </div>
    </div>
  )
}

function DesktopWelcome() {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-fg">
        Mulai dari satu langkah kecil.
      </h2>
      <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-fg-muted text-pretty">
        Dalam beberapa menit kita siapkan ruangmu: tulis refleksi, ngobrol
        dengan asisten, dan pantau kesiapan kerjamu. Semua bisa berubah kapan
        saja.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-3">
        <DesktopFeature
          icon="journal"
          title="Jurnal & mood"
          body="Catat momen harian dan lihat polanya menumbuh."
        />
        <DesktopFeature
          icon="consult"
          title="Konsultasi"
          body="Teman bicara bergaya coaching untuk refleksi."
        />
        <DesktopFeature
          icon="briefcase"
          title="Siap PKL"
          body="Dari persiapan sampai refleksi masa praktik."
        />
      </div>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
        Perkiraan waktu pengisian · ± 1 menit
      </p>
    </div>
  )
}

function MiniFeature({
  icon,
  label,
}: {
  icon: 'journal' | 'consult' | 'briefcase'
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-border bg-surface p-3">
      <Icon name={icon} size={22} weight="duotone" className="text-accent-strong" />
      <span className="text-[11px] font-semibold text-fg-muted">{label}</span>
    </div>
  )
}

function DesktopFeature({
  icon,
  title,
  body,
}: {
  icon: 'journal' | 'consult' | 'briefcase'
  title: string
  body: string
}) {
  return (
    <div className="group rounded-[calc(var(--radius-card)+6px)] border border-border bg-surface-2 p-1.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
      <div className="h-full rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
          <Icon name={icon} size={20} weight="duotone" />
        </span>
        <p className="mt-3 text-sm font-bold text-fg">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-fg-muted text-pretty">
          {body}
        </p>
      </div>
    </div>
  )
}

function StepShell({
  current,
  children,
}: {
  current: number
  children: ReactNode
}) {
  const head = STEP_HEAD[current]
  return (
    <div className="animate-rise flex flex-1 flex-col pt-2">
      <h2 className="text-2xl font-extrabold text-fg">{head.title}</h2>
      <p className="mb-5 mt-1.5 text-sm text-fg-muted text-pretty">
        {head.desc}
      </p>
      {children}
    </div>
  )
}

function PrivacyItem({
  icon,
  title,
  body,
}: {
  icon: 'lock' | 'eye' | 'shieldWarning' | 'robot'
  title: string
  body: string
}) {
  return (
    <li className="flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-strong">
        <Icon name={icon} size={18} weight="fill" />
      </span>
      <span>
        <span className="block text-sm font-bold text-fg">{title}</span>
        <span className="mt-0.5 block text-[13px] text-fg-muted text-pretty">
          {body}
        </span>
      </span>
    </li>
  )
}
