import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SegmentedControl } from '../ui/SegmentedControl'
import { useSettings } from '../../lib/settings'
import type { ContrastMode, LineSpacing } from '../../lib/settings'
import { resetAccessibilitySettings } from '../../lib/settings'
import {
  SettingItem,
  SettingsDivider,
  SettingsSectionTitle,
  ToggleSetting,
} from './SettingsParts'

export function AccessibilitySection() {
  const { settings, update } = useSettings()

  return (
    <section>
      <SettingsSectionTitle icon="eye">Aksesibilitas</SettingsSectionTitle>
      <Card className="flex flex-col gap-5">
        <SettingItem
          label="Kontras"
          description="Perkuat warna teks, border, dan penanda status agar lebih mudah dibedakan."
        >
          <SegmentedControl<ContrastMode>
            label="Kontras"
            value={settings.contrast}
            onChange={(contrast) => update({ contrast })}
            options={[
              { value: 'normal', label: 'Standar' },
              { value: 'tinggi', label: 'Tinggi' },
            ]}
          />
        </SettingItem>

        <SettingsDivider />

        <SettingItem
          label="Spasi baris"
          description="Buka jarak antarbaris supaya mata tidak cepat lelah saat membaca panjang."
        >
          <SegmentedControl<LineSpacing>
            label="Spasi baris"
            value={settings.lineSpacing}
            onChange={(lineSpacing) => update({ lineSpacing })}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'lega', label: 'Lega' },
            ]}
          />
        </SettingItem>

        <SettingsDivider />

        <ToggleSetting
          id="a11y-mode-baca"
          label="Mode baca"
          description="Ganti huruf ke Atkinson Hyperlegible dan longgarkan jarak antar kata."
          checked={settings.readingMode === 'baca'}
          onChange={(checked) =>
            update({ readingMode: checked ? 'baca' : 'normal' })
          }
        />

        <ToggleSetting
          id="a11y-teks-tebal"
          label="Teks tebal"
          description="Tambah bobot huruf supaya teks lebih tegas di layar."
          checked={settings.boldText}
          onChange={(boldText) => update({ boldText })}
        />

        <ToggleSetting
          id="a11y-garis-bawah"
          label="Garis bawah tautan"
          description="Tandai semua tautan dengan garis bawah, bukan hanya saat kursor mendekat."
          checked={settings.underlineLinks}
          onChange={(underlineLinks) => update({ underlineLinks })}
        />

        <ToggleSetting
          id="a11y-transparansi"
          label="Kurangi transparansi"
          description="Matikan efek kaca buram pada sidebar, bilah atas, dan bilah bawah."
          checked={settings.reduceTransparency}
          onChange={(reduceTransparency) => update({ reduceTransparency })}
        />

        <SettingsDivider />

        <Button
          variant="secondary"
          icon="rotate"
          onClick={() => {
            resetAccessibilitySettings()
          }}
        >
          Atur ulang preferensi aksesibilitas
        </Button>
      </Card>
    </section>
  )
}
