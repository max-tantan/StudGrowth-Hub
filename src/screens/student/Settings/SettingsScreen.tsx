import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ThemePreference } from '../../../lib/theme'
import { getThemePreference, setThemePreference } from '../../../lib/theme'
import { useSettings, type TextScale, type MotionPreference } from '../../../lib/settings'
import {
  COLOR_BLIND_OPTIONS,
  type ColorBlindMode,
} from '../../../lib/colorBlind'
import { useApp } from '../../../store/AppContext'
import { cn } from '../../../lib/cn'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'
import type { IconName } from '../../../components/ui/icons'
import { SegmentedControl } from '../../../components/ui/SegmentedControl'
import { Sheet } from '../../../components/ui/Sheet'
import { Switch } from '../../../components/ui/Switch'

const TEXT_SCALE_OPTIONS: { value: TextScale; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'besar', label: 'Besar' },
  { value: 'sangat-besar', label: 'Ekstra' },
]

const MOTION_OPTIONS: { value: MotionPreference; label: string; icon: IconName }[] = [
  { value: 'system', label: 'Sistem', icon: 'monitor' },
  { value: 'reduce', label: 'Reduksi', icon: 'minus' },
  { value: 'full', label: 'Penuh', icon: 'sparkle' },
]

export function SettingsScreen() {
  const navigate = useNavigate()
  const { resetDemo } = useApp()
  const { settings, update } = useSettings()
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)
  const [resetOpen, setResetOpen] = useState(false)

  const chooseTheme = (pref: ThemePreference) => {
    setTheme(pref)
    setThemePreference(pref)
  }

  return (
    <>
      <TopBar title="Pengaturan" showBack className="lg:hidden" />

      <main className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-4 lg:mx-auto lg:w-full lg:max-w-[720px] lg:px-8 lg:pb-14 lg:pt-6">
        <div className="hidden lg:block">
          <h1 className="text-2xl font-extrabold text-fg">Pengaturan</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Personalisasi tampilan, aksesibilitas, dan data aplikasi.
          </p>
        </div>

        <section>
          <SectionTitle icon="palette">Tampilan</SectionTitle>
          <Card className="flex flex-col gap-5">
            <SettingItem
              label="Tema"
              description="Mode gelap mengikuti perangkatmu bila memilih “Sistem”."
            >
              <SegmentedControl<ThemePreference>
                value={theme}
                onChange={chooseTheme}
                options={[
                  { value: 'system', label: 'Sistem', icon: 'monitor' },
                  { value: 'light', label: 'Terang', icon: 'sun' },
                  { value: 'dark', label: 'Gelap', icon: 'moon' },
                ]}
              />
            </SettingItem>

            <Divider />

            <SettingItem
              label="Modus buta warna"
              description="Tukar palet data & status agar tetap bisa dibedakan. Perubahan tampil seketika."
            >
              <ColorBlindGrid
                mode={settings.colorBlind}
                onChange={(mode) => update({ colorBlind: mode })}
              />
            </SettingItem>

            <Divider />

            <SettingItem
              label="Skala teks"
              description="Perbesar teks di seluruh aplikasi untuk kenyamanan membaca."
            >
              <SegmentedControl<TextScale>
                value={settings.textScale}
                onChange={(textScale) => update({ textScale })}
                options={TEXT_SCALE_OPTIONS}
              />
            </SettingItem>

            <Divider />

            <SettingItem
              label="Animasi"
              description="Pilih “Sistem” agar mengikuti pengaturan perangkat, “Reduksi” untuk meminimalkan gerak, atau “Penuh” untuk pengalaman paling hidup."
            >
              <SegmentedControl<MotionPreference>
                value={settings.motion}
                onChange={(motion) => update({ motion })}
                options={MOTION_OPTIONS}
              />
            </SettingItem>
          </Card>
        </section>

        <section>
          <SectionTitle icon="bell">Pemberitahuan</SectionTitle>
          <Card className="flex flex-col gap-4">
            <Switch
              checked={settings.notificationsJournal}
              onChange={(v) => update({ notificationsJournal: v })}
              label="Pengingat jurnal harian"
              description="Ingatkan menulis refleksi singkat setiap hari."
            />
            <Divider />
            <Switch
              checked={settings.notificationsRisk}
              onChange={(v) => update({ notificationsRisk: v })}
              label="Peringatan risiko & konsultasi"
              description="Info saat murid terindikasi butuh perhatian guru BK."
            />
          </Card>
        </section>

        <section>
          <SectionTitle icon="shieldCheck">Privasi & data</SectionTitle>
          <div className="flex flex-col gap-2.5">
            <Card variant="outline" className="flex items-start gap-2.5">
              <Icon
                name="lock"
                size={18}
                className="mt-0.5 shrink-0 text-info"
              />
              <p className="text-[12.5px] text-fg-muted text-pretty">
                Semua data prototipe ini tersimpan hanya di perambanmu
                (localStorage). Tidak ada data yang dikirim ke server.
              </p>
            </Card>
            <Button
              variant="danger"
              icon="rotate"
              onClick={() => setResetOpen(true)}
            >
              Atur ulang data demo
            </Button>
          </div>
        </section>

        <section>
          <SectionTitle icon="gear">Tentang</SectionTitle>
          <Card className="divide-y divide-border">
            <InfoRow label="Aplikasi" value="Ruang Tumbuh" />
            <InfoRow label="Versi" value="Prototipe v0.1" />
            <InfoRow label="Teknologi" value="React · Vite · Tailwind" />
            <InfoRow label="Dibangun untuk" value="SMK Yadika" />
          </Card>
        </section>

        <p className="text-center text-[11px] text-fg-subtle">
          Preferensi tersimpan otomatis di perangkatmu.
        </p>
      </main>

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

function SectionTitle({
  icon,
  children,
}: {
  icon: IconName
  children: ReactNode
}) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-fg">
      <Icon name={icon} size={17} weight="duotone" className="text-accent-strong" />
      {children}
    </h2>
  )
}

function SettingItem({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-bold text-fg">{label}</p>
        <p className="mt-0.5 text-xs text-fg-muted text-pretty">{description}</p>
      </div>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-border" />
}

function ColorBlindGrid({
  mode,
  onChange,
}: {
  mode: ColorBlindMode
  onChange: (mode: ColorBlindMode) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {COLOR_BLIND_OPTIONS.map((opt) => {
        const active = opt.id === mode
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'rounded-[var(--radius-card)] border p-3 text-left transition-all duration-200',
              'hover:border-border-strong active:scale-[0.98]',
              active
                ? 'border-accent bg-accent-tint'
                : 'border-border bg-surface-2',
            )}
          >
            <span className="flex items-center justify-between gap-1">
              <span className="flex flex-wrap items-center gap-1">
                {opt.swatches.map((c) => (
                  <span
                    key={c}
                    className="h-3 w-3 rounded-full ring-1 ring-black/5"
                    style={{ background: c }}
                  />
                ))}
              </span>
              {active && (
                <Icon
                  name="check"
                  size={14}
                  weight="bold"
                  className="shrink-0 text-accent-strong"
                />
              )}
            </span>
            <span className="mt-2 block text-[13px] font-bold text-fg">
              {opt.label}
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-fg-muted">
              {opt.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-sm font-semibold text-fg">{value}</span>
    </div>
  )
}