import type { IconName } from '../ui/icons'

export interface TeacherNavItem {
  to: string
  label: string
  shortLabel?: string
  icon: IconName
  end?: boolean
  badgeKey?: 'review' | 'alert'
}

export const TEACHER_NAV: TeacherNavItem[] = [
  { to: '/guru', label: 'Dasbor', icon: 'trend', end: true },
  {
    to: '/guru/review',
    label: 'Review Resume',
    shortLabel: 'Review',
    icon: 'resume',
    badgeKey: 'review',
  },
  {
    to: '/guru/alert',
    label: 'Alert Risiko',
    shortLabel: 'Alert',
    icon: 'shieldWarning',
    badgeKey: 'alert',
  },
  { to: '/guru/murid', label: 'Murid', icon: 'users3' },
  {
    to: '/guru/pkl',
    label: 'Monitoring PKL',
    shortLabel: 'PKL',
    icon: 'briefcase',
  },
]
