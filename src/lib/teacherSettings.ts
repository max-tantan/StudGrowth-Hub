import { useCallback, useSyncExternalStore } from 'react'

export type TableDensity = 'rapat' | 'normal'

export interface TeacherPrefs {
  notifyNewAlert: boolean
  notifyWeeklyReview: boolean
  notifyPklUpdate: boolean
  anonymizeStudents: boolean
  tableDensity: TableDensity
  showAvatars: boolean
}

export const DEFAULT_TEACHER_PREFS: TeacherPrefs = {
  notifyNewAlert: true,
  notifyWeeklyReview: true,
  notifyPklUpdate: true,
  anonymizeStudents: false,
  tableDensity: 'normal',
  showAvatars: true,
}

const STORAGE_KEY = 'ruang-tumbuh:teacher-settings:v1'

type PrefsMap = Record<string, TeacherPrefs>

const DENSITY_VALUES: TableDensity[] = ['rapat', 'normal']

function sanitize(value: Partial<TeacherPrefs> | undefined): TeacherPrefs {
  if (!value) return DEFAULT_TEACHER_PREFS
  return {
    notifyNewAlert:
      typeof value.notifyNewAlert === 'boolean'
        ? value.notifyNewAlert
        : DEFAULT_TEACHER_PREFS.notifyNewAlert,
    notifyWeeklyReview:
      typeof value.notifyWeeklyReview === 'boolean'
        ? value.notifyWeeklyReview
        : DEFAULT_TEACHER_PREFS.notifyWeeklyReview,
    notifyPklUpdate:
      typeof value.notifyPklUpdate === 'boolean'
        ? value.notifyPklUpdate
        : DEFAULT_TEACHER_PREFS.notifyPklUpdate,
    anonymizeStudents:
      typeof value.anonymizeStudents === 'boolean'
        ? value.anonymizeStudents
        : DEFAULT_TEACHER_PREFS.anonymizeStudents,
    tableDensity: DENSITY_VALUES.includes(value.tableDensity as TableDensity)
      ? (value.tableDensity as TableDensity)
      : DEFAULT_TEACHER_PREFS.tableDensity,
    showAvatars:
      typeof value.showAvatars === 'boolean'
        ? value.showAvatars
        : DEFAULT_TEACHER_PREFS.showAvatars,
  }
}

function readAll(): PrefsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, Partial<TeacherPrefs>>
    const out: PrefsMap = {}
    for (const teacherId of Object.keys(parsed)) {
      out[teacherId] = sanitize(parsed[teacherId])
    }
    return out
  } catch {
    return {}
  }
}

let current: PrefsMap = readAll()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // storage may be unavailable; ignore for the mock
  }
}

export function getTeacherPrefs(teacherId: string): TeacherPrefs {
  return current[teacherId] ?? DEFAULT_TEACHER_PREFS
}

export function saveTeacherPrefs(
  teacherId: string,
  patch: Partial<TeacherPrefs>,
): TeacherPrefs {
  const next = { ...getTeacherPrefs(teacherId), ...patch }
  current = { ...current, [teacherId]: next }
  persist()
  emit()
  return next
}

export function resetTeacherPrefs(teacherId: string): TeacherPrefs {
  const next = { ...current }
  delete next[teacherId]
  current = next
  persist()
  emit()
  return DEFAULT_TEACHER_PREFS
}

export function resetAllTeacherPrefs() {
  current = {}
  persist()
  emit()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    current = readAll()
    emit()
  })
}

export function useTeacherPrefs(teacherId: string) {
  const prefs = useSyncExternalStore(
    subscribe,
    () => getTeacherPrefs(teacherId),
    () => getTeacherPrefs(teacherId),
  )
  const update = useCallback(
    (patch: Partial<TeacherPrefs>) => {
      saveTeacherPrefs(teacherId, patch)
    },
    [teacherId],
  )
  return { prefs, update } as const
}

export function maskStudentName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      const head = part.charAt(0).toUpperCase()
      return `${head}${'•'.repeat(Math.max(2, part.length - 1))}`
    })
    .join(' ')
}

export function maskStudentInitials(initials: string): string {
  return initials
    .split('')
    .map((char) => (char === ' ' ? ' ' : '•'))
    .join('')
}
