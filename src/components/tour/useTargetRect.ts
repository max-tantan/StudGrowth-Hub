import { useCallback, useEffect, useState } from 'react'

export interface TargetRect {
  left: number
  top: number
  width: number
  height: number
  radius: number
}

interface TrackedRect {
  id: string
  rect: TargetRect
}

function readRadius(el: HTMLElement): number {
  const parsed = Number.parseFloat(getComputedStyle(el).borderTopLeftRadius)
  if (!Number.isFinite(parsed)) return 14
  return Math.min(28, Math.max(8, parsed))
}

function findTarget(id: string): HTMLElement | null {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-tour="${id}"]`),
  )
  const center = window.innerWidth / 2
  let best: HTMLElement | null = null
  let bestDistance = Number.POSITIVE_INFINITY
  for (const el of nodes) {
    const rect = el.getBoundingClientRect()
    if (rect.width < 4 || rect.height < 4) continue
    const style = getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') continue
    const distance = Math.abs(rect.left + rect.width / 2 - center)
    if (distance < bestDistance) {
      bestDistance = distance
      best = el
    }
  }
  return best
}

function sameRect(a: TargetRect, b: TargetRect): boolean {
  return (
    a.left === b.left &&
    a.top === b.top &&
    a.width === b.width &&
    a.height === b.height &&
    a.radius === b.radius
  )
}

export function useTargetRect(targetId: string | undefined): TargetRect | null {
  const [tracked, setTracked] = useState<TrackedRect | null>(null)

  const measure = useCallback(() => {
    if (!targetId) return
    const el = findTarget(targetId)
    if (!el) {
      setTracked((prev) => (prev?.id === targetId ? null : prev))
      return
    }
    const box = el.getBoundingClientRect()
    const next: TargetRect = {
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      radius: readRadius(el),
    }
    setTracked((prev) =>
      prev && prev.id === targetId && sameRect(prev.rect, next)
        ? prev
        : { id: targetId, rect: next },
    )
  }, [targetId])

  useEffect(() => {
    if (!targetId) return

    let frame = 0
    let retry: number | undefined
    let observer: ResizeObserver | null = null

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }

    const attach = () => {
      const el = findTarget(targetId)
      if (!el) {
        retry = window.setTimeout(() => {
          attach()
          schedule()
        }, 120)
        return
      }
      observer?.disconnect()
      observer = new ResizeObserver(schedule)
      observer.observe(el)
      observer.observe(document.body)
      schedule()
    }

    attach()
    window.addEventListener('resize', schedule)
    document.addEventListener('scroll', schedule, { capture: true, passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (retry) clearTimeout(retry)
      observer?.disconnect()
      window.removeEventListener('resize', schedule)
      document.removeEventListener('scroll', schedule, { capture: true })
    }
  }, [targetId, measure])

  if (!tracked || tracked.id !== targetId) return null
  return tracked.rect
}
