import { createContext, useContext } from 'react'
import type { UserRole } from '../../types'

export interface TourContextValue {
  active: boolean
  role: UserRole | null
  start: () => void
  stop: () => void
}

export const TourContext = createContext<TourContextValue | null>(null)

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTour must be used within TourProvider')
  return ctx
}
