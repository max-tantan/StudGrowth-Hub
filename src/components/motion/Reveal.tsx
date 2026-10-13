import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { RISE_TRANSITION } from './transitions'

type RevealVariant = 'rise' | 'fade' | 'bloom'

const HIDDEN: Record<RevealVariant, Record<string, number>> = {
  rise: { opacity: 0, y: 10 },
  fade: { opacity: 0 },
  bloom: { opacity: 0, scale: 0.96 },
}

export function Reveal({
  children,
  variant = 'rise',
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={HIDDEN[variant]}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ ...RISE_TRANSITION, delay }}
    >
      {children}
    </motion.div>
  )
}
