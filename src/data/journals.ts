import type { JournalEntry, MoodLevel } from '../types'
import { daysAgo } from '../lib/format'

interface Opts {
  prompt?: string
  evidence?: string
  pkl?: boolean
  tags?: string[]
}

function j(
  id: string,
  studentId: string,
  ago: number,
  title: string,
  body: string,
  mood: MoodLevel,
  dimensions: string[],
  opts: Opts = {},
): JournalEntry {
  return {
    id,
    studentId,
    date: daysAgo(ago, 18, 10 + (ago % 40)),
    title,
    body,
    mood,
    dimensions,
    ...opts,
  }
}

export const SEED_JOURNALS: JournalEntry[] = [
  // ---------------- Anisa — Perhotelan XI, sedang PKL ----------------
  j('an-1', 'anisa', 1, 'Tamu mengeluh AC kamar dingin', 'Seorang tamu menelepon dan kesal karena AC kamarnya tidak dingin. Aku awalnya panik, tapi aku tarik napas, mendengarkan dulu sampai selesai, lalu mencatat kamarnya dan langsung menghubungi engineering. Tamu jadi lebih tenang setelah aku jelaskan dan kabari perkembangannya. Belajar: orang marah biasanya cuma ingin didengar.', 'biasa', ['adaptasi', 'etika-profesi', 'komunikasi-tim'], { pkl: true, prompt: 'Momen apa yang membuatmu perlu tetap tenang saat menghadapi tamu?', tags: ['tamu', 'komplain'] }),
  j('an-2', 'anisa', 2, 'Latihan set up meja untuk banquet', 'Hari ini aku belajar menata meja untuk 80 tamu. Rapi itu tidak bisa asal. Aku salah menaruh satu garpu dan pembimbing mengoreksi. Aku benerin sambil mencatat urutannya supaya tidak salah lagi.', 'baik', ['disiplin', 'gotong-royong'], { pkl: true, tags: ['banquet'] }),
  j('an-3', 'anisa', 3, 'Sapa tamu pagi ini', 'Aku coba sapa dan senyum ke tiga tamu berbeda seperti aksi kecil minggu lalu. Dua balas ramah, satu cuma angguk. Ternyata keberanian menyapa itu bisa dilatih.', 'sangat-baik', ['gotong-royong', 'komunikasi-tim'], { pkl: true, prompt: 'Kapan hari ini kamu melayani seseorang dengan baik?' }),
  j('an-4', 'anisa', 5, 'Salah catat nomor kamar pesanan', 'Aku hampir mengantar pesanan sarapan ke kamar yang salah. Untung aku cek ulang nomornya di sistem. Ternyata tamu pindah kamar. Pelajaran: cek ulang sebelum bertindak itu menyelamatkan.', 'kurang', ['tanggung-jawab', 'bernalar-kritis'], { pkl: true, prompt: 'Kesalahan kecil apa yang berhasil kamu tangkap hari ini?', tags: ['ceklis'] }),
  j('an-5', 'anisa', 7, 'Shift malam pertama', 'Shift malam itu berat, ngantuk banget. Aku bikin jadwal istirahat kecil dan minum air biar tetap fokus. Aku berhasil melewati malam tanpa kesalahan catat.', 'biasa', ['adaptasi', 'disiplin'], { pkl: true, tags: ['shift'] }),
  j('an-6', 'anisa', 9, 'Bantu rekan housekeeping', 'Rekan regu kelabakan karena satu kamar kekurangan handuk. Aku bantu ambil dan anterin walau itu bukan tugas utamaku. Dia bilang terima kasih, dan pekerjaan jadi cepat selesai.', 'baik', ['gotong-royong', 'komunikasi-tim'], { pkl: true }),
  j('an-7', 'anisa', 12, 'Rapikan penampilan sebelum shift', 'Aku cek grooming: rambut, seragam, sepatu. Ternyata detail kecil kelihatan. Aku jadi lebih pede melayani tamu.', 'baik', ['mandiri', 'disiplin'], { prompt: 'Bagaimana kamu menjaga penampilan dan sikap selama bekerja hari ini?' }),
  j('an-8', 'anisa', 16, 'Latihan percakapan bahasa Inggris dengan tamu asing', 'Aku memberanikan diri ngobrol singkat dengan tamu asing. Kalimatku masih belepotan tapi tamunya senyum dan mengerti. Aku catat kosakata baru untuk latihan.', 'sangat-baik', ['kreatif', 'mandiri'], { evidence: 'Catatan kosakata: arrivals, towel, extension.' }),
  j('an-9', 'anisa', 20, 'Kejutan ulang tahun kecil untuk tamu', 'Tim kami menyiapkan kejutan kecil untuk tamu yang berulang tahun. Aku usul menulis kartu ucapan tangan. Tamunya senang sekali. Ide kecil bisa bikin hari orang lain lebih baik.', 'sangat-baik', ['kreatif', 'beriman']),
  j('an-10', 'anisa', 26, 'Kenapa aku pilih Perhotelan', 'Awal masuk aku ragu. Tapi aku sadar aku suka ketemu banyak orang dan bikin mereka nyaman. Aku mau jadi front office yang bisa dipercaya.', 'baik', ['mandiri', 'beriman'], { prompt: 'Apa yang membuatmu bertahan di jurusan ini?' }),

  // ---------------- Dimas — Perhotelan XI, sedang PKL ----------------
  j('di-1', 'dimas', 2, 'Menangani checkout cepat saat ramai', 'Antrean panjang banget sore ini. Aku bantu percepat proses checkout dan tetap pastikan tidak ada tagihan yang terlewat. Tegang tapi seru.', 'baik', ['adaptasi', 'disiplin', 'tanggung-jawab'], { pkl: true }),
  j('di-2', 'dimas', 6, 'Belajar komunikasi dengan atasan', 'Aku gugup waktu harus lapor ke supervisor. Ternyata kalau laporan singkat dan jelas, dia mengerti cepat. Aku latih buat laporan satu menit.', 'biasa', ['komunikasi-tim', 'etika-profesi'], { pkl: true }),
  j('di-3', 'dimas', 13, 'Kesalahan kecil di bill tamu', 'Aku hampir salah memasukkan item ke tagihan. Aku sadar karena aku cek lagi totalnya. Jujur ke supervisor walau takut dimarahi, dan dia malah menghargai kejujuranku.', 'kurang', ['etika-profesi', 'bernalar-kritis'], { pkl: true }),

  // ---------------- Citra — Perhotelan XII, selesai PKL ----------------
  j('ci-1', 'citra', 4, 'Persiapan uji kompetensi front office', 'Aku latihan simulasi check-in untuk uji kompetensi minggu depan. Aku rekam diriku sendiri buat lihat kekurangan. Masih kaku tapi makin percaya diri.', 'baik', ['mandiri', 'disiplin', 'kreatif'], { evidence: 'Rekaman simulasi check-in.' }),
  j('ci-2', 'citra', 11, 'Membuat ringkasan pengalaman PKL', 'Aku rangkum pengalaman PKL di Hotel Aryaduta untuk portofolio: apa yang dipelajari, kendala, dan hasilnya. Rasanya lega punya bukti nyata.', 'sangat-baik', ['bernalar-kritis', 'tanggung-jawab'], { pkl: true }),
  j('ci-3', 'citra', 19, 'Tamu sulit yang akhirnya puas', 'Ada tamu yang sangat rewel soal kamar. Aku tetap tenang, menawarkan solusi, dan akhirnya dia mengucapkan terima kasih. Momen paling membanggakan selama PKL.', 'sangat-baik', ['adaptasi', 'komunikasi-tim']),

  // ---------------- Bagas — Perhotelan X ----------------
  j('ba-1', 'bagas', 3, 'Praktik pertama di lab housekeeping', 'Aku baru pertama praktik merapikan tempat tidur. Hasilnya masih berkerut tapi pembimbing bilang sudah lumayan untuk awal. Aku mau latihan tiap hari.', 'baik', ['disiplin', 'gotong-royong']),
  j('ba-2', 'bagas', 10, 'Belajar nama peralatan', 'Banyak banget nama alat yang harus dihafal. Aku bikin catatan kecil dan kuis sendiri sama teman. Jadi lebih cepat hafal.', 'biasa', ['mandiri', 'kreatif']),

  // ---------------- Eka — Akuntansi XI ----------------
  j('ek-1', 'eka', 2, 'Menemukan selisih kecil di jurnal', 'Aku cek ulang jurnal praktik dan menemukan selisih 5.000 rupiah. Kelihatannya sepele tapi aku jadi paham pentingnya teliti. Ternyata salah input satu nol.', 'baik', ['bernalar-kritis', 'etika-profesi'], { prompt: 'Kesalahan kecil apa yang berhasil kamu tangkap hari ini?' }),
  j('ek-2', 'eka', 8, 'Belajar Excel rumus dasar', 'Aku belajar SUM dan IF sendiri lewat video. Aku pakai buat bantu kelompok membuat rekap. Jadi lebih cepat.', 'sangat-baik', ['mandiri', 'kreatif']),
  j('ek-3', 'eka', 15, 'Rapat kelompok proyek kewirausahaan', 'Kelompok kami berdebat soal pembagian biaya. Aku jadi penengah dan kami sepakat membuat catatan bersama. Lega bisa menyelesaikan tanpa ribut.', 'biasa', ['komunikasi-tim', 'gotong-royong']),

  // ---------------- Fajar — Akuntansi XII, sedang PKL ----------------
  j('fa-1', 'fajar', 1, 'Hari pertama PKL di KPP', 'Deg-degan banget hari pertama. Aku ditugaskan mengarsip dokumen. Aku pelajari alur nomor berkas supaya tidak salah susun.', 'biasa', ['disiplin', 'adaptasi'], { pkl: true }),
  j('fa-2', 'fajar', 5, 'Diajari konsistensi tanda tangan', 'Pembimbing PKL menegur karena kelengkapan berkas. Aku belajar kalau satu kolom kosong bisa jadi masalah besar. Sekarang aku cek daftar periksa sebelum menyerahkan.', 'kurang', ['etika-profesi', 'tanggung-jawab'], { pkl: true }),
  j('fa-3', 'fajar', 12, 'Membantu rekap data bulanan', 'Aku bantu rekap data dan mendapat kesempatan belajar langsung. Rasanya teori di sekolah nyambung di sini.', 'sangat-baik', ['inisiatif', 'bernalar-kritis'], { pkl: true }),

  // ---------------- Gita — Akuntansi X ----------------
  j('gi-1', 'gita', 4, 'Praktik mencatat transaksi kecil', 'Aku catat pengeluaran pribadi seminggu sebagai latihan. Aku sadar uang jajan cepat habis kalau tidak dicatat. Lucu tapi berguna.', 'baik', ['mandiri', 'disiplin']),
  j('gi-2', 'gita', 13, 'Belajar teliti dari permainan', 'Guru mengadakan permainan mencari kesalahan data. Aku jadi ketiga tercepat. Seru karena belajar teliti sambil santai.', 'sangat-baik', ['bernalar-kritis', 'kreatif']),

  // ---------------- Hendra — Akuntansi XI, selesai PKL ----------------
  j('he-1', 'hendra', 6, 'Menyusun laporan kas kecil', 'Aku dipercaya menyusun laporan kas kecil sendiri. Awalnya bingung, tapi aku urutkan bertahap dan hasilnya diperiksa pembimbing dengan sedikit koreksi.', 'baik', ['tanggung-jawab', 'etika-profesi'], { pkl: true }),
  j('he-2', 'hendra', 14, 'Menjaga kejujuran saat ada selisih', 'Ada selisih uang fisik dan catatan. Aku langsung laporkan walau takut disalahkan. Ternyata pembimbing malah bangga dengan sikapku.', 'sangat-baik', ['etika-profesi', 'beriman']),

  // ---------------- Indah — PPLG XII, sedang PKL ----------------
  j('in-1', 'indah', 1, 'Bug yang bikin stuck dua hari', 'Aku stuck dua hari karena satu error. Ternyata masalahnya cuma salah nama variabel. Frustrasi tapi lega. Aku belajar untuk baca pesan error lebih teliti.', 'kurang', ['adaptasi', 'bernalar-kritis'], { pkl: true }),
  j('in-2', 'indah', 4, 'Membantu teman satu tim', 'Teman magangku bingung soal Git. Aku ajari cara pull dan push. Dia akhirnya bisa mandiri. Aku jadi lebih paham karena mengajari orang lain.', 'sangat-baik', ['komunikasi-tim', 'gotong-royong'], { pkl: true }),
  j('in-3', 'indah', 10, 'Menyelesaikan fitur login', 'Aku akhirnya menyelesaikan fitur login sendiri. Rasanya puas saat tes berhasil. Aku rapikan kodenya dan minta review senior.', 'sangat-baik', ['inisiatif', 'kreatif'], { pkl: true, evidence: 'Pull request #12.' }),

  // ---------------- Joko — PPLG XI ----------------
  j('jo-1', 'joko', 3, 'Hari pertama belajar React', 'Aku belajar membuat komponen pertama. Awalnya bingung props, tapi setelah praktik langsung aku mulai paham. Besok mau bikin yang lebih rumit.', 'baik', ['mandiri', 'bernalar-kritis']),
  j('jo-2', 'joko', 9, 'Belajar dari kesalahan kode', 'Kodeku error karena salah tanda kurung. Klasik banget. Aku belajar pakai linter biar ketangkap lebih awal.', 'biasa', ['adaptasi', 'bernalar-kritis']),

  // ---------------- Kiki — PPLG X ----------------
  j('ki-1', 'kiki', 2, 'Praktik logika pemrograman', 'Hari ini aku belajar logika if-else lewat latihan membuat kalkulator sederhana. Seru walau sempat bingung.', 'baik', ['bernalar-kritis', 'kreatif']),
  j('ki-2', 'kiki', 11, 'Kerja kelompok membuat mini game', 'Aku kebagian desain tingkat. Aku belajar mendengarkan ide teman yang beda dan menggabungkannya.', 'sangat-baik', ['gotong-royong', 'komunikasi-tim', 'kreatif']),

  // ---------------- Lukman — PPLG XII, selesai PKL ----------------
  j('lu-1', 'lukman', 5, 'Menyelesaikan proyek PKL tepat waktu', 'Proyek terakhir PKL-ku selesai tepat waktu. Aku belajar manajemen waktu dan komunikasi dengan klien. Bangga bisa dipercaya.', 'sangat-baik', ['disiplin', 'tanggung-jawab', 'inisiatif'], { pkl: true }),
  j('lu-2', 'lukman', 13, 'Refleksi mau kerja atau kuliah', 'Aku lagi bimbang antara kerja atau kuliah setelah lulus. Aku mulai kumpulkan portofolio dan tanya senior. Belum pasti, tapi arahnya mulai jelas.', 'biasa', ['mandiri', 'bernalar-kritis']),
]
