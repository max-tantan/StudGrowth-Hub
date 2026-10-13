export type ColorBlindMode =
  | 'normal'
  | 'deuteranopia'
  | 'protanopia'
  | 'tritanopia'
  | 'monokrom'

export interface ColorBlindOption {
  id: ColorBlindMode
  label: string
  description: string
  swatches: string[]
}

export const COLOR_BLIND_OPTIONS: ColorBlindOption[] = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'Palet bawaan ruang tumbuh.',
    swatches: ['#3d87c4', '#2f9a88', '#5d9c43', '#6a7cd0', '#26759b', '#3c8262'],
  },
  {
    id: 'deuteranopia',
    label: 'Deuteranopia',
    description: 'Buta warna hijau-merah, yang paling umum.',
    swatches: ['#0072b2', '#e69f00', '#cc79a7', '#56b4e9', '#d55e00', '#009e73'],
  },
  {
    id: 'protanopia',
    label: 'Protanopia',
    description: 'Buta warna merah-hijau dengan sensitivitas merah rendah.',
    swatches: ['#0072b2', '#e69f00', '#cc79a7', '#56b4e9', '#d55e00', '#009e73'],
  },
  {
    id: 'tritanopia',
    label: 'Tritanopia',
    description: 'Buta warna biru-kuning, cukup jarang.',
    swatches: ['#d1495b', '#2a9d8f', '#8e44ad', '#e76f51', '#457b9d', '#66a182'],
  },
  {
    id: 'monokrom',
    label: 'Monokrom',
    description: 'Seluruh warna dinetralkan menjadi skala abu-abu.',
    swatches: ['#1f2937', '#3f4a5a', '#5b6675', '#7c8b99', '#9fadb9', '#c2ccd6'],
  },
]

export function colorBlindClass(mode: ColorBlindMode): string {
  return mode === 'normal' ? '' : `cb-${mode}`
}

export function applyColorBlind(mode: ColorBlindMode) {
  const root = document.documentElement
  root.classList.remove(
    'cb-deuteranopia',
    'cb-protanopia',
    'cb-tritanopia',
    'cb-monokrom',
  )
  const cls = colorBlindClass(mode)
  if (cls) root.classList.add(cls)
}