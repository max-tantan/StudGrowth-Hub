import type { Teacher } from '../types'

export const SEED_TEACHERS: Teacher[] = [
  {
    id: 't-wali-a',
    name: 'Bu Rina Kartika',
    initials: 'RK',
    role: 'WALI_KELAS',
    title: 'Wali Kelas XI Perhotelan',
    major: 'PERHOTELAN',
    grade: 'XI',
    homeroom: 'XI Perhotelan',
    email: 'rina.kartika@yadika.sch.id',
  },
  {
    id: 't-bk',
    name: 'Pak Damar Prasetyo',
    initials: 'DP',
    role: 'GURU_BK',
    title: 'Guru Bimbingan Konseling',
    email: 'damar.prasetyo@yadika.sch.id',
  },
  {
    id: 't-pkl',
    name: 'Bu Sari Melati',
    initials: 'SM',
    role: 'PEMBIMBING_PKL',
    title: 'Pembimbing PKL',
    major: 'AKUNTANSI',
    email: 'sari.melati@yadika.sch.id',
  },
  {
    id: 't-kaprog',
    name: 'Pak Yosef Anwar',
    initials: 'YA',
    role: 'KAPROG',
    title: 'Kepala Program PPLG',
    major: 'PPLG',
    email: 'yosef.anwar@yadika.sch.id',
  },
  {
    id: 't-admin',
    name: 'Admin Sekolah',
    initials: 'AS',
    role: 'ADMIN',
    title: 'Administrator',
    email: 'admin@yadika.sch.id',
  },
]

export const DEFAULT_TEACHER_ID = 't-bk'

export function getTeacher(teachers: Teacher[], id: string): Teacher {
  return teachers.find((t) => t.id === id) ?? teachers[0]
}
