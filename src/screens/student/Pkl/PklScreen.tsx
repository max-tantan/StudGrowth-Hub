import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SUPPORT_CONTACTS } from '../../lib/risk'
import { relativeLabel } from '../../lib/format'
import { cn } from '../../lib/cn'
import { useApp } from '../../store/AppContext'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { Icon } from '../../components/ui/Icon'
import { EmptyState } from '../../components/ui/EmptyState'

const CHECKLIST_KEY = 'ruang-tumbuh:pkl-checklist'

const CHECKLIST = [
  'Surat pengantar & berkas lengkap',
  'Seragam, sepatu, dan penampilan siap',
  'Kenalan dengan pembimbing lapangan',
  'Simpan kontak darurat sekolah',
  'Paham jam kerja & aturan tempat PKL',
  'Siapkan buku catatan kegiatan',
]

function loadChecklist(): string[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function PklScreen() {
  const { state, currentStudent } = useApp()
  const [done, setDone] = useState<string[]>(loadChecklist)

  const toggle = (item: string) => {
    const next = done.includes(item)
      ? done.filter((d) => d !== item)
      : [...done, item]
    setDone(next)
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next))
    } catch {
      // ignore storage errors in the mock
    }
  }

  const pklEntries = state.journals
    .filter((j) => j.studentId === currentStudent.id && j.pkl)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  const isFresh = currentStudent.pklStatus === 'belum'
  const statusLabel =
    currentStudent.pklStatus === 'sedang'
      ? 'Sedang berjalan'
      : currentStudent.pklStatus === 'selesai'
        ? 'Sudah selesai'
        : 'Belum dimulai'

  return (
    <>
      <TopBar title="PKL" subtitle="Praktik Kerja Lapangan" showBack />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 lg:mx-auto lg:w-full lg:max-w-[880px] lg:px-8 lg:pb-14 lg:pt-6">
        <Card className="overflow-hidden p-0">
          <div className="flex items-start gap-3 p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-accent-strong">
              <Icon name="briefcase" size={24} weight="fill" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-extrabold text-fg">{statusLabel}</p>
              <p className="text-[13px] text-fg-muted">
                {currentStudent.pklPlacement ?? 'Tempat PKL belum ditentukan'}
              </p>
            </div>
            <Chip tone={currentStudent.pklStatus === 'sedang' ? 'info' : 'neutral'}>
              Kelas {currentStudent.grade}
            </Chip>
          </div>
          <div className="flex gap-2 border-t border-border bg-surface-2/50 px-4 py-3">
            <Link to="/jurnal/baru" className="flex-1">
              <Button block size="sm" icon="note">
                {isFresh ? 'Catat persiapanmu' : 'Catatan PKL hari ini'}
              </Button>
            </Link>
            <Link to="/konsultasi" className="flex-1">
              <Button block size="sm" variant="secondary" icon="consult">
                Curhat kendala PKL
              </Button>
            </Link>
          </div>
        </Card>

        <section>
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">
            {isFresh ? 'Persiapan PKL' : 'Ceklis kesiapan'}
          </h2>
          <Card padded={false}>
            <ul className="divide-y divide-border">
              {CHECKLIST.map((item) => {
                const checked = done.includes(item)
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      aria-pressed={checked}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                          checked
                            ? 'border-transparent bg-accent text-fg-on-accent'
                            : 'border-border-strong text-transparent',
                        )}
                      >
                        <Icon name="check" size={14} weight="bold" />
                      </span>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          checked ? 'text-fg-subtle line-through' : 'text-fg',
                        )}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-border px-4 py-2.5">
              <p className="text-xs text-fg-subtle">
                {done.length} dari {CHECKLIST.length} selesai
              </p>
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-fg">Catatan PKL</h2>
            <span className="text-xs text-fg-subtle">
              {pklEntries.length} catatan
            </span>
          </div>
          {pklEntries.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="Belum ada catatan PKL"
              description="Tandai jurnalmu sebagai catatan PKL agar masuk ke rekap resume mingguan."
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {pklEntries.slice(0, 5).map((entry) => (
                <Link key={entry.id} to={`/jurnal/${entry.id}`}>
                  <Card className="transition-all hover:border-border-strong active:scale-[0.995]">
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm font-bold text-fg">
                        {entry.title}
                      </p>
                      <span className="shrink-0 font-mono text-[10.5px] text-fg-subtle">
                        {relativeLabel(entry.date)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] text-fg-muted text-pretty">
                      {entry.body}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">
            Kalau ada kendala serius
          </h2>
          <Card variant="accent">
            <p className="text-[13px] text-fg-muted text-pretty">
              Ceritakan di Konsultasi mode PKL. Kalau menyangkut keselamatan,
              perlakuan tidak pantas, atau eksploitasi, catatanmu diteruskan
              otomatis ke pendamping agar kamu benar-benar terbantu.
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {SUPPORT_CONTACTS.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-fg">
                  <Icon
                    name="users"
                    size={16}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-accent-strong"
                  />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </main>
    </>
  )
}