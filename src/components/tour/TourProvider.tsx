import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { markTourSeen, useTourProgress } from '../../lib/tour'
import { TOUR_COPY } from '../../config/tour'
import type { UserRole } from '../../types'
import { TourContext } from './TourContext'
import { TourCard } from './TourCard'
import type { TourPhase } from './TourCard'
import { Spotlight } from './Spotlight'
import { useTargetRect } from './useTargetRect'

export function TourProvider({ children }: { children: ReactNode }) {
  const { state } = useApp()
  return (
    <TourSession key={state.role ?? 'guest'} role={state.role}>
      {children}
    </TourSession>
  )
}

function TourSession({
  children,
  role,
}: {
  children: ReactNode
  role: UserRole | null
}) {
  const { state } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { seen } = useTourProgress()

  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(-1)

  const copy = role === 'teacher' ? TOUR_COPY.teacher : TOUR_COPY.student
  const stepTotal = copy.steps.length
  const phase: TourPhase =
    index < 0 ? 'intro' : index >= stepTotal ? 'outro' : 'step'
  const step = phase === 'step' ? copy.steps[index] : null

  const start = useCallback(() => {
    setIndex(-1)
    setActive(true)
  }, [])

  const stop = useCallback(() => {
    if (role) markTourSeen(role)
    setActive(false)
  }, [role])

  const next = useCallback(() => {
    setIndex((current) => (current < stepTotal ? current + 1 : current))
  }, [stepTotal])

  const prev = useCallback(() => {
    setIndex((current) => Math.max(-1, current - 1))
  }, [])

  const cta = useCallback(() => {
    navigate(copy.outro.ctaRoute)
    stop()
  }, [copy.outro.ctaRoute, navigate, stop])

  useEffect(() => {
    if (!role) return
    if (role === 'student' && !state.onboarded) return
    if (seen[role]) return
    const timer = window.setTimeout(start, 700)
    return () => window.clearTimeout(timer)
  }, [role, state.onboarded, seen, start])

  useEffect(() => {
    if (!active || phase !== 'step' || !step?.route) return
    if (location.pathname !== step.route) navigate(step.route)
  }, [active, phase, step, location.pathname, navigate])

  const rect = useTargetRect(phase === 'step' ? step?.target : undefined)

  return (
    <TourContext.Provider value={{ active, role, start, stop }}>
      {children}
      {active &&
        createPortal(
          <>
            <Spotlight rect={rect} />
            <button
              type="button"
              aria-label="Tutup panduan"
              className="fixed inset-0 z-[60] cursor-default"
              onClick={stop}
            />
            <TourCard
              phase={phase}
              step={step}
              stepNumber={phase === 'step' ? index + 1 : 0}
              stepTotal={stepTotal}
              intro={copy.intro}
              outro={copy.outro}
              rect={rect}
              onNext={next}
              onPrev={prev}
              onSkip={stop}
              onCta={cta}
            />
          </>,
          document.body,
        )}
    </TourContext.Provider>
  )
}
