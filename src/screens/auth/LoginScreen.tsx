import { useState } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { Chip } from '../../components/ui/Chip'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import type { IconName } from '../../components/ui/icons'
import { useApp } from '../../store/AppContext'
import { SEED_TEACHERS, DEFAULT_TEACHER_ID } from '../../data/teachers'
import { TEACHER_ROLE_META } from '../../config/teacherRoles'

type Role = 'student' | 'teacher'

const STUDENT_POINTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'journal', title: 'Jurnal tumbuh', text: 'Refleksi harian yang dipetakan ke karakter & kesiapan kerja.' },
  { icon: 'consult', title: 'Teman konsultasi', text: 'AI yang menemani, bukan menghakimi.' },
  { icon: 'resume', title: 'Resume digital', text: 'Rekap mingguan untuk guru dan pembimbing PKL.' },
]

const TEACHER_POINTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'clipboard', title: 'Review resume', text: 'Antrean resume mingguan murid binaan dalam satu tempat.' },
  { icon: 'shieldWarning', title: 'Alert risiko', text: 'Eskalasi otomatis untuk ditindaklanjuti cepat.' },
  { icon: 'briefcase', title: 'Monitoring PKL', text: 'Pantau murid PKL dan catatan pembimbing industri.' },
]

export function LoginScreen() {
  const { loginAsStudent, loginAsTeacher } = useApp()
  const [role, setRole] = useState<Role>('student')
  const [teacherId, setTeacherId] = useState(DEFAULT_TEACHER_ID)

  const points = role === 'student' ? STUDENT_POINTS : TEACHER_POINTS

  return (
    <div className="ambient-bg relative flex min-h-dvh flex-col bg-bg lg:flex-row">
      {/* Editorial brand panel */}
      <section className="relative flex flex-col justify-between overflow-hidden px-6 py-10 lg:w-[46%] lg:px-14 lg:py-16">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-strong ring-1 ring-accent/15">
            <Icon name="sparkle" size={24} weight="fill" />
          </span>
          <div>
            <p className="text-[15px] font-extrabold text-fg">Ruang Tumbuh</p>
            <p className="text-[11px] font-medium text-fg-subtle">StudGrowth Hub</p>
          </div>
        </div>

        <div className="my-10 max-w-[30ch] lg:my-0">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-fg lg:text-[52px]">
            Tumbuh terarah, siap berkarya.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-muted text-pretty">
            Ruang refleksi, konsultasi, dan pendampingan untuk murid SMK — dari
            praktik di lab sampai PKL di dunia industri.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {points.map((p) => (
              <li key={p.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-accent-strong shadow-[var(--shadow-sm)] ring-1 ring-border">
                  <Icon name={p.icon} size={18} weight="duotone" />
                </span>
                <div>
                  <p className="text-sm font-bold text-fg">{p.title}</p>
                  <p className="text-[13px] text-fg-muted text-pretty">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden text-[11.5px] text-fg-subtle lg:block">
          Prototipe demo · data tersimpan lokal di perangkatmu.
        </p>
      </section>

      {/* Login card */}
      <section className="flex flex-1 items-center justify-center px-4 pb-12 lg:px-10">
        <div className="w-full max-w-[460px] rounded-[30px] bg-surface-2/70 p-2 ring-1 ring-border animate-rise">
          <div className="rounded-[24px] bg-surface p-6 shadow-[var(--shadow-md)] sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-strong">
              Selamat datang
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-fg">
              Masuk ke Ruang Tumbuh
            </h2>
            <p className="mt-1 text-sm text-fg-muted text-pretty">
              Pilih peran untuk melanjutkan ke ruang yang sesuai.
            </p>

            <div className="mt-5">
              <SegmentedControl<Role>
                label="Pilih peran"
                value={role}
                onChange={setRole}
                options={[
                  { value: 'student', label: 'Murid', icon: 'grad' },
                  { value: 'teacher', label: 'Guru', icon: 'users3' },
                ]}
              />
            </div>

            {role === 'student' ? (
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-[16px] border border-border bg-surface-2/50 p-3.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
                    <Icon name="grad" size={20} weight="fill" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-fg">Masuk sebagai murid</p>
                    <p className="text-[12px] text-fg-subtle">
                      Lanjut ke beranda atau lengkapi profil dulu.
                    </p>
                  </div>
                </div>
                <Button block size="lg" iconRight="arrowRight" onClick={loginAsStudent}>
                  Mulai sebagai murid
                </Button>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
                  Pilih akun guru
                </p>
                <div className="flex flex-col gap-2">
                  {SEED_TEACHERS.map((t) => {
                    const meta = TEACHER_ROLE_META[t.role]
                    const selected = t.id === teacherId
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTeacherId(t.id)}
                        aria-pressed={selected}
                        className={cn(
                          'flex items-center gap-3 rounded-[16px] border p-3 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                          selected
                            ? 'border-accent/40 bg-accent-tint/60 ring-1 ring-accent/30'
                            : 'border-border bg-surface hover:bg-surface-2/60',
                        )}
                      >
                        <Avatar name={t.name} initials={t.initials} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-bold text-fg">{t.name}</p>
                          <p className="truncate text-[11.5px] text-fg-subtle">{t.title}</p>
                        </div>
                        <Chip tone={selected ? 'accent' : 'neutral'} icon={meta.icon}>
                          {meta.label}
                        </Chip>
                      </button>
                    )
                  })}
                </div>
                <Button
                  block
                  size="lg"
                  iconRight="arrowRight"
                  onClick={() => loginAsTeacher(teacherId)}
                >
                  Masuk sebagai guru
                </Button>
              </div>
            )}

            <p className="mt-5 flex items-center gap-1.5 text-[11px] text-fg-subtle">
              <Icon name="lock" size={13} weight="bold" />
              Demo tanpa kata sandi. Data tetap di perangkatmu.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
