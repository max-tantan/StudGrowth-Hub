import type { MoodLevel } from '../types'

export function daysAgo(days: number, hour = 19, minute = 30): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat('id-ID', opts).format(new Date(iso))
}

export function formatDay(iso: string): string {
  return formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatShort(iso: string): string {
  return formatDate(iso, { day: 'numeric', month: 'short' })
}

export function formatClock(iso: string): string {
  return formatDate(iso, { hour: '2-digit', minute: '2-digit' })
}

export function startOfWeek(date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7 // Monday as start
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function dayIndexFromMonday(date = new Date()): number {
  return (date.getDay() + 6) % 7
}

export function relativeLabel(iso: string): string {
  const then = new Date(iso)
  const now = new Date()
  const startThen = new Date(then)
  startThen.setHours(0, 0, 0, 0)
  const startNow = new Date(now)
  startNow.setHours(0, 0, 0, 0)
  const diffDays = Math.round(
    (startNow.getTime() - startThen.getTime()) / 86_400_000,
  )
  if (diffDays <= 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  return formatShort(iso)
}

export interface MoodMeta {
  id: MoodLevel
  label: string
  face: string
  color: string
  tint: string
}

export const MOODS: MoodMeta[] = [
  {
    id: 'sangat-baik',
    label: 'Sangat baik',
    face: 'cerah',
    color: 'var(--success)',
    tint: 'var(--success-tint)',
  },
  {
    id: 'baik',
    label: 'Baik',
    face: 'tenang',
    color: 'var(--dim-2)',
    tint: 'var(--info-tint)',
  },
  {
    id: 'biasa',
    label: 'Biasa saja',
    face: 'datar',
    color: 'var(--warning)',
    tint: 'var(--warning-tint)',
  },
  {
    id: 'kurang',
    label: 'Kurang',
    face: 'lesu',
    color: 'var(--dim-4)',
    tint: 'var(--accent-tint)',
  },
  {
    id: 'berat',
    label: 'Berat',
    face: 'berat',
    color: 'var(--danger)',
    tint: 'var(--danger-tint)',
  },
]

export const MOOD_MAP: Record<MoodLevel, MoodMeta> = Object.fromEntries(
  MOODS.map((m) => [m.id, m]),
) as Record<MoodLevel, MoodMeta>

export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n))
}

export function pct(n: number): string {
  return `${Math.round(n)}%`
}
