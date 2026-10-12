import type { Major, MajorConfig } from '../types'

export const MAJORS: Record<Major, MajorConfig> = {
  PERHOTELAN: {
    id: 'PERHOTELAN',
    name: 'Perhotelan',
    fullName: 'Akomodasi Perhotelan',
    tagline: 'Ramah, rapi, dan tenang di setiap situasi.',
    values: [
      'Service excellence',
      'Keramahan (hospitality)',
      'Grooming & penampilan profesional',
      'Ketenangan menghadapi tamu sulit',
      'Kerja shift',
    ],
    reflectionPrompts: [
      'Kapan hari ini kamu melayani seseorang dengan baik?',
      'Momen apa yang membuatmu perlu tetap tenang saat menghadapi tamu?',
      'Detail kecil apa yang kamu rapikan demi kenyamanan orang lain?',
      'Bagaimana kamu menjaga penampilan dan sikap selama bekerja hari ini?',
    ],
    smallActions: [
      'Latih senyum dan sapa tiga orang berbeda besok pagi.',
      'Rapikan satu area bersama teman regu sebelum pulang.',
      'Tanyakan kebutuhan satu tamu sebelum ia memintanya.',
    ],
    portfolioFocus: [
      'Layanan tamu (front office / housekeeping)',
      'Penanganan keluhan tamu',
      'Kerja regu & shift',
    ],
  },
  AKUNTANSI: {
    id: 'AKUNTANSI',
    name: 'Akuntansi',
    fullName: 'Akuntansi dan Keuangan Lembaga',
    tagline: 'Teliti pada angka, jujur pada data.',
    values: [
      'Ketelitian',
      'Kejujuran & integritas data',
      'Kerapian',
      'Tanggung jawab atas angka',
      'Kepatuhan prosedur',
    ],
    reflectionPrompts: [
      'Kesalahan kecil apa yang berhasil kamu tangkap hari ini, dan bagaimana kamu menemukannya?',
      'Data atau langkah mana yang kamu cek ulang sebelum dipercaya orang lain?',
      'Bagaimana kamu menjaga kejujuran saat menemukan selisih?',
      'Prosedur apa yang kamu ikuti dengan disiplin hari ini?',
    ],
    smallActions: [
      'Cek ulang satu pekerjaanmu sebelum dikumpulkan.',
      'Rapikan satu berkas/dokumen agar mudah diperiksa orang lain.',
      'Catat satu pengeluaran kecil hari ini dengan rapi.',
    ],
    portfolioFocus: [
      'Penyusunan laporan keuangan sederhana',
      'Ketelitian & rekonsiliasi data',
      'Kepatuhan prosedur administrasi',
    ],
  },
  PPLG: {
    id: 'PPLG',
    name: 'PPLG',
    fullName: 'Pengembangan Perangkat Lunak dan Gim',
    tagline: 'Tekun mengejar bug, tumbuh bersama tim.',
    values: [
      'Logika & problem solving',
      'Ketekunan menghadapi bug',
      'Kolaborasi tim (pembagian tugas, review kode)',
      'Belajar mandiri',
      'Kreativitas & etika digital',
    ],
    reflectionPrompts: [
      'Masalah teknis apa yang berhasil kamu pecahkan minggu ini, dan apa yang kamu pelajari?',
      'Bagian mana dari kode/proyekmu yang membuatmu paling bangga, kenapa?',
      'Bagaimana kamu membantu atau meminta bantuan tim hari ini?',
      'Hal baru apa yang kamu pelajari sendiri tanpa disuruh?',
    ],
    smallActions: [
      'Bantu satu teman yang tersangkut di bug-nya.',
      'Rapikan satu bagian kode/aset proyek agar lebih mudah dibaca.',
      'Tulis satu catatan belajar singkat setelah sesi praktik.',
    ],
    portfolioFocus: [
      'Proyek aplikasi / gim',
      'Kolaborasi tim & review kode',
      'Belajar mandiri & etika digital',
    ],
  },
}

export const MAJOR_LIST: MajorConfig[] = [
  MAJORS.PERHOTELAN,
  MAJORS.AKUNTANSI,
  MAJORS.PPLG,
]

export const GRADE_LIST: GradeOption[] = [
  { id: 'X', label: 'Kelas X', hint: 'Awal di jurusan, banyak praktik dasar.' },
  { id: 'XI', label: 'Kelas XI', hint: 'Mulai PKL dan proyek kelompok.' },
  {
    id: 'XII',
    label: 'Kelas XII',
    hint: 'Uji kompetensi, sertifikasi, dan persiapan lulus.',
  },
]

export interface GradeOption {
  id: 'X' | 'XI' | 'XII'
  label: string
  hint: string
}
