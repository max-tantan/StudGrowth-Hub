import type { IconName } from '../components/ui/icons'

export interface TourStep {
  id: string
  target?: string
  route?: string
  icon: IconName
  label: string
  title: string
  body: string
}

export interface TourFeature {
  icon: IconName
  label: string
}

export interface TourIntro {
  icon: IconName
  eyebrow: string
  title: string
  body: string
  features: TourFeature[]
}

export interface TourOutro {
  title: string
  body: string
  cta: string
  ctaRoute: string
}

export const STUDENT_INTRO: TourIntro = {
  icon: 'plant',
  eyebrow: 'Panduan Ruang Tumbuh',
  title: 'Tumbuh terarah, siap berkarya',
  body: 'Enam fitur ini jadi tempat kamu merefleksikan diri, bertanya, dan menyusun portofolio. Ikuti tur singkat ini, atau langsung mulai menulis jurnal pertama.',
  features: [
    { icon: 'home', label: 'Beranda' },
    { icon: 'journal', label: 'Jurnal' },
    { icon: 'consult', label: 'Konsultasi' },
    { icon: 'plant', label: 'Tumbuh' },
    { icon: 'resume', label: 'Resume' },
    { icon: 'briefcase', label: 'PKL' },
  ],
}

export const STUDENT_TOUR: TourStep[] = [
  {
    id: 'beranda',
    target: 'student-beranda',
    route: '/beranda',
    icon: 'home',
    label: 'Beranda',
    title: 'Satu layar untuk melihat hari ini',
    body: 'Beranda merangkum rantutan hari, jumlah jurnal, skor karakter, dan kesiapan kerja. Di sini juga ada prompt refleksi dan satu aksi kecil untuk hari ini.',
  },
  {
    id: 'mulai',
    target: 'student-mulai',
    route: '/beranda',
    icon: 'note',
    label: 'Mulai dari sini',
    title: 'Tulis jurnal dalam satu ketukan',
    body: 'Buka jurnal dengan prompt hari ini. Tidak perlu panjang: mood, satu hal yang kamu pelajari, dan satu bukti konkret sudah cukup.',
  },
  {
    id: 'jurnal',
    target: 'student-jurnal',
    route: '/jurnal',
    icon: 'journal',
    label: 'Jurnal',
    title: 'Catatan harian yang jadi bahan penilaian',
    body: 'Setiap entri menyimpan mood, dimensi karakter yang kamu bangun, dan bukti. Dari jurnal ini skor, lencana, dan ringkasan resume dihitung otomatis.',
  },
  {
    id: 'konsultasi',
    target: 'student-konsultasi',
    route: '/konsultasi',
    icon: 'robot',
    label: 'Konsultasi',
    title: 'Tanya asisten, bukan asal internet',
    body: 'Pilih mode Refleksi, Belajar, Sosial dan Emosi, Karier, atau PKL. Jawabannya diberikan sebagai coaching. Kalau muncul tanda bahaya, guru menerima alert.',
  },
  {
    id: 'tumbuh',
    target: 'student-tumbuh',
    route: '/perkembangan',
    icon: 'plant',
    label: 'Tumbuh',
    title: 'Lihat hasilmu dalam radar',
    body: 'Enam dimensi Profil Pelajar Pancasila dan enam dimensi Kesiapan Kerja. Buka lencana yang sudah terbuka, lalu tetapkan target untuk minggu depan.',
  },
  {
    id: 'resume',
    target: 'student-resume',
    route: '/resume',
    icon: 'certificate',
    label: 'Resume',
    title: 'Portofolio yang siap dibaca orang lain',
    body: 'Resume mingguan dirangkum otomatis dari jurnalmu, lengkap dengan catatan PKL. Inilah yang dibaca guru di halaman Review Resume.',
  },
  {
    id: 'pkl',
    target: 'student-pkl',
    route: '/pkl',
    icon: 'briefcase',
    label: 'PKL',
    title: 'Catat pengalaman praktikmu',
    body: 'Simpan catatan PKL setiap minggu: apa yang kamu kerjakan, apa yang kamu pelajari, dan apa yang masih perlu diperbaiki. Catatan ini ikut masuk ke resume.',
  },
  {
    id: 'profil',
    target: 'student-profil',
    route: '/profil',
    icon: 'users',
    label: 'Profil',
    title: 'Data, pengaturan, dan akses cepat',
    body: 'Di sini kamu ganti akun demo, mengatur ukuran teks, mode buta warna, dan notifikasi. Tombol Atur ulang data demo juga ada di halaman ini.',
  },
]

