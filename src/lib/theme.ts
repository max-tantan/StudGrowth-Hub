import { useSyncExternalStore } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'ruang-tumbuh:theme'

function readPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === 'light' || raw === 'dark' ? raw : 'system'
  } catch {
    return 'system'
  }
}

let current: ThemePreference = readPreference()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getThemePreference(): ThemePreference {
  return current
}

export function applyTheme(pref: ThemePreference = current) {
  const dark = pref === 'dark' || (pref === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
  return dark
}

export function setThemePreference(pref: ThemePreference) {
  current = pref
  try {
    localStorage.setItem(STORAGE_KEY, pref)
  } catch {
    // storage may be unavailable; ignore for the mock
  }
  applyTheme(pref)
  emit()
}

export function initTheme() {
  applyTheme()
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (getThemePreference() === 'system') applyTheme('system')
    })
}

export function resetTheme() {
  setThemePreference('system')
}

export function isDarkNow(): boolean {
  return document.documentElement.classList.contains('dark')
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getThemePreference,
    getThemePreference,
  )
  return { theme, setTheme: setThemePreference } as const
}
