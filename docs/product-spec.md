# Spesifikasi Produk — Ruang Tumbuh (StudGrowth Hub)

Dokumen ini adalah sumber kebenaran untuk kebutuhan produk: konteks sekolah,
gaya bahasa, dimensi penilaian, mode AI, deteksi risiko, hingga peran guru.
Untuk implementasi teknis, lihat [`architecture.md`](architecture.md) dan
[`data-model.md`](data-model.md).

## Daftar Isi

1. [Konteks sekolah](#1-konteks-sekolah)
2. [Gaya bahasa & nada](#2-gaya-bahasa--nada)
3. [Dimensi karakter & kesiapan kerja](#3-dimensi-karakter--kesiapan-kerja)
4. [Konteks per jurusan](#4-konteks-per-jurusan)
5. [AI konsultasi](#5-ai-konsultasi)
6. [Deteksi risiko khas SMK](#6-deteksi-risiko-khas-smk)
7. [Resume & portofolio](#7-resume--portofolio)
8. [Peran pengguna di modul guru](#8-peran-pengguna-di-modul-guru)
9. [Model data](#9-model-data)
10. [Penyesuaian UI](#10-penyesuaian-ui)

---

## 1. Konteks sekolah

Pengguna: siswa SMK Yadika, kelas X, XI, XII (usia sekitar 15–18 tahun).

Jurusan (sesuaikan penamaan dengan yang dipakai sekolah):

- **Perhotelan** — Akomodasi Perhotelan
- **Akuntansi** — Akuntansi dan Keuangan Lembaga
- **PPLG** — Pengembangan Perangkat Lunak dan Gim

Konteks khas SMK yang harus tercermin di aplikasi: praktik di bengkel/lab,
proyek kelompok, uji kompetensi, sertifikasi, PKL di dunia usaha/industri
(biasanya kelas XI–XII), dan persiapan kerja/kuliah/wirausaha.

## 2. Gaya bahasa & nada

- Antarmuka dan AI memakai Bahasa Indonesia santai-sopan, sapaan "kamu".
  Hindari bahasa kekanak-kanakan dan hindari terlalu formal/menggurui.
- Perlakukan murid sebagai calon profesional muda. Boleh ada sedikit humor ringan.
- Tidak ada ilustrasi bergaya anak SD. Gaya visual tetap clean ala iOS, dewasa
  muda, dan modern.

## 3. Dimensi karakter & kesiapan kerja

Dimensi utama tetap memakai **6 dimensi Profil Pelajar Pancasila (PPP)**.
Sebagai lapisan turunan untuk SMK ditambahkan **Kesiapan Kerja (work readiness)**
dengan 6 sumbu. Radar chart utama = 6 dimensi PPP; tersedia tab/radar kedua
"Kesiapan Kerja".

**PPP (Karakter)**

1. Beriman, Bertakwa, Berakhlak Mulia
2. Berkebinekaan Global
3. Bergotong Royong
4. Mandiri
5. Bernalar Kritis
6. Kreatif

**Kesiapan Kerja**

1. Disiplin & tepat waktu
2. Tanggung jawab
3. Etika profesi & integritas
4. Komunikasi & kerja tim
5. Inisiatif & problem solving
6. Adaptasi & ketahanan (resilience)

Setiap jurnal/aksi/klaim resume dapat dipetakan ke dimensi PPP dan/atau dimensi
kesiapan kerja. Definisi teknis ada di `src/config/dimensions.ts`.

## 4. Konteks per jurusan

Disimpan di `src/config/majors.ts`. Dipakai untuk personalisasi prompt jurnal,
saran aksi AI, contoh mock data, dan lencana.

### Perhotelan

- **Nilai kunci:** service excellence, keramahan (hospitality), grooming dan
  penampilan profesional, ketenangan menghadapi tamu sulit, kerja shift.
- **Contoh prompt refleksi:** "Kapan hari ini kamu melayani seseorang dengan baik?"
- **Contoh aksi kecil:** "Latih senyum dan sapa tiga orang berbeda besok pagi."
- **Lencana:** "Pelayan Teladan", "Tenang Saat Tekanan".

### Akuntansi

- **Nilai kunci:** ketelitian, kejujuran dan integritas data, kerapian, tanggung
  jawab atas angka, kepatuhan prosedur.
- **Contoh prompt refleksi:** "Kesalahan kecil apa yang berhasil kamu tangkap
  hari ini, dan bagaimana kamu menemukannya?"
- **Contoh aksi kecil:** "Cek ulang satu pekerjaanmu sebelum dikumpulkan."
- **Lencana:** "Teliti Sampai Detail", "Jujur pada Angka".

### PPLG

- **Nilai kunci:** logika dan problem solving, ketekunan menghadapi bug, kolaborasi
  tim (pembagian tugas, review kode), belajar mandiri, kreativitas, etika digital.
- **Contoh prompt refleksi:** "Masalah teknis apa yang berhasil kamu pecahkan
  minggu ini, dan apa yang kamu pelajari?"
- **Contoh aksi kecil:** "Bantu satu teman yang tersangkut di bug-nya."
- **Lencana:** "Pantang Menyerah Debug", "Rekan Satu Tim".

## 5. AI konsultasi

Mode konsultasi:

`Refleksi | Belajar & Praktik | Sosial & Emosi | Karier & Masa Depan | PKL`

- Mode **Karier & Masa Depan**: arah setelah lulus (kerja, kuliah, wirausaha),
  sertifikasi kompetensi, membangun portofolio sesuai jurusan.
- Mode **PKL**: persiapan sebelum berangkat (etika, komunikasi dengan pembimbing
  industri, manajemen waktu), refleksi selama PKL, dan menghadapi kendala di
  tempat PKL.
- AI menyesuaikan contoh dengan jurusan murid (mengambil dari `majors.ts`).
- AI tetap bergaya coaching (bertanya balik), bukan psikolog.

Implementasi balasan ada di `src/lib/ai.ts` (rule-based, lihat
[`scoring-and-risk.md`](scoring-and-risk.md)).

## 6. Deteksi risiko khas SMK

Selain bullying, kekerasan, menyakiti diri, dan krisis, deteksi juga mencakup:

- Pelecehan atau perlakuan tidak pantas di tempat PKL/kerja.
- Eksploitasi: jam kerja berlebihan, tidak dibayar/tanpa uang saku yang
  dijanjikan, disuruh tugas di luar program dan berbahaya.
- Keselamatan kerja (kecelakaan, alat tidak aman).
- Tekanan ekonomi keluarga yang mendorong murid ingin berhenti sekolah.
- Kecanduan gim atau media sosial yang mengganggu belajar (relevan terutama
  untuk PPLG).

Untuk kasus PKL, notifikasi dikirim ke **Guru BK** dan **Pembimbing PKL / Kaprog**.
Respons AI tetap suportif dan tidak menghakimi, serta mengarahkan murid ke orang
dewasa yang dipercaya.

## 7. Resume & portofolio

- Resume mingguan murid berbasis jurnal, mood, target, dan chat yang diizinkan.
- Selama masa PKL, resume menambahkan bagian **"Catatan PKL"**: kegiatan, hal yang
  dipelajari, kendala, dan masukan dari pembimbing industri (input manual guru).
- Resume portofolio (kelas XII): ringkasan karakter dan kesiapan kerja untuk
  CV/lamaran/beasiswa, dengan bukti berupa prestasi, proyek, sertifikat, dan
  hasil PKL. Murid dapat mengekspor sebagai PDF (mock).
- Tetap berlaku: growth mindset, tautan bukti, murid bisa menandai "kurang
  akurat", dan guru mereview sebelum dipublikasikan.

## 8. Peran pengguna di modul guru

Role: **Wali Kelas, Guru BK, Guru Produktif/Pembimbing Jurusan, Pembimbing PKL,
Kaprog (kepala program keahlian), Admin.**

- **Wali Kelas**: review resume mingguan murid binaannya (peran utama alur mingguan).
- **Guru BK**: menerima eskalasi dan alert risiko.
- **Pembimbing PKL**: melihat murid yang sedang PKL dan menerima alert terkait PKL.
- **Kaprog**: melihat tren agregat per jurusan (tanpa data pribadi/isi curhat).

Filter berdasarkan jurusan, kelas, dan status PKL tersedia di antrean review.

> Catatan implementasi: enum saat ini membedakan `WALI_KELAS`, `GURU_BK`,
> `PEMBIMBING_PKL`, `KAPROG`, `ADMIN`. Cakupan data per-role didokumentasikan di
> [`roles-and-routing.md`](roles-and-routing.md).

## 9. Model data

- **Student**: tambahkan `major` (`PERHOTELAN` | `AKUNTANSI` | `PPLG`), `grade`
  (`X` | `XI` | `XII`), `pklStatus` (`belum` | `sedang` | `selesai`), `pklPlacement`.
- **CharacterDimension**: tambahkan kelompok `PPP` | `WORK_READINESS`.
- **ChatSession.mode**: tambahkan `KARIER` dan `PKL`.
- **Teacher.role**: memakai role di atas.
- **Mock data**: minimal 12 murid (4 per jurusan) dengan variasi kelas dan status
  PKL, jurnal dan chat realistis sesuai konteks tiap jurusan.

Definisi tipe lengkap ada di [`data-model.md`](data-model.md).

## 10. Penyesuaian UI

- **Onboarding**: murid memilih jurusan dan kelas (atau terisi otomatis dari data
  sekolah). Beranda menampilkan kartu konteks jurusan (target, lencana).
- Tab **Perkembangan** memiliki dua sub-tab: "Karakter" dan "Kesiapan Kerja".
- Layar penjelasan privasi di onboarding menyebut juga bahwa hal yang berkaitan
  dengan keselamatan di PKL bisa diteruskan ke guru yang berwenang.
