import type { IconName } from '../ui/icons'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  tour?: string
}

export const TAB_NAV: NavItem[] = [
  { to: '/beranda', label: 'Beranda', icon: 'home', tour: 'student-beranda' },
  { to: '/jurnal', label: 'Jurnal', icon: 'journal', tour: 'student-jurnal' },
  {
    to: '/konsultasi',
    label: 'Konsultasi',
    icon: 'consult',
    tour: 'student-konsultasi',
  },
  {
    to: '/perkembangan',
    label: 'Tumbuh',
    icon: 'progress',
    tour: 'student-tumbuh',
  },
  { to: '/resume', label: 'Resume', icon: 'resume', tour: 'student-resume' },
]

export const SECONDARY_NAV: NavItem[] = [
  { to: '/pkl', label: 'PKL', icon: 'briefcase' },
  { to: '/pengaturan', label: 'Pengaturan', icon: 'gear' },
  { to: '/profil', label: 'Profil', icon: 'users' },
]
