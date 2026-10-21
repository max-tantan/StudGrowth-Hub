import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../../lib/settings'
import { useApp } from '../../../store/AppContext'
import { TopBar } from '../../../components/layout/TopBar'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'
import { Sheet } from '../../../components/ui/Sheet'
import { Switch } from '../../../components/ui/Switch'
import { useTour } from '../../../components/tour/TourContext'
import { AccessibilitySection } from '../../../components/settings/AccessibilitySection'
import { DisplaySection } from '../../../components/settings/DisplaySection'
import {
  InfoRow,
  SettingsDivider,
  SettingsSectionTitle,
} from '../../../components/settings/SettingsParts'

export function SettingsScreen() {
  const navigate = useNavigate()
  const { resetDemo } = useApp()
  const { settings, update } = useSettings()
  const { start } = useTour()
  const [resetOpen, setResetOpen] = useState(false)

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

        <DisplaySection />

        <AccessibilitySection />

        <section>
          <SettingsSectionTitle icon="bell">Pemberitahuan</SettingsSectionTitle>
          <Card className="flex flex-col gap-4">
            <Switch
              checked={settings.notificationsJournal}
              onChange={(v) => update({ notificationsJournal: v })}
              label="Pengingat jurnal harian"
              description="Ingatkan menulis refleksi singkat setiap hari."
            />
            <SettingsDivider />
            <Switch
              checked={settings.notificationsRisk}
              onChange={(v) => update({ notificationsRisk: v })}
              label="Peringatan risiko & konsultasi"
              description="Info saat murid terindikasi butuh perhatian guru BK."
            />
          </Card>
        </section>

        <section>
          <SettingsSectionTitle icon="compass">Panduan</SettingsSectionTitle>
          <Card className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-fg">Tur Ruang Tumbuh</p>
              <p className="mt-0.5 text-xs text-fg-muted text-pretty">
                Tampilkan lagi penjelasan setiap fitur, lengkap dengan penanda di
                layar yang sedang dibahas.
              </p>
            </div>
            <Button variant="secondary" icon="compass" onClick={start}>
              Tonton ulang panduan
            </Button>
          </Card>
        </section>

        <section>
          <SettingsSectionTitle icon="shieldCheck">Privasi & data</SettingsSectionTitle>
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
          <SettingsSectionTitle icon="gear">Tentang</SettingsSectionTitle>
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
