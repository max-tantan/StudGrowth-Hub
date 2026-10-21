import { motion } from 'motion/react'
import { useMotionEnabled } from '../motion/useMotionEnabled'
import type { TargetRect } from './useTargetRect'

export function Spotlight({ rect }: { rect: TargetRect | null }) {
  const motionEnabled = useMotionEnabled()

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      {rect && (
        <motion.div
          className="absolute left-0 top-0"
          initial={false}
          animate={{
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            borderRadius: rect.radius,
          }}
          transition={
            motionEnabled
              ? { type: 'spring', stiffness: 340, damping: 34 }
              : { duration: 0 }
          }
          style={{
            boxShadow:
              '0 0 0 2px var(--accent), 0 0 0 100vmax var(--tour-scrim)',
          }}
        >
          <span className="tour-breathe absolute -inset-3 rounded-[inherit] border-2 border-accent/40" />
        </motion.div>
      )}
    </div>
  )
}
