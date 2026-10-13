import { useCallback, useSyncExternalStore } from 'react'
import { applyColorBlind, type ColorBlindMode } from './colorBlind'

export type TextScale = 'normal' | 'besar' | 'sangat-besar'
export type MotionPreference = 'system' | 'reduce' | 'full'

export interface SettingsState {
  colorBlind: ColorBlindMode
  textScale: TextScale
  motion: MotionPreference
  notificationsJournal: boolean
  notificationsRisk: boolean
}

const STORAGE_KEY = 'ruang-tumbuh:settings:v1'

export const DEFAULT_SETTINGS: SettingsState = {
  colorBlind: 'normal',
  textScale: 'normal',
  motion: 'system',
  notificationsJournal: true,
  notificationsRisk: true,
}

const COLOR_BLIND_VALUES: ColorBlindMode[] = [
  'normal',
  'deuteranopia',
  'protanopia',
  'tritanopia',
  'monokrom',
]

const TEXT_SCALE_VALUES: TextScale[] = ['normal', 'besar', 'sangat-besar']

const MOTION_VALUES: MotionPreference[] = ['system', 'reduce', 'full']

function readSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<SettingsState>
    return {
      colorBlind: COLOR_BLIND_VALUES.includes(parsed.colorBlind as ColorBlindMode)
        ? (parsed.colorBlind as ColorBlindMode)
        : DEFAULT_SETTINGS.colorBlind,
      textScale: TEXT_SCALE_VALUES.includes(parsed.textScale as TextScale)
        ? (parsed.textScale as TextScale)
        : DEFAULT_SETTINGS.textScale,
      motion: MOTION_VALUES.includes(parsed.motion as MotionPreference)
        ? (parsed.motion as MotionPreference)
        : DEFAULT_SETTINGS.motion,
      notificationsJournal:
        typeof parsed.notificationsJournal === 'boolean'
          ? parsed.notificationsJournal
          : DEFAULT_SETTINGS.notificationsJournal,
      notificationsRisk:
        typeof parsed.notificationsRisk === 'boolean'
          ? parsed.notificationsRisk
          : DEFAULT_SETTINGS.notificationsRisk,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

let current: SettingsState = readSettings()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSettings(): SettingsState {
  return current
}

export function applySettings(settings: SettingsState = current) {
  applyColorBlind(settings.colorBlind)
  const root = document.documentElement
  root.classList.toggle('text-scale-besar', settings.textScale === 'besar')
  root.classList.toggle(
    'text-scale-sangat-besar',
    settings.textScale === 'sangat-besar',
  )
  root.classList.toggle('motion-reduce', settings.motion === 'reduce')
  root.classList.toggle('motion-full', settings.motion === 'full')
}

export function saveSettings(next: SettingsState): SettingsState {
  current = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  applySettings(next)
  emit()
  return next
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    current = readSettings()
    applySettings(current)
    emit()
  })
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSettings, getSettings)
  const update = useCallback((patch: Partial<SettingsState>) => {
    saveSettings({ ...current, ...patch })
  }, [])
  return { settings, update } as const
}
