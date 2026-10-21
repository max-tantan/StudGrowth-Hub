import { useCallback, useSyncExternalStore } from 'react'
import { applyColorBlind, type ColorBlindMode } from './colorBlind'

export type TextScale = 'normal' | 'besar' | 'sangat-besar'
export type MotionPreference = 'system' | 'reduce' | 'full'
export type ContrastMode = 'normal' | 'tinggi'
export type ReadingMode = 'normal' | 'baca'
export type LineSpacing = 'normal' | 'lega'

export interface SettingsState {
  colorBlind: ColorBlindMode
  textScale: TextScale
  motion: MotionPreference
  contrast: ContrastMode
  readingMode: ReadingMode
  lineSpacing: LineSpacing
  boldText: boolean
  underlineLinks: boolean
  reduceTransparency: boolean
  notificationsJournal: boolean
  notificationsRisk: boolean
}

const STORAGE_KEY = 'ruang-tumbuh:settings:v1'

export const DEFAULT_SETTINGS: SettingsState = {
  colorBlind: 'normal',
  textScale: 'normal',
  motion: 'system',
  contrast: 'normal',
  readingMode: 'normal',
  lineSpacing: 'normal',
  boldText: false,
  underlineLinks: false,
  reduceTransparency: false,
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

const CONTRAST_VALUES: ContrastMode[] = ['normal', 'tinggi']

const READING_MODE_VALUES: ReadingMode[] = ['normal', 'baca']

const LINE_SPACING_VALUES: LineSpacing[] = ['normal', 'lega']

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
      contrast: CONTRAST_VALUES.includes(parsed.contrast as ContrastMode)
        ? (parsed.contrast as ContrastMode)
        : DEFAULT_SETTINGS.contrast,
      readingMode: READING_MODE_VALUES.includes(
        parsed.readingMode as ReadingMode,
      )
        ? (parsed.readingMode as ReadingMode)
        : DEFAULT_SETTINGS.readingMode,
      lineSpacing: LINE_SPACING_VALUES.includes(
        parsed.lineSpacing as LineSpacing,
      )
        ? (parsed.lineSpacing as LineSpacing)
        : DEFAULT_SETTINGS.lineSpacing,
      boldText:
        typeof parsed.boldText === 'boolean'
          ? parsed.boldText
          : DEFAULT_SETTINGS.boldText,
      underlineLinks:
        typeof parsed.underlineLinks === 'boolean'
          ? parsed.underlineLinks
          : DEFAULT_SETTINGS.underlineLinks,
      reduceTransparency:
        typeof parsed.reduceTransparency === 'boolean'
          ? parsed.reduceTransparency
          : DEFAULT_SETTINGS.reduceTransparency,
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
  root.classList.toggle('contrast-tinggi', settings.contrast === 'tinggi')
  root.classList.toggle('mode-baca', settings.readingMode === 'baca')
  root.classList.toggle('spasi-lega', settings.lineSpacing === 'lega')
  root.classList.toggle('teks-tebal', settings.boldText)
  root.classList.toggle('garis-bawah-tautan', settings.underlineLinks)
  root.classList.toggle('kurangi-transparansi', settings.reduceTransparency)
}

export function saveSettings(next: SettingsState): SettingsState {
  current = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage may be unavailable; ignore for the mock
  }
  applySettings(next)
  emit()
  return next
}

export function resetSettings(): SettingsState {
  return saveSettings({ ...DEFAULT_SETTINGS })
}

export function resetAccessibilitySettings(): SettingsState {
  return saveSettings({
    ...current,
    contrast: DEFAULT_SETTINGS.contrast,
    readingMode: DEFAULT_SETTINGS.readingMode,
    lineSpacing: DEFAULT_SETTINGS.lineSpacing,
    boldText: DEFAULT_SETTINGS.boldText,
    underlineLinks: DEFAULT_SETTINGS.underlineLinks,
    reduceTransparency: DEFAULT_SETTINGS.reduceTransparency,
  })
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
