import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ThemePreference } from '../../lib/theme'
import { getThemePreference, setThemePreference } from '../../lib/theme'
import { MAJORS, MAJOR_LIST } from '../../config/majors'
import { formatDate } from '../../lib/format'
import { useApp } from '../../store/AppContext'
import { TopBar } from '../../components/layout/TopBar'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { Icon } from '../../components/ui/Icon'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { Sheet } from '../../components/ui/Sheet'

export function ProfileScreen() {
  const navigate = useNavigate()
  const {
    state,
    currentStudent,
    setCurrentStudent,
    resetDemo,
    journalCount,
    streak,
    badges,
  } = useApp()
  const major = MAJORS[currentStudent.major]
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)
  const [switchOpen, setSwitchOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const chooseTheme = (pref: ThemePreference) => {
    setTheme(pref)
    setThemePreference(pref)
  }

  return (
    <>
      <TopBar title="Profil" showBack />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 lg:mx-auto lg:w-full lg:max-w-[760px] lg:px-8 lg:pb-14 lg:pt-6">
        <Card className="flex flex-col items-center gap-3 pb-5 text-center">
          <Avatar name={currentStudent.name} initials={currentStudent.initials} size="lg" />
          <div>
            <p className="text-lg font-extrabold text-fg">{currentStudent.name}</p>
            <p className="text-[13px] text-fg-muted">
              {major.fullName} · Kelas {currentStudent.grade}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            <Chip tone="accent" icon="sparkle">
              {currentStudent.major === 'PPLG' ? 'PPLG' : major.name}
            </Chip>
            <Chip tone="neutral" icon="calendar">
              Gabung {formatDate(currentStudent.joinedAt, { month: 'short', year: 'numeric' })}
            </Chip>
          </div>
          <div className="mt-1 grid w-full grid-cols-3 divide-x divide-border border-t border-border pt-3">
            <MiniStat value={String(journalCount)} label="Jurnal" />
            <MiniStat value={String(streak)} label="Runtutan" />
            <MiniStat value={String(badges.length)} label="Lencana" />
          </div>
          {currentStudent.id === 'me' && (
            <p className="text-[11.5px] text-fg-subtle">
              Akun ini kamu isi sendiri saat pendaftaran.
            </p>
          )}
        </Card>

        <section>
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">PKL</h2>
          <Link to="/pkl">
            <Card className="flex items-center gap-3 transition-all hover:border-border-strong active:scale-[0.995]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-strong">
                <Icon name="briefcase" size={20} weight="fill" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-fg">Halaman PKL</p>
                <p className="text-xs text-fg-muted">
                  {currentStudent.pklPlacement ?? 'Ceklis persiapan & catatan PKL'}
                </p>
              </div>
              <Icon name="caretRight" size={16} weight="bold" className="text-fg-subtle" />
            </Card>
          </Link>
        </section>

        <section>
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">Tampilan</h2>
          <SegmentedControl<ThemePreference>
            value={theme}
            onChange={chooseTheme}
            options={[
              { value: 'system', label: 'Sistem', icon: 'monitor' },
              { value: 'light', label: 'Terang', icon: 'sun' },
              { value: 'dark', label: 'Gelap', icon: 'moon' },
            ]}
          />
          <p className="mt-2 text-xs text-fg-subtle">
            Mode gelap mengikuti preferensi perangkatmu jika memilih "Sistem".
          </p>
        </section>

        <section>
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">Akun</h2>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setSwitchOpen(true)}
              className="text-left"
            >
              <Card className="flex items-center gap-3 transition-all hover:border-border-strong active:scale-[0.995]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-accent-strong">
                  <Icon name="users" size={20} weight="fill" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-fg">Ganti akun demo</p>
                  <p className="text-xs text-fg-muted">
                    Lihat aplikasi dari sisi murid lain
                  </p>
                </div>
                <Icon name="caretRight" size={16} weight="bold" className="text-fg-subtle" />
              </Card>
            </button>

            <Card variant="outline" className="flex items-start gap-2.5">
              <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-info" />
              <p className="text-[12.5px] text-fg-muted text-pretty">
                Semua data di prototipe ini tersimpan hanya di perambanmu
                (localStorage). Tidak ada data yang dikirim ke server.
              </p>
            </Card>

            <Button variant="danger" icon="rotate" onClick={() => setResetOpen(true)}>
              Atur ulang data demo
            </Button>
          </div>
        </section>

        <p className="text-center text-[11px] text-fg-subtle">
          Ruang Tumbuh · Prototipe v0.1 · Asisten konsultasi adalah simulasi
          (mock)
        </p>
      </main>

      <Sheet
        open={switchOpen}
        onClose={() => setSwitchOpen(false)}
        title="Ganti akun demo"
        description="Pilih murid untuk melihat pengalaman mereka."
      >
        <ul className="flex flex-col gap-2">
          {state.students.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setCurrentStudent(s.id)
                  setSwitchOpen(false)
                  navigate('/beranda')
                }}
                className={
                  'flex w-full items-center gap-3 rounded-[var(--radius-card)] border p-3 text-left transition-colors ' +
                  (s.id === currentStudent.id
                    ? 'border-accent bg-accent-tint'
                    : 'border-border bg-surface hover:bg-surface-2')
                }
              >
                <Avatar name={s.name} initials={s.initials} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-fg">{s.name}</p>
                  <p className="text-xs text-fg-muted">
                    {MAJORS[s.major].name} · Kelas {s.grade}
                  </p>
                </div>
                <Chip
                  tone={s.pklStatus === 'sedang' ? 'info' : 'neutral'}
                  icon="briefcase"
                >
                  {s.pklStatus === 'belum'
                    ? 'Belum PKL'
                    : s.pklStatus === 'sedang'
                      ? 'Sedang PKL'
                      : 'Selesai'}
                </Chip>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-fg-subtle">
          {MAJOR_LIST.length} jurusan · {state.students.length} murid contoh
        </p>
      </Sheet>

      <Sheet
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Atur ulang data demo?"
        description="Semua jurnal, target, dan obrolan tambahanmu akan dihapus dan kembali ke data contoh."
        footer={
          <div className="flex gap-2">
            <Button block variant="secondary" onClick={() => setResetOpen(false)}>
              Batal
            </Button>
            <Button
              block
              variant="danger"
              onClick={() => {
                resetDemo()
                setResetOpen(false)
                navigate('/onboarding', { replace: true })
              }}
            >
              Atur ulang
            </Button>
          </div>
        }
      >
        <p className="text-sm text-fg-muted">
          Kamu akan kembali ke layar pendaftaran dan bisa memulai dari awal.
        </p>
      </Sheet>
    </>
  )
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-mono text-lg font-semibold text-fg">{value}</span>
      <span className="text-[10.5px] font-semibold text-fg-subtle">{label}</span>
    </div>
  )
}