import { useSyncExternalStore } from 'react'
import type { UserRole } from '../types'

const STORAGE_KEY = 'ruang-tumbuh:tour:v1'

export interface TourProgress {
  seen: Record<string, boolean>
}

const DEFAULT_PROGRESS: TourProgress = { seen: {} }

function readProgress(): TourProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROGRESS
    const parsed = JSON.parse(raw) as Partial<TourProgress>
    return { seen: parsed.seen ?? {} }
  } catch {
    return DEFAULT_PROGRESS
  }
}

let current: TourProgress = readProgress()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    /* storage penuh atau ditolak browser */
  }
}

export function getTourProgress(): TourProgress {
  return current
}

export function hasSeenTour(role: UserRole): boolean {
  return current.seen[role] === true
}

export function markTourSeen(role: UserRole): void {
  if (current.seen[role] === true) return
  current = { seen: { ...current.seen, [role]: true } }
  persist()
  emit()
}

export function resetTourSeen(role?: UserRole): void {
  current = { seen: role ? { ...current.seen, [role]: false } : {} }
  persist()
  emit()
}

export function useTourProgress(): TourProgress {
  return useSyncExternalStore(subscribe, getTourProgress, getTourProgress)
}