export const STUDENT_OUTRO: TourOutro = {
  title: 'Tur selesai, sekarang giliranmu',
  body: 'Mulai dari satu entri jurnal hari ini. Sisanya akan terlihat sendiri saat rutinitasmu terbentuk.',
  cta: 'Tulis jurnal sekarang',
  ctaRoute: '/jurnal/baru',
}

export const TEACHER_INTRO: TourIntro = {
  icon: 'compass',
  eyebrow: 'Panduan Ruang Guru',
  title: 'Satu tempat untuk mendampingi murid',
  body: 'Lima modul ini mencakup monitoring harian sampai review resume mingguan. Tur singkat ini menunjukkan di mana masing-masing fitur berada.',
  features: [
    { icon: 'trend', label: 'Dasbor' },
    { icon: 'resume', label: 'Review Resume' },
    { icon: 'shieldWarning', label: 'Alert Risiko' },
    { icon: 'users3', label: 'Murid' },
    { icon: 'briefcase', label: 'Monitoring PKL' },
  ],
}

export const TEACHER_TOUR: TourStep[] = [
  {
    id: 'dasbor',
    target: 'teacher-dasbor',
    route: '/guru',
    icon: 'trend',
    label: 'Dasbor',
    title: 'Ringkasan yang bisa dipakai saat briefing',
    body: 'Jumlah murid binaan, antrean review, alert aktif, dan sebaran jurusan terangkum di satu halaman. Dari sini kamu langsung bisa membuka review atau alert.',
  },
  {
    id: 'antrean',
    target: 'teacher-antrean',
    route: '/guru',
    icon: 'clipboard',
    label: 'Antrean review',
    title: 'Mulai dari murid yang paling perlu ditemani',
    body: 'Antrean diurutkan dari jumlah jurnal minggu ini, jadi murid yang paling jarang menulis muncul lebih dulu. Buka review, beri catatan, lalu tandai selesai.',
  },
  {
    id: 'alert-kartu',
    target: 'teacher-alert-kartu',
    route: '/guru',
    icon: 'shieldWarning',
    label: 'Alert risiko',
    title: 'Tanda bahaya yang muncul otomatis',
    body: 'Konsultasi murid yang menunjukkan tanda bahaya menjadi alert di sini. Prioritas tinggi ditandai warna merah agar bisa ditindak lebih cepat.',
  },
  {
    id: 'review',
    target: 'teacher-review',
    route: '/guru/review',
    icon: 'resume',
    label: 'Review Resume',
    title: 'Baca resume mingguan murid',
    body: 'Resume berisi ringkasan jurnal, nilai dimensi, dan catatan PKL. Beri catatan agar murid tahu bagian mana yang perlu diperbaiki minggu depan.',
  },
  {
    id: 'alert',
    target: 'teacher-alert',
    route: '/guru/alert',
    icon: 'shieldWarning',
    label: 'Alert Risiko',
    title: 'Triage alert satu per satu',
    body: 'Setiap alert menjelaskan tandanya, kapan muncul, dan konteks konsultasinya. Tutup yang sudah ditangani supaya tidak menumpuk.',
  },
  {
    id: 'murid',
    target: 'teacher-murid',
    route: '/guru/murid',
    icon: 'users3',
    label: 'Murid',
    title: 'Semua murid dalam satu daftar',
    body: 'Cari nama, filter jurusan, kelas, atau status PKL. Buka profil untuk melihat jurnal, skor, dan riwayat konsultasinya.',
  },
  {
    id: 'pkl',
    target: 'teacher-pkl',
    route: '/guru/pkl',
    icon: 'briefcase',
    label: 'Monitoring PKL',
    title: 'Pantau murid yang sedang praktik',
    body: 'Lihat tempat praktik, catatan mingguan, dan kelengkapan portofolio setiap murid PKL supaya pendampingan tetap berjalan.',
  },
  {
    id: 'aktivitas',
    target: 'teacher-aktivitas',
    route: '/guru',
    icon: 'journal',
    label: 'Aktivitas terbaru',
    title: 'Jurnal terbaru dari muridmu',
    body: 'Aktivitas terbaru menampilkan jurnal terbaru dari murid dalam lingkupmu. Ini cara cepat untuk tahu siapa yang sedang aktif menulis.',
  },
]

export const TEACHER_OUTRO: TourOutro = {
  title: 'Tur selesai, siap mendampingi',
  body: 'Cek antrean review lebih dulu. Murid yang paling jarang menulis biasanya paling butuh pendampingan.',
  cta: 'Buka antrean review',
  ctaRoute: '/guru/review',
}

export const TOUR_COPY = {
  student: { intro: STUDENT_INTRO, steps: STUDENT_TOUR, outro: STUDENT_OUTRO },
  teacher: { intro: TEACHER_INTRO, steps: TEACHER_TOUR, outro: TEACHER_OUTRO },
} as const
