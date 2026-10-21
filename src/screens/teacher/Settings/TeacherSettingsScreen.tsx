import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'
import { SegmentedControl } from '../../../components/ui/SegmentedControl'
import { PageHeader } from '../../../components/teacher/PageHeader'
import { AccessibilitySection } from '../../../components/settings/AccessibilitySection'
import { DisplaySection } from '../../../components/settings/DisplaySection'
import {
  SettingItem,
  SettingsDivider,
  SettingsSectionTitle,
  ToggleSetting,
} from '../../../components/settings/SettingsParts'
import { useApp } from '../../../store/AppContext'
import { useTour } from '../../../components/tour/TourContext'
import {
  resetTeacherPrefs,
  useTeacherPrefs,
  type TableDensity,
} from '../../../lib/teacherSettings'

export function TeacherSettingsScreen() {
  const { currentTeacher } = useApp()
  const { prefs, update } = useTeacherPrefs(currentTeacher.id)
  const { start } = useTour()

  return (
    <div className="mx-auto w-full max-w-[880px]">
      <PageHeader
        eyebrow="Ruang Guru"
        title="Pengaturan"
        description="Atur tampilan, aksesibilitas, notifikasi, dan cara data murid ditampilkan di layarmu."
      />

      <div className="flex flex-col gap-6">
        <AccessibilitySection />

        <DisplaySection />

        <section>
          <SettingsSectionTitle icon="bell">Notifikasi guru</SettingsSectionTitle>
          <Card className="flex flex-col gap-4">
            <ToggleSetting
              id="guru-notif-alert"
              label="Alert risiko baru"
              description="Tandai lonceng di bilah atas saat ada sinyal risiko baru dalam lingkupmu."
              checked={prefs.notifyNewAlert}
              onChange={(notifyNewAlert) => update({ notifyNewAlert })}
            />
            <SettingsDivider />
            <ToggleSetting
              id="guru-notif-review"
              label="Review mingguan masuk"
              description="Tampilkan jumlah antrean review di navigasi guru dan chip ringkasan di halaman review."
              checked={prefs.notifyWeeklyReview}
              onChange={(notifyWeeklyReview) => update({ notifyWeeklyReview })}
            />
            <SettingsDivider />
            <ToggleSetting
              id="guru-notif-pkl"
              label="Pembaruan PKL"
              description="Tampilkan jumlah catatan PKL minggu ini di navigasi guru dan di halaman monitoring PKL."
              checked={prefs.notifyPklUpdate}
              onChange={(notifyPklUpdate) => update({ notifyPklUpdate })}
            />
          </Card>
        </section>

        <section>
          <SettingsSectionTitle icon="lock">Privasi data murid</SettingsSectionTitle>
          <div className="flex flex-col gap-2.5">
            <Card className="flex flex-col gap-4">
              <ToggleSetting
                id="guru-priv-anonim"
                label="Mode anonim"
                description="Sembunyikan nama lengkap murid di seluruh layar guru: dasbor, daftar murid, antrean review, alert, dan monitoring PKL. Inisial, jurusan, dan angka tetap tampil."
                checked={prefs.anonymizeStudents}
                onChange={(anonymizeStudents) => update({ anonymizeStudents })}
              />
            </Card>
            <Card variant="outline" className="flex items-start gap-2.5">
              <Icon
                name="shieldCheck"
                size={18}
                className="mt-0.5 shrink-0 text-info"
              />
              <p className="text-[12.5px] text-fg-muted text-pretty">
                Mode anonim hanya mengubah tampilan di peramban ini. Data asli
                tetap ada di penyimpanan lokal dan tidak pernah dikirim ke
                server.
              </p>
            </Card>
          </div>
        </section>

        <section>
          <SettingsSectionTitle icon="listChecks">Tampilan data</SettingsSectionTitle>
          <Card className="flex flex-col gap-5">
            <SettingItem
              label="Kerapatan tabel"
              description="Padatkan baris agar lebih banyak murid terlihat tanpa menggulir."
            >
              <SegmentedControl<TableDensity>
                label="Kerapatan tabel"
                value={prefs.tableDensity}
                onChange={(tableDensity) => update({ tableDensity })}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'rapat', label: 'Rapat' },
                ]}
              />
            </SettingItem>
            <SettingsDivider />
            <ToggleSetting
              id="guru-data-avatar"
              label="Tampilkan avatar murid"
              description="Ganti avatar lingkaran menjadi badge inisial di daftar dan kartu murid."
              checked={prefs.showAvatars}
              onChange={(showAvatars) => update({ showAvatars })}
            />
          </Card>
        </section>

        <section>
          <SettingsSectionTitle icon="compass">Panduan</SettingsSectionTitle>
          <Card className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-fg">Tur Ruang Guru</p>
              <p className="mt-0.5 text-xs text-fg-muted text-pretty">
                Tampilkan lagi penjelasan setiap halaman guru, lengkap dengan
                penanda di layar yang sedang dibahas.
              </p>
            </div>
            <Button variant="secondary" icon="compass" onClick={start}>
              Tonton ulang panduan
            </Button>
          </Card>
        </section>

        <section>
          <SettingsSectionTitle icon="rotate">Atur ulang</SettingsSectionTitle>
          <div className="flex flex-col gap-2.5">
            <Card variant="outline" className="flex items-start gap-2.5">
              <Icon
                name="lock"
                size={18}
                className="mt-0.5 shrink-0 text-info"
              />
              <p className="text-[12.5px] text-fg-muted text-pretty">
                Preferensi guru disimpan per akun di peramban ini. Mengembalikan
                ke bawaan tidak menghapus jurnal, target, atau data murid.
              </p>
            </Card>
            <Button
              variant="secondary"
              icon="rotate"
              onClick={() => {
                resetTeacherPrefs(currentTeacher.id)
              }}
            >
              Kembalikan preferensi guru ke bawaan
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
