import type { IconName } from '../ui/icons'

export interface TeacherNavItem {
  to: string
  label: string
  shortLabel?: string
  icon: IconName
  end?: boolean
  badgeKey?: 'review' | 'alert'
  tour?: string
}

export const TEACHER_NAV: TeacherNavItem[] = [
  {
    to: '/guru',
    label: 'Dasbor',
    icon: 'trend',
    end: true,
    tour: 'teacher-dasbor',
  },
  {
    to: '/guru/review',
    label: 'Review Resume',
    shortLabel: 'Review',
    icon: 'resume',
    badgeKey: 'review',
    tour: 'teacher-review',
  },
  {
    to: '/guru/alert',
    label: 'Alert Risiko',
    shortLabel: 'Alert',
    icon: 'shieldWarning',
    badgeKey: 'alert',
    tour: 'teacher-alert',
  },
  {
    to: '/guru/murid',
    label: 'Murid',
    icon: 'users3',
    tour: 'teacher-murid',
  },
  {
    to: '/guru/pkl',
    label: 'Monitoring PKL',
    shortLabel: 'PKL',
    icon: 'briefcase',
    tour: 'teacher-pkl',
  },
]
