import type { IconName } from '../ui/icons'

export type TeacherNavGroup = 'Ringkasan' | 'Pendampingan' | 'Data Murid'

export interface TeacherNavItem {
  to: string
  label: string
  shortLabel?: string
  hint?: string
  icon: IconName
  end?: boolean
  badgeKey?: 'review' | 'alert' | 'pkl'
  tour?: string
  group: TeacherNavGroup
}

export const TEACHER_NAV: TeacherNavItem[] = [
  {
    to: '/guru',
    label: 'Dasbor',
    hint: 'Ringkasan aktivitas kelas hari ini',
    icon: 'trend',
    end: true,
    tour: 'teacher-dasbor',
    group: 'Ringkasan',
  },
  {
    to: '/guru/review',
    label: 'Review Resume',
    shortLabel: 'Review',
    hint: 'Rekap mingguan murid binaan',
    icon: 'resume',
    badgeKey: 'review',
    tour: 'teacher-review',
    group: 'Pendampingan',
  },
  {
    to: '/guru/alert',
    label: 'Alert Risiko',
    shortLabel: 'Alert',
    hint: 'Sinyal risiko dari konsultasi murid',
    icon: 'shieldWarning',
    badgeKey: 'alert',
    tour: 'teacher-alert',
    group: 'Pendampingan',
  },
  {
    to: '/guru/murid',
    label: 'Murid',
    hint: 'Kelola data dan perkembangan murid',
    icon: 'users3',
    tour: 'teacher-murid',
    group: 'Data Murid',
  },
  {
    to: '/guru/pkl',
    label: 'Monitoring PKL',
    shortLabel: 'PKL',
    hint: 'Penempatan dan catatan harian PKL',
    icon: 'briefcase',
    badgeKey: 'pkl',
    tour: 'teacher-pkl',
    group: 'Data Murid',
  },
]

export const TEACHER_NAV_GROUPS: TeacherNavGroup[] = [
  'Ringkasan',
  'Pendampingan',
  'Data Murid',
]
