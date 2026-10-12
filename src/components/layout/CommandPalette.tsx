import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { MODE_META } from '../../lib/ai'
import { isDarkNow, setThemePreference } from '../../lib/theme'
import { useApp } from '../../store/AppContext'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { TAB_NAV, SECONDARY_NAV } from './nav'
import type { IconName } from '../ui/icons'
import type { ChatMode } from '../../types'

const MODES: ChatMode[] = ['REFLEKSI', 'BELAJAR', 'SOSIAL', 'KARIER', 'PKL']

interface Item {
  id: string
  label: string
  hint?: string
  icon: IconName
  run: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { state, startChat } = useApp()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const items: { group: string; data: Item[] }[] = useMemo(() => {
    const q = query.trim().toLowerCase()

    const pages: Item[] = [
      ...TAB_NAV.map((n) => ({
        id: n.to,
        label: n.label,
        hint: '',
        icon: n.icon,
        run: () => { navigate(n.to); onClose() },
      })),
      ...SECONDARY_NAV.map((n) => ({
        id: n.to,
        label: n.label,
        hint: '',
        icon: n.icon,
        run: () => { navigate(n.to); onClose() },
      })),
    ]

    const actions: Item[] = [
      {
        id: 'new-journal',
        label: 'Tulis jurnal baru',
        hint: '',
        icon: 'note' as IconName,
        run: () => { navigate('/jurnal/baru'); onClose() },
      },
      ...MODES.map((m) => ({
        id: `chat-${m}`,
        label: `Konsultasi: ${MODE_META[m].label}`,
        hint: MODE_META[m].desc,
        icon: 'consult' as IconName,
        run: () => {
          const session = startChat(m)
          navigate(`/konsultasi/${session.id}`)
          onClose()
        },
      })),
      {
        id: 'theme',
        label: isDarkNow() ? 'Mode terang' : 'Mode gelap',
        hint: '',
        icon: isDarkNow() ? 'sun' as IconName : 'moon' as IconName,
        run: () => {
          setThemePreference(isDarkNow() ? 'light' : 'dark')
          onClose()
        },
      },
    ]

    const journals: Item[] = q.length >= 2
      ? state.journals
          .filter((j) => j.title.toLowerCase().includes(q))
          .slice(0, 5)
          .map((j) => ({
            id: j.id,
            label: j.title,
            hint: 'Buka jurnal',
            icon: 'journal' as IconName,
            run: () => { navigate(`/jurnal/${j.id}`); onClose() },
          }))
      : []

    const groups: { group: string; data: Item[] }[] = []

    const pageMatch = pages.filter((p) => !q || p.label.toLowerCase().includes(q))
    if (pageMatch.length) groups.push({ group: 'Halaman', data: pageMatch })

    const actionMatch = actions.filter((p) => !q || p.label.toLowerCase().includes(q))
    if (actionMatch.length) groups.push({ group: 'Aksi', data: actionMatch })

    if (journals.length) groups.push({ group: 'Jurnal', data: journals })

    return groups
  }, [query, onClose, navigate, startChat, state.journals])

  const flat = items.flatMap((g) => g.data)
  const total = flat.length

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % total) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + total) % total) }
    if (e.key === 'Enter') { const item = flat[active]; if (item) item.run() }
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 hidden items-start justify-center backdrop-blur-[1px] lg:flex" style={{ paddingTop: '18vh' }}>
      <button
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
        onKeyDown={onKey}
      >
        {/* Input */}
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Icon name="search" size={18} className="shrink-0 text-fg-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Cari halaman, aksi, atau jurnal…"
            className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-fg outline-none placeholder:text-fg-subtle"
            autoFocus
          />
          <kbd className="rounded border border-border-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-bold text-fg-subtle">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto px-2 py-2">
          {items.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-fg-muted">
              Tidak ada hasil
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {items.map((group) => (
                <div key={group.group}>
                  <p className="px-2 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-fg-subtle">
                    {group.group}
                  </p>
                  {group.data.map((item) => {
                    const idx = flat.indexOf(item)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.run}
                        onMouseEnter={() => setActive(idx)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition-colors',
                          idx === active
                            ? 'bg-accent-tint text-accent-strong'
                            : 'text-fg hover:bg-surface-2',
                        )}
                      >
                        <Icon
                          name={item.icon}
                          size={18}
                          weight={idx === active ? 'fill' : 'duotone'}
                          className="shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{item.label}</span>
                          {item.hint && (
                            <span className="block truncate text-[12px] text-fg-muted">
                              {item.hint}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
