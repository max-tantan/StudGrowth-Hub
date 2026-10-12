import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { IconButton } from './Button'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] animate-rise"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 w-full max-w-[560px] animate-rise rounded-t-[26px] border border-border bg-surface shadow-[var(--shadow-lg)]',
          'max-h-[88dvh] overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]',
          className,
        )}
      >
        <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-border bg-surface/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0 flex-1">
            {title && <h2 className="text-lg font-bold text-fg">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-sm text-fg-muted text-pretty">
                {description}
              </p>
            )}
          </div>
          <IconButton name="close" label="Tutup" tone="ghost" onClick={onClose} />
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="sticky bottom-0 border-t border-border bg-surface/95 px-5 py-3 backdrop-blur">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
