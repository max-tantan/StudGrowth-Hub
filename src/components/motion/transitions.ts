import type { Transition } from 'motion/react'

export const EASE_SETTLE: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_SOFT: [number, number, number, number] = [0.32, 0.72, 0, 1]

export const RISE_TRANSITION: Transition = {
  duration: 0.45,
  ease: EASE_SETTLE,
}

export const SPRING_SETTLE: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 34,
}
