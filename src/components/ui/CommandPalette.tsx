import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'
import type { IconName } from './icons'

export interface CommandItem {
  id: string
  label: string
  hint?: string
  icon: IconName
  run: () => void
}

export interface CommandGroup {
  group: string
  data: CommandItem[]
}

interface CommandPaletteProps {
  onClose: () => void
  getGroups: (query: string) => CommandGroup[]
  placeholder?: string
  emptyText?: string
  overlayClassName?: string
}

export function CommandPalette({
  onClose,
  getGroups,
  placeholder = 'Cari halaman, aksi, atau data…',
  emptyText = 'Tidak ada hasil',
  overlayClassName,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const groups = getGroups(query)
  const flat = groups.flatMap((g) => g.data)
  const total = flat.length
  const activeIndex = total > 0 ? Math.min(active, total - 1) : 0

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (total === 0 ? 0 : (i + 1) % total))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (total === 0 ? 0 : (i - 1 + total) % total))
      return
    }
    if (e.key === 'Enter') {
      const item = flat[activeIndex]
      if (item) item.run()
    }
  }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] backdrop-blur-[1px]',
        overlayClassName,
      )}
    >
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
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Icon name="search" size={18} className="shrink-0 text-fg-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-fg outline-none placeholder:text-fg-subtle"
            autoFocus
          />
          <kbd className="rounded border border-border-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-bold text-fg-subtle">
            Esc
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-2 py-2">
          {groups.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-fg-muted">{emptyText}</p>
          ) : (
            <div className="flex flex-col gap-1">
              {groups.map((group) => (
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
                          idx === activeIndex
                            ? 'bg-accent-tint text-accent-strong'
                            : 'text-fg hover:bg-surface-2',
                        )}
                      >
                        <Icon
                          name={item.icon}
                          size={18}
                          weight={idx === activeIndex ? 'fill' : 'duotone'}
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
