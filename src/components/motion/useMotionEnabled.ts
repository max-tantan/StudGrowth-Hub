import { useReducedMotion } from 'motion/react'
import { useSettings } from '../../lib/settings'

export function useMotionEnabled(): boolean {
  const { settings } = useSettings()
  const prefersReduced = useReducedMotion()
  if (settings.motion === 'reduce') return false
  if (settings.motion === 'full') return true
  return !prefersReduced
}
