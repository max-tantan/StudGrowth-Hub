import { useState } from 'react'
import type { Target } from '../../types'
import { ALL_DIMENSIONS, getDimension, PPP_DIMENSIONS, WORK_READINESS_DIMENSIONS } from '../../config/dimensions'
import { daysAgo } from '../../lib/format'
import { cn } from '../../lib/cn'
import { useApp } from '../../store/AppContext'
import { uid } from '../../store/appState'
import { Button, IconButton } from '../ui/Button'
import { Card } from '../ui/Card'
import { SelectField, TextField } from '../ui/Field'
import { Icon } from '../ui/Icon'
import { DIMENSION_ICON } from '../ui/icons'
import { Progress } from '../ui/Progress'
import { Sheet } from '../ui/Sheet'

export function TargetSection({
  studentId,
  targets,
  title = 'Target kecil',
  limit,
}: {
  studentId: string
  targets: Target[]
  title?: string
  limit?: number
}) {
  const { addTarget, setTarget } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    dimensionId: ALL_DIMENSIONS[0].id,
    due: '',
  })

  const mine = targets
    .filter((t) => t.studentId === studentId)
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'aktif' ? -1 : 1))
  const shown = limit ? mine.slice(0, limit) : mine
  const activeCount = mine.filter((t) => t.status === 'aktif').length

  const submit = () => {
    if (form.title.trim().length < 3) return
    addTarget({
      id: uid('tg'),
      studentId,
      title: form.title.trim(),
      dimensionId: form.dimensionId,
      status: 'aktif',
      progress: 0,
      due: form.due ? new Date(form.due).toISOString() : undefined,
    })
    setForm({ title: '', dimensionId: ALL_DIMENSIONS[0].id, due: '' })
    setOpen(false)
  }

  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2">
        <h2 className="flex-1 text-[15px] font-bold text-fg">{title}</h2>
        <span className="text-xs text-fg-subtle">{activeCount} aktif</span>
        <IconButton
          name="plus"
          label="Tambah target"
          tone="ghost"
          size={16}
          onClick={() => setOpen(true)}
        />
      </div>

      {shown.length === 0 ? (
        <Card variant="sunken" className="text-center">
          <p className="text-sm text-fg-muted">
            Belum ada target. Mulai dari satu langkah kecil.
          </p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {shown.map((t) => {
            const dim = getDimension(t.dimensionId)
            const done = t.status === 'selesai'
            return (
              <li key={t.id}>
                <Card className="flex items-center gap-3 py-3">
                  <button
                    type="button"
                    aria-label={done ? 'Tandai aktif' : 'Tandai selesai'}
                    onClick={() =>
                      setTarget(t.id, {
                        status: done ? 'aktif' : 'selesai',
                        progress: done ? 40 : 100,
                      })
                    }
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                      done
                        ? 'border-transparent bg-accent text-fg-on-accent'
                        : 'border-border-strong text-transparent hover:border-accent',
                    )}
                  >
                    <Icon name="check" size={16} weight="bold" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        done ? 'text-fg-subtle line-through' : 'text-fg',
                      )}
                    >
                      {t.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {dim && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold"
                          style={{ color: dim.color }}
                        >
                          <Icon
                            name={DIMENSION_ICON[dim.id] ?? 'sparkle'}
                            size={12}
                            weight="bold"
                          />
                          {dim.short}
                        </span>
                      )}
                      {t.due && (
                        <span className="font-mono text-[10.5px] text-fg-subtle">
                          {new Date(t.due) < new Date()
                            ? 'lewat tenggat'
                            : 'tenggat ' +
                              new Date(t.due).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                              })}
                        </span>
                      )}
                    </div>
                    <Progress
                      value={done ? 100 : t.progress}
                      size="sm"
                      className="mt-2"
                      label={t.title}
                    />
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Target baru"
        description="Satu langkah kecil yang bisa kamu ukur."
        footer={
          <Button block onClick={submit} disabled={form.title.trim().length < 3}>
            Simpan target
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <TextField
            label="Apa yang mau kamu capai?"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Contoh: Latih senyum & sapa 3 tamu"
            autoFocus
          />
          <SelectField
            label="Dimensi terkait"
            value={form.dimensionId}
            onChange={(e) =>
              setForm((f) => ({ ...f, dimensionId: e.target.value }))
            }
          >
            <optgroup label="Karakter">
              {PPP_DIMENSIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Kesiapan Kerja">
              {WORK_READINESS_DIMENSIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </optgroup>
          </SelectField>
          <TextField
            label="Tenggat (opsional)"
            type="date"
            value={form.due}
            min={daysAgo(0).slice(0, 10)}
            onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
          />
        </div>
      </Sheet>
    </section>
  )
}
