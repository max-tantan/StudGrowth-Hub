import type { Target } from '../types'
import { daysAgo } from '../lib/format'

const future = (d: number) => daysAgo(-d, 17, 0)

export const SEED_TARGETS: Target[] = [
  // Anisa
  { id: 'ta-1', studentId: 'anisa', title: 'Sapa & layani 10 tamu dengan ramah', detail: 'Catat tiap interaksi di jurnal.', due: future(5), status: 'aktif', dimensionId: 'komunikasi-tim', progress: 70 },
  { id: 'ta-2', studentId: 'anisa', title: 'Grooming check setiap sebelum shift', detail: 'Rambut, seragam, sepatu, nama tag.', due: future(-2), status: 'selesai', dimensionId: 'disiplin', progress: 100 },
  { id: 'ta-3', studentId: 'anisa', title: 'Kuasai 50 kosakata perhotelan', detail: 'Hafal & pakai dalam percakapan.', due: future(14), status: 'aktif', dimensionId: 'mandiri', progress: 40 },
  { id: 'ta-4', studentId: 'anisa', title: 'Tetap tenang saat tamu mengeluh', detail: 'Dengarkan dulu, jangan potong.', due: future(9), status: 'aktif', dimensionId: 'adaptasi', progress: 60 },
  // Dimas
  { id: 'td-1', studentId: 'dimas', title: 'Buat laporan singkat 1 menit ke supervisor', status: 'aktif', dimensionId: 'komunikasi-tim', progress: 55, due: future(6) },
  { id: 'td-2', studentId: 'dimas', title: 'Cek ulang tagihan sebelum serahkan', status: 'selesai', dimensionId: 'etika-profesi', progress: 100, due: future(-3) },
  // Citra
  { id: 'tc-1', studentId: 'citra', title: 'Siapkan portofolio PKL', status: 'aktif', dimensionId: 'tanggung-jawab', progress: 80, due: future(4) },
  { id: 'tc-2', studentId: 'citra', title: 'Latihan simulasi check-in 5x', status: 'aktif', dimensionId: 'mandiri', progress: 60, due: future(8) },
  // Bagas
  { id: 'tb-1', studentId: 'bagas', title: 'Rapikan tempat tidur rapi 7 hari', status: 'aktif', dimensionId: 'disiplin', progress: 30, due: future(7) },
  // Eka
  { id: 'te-1', studentId: 'eka', title: 'Cek ulang setiap jurnal praktik', status: 'aktif', dimensionId: 'bernalar-kritis', progress: 50, due: future(5) },
  { id: 'te-2', studentId: 'eka', title: 'Belajar 3 rumus Excel baru', status: 'selesai', dimensionId: 'mandiri', progress: 100, due: future(-4) },
  // Fajar
  { id: 'tf-1', studentId: 'fajar', title: 'Pakai daftar periksa berkas', status: 'aktif', dimensionId: 'etika-profesi', progress: 45, due: future(6) },
  // Gita
  { id: 'tg-1', studentId: 'gita', title: 'Catat pengeluaran harian 14 hari', status: 'aktif', dimensionId: 'disiplin', progress: 65, due: future(10) },
  // Hendra
  { id: 'th-1', studentId: 'hendra', title: 'Susun laporan kas kecil mandiri', status: 'selesai', dimensionId: 'tanggung-jawab', progress: 100, due: future(-6) },
  // Indah
  { id: 'ti-1', studentId: 'indah', title: 'Selesaikan fitur login', status: 'selesai', dimensionId: 'inisiatif', progress: 100, due: future(-4) },
  { id: 'ti-2', studentId: 'indah', title: 'Review kode bersama senior tiap minggu', status: 'aktif', dimensionId: 'komunikasi-tim', progress: 50, due: future(3) },
  // Joko
  { id: 'tj-1', studentId: 'joko', title: 'Buat 3 komponen latihan', status: 'aktif', dimensionId: 'mandiri', progress: 35, due: future(9) },
  // Kiki
  { id: 'tk-1', studentId: 'kiki', title: 'Selesaikan mini game kelompok', status: 'aktif', dimensionId: 'gotong-royong', progress: 55, due: future(12) },
  // Lukman
  { id: 'tl-1', studentId: 'lukman', title: 'Kumpulkan 2 sertifikat portofolio', status: 'aktif', dimensionId: 'inisiatif', progress: 70, due: future(15) },
  { id: 'tl-2', studentId: 'lukman', title: 'Tanya 2 senior soal jalur karier', status: 'selesai', dimensionId: 'bernalar-kritis', progress: 100, due: future(-5) },
]
