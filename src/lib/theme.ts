export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'ruang-tumbuh:theme'

export function getThemePreference(): ThemePreference {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw === 'light' || raw === 'dark' ? raw : 'system'
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(pref: ThemePreference = getThemePreference()) {
  const dark = pref === 'dark' || (pref === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
  return dark
}

export function setThemePreference(pref: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, pref)
  applyTheme(pref)
}

export function initTheme() {
  applyTheme()
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (getThemePreference() === 'system') applyTheme('system')
    })
}

export function isDarkNow(): boolean {
  return document.documentElement.classList.contains('dark')
}
