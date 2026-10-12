# KONTEKS SEKOLAH (TAMBAHKAN DI BAWAH "PERAN", MENGGANTIKAN ASUMSI JENJANG UMUM)
Pengguna: siswa SMK Yadika, kelas X, XI, XII (usia sekitar 15-18 tahun).
Jurusan (sesuaikan penamaan dengan yang dipakai sekolah):
- Perhotelan (Akomodasi Perhotelan)
- Akuntansi (Akuntansi dan Keuangan Lembaga)
- PPLG (Pengembangan Perangkat Lunak dan Gim)
Konteks khas SMK yang harus tercermin di aplikasi: praktik di bengkel/lab,
proyek kelompok, uji kompetensi, sertifikasi, PKL di dunia usaha/industri
(biasanya kelas XI-XII), dan persiapan kerja/kuliah/wirausaha.

# GAYA BAHASA & NADA (MENGGANTIKAN ASUMSI NADA UMUM)
- Antarmuka dan AI memakai Bahasa Indonesia santai-sopan, sapaan "kamu".
  Hindari bahasa kekanak-kanakan dan hindari terlalu formal/menggurui.
- Perlakukan murid sebagai calon profesional muda. Boleh ada sedikit humor ringan.
- Tidak ada ilustrasi bergaya anak SD. Gaya visual tetap clean ala iOS, dewasa
  muda, dan modern.

# DIMENSI KARAKTER (MENGGANTIKAN 6 DIMENSI SAJA)
Tetap pakai 6 dimensi Profil Pelajar Pancasila sebagai dimensi utama, lalu
tambahkan lapisan "Kesiapan Kerja" (work readiness) sebagai dimensi turunan
untuk SMK. Radar chart utama = 6 dimensi PPP. Tambahkan radar kedua / tab
terpisah "Kesiapan Kerja" dengan 6 sumbu:
1. Disiplin & tepat waktu
2. Tanggung jawab
3. Etika profesi & integritas
4. Komunikasi & kerja tim
5. Inisiatif & problem solving
6. Adaptasi & ketahanan (resilience)
Setiap jurnal/aksi/klaim resume dapat dipetakan ke dimensi PPP dan/atau
dimensi kesiapan kerja.

# KONTEKS PER JURUSAN
Simpan di src/config/majors.ts. Dipakai untuk personalisasi prompt jurnal,
saran aksi AI, contoh mock data, dan lencana.

PERHOTELAN
- Nilai kunci: service excellence, keramahan (hospitality), grooming dan
  penampilan profesional, ketenangan menghadapi tamu sulit, kerja shift.
- Contoh prompt refleksi: "Kapan hari ini kamu melayani seseorang dengan baik?"
- Contoh aksi kecil: "Latih senyum dan sapa tiga orang berbeda besok pagi."
- Lencana: "Pelayan Teladan", "Tenang Saat Tekanan".

AKUNTANSI
- Nilai kunci: ketelitian, kejujuran dan integritas data, kerapian, tanggung
  jawab atas angka, kepatuhan prosedur.
- Contoh prompt refleksi: "Kesalahan kecil apa yang berhasil kamu tangkap
  hari ini, dan bagaimana kamu menemukannya?"
- Contoh aksi kecil: "Cek ulang satu pekerjaanmu sebelum dikumpulkan."
- Lencana: "Teliti Sampai Detail", "Jujur pada Angka".

PPLG
- Nilai kunci: logika dan problem solving, ketekunan menghadapi bug, kolaborasi
  tim (pembagian tugas, review kode), belajar mandiri, kreativitas, etika
  digital.
- Contoh prompt refleksi: "Masalah teknis apa yang berhasil kamu pecahkan
  minggu ini, dan apa yang kamu pelajari?"
- Contoh aksi kecil: "Bantu satu teman yang tersangkut di bug-nya."
- Lencana: "Pantang Menyerah Debug", "Rekan Satu Tim".

# AI KONSULTASI: PENYESUAIAN SMK (TAMBAHAN)
Mode konsultasi diperluas menjadi:
Refleksi | Belajar & Praktik | Sosial & Emosi | Karier & Masa Depan | PKL
- Mode "Karier & Masa Depan": arah setelah lulus (kerja, kuliah, wirausaha),
  sertifikasi kompetensi, membangun portofolio sesuai jurusan.
