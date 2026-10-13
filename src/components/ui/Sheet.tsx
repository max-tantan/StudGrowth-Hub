import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { SPRING_SETTLE } from '../motion/transitions'
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

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.button
            aria-label="Tutup"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING_SETTLE}
            className={cn(
              'relative z-10 w-full max-w-[560px] rounded-t-[26px] border border-border bg-surface shadow-[var(--shadow-lg)]',
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
