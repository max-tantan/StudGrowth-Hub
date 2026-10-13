import type { IconName } from '../ui/icons'

export interface TeacherNavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
  badgeKey?: 'review' | 'alert'
}

export const TEACHER_NAV: TeacherNavItem[] = [
  { to: '/guru', label: 'Dasbor', icon: 'trend', end: true },
  { to: '/guru/review', label: 'Review Resume', icon: 'resume', badgeKey: 'review' },
  { to: '/guru/alert', label: 'Alert Risiko', icon: 'shieldWarning', badgeKey: 'alert' },
  { to: '/guru/murid', label: 'Murid', icon: 'users3' },
  { to: '/guru/pkl', label: 'Monitoring PKL', icon: 'briefcase' },
]
