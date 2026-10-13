import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_SETTLE } from './transitions'

export function Stagger({
  children,
  className,
  gap = 0.07,
  delay = 0,
  once = true,
}: {
  children: ReactNode
  className?: string
  gap?: number
  delay?: number
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: EASE_SETTLE },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
