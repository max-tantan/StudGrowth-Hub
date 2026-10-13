import { motion } from 'motion/react'
import { Icon } from '../ui/Icon'
import { EASE_SETTLE } from '../motion/transitions'

export function Splash({ label = 'Ruang Tumbuh' }: { label?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <motion.span
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint text-accent"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.06, 1], opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_SETTLE }}
        >
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
            className="flex"
          >
            <Icon name="sparkle" size={30} weight="fill" />
          </motion.span>
        </motion.span>
        <motion.p
          className="text-sm font-semibold text-fg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {label}
        </motion.p>
      </div>
    </div>
  )
}
