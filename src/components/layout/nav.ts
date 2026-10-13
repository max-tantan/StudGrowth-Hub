import type { IconName } from '../ui/icons'

export interface NavItem {
  to: string
  label: string
  icon: IconName
}

export const TAB_NAV: NavItem[] = [
  { to: '/beranda', label: 'Beranda', icon: 'home' },
  { to: '/jurnal', label: 'Jurnal', icon: 'journal' },
  { to: '/konsultasi', label: 'Konsultasi', icon: 'consult' },
  { to: '/perkembangan', label: 'Tumbuh', icon: 'progress' },
  { to: '/resume', label: 'Resume', icon: 'resume' },
]

export const SECONDARY_NAV: NavItem[] = [
  { to: '/pkl', label: 'PKL', icon: 'briefcase' },
  { to: '/pengaturan', label: 'Pengaturan', icon: 'gear' },
  { to: '/profil', label: 'Profil', icon: 'users' },
]
