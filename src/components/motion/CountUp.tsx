import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { EASE_SETTLE } from './transitions'
import { useMotionEnabled } from './useMotionEnabled'

export function CountUp({
  value,
  duration = 0.9,
  className,
}: {
  value: number
  duration?: number
  className?: string
}) {
  const enabled = useMotionEnabled()
  const count = useMotionValue(enabled ? 0 : value)
  const rounded = useTransform(count, (latest) => String(Math.round(latest)))

  useEffect(() => {
    if (!enabled) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration, ease: EASE_SETTLE })
    return () => controls.stop()
  }, [value, enabled, duration, count])

  return <motion.span className={className}>{rounded}</motion.span>
}
