import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_SETTLE } from './transitions'

export function PageTransition({
  routeKey,
  children,
}: {
  routeKey: string
  children: ReactNode
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        className="flex min-h-0 flex-1 flex-col"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: EASE_SETTLE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
