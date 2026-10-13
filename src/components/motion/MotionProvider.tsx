import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { useSettings } from '../../lib/settings'

const REDUCED_MOTION = {
  system: 'user',
  reduce: 'always',
  full: 'never',
} as const

export function MotionProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  return (
    <MotionConfig reducedMotion={REDUCED_MOTION[settings.motion]}>
      {children}
    </MotionConfig>
  )
}