- Mode "PKL": persiapan sebelum berangkat (etika, komunikasi dengan
  pembimbing industri, manajemen waktu), refleksi selama PKL, dan menghadapi
  kendala di tempat PKL.
- AI menyesuaikan contoh dengan jurusan murid (ambil dari majors.ts).
- AI tetap bergaya coaching (bertanya balik), bukan psikolog.

# DETEKSI RISIKO: TAMBAHAN KHAS SMK
Selain bullying, kekerasan, menyakiti diri, dan krisis, deteksi juga:
- Pelecehan atau perlakuan tidak pantas di tempat PKL/kerja.
- Eksploitasi: jam kerja berlebihan, tidak dibayar/tanpa uang saku yang
  dijanjikan, disuruh tugas di luar program dan berbahaya.
- Keselamatan kerja (kecelakaan, alat tidak aman).
- Tekanan ekonomi keluarga yang mendorong murid ingin berhenti sekolah.
- Kecanduan gim atau media sosial yang mengganggu belajar (relevan terutama
  untuk PPLG).
Untuk kasus PKL, notifikasi dikirim ke Guru BK DAN Pembimbing PKL / Kaprog.
Respons AI tetap suportif dan tidak menghakimi, serta mengarahkan murid ke
orang dewasa yang dipercaya.

# RESUME: PENYESUAIAN SMK (TAMBAHAN)
- Resume mingguan murid tetap berbasis jurnal, mood, target, dan chat yang
  diizinkan.
- Selama masa PKL, resume menambahkan bagian "Catatan PKL": kegiatan, hal yang
  dipelajari, kendala, dan masukan dari pembimbing industri (input manual
  guru).
- Resume portofolio (kelas XII): ringkasan karakter dan kesiapan kerja untuk
  CV/lamaran/beasiswa, dengan bukti berupa prestasi, proyek, sertifikat, dan
  hasil PKL. Murid dapat mengekspor sebagai PDF (mock).
- Tetap berlaku: growth mindset, tautan bukti, murid bisa menandai "kurang
  akurat", dan guru mereview sebelum dipublikasikan.

# PERAN PENGGUNA DI MODUL GURU (MENGGANTIKAN HANYA "GURU")
Role: Wali Kelas, Guru BK, Guru Produktif/Pembimbing Jurusan, Pembimbing PKL,
Kaprog (kepala program keahlian), Admin.
- Wali Kelas: review resume mingguan murid binaannya (peran utama alur mingguan).
- Guru BK: menerima eskalasi dan alert risiko.
- Pembimbing PKL: melihat murid yang sedang PKL dan menerima alert terkait PKL.
- Kaprog: melihat tren agregat per jurusan (tanpa data pribadi/isi curhat).
Tambahkan filter berdasarkan jurusan, kelas, dan status PKL di antrean review.

# MODEL DATA: TAMBAHAN
Student: tambahkan major ('PERHOTELAN'|'AKUNTANSI'|'PPLG'), grade ('X'|'XI'|
'XII'), pklStatus ('belum'|'sedang'|'selesai'), pklPlacement.
CharacterDimension: tambahkan kelompok 'PPP' | 'WORK_READINESS'.
ChatSession.mode: tambahkan 'KARIER' dan 'PKL'.
Teacher.role: tambahkan role di atas.
Mock data: minimal 12 murid (4 per jurusan) dengan variasi kelas dan status PKL,
jurnal dan chat realistis sesuai konteks tiap jurusan.

# UI: PENYESUAIAN
- Onboarding: murid memilih jurusan dan kelas (atau terisi otomatis dari
  data sekolah). Beranda menampilkan kartu konteks jurusan (target, lencana).
- Tab "Perkembangan" memiliki dua sub-tab: "Karakter" dan "Kesiapan Kerja".
- Layar penjelasan privasi di onboarding menyebut juga bahwa hal yang
  berkaitan dengan keselamatan di PKL bisa diteruskan ke guru yang berwenang.