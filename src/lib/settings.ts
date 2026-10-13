import { useCallback, useState } from 'react'
import { applyColorBlind, type ColorBlindMode } from './colorBlind'

export type TextScale = 'normal' | 'besar' | 'sangat-besar'

export interface SettingsState {
  colorBlind: ColorBlindMode
  textScale: TextScale
  notificationsJournal: boolean
  notificationsRisk: boolean
}

const STORAGE_KEY = 'ruang-tumbuh:settings:v1'

export const DEFAULT_SETTINGS: SettingsState = {
  colorBlind: 'normal',
  textScale: 'normal',
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

export function getSettings(): SettingsState {
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

export function applySettings(settings: SettingsState = getSettings()) {
  applyColorBlind(settings.colorBlind)
  const root = document.documentElement
  root.classList.toggle('text-scale-besar', settings.textScale === 'besar')
  root.classList.toggle(
    'text-scale-sangat-besar',
    settings.textScale === 'sangat-besar',
  )
}

export function saveSettings(next: SettingsState): SettingsState {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  applySettings(next)
  return next
}

export function useSettings() {
  const [settings, setState] = useState<SettingsState>(getSettings)
  const update = useCallback((patch: Partial<SettingsState>) => {
    setState((prev) => saveSettings({ ...prev, ...patch }))
  }, [])
  return { settings, update } as const
}