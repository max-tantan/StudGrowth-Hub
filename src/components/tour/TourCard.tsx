import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { useMotionEnabled } from '../motion/useMotionEnabled'
import { EASE_SETTLE } from '../motion/transitions'
import type { TargetRect } from './useTargetRect'
import type { TourIntro, TourOutro, TourStep } from '../../config/tour'

export type TourPhase = 'intro' | 'step' | 'outro'

interface TourCardProps {
  phase: TourPhase
  step: TourStep | null
  stepNumber: number
  stepTotal: number
  intro: TourIntro
  outro: TourOutro
  rect: TargetRect | null
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onCta: () => void
}

interface Placement {
  left: number
  top: number
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const MARGIN = 12
const GAP = 14

function placeCard(rect: TargetRect | null, size: { w: number; h: number }): Placement {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const clampX = (value: number) =>
    Math.min(Math.max(value, MARGIN), Math.max(MARGIN, vw - size.w - MARGIN))
  const clampY = (value: number) =>
    Math.min(Math.max(value, MARGIN), Math.max(MARGIN, vh - size.h - MARGIN))

  if (!rect) {
    return {
      left: Math.max(MARGIN, (vw - size.w) / 2),
      top: Math.max(MARGIN, (vh - size.h) / 2),
    }
  }

  const right = rect.left + rect.width
  const bottom = rect.top + rect.height
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  if (bottom > vh * 0.82) {
    return { left: clampX(centerX - size.w / 2), top: clampY(rect.top - GAP - size.h) }
  }

  if (rect.left < vw * 0.2 && right + GAP + size.w + MARGIN < vw) {
    return { left: clampX(right + GAP), top: clampY(centerY - size.h / 2) }
  }

  if (right > vw * 0.8 && rect.left - GAP - size.w - MARGIN > 0) {
    return { left: clampX(rect.left - GAP - size.w), top: clampY(centerY - size.h / 2) }
  }

  if (vh - bottom >= size.h + GAP + MARGIN) {
    return { left: clampX(centerX - size.w / 2), top: clampY(bottom + GAP) }
  }

  if (rect.top >= size.h + GAP + MARGIN) {
    return { left: clampX(centerX - size.w / 2), top: clampY(rect.top - GAP - size.h) }
  }

  return { left: clampX(centerX - size.w / 2), top: clampY(centerY - size.h / 2) }
}

export function TourCard({
  phase,
  step,
  stepNumber,
  stepTotal,
  intro,
  outro,
  rect,
  onNext,
  onPrev,
  onSkip,
  onCta,
}: TourCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const motionEnabled = useMotionEnabled()
  const titleId = `tour-title-${phase}`

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
  }, [phase, step?.id])

  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true })
  }, [phase, step?.id])

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const container = cardRef.current
        if (container) trapFocus(container, event)
        event.stopPropagation()
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onSkip()
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        onNext()
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()
        onPrev()
        return
      }
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement | null
        const interactive =
          target?.tagName === 'BUTTON' ||
          target?.tagName === 'A' ||
          target?.tagName === 'INPUT'
        if (!interactive) {
          event.preventDefault()
          event.stopPropagation()
          onNext()
        }
        return
      }
      if (event.key.length === 1) {
        event.stopPropagation()
      }
    },
    [onNext, onPrev, onSkip],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey, { capture: true })
    return () => document.removeEventListener('keydown', handleKey, { capture: true })
  }, [handleKey])

  const estimate = size ?? { w: 340, h: 300 }
  const placement = placeCard(rect, estimate)

  return (
    <motion.div
      ref={cardRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed left-0 top-0 z-[61] outline-none"
      style={{ width: 'min(340px, calc(100vw - 24px))' }}
      initial={false}
      animate={{
        x: placement.left,
        y: placement.top,
        opacity: size ? 1 : 0,
      }}
      transition={
        motionEnabled
          ? {
              x: { type: 'spring', stiffness: 340, damping: 34 },
              y: { type: 'spring', stiffness: 340, damping: 34 },
              opacity: { duration: 0.18 },
            }
          : { duration: 0 }
      }
    >
      <motion.div
        key={`${phase}-${step?.id ?? ''}`}
        initial={motionEnabled ? { opacity: 0, y: 6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: EASE_SETTLE }}
      >
        {phase === 'intro' && (
          <IntroPanel intro={intro} titleId={titleId} onNext={onNext} onSkip={onSkip} />
        )}
        {phase === 'step' && step && (
          <StepPanel
            step={step}
            stepNumber={stepNumber}
            stepTotal={stepTotal}
            titleId={titleId}
            onNext={onNext}
            onPrev={onPrev}
            onSkip={onSkip}
          />
        )}
        {phase === 'outro' && (
          <OutroPanel
            outro={outro}
            titleId={titleId}
            onCta={onCta}
            onSkip={onSkip}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  const items = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE),
  ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0)

  if (items.length === 0) {
    event.preventDefault()
    container.focus()
    return
  }

  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (event.shiftKey) {
    if (!active || !container.contains(active) || active === first) {
      event.preventDefault()
      last.focus()
    }
    return
  }

  if (!active || !container.contains(active) || active === last) {
    event.preventDefault()
    first.focus()
  }
}

function IntroPanel({
  intro,
  titleId,
  onNext,
  onSkip,
}: {
  intro: TourIntro
  titleId: string
  onNext: () => void
  onSkip: () => void
}) {
  const wideFirst = intro.features.length % 2 === 1

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-lg)]">
      <div className="border-b border-border bg-accent-tint/60 px-5 pb-4 pt-5">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-fg-on-accent">
            <Icon name={intro.icon} size={22} weight="fill" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
              {intro.eyebrow}
            </p>
            <h2
              id={titleId}
              className="mt-1.5 text-[19px] font-extrabold leading-[1.2] text-balance text-fg"
            >
              {intro.title}
            </h2>
          </div>
        </div>
        <p className="mt-3.5 text-[13.5px] leading-relaxed text-pretty text-fg-muted">
          {intro.body}
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-2">
          {intro.features.map((feature, index) => (
            <div
              key={feature.label}
              className={
                wideFirst && index === 0
                  ? 'col-span-2 flex items-center gap-2.5 rounded-xl border border-border bg-surface-2/60 px-3 py-2.5'
                  : 'flex items-center gap-2.5 rounded-xl border border-border bg-surface-2/60 px-3 py-2.5'
              }
            >
              <Icon
                name={feature.icon}
                size={17}
                weight="duotone"
                className="shrink-0 text-accent-strong"
              />
              <span className="truncate text-[12.5px] font-semibold text-fg">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-surface-2/40 px-5 py-3.5">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Lewati
        </Button>
        <Button
          size="sm"
          iconRight="arrowRight"
          className="ml-auto"
          onClick={onNext}
        >
          Mulai tur
        </Button>
      </div>
    </div>
  )
}

function StepPanel({
  step,
  stepNumber,
  stepTotal,
  titleId,
  onNext,
  onPrev,
  onSkip,
}: {
  step: TourStep
  stepNumber: number
  stepTotal: number
  titleId: string
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}) {
  const isLast = stepNumber === stepTotal

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-lg)]">
      <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
          <Icon name={step.icon} size={17} weight="duotone" />
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
          {step.label}
        </span>
        <span className="ml-auto font-mono text-[11px] font-semibold tabular-nums text-fg-subtle">
          {String(stepNumber).padStart(2, '0')}
          <span className="text-fg-subtle/60">/{String(stepTotal).padStart(2, '0')}</span>
        </span>
      </div>

      <div className="px-4">
        <h2
          id={titleId}
          className="text-[16.5px] font-extrabold leading-[1.25] text-balance text-fg"
        >
          {step.title}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-pretty text-fg-muted">
          {step.body}
        </p>
      </div>

      <div className="px-4 pb-4 pt-4">
        <StemProgress value={stepNumber} total={stepTotal} />
        <div className="mt-3 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSkip}>
            Lewati
          </Button>
          <div className="ml-auto flex items-center gap-2">
            {stepNumber > 1 && (
              <Button
                variant="secondary"
                size="sm"
                icon="arrowLeft"
                onClick={onPrev}
                aria-label="Langkah sebelumnya"
              />
            )}
            <Button
              size="sm"
              iconRight={isLast ? 'check' : 'arrowRight'}
              onClick={onNext}
            >
              {isLast ? 'Selesai' : 'Lanjut'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StemProgress({ value, total }: { value: number; total: number }) {
  const percent = total > 0 ? (value / total) * 100 : 0

  return (
    <div
      className="relative h-5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={value}
      aria-label="Kemajuan tur"
    >
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-3" />
      <motion.div
        className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={{ type: 'spring', stiffness: 220, damping: 30 }}
      >
        <span className="absolute right-0 top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-accent-tint ring-1 ring-accent/35">
          <Icon name="leaf" size={11} weight="fill" className="text-accent-strong" />
        </span>
      </motion.div>
    </div>
  )
}

function OutroPanel({
  outro,
  titleId,
  onCta,
  onSkip,
}: {
  outro: TourOutro
  titleId: string
  onCta: () => void
  onSkip: () => void
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-lg)]">
      <div className="flex items-start gap-3.5 px-5 pb-4 pt-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success-tint text-success">
          <Icon name="checkCircle" size={22} weight="fill" />
        </span>
        <div className="min-w-0">
          <h2
            id={titleId}
            className="text-[17px] font-extrabold leading-[1.25] text-balance text-fg"
          >
            {outro.title}
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-pretty text-fg-muted">
            {outro.body}
          </p>
        </div>
      </div>
      <div className="border-t border-border bg-surface-2/40 px-5 py-3.5">
        <Button block size="sm" iconRight="arrowRight" onClick={onCta}>
          {outro.cta}
        </Button>
        <Button
          block
          variant="ghost"
          size="sm"
          className="mt-1.5"
          onClick={onSkip}
        >
          Tutup
        </Button>
      </div>
    </div>
  )
}
