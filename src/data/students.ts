import type { Student } from '../types'
import { daysAgo } from '../lib/format'

function initials(name: string): string {
  const parts = name.split(' ')
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

function make(
  id: string,
  name: string,
  major: Student['major'],
  grade: Student['grade'],
  pklStatus: Student['pklStatus'],
  pklPlacement?: string,
  joinedDaysAgo = 120,
): Student {
  return {
    id,
    name,
    major,
    grade,
    pklStatus,
    pklPlacement,
    initials: initials(name),
    joinedAt: daysAgo(joinedDaysAgo),
  }
}

export const SEED_STUDENTS: Student[] = [
  // Perhotelan
  make('anisa', 'Anisa Rahmawati', 'PERHOTELAN', 'XI', 'sedang', 'Hotel Santika Premiere', 150),
  make('bagas', 'Bagas Pratama', 'PERHOTELAN', 'X', 'belum', undefined, 40),
  make('citra', 'Citra Lestari', 'PERHOTELAN', 'XII', 'selesai', 'Hotel Aryaduta', 420),
  make('dimas', 'Dimas Saputra', 'PERHOTELAN', 'XI', 'sedang', 'Grand Hyatt Jakarta', 160),
  // Akuntansi
  make('eka', 'Eka Wulandari', 'AKUNTANSI', 'XI', 'belum', undefined, 150),
  make('fajar', 'Fajar Nugroho', 'AKUNTANSI', 'XII', 'sedang', 'KPP Pratama', 400),
  make('gita', 'Gita Puspita', 'AKUNTANSI', 'X', 'belum', undefined, 35),
  make('hendra', 'Hendra Wijaya', 'AKUNTANSI', 'XI', 'selesai', 'Bank BRI Cabang Kota', 210),
  // PPLG
  make('indah', 'Indah Permata', 'PPLG', 'XII', 'sedang', 'Nusantara Digital Studio', 380),
  make('joko', 'Joko Susilo', 'PPLG', 'XI', 'belum', undefined, 150),
  make('kiki', 'Kiki Amelia', 'PPLG', 'X', 'belum', undefined, 30),
  make('lukman', 'Lukman Hakim', 'PPLG', 'XII', 'selesai', 'Kode Kreatif Indonesia', 430),
]

export const DEFAULT_STUDENT_ID = 'anisa'

export function getStudent(students: Student[], id: string): Student {
  return students.find((s) => s.id === id) ?? students[0]
}
