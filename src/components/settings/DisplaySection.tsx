import { Card } from '../ui/Card'
import { SegmentedControl } from '../ui/SegmentedControl'
import type { IconName } from '../ui/icons'
import { useSettings } from '../../lib/settings'
import type { TextScale, MotionPreference } from '../../lib/settings'
import { useTheme } from '../../lib/theme'
import type { ThemePreference } from '../../lib/theme'
import { ColorBlindPicker } from './ColorBlindPicker'
import {
  SettingItem,
  SettingsDivider,
  SettingsSectionTitle,
} from './SettingsParts'

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

export function DisplaySection() {
  const { settings, update } = useSettings()
  const { theme, setTheme } = useTheme()

  return (
    <section>
      <SettingsSectionTitle icon="palette">Tampilan</SettingsSectionTitle>
      <Card className="flex flex-col gap-5">
        <SettingItem
          label="Tema"
          description="Mode gelap mengikuti perangkatmu bila memilih “Sistem”."
        >
          <SegmentedControl<ThemePreference>
            label="Tema"
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'system', label: 'Sistem', icon: 'monitor' },
              { value: 'light', label: 'Terang', icon: 'sun' },
              { value: 'dark', label: 'Gelap', icon: 'moon' },
            ]}
          />
        </SettingItem>

        <SettingsDivider />

        <SettingItem
          label="Modus buta warna"
          description="Tukar palet data & status agar tetap bisa dibedakan. Perubahan tampil seketika."
        >
          <ColorBlindPicker
            mode={settings.colorBlind}
            onChange={(colorBlind) => update({ colorBlind })}
          />
        </SettingItem>

        <SettingsDivider />

        <SettingItem
          label="Skala teks"
          description="Perbesar teks di seluruh aplikasi untuk kenyamanan membaca."
        >
          <SegmentedControl<TextScale>
            label="Skala teks"
            value={settings.textScale}
            onChange={(textScale) => update({ textScale })}
            options={TEXT_SCALE_OPTIONS}
          />
        </SettingItem>

        <SettingsDivider />

        <SettingItem
          label="Animasi"
          description="Pilih “Sistem” agar mengikuti pengaturan perangkat, “Reduksi” untuk meminimalkan gerak, atau “Penuh” untuk pengalaman paling hidup."
        >
          <SegmentedControl<MotionPreference>
            label="Animasi"
            value={settings.motion}
            onChange={(motion) => update({ motion })}
            options={MOTION_OPTIONS}
          />
        </SettingItem>
      </Card>
    </section>
  )
}
