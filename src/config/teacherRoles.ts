import type { TeacherRole } from '../types'
import type { IconName } from '../components/ui/icons'

export interface TeacherRoleMeta {
  id: TeacherRole
  label: string
  tagline: string
  description: string
  icon: IconName
}

export const TEACHER_ROLE_META: Record<TeacherRole, TeacherRoleMeta> = {
  WALI_KELAS: {
    id: 'WALI_KELAS',
    label: 'Wali Kelas',
    tagline: 'Alur mingguan',
    description: 'Review resume mingguan murid binaanmu dan beri catatan apresiasi.',
    icon: 'users3',
  },
  GURU_BK: {
    id: 'GURU_BK',
    label: 'Guru BK',
    tagline: 'Eskalasi risiko',
    description: 'Terima alert risiko dan tindak lanjuti dengan pendampingan.',
    icon: 'shieldWarning',
  },
  PEMBIMBING_PKL: {
    id: 'PEMBIMBING_PKL',
    label: 'Pembimbing PKL',
    tagline: 'Monitoring industri',
    description: 'Pantau murid yang sedang PKL dan alert terkait tempat kerja.',
    icon: 'briefcase',
  },
  KAPROG: {
    id: 'KAPROG',
    label: 'Kaprog',
    tagline: 'Tren jurusan',
    description: 'Lihat tren agregat per jurusan tanpa data pribadi murid.',
    icon: 'trend',
  },
  ADMIN: {
    id: 'ADMIN',
    label: 'Admin',
    tagline: 'Kelola sekolah',
    description: 'Kelola data murid, guru, dan konfigurasi sekolah.',
    icon: 'gear',
  },
}

export const TEACHER_ROLE_LIST: TeacherRoleMeta[] = [
  TEACHER_ROLE_META.WALI_KELAS,
  TEACHER_ROLE_META.GURU_BK,
  TEACHER_ROLE_META.PEMBIMBING_PKL,
  TEACHER_ROLE_META.KAPROG,
  TEACHER_ROLE_META.ADMIN,
]

export const RISK_CATEGORY_LABEL: Record<string, string> = {
  bullying: 'Perundungan',
  kekerasan: 'Kekerasan',
  'self-harm': 'Keselamatan diri',
  krisis: 'Krisis emosional',
  'pkl-pelecehan': 'Perlakuan tidak pantas di PKL',
  'pkl-eksploitasi': 'Dugaan eksploitasi PKL',
  'pkl-keselamatan': 'Keselamatan kerja',
  ekonomi: 'Tekanan ekonomi',
  kecanduan: 'Kecanduan gim / medsos',
}

export const RISK_TARGET_ROLE: Record<string, string> = {
  'pkl-pelecehan': 'Guru BK',
  'pkl-eksploitasi': 'Pembimbing PKL',
  'pkl-keselamatan': 'Kaprog',
}
