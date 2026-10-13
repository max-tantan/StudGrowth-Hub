import { useState } from 'react'
import { DIMENSION_GROUP_LABEL } from '../../config/dimensions'
import type { DimensionScore } from '../../types'
import { useApp } from '../../store/AppContext'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Chip'
import { Icon } from '../../components/ui/Icon'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { GrowthBloom } from '../../components/charts/GrowthBloom'
import { GrowthRadar } from '../../components/charts/GrowthRadar'
import { DimensionBars } from '../../components/charts/DimensionBars'
import { BadgeGrid } from '../../components/progress/BadgeGrid'

type Tab = 'PPP' | 'WORK_READINESS'

export function ProgressScreen() {
  const { characterScores, workScores, pppAverage, wrAverage, currentStudent, badges } =
    useApp()
  const [tab, setTab] = useState<Tab>('PPP')

  const scores = tab === 'PPP' ? characterScores : workScores
  const average = tab === 'PPP' ? pppAverage : wrAverage
  const petals = scores.map((s) => ({
    color: s.dimension.color,
    score: s.score,
    label: s.dimension.short,
  }))

  return (
    <>
      <TopBar title="Perkembangan" subtitle="Karakter & kesiapan kerja" />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-8 lg:pb-14 lg:pt-6">
        <Card className="flex flex-col items-center gap-3 pb-5 lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <GrowthBloom petals={petals} size={224} interactive />
          <div className="text-center">
            <p className="text-3xl font-extrabold text-fg">{average}</p>
            <p className="text-sm text-fg-muted">
              rata-rata {DIMENSION_GROUP_LABEL[tab].toLowerCase()}
            </p>
          </div>
          <p className="max-w-[40ch] text-center text-[13px] text-fg-subtle text-pretty">
            Semakin sering kamu berefleksi dan menyelesaikan target, semakin
            mekar bunga tumbuhmu.
          </p>
        </Card>

        <div className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'PPP', label: 'Karakter', icon: 'sparkle' },
            { value: 'WORK_READINESS', label: 'Kesiapan Kerja', icon: 'briefcase' },
          ]}
        />

        <Card>
          <div className="mb-1 flex items-center gap-2">
            <h2 className="flex-1 text-[15px] font-bold text-fg">
              Radar {DIMENSION_GROUP_LABEL[tab]}
            </h2>
            <Chip tone="accent">{average}/100</Chip>
          </div>
          <GrowthRadar
            scores={scores}
            height={260}
            color={tab === 'PPP' ? 'var(--accent-strong)' : 'var(--success)'}
          />
        </Card>

        <Card>
          <h2 className="mb-3 text-[15px] font-bold text-fg">Rincian dimensi</h2>
          <DimensionBars scores={scores} />
        </Card>

        <InsightCard scores={scores} tab={tab} />

      </div>

      <section className="lg:col-span-12 lg:row-start-3">
          <h2 className="mb-2.5 text-[15px] font-bold text-fg">
            Lencana & pencapaian
          </h2>
          <BadgeGrid major={currentStudent.major} awards={badges} />
        </section>
      </main>
    </>
  )
}

function InsightCard({ scores, tab }: { scores: DimensionScore[]; tab: Tab }) {
  if (!scores.length) return null
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const top = sorted[0]
  const low = sorted[sorted.length - 1]
  const tip =
    tab === 'PPP'
      ? 'Coba tulis jurnal yang menyentuh dimensi ini minggu ini.'
      : 'Coba latih ini lewat aksi kecil saat praktik atau PKL.'

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <Card className="border-success/25 bg-success-tint/50">
        <div className="flex items-center gap-2 text-success">
          <Icon name="trend" size={18} weight="bold" />
          <span className="text-[11px] font-bold uppercase tracking-wide">
            Kekuatanmu
          </span>
        </div>
        <p className="mt-1.5 text-sm font-bold text-fg">{top.dimension.label}</p>
        <p className="text-[13px] text-fg-muted text-pretty">
          Skor {top.score}. Terus jaga dan jadikan contoh.
        </p>
      </Card>
      <Card className="border-warning/25 bg-warning-tint/50">
        <div className="flex items-center gap-2 text-warning">
          <Icon name="target" size={18} weight="bold" />
          <span className="text-[11px] font-bold uppercase tracking-wide">
            Area tumbuh
          </span>
        </div>
        <p className="mt-1.5 text-sm font-bold text-fg">{low.dimension.label}</p>
        <p className="text-[13px] text-fg-muted text-pretty">
          {tip}
        </p>
      </Card>
    </div>
  )
}
