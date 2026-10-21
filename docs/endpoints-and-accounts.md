# Daftar Rute & Akun Demo

Ruang Tumbuh berjalan **sepenuhnya di sisi klien** (mock, tanpa backend). Karena
itu "endpoint" di sini berarti **rute SPA** yang dikenali `react-router-dom`,
bukan URL API. Untuk akun, aplikasi tidak memakai kata sandi — pengguna memilih
peran lalu memilih akun yang sudah tersedia (lihat
[`roles-and-routing.md`](roles-and-routing.md)).

- Basis URL pengembangan: `http://localhost:5173` (Vite dapat berpindah port bila
  5173 terpakai).
- Data akun berasal dari `src/data/teachers.ts` dan `src/data/students.ts`.

## 1. Akun Demo

### Guru

Pilih tab **Guru** di `/masuk`, lalu pilih salah satu akun. Tidak ada kata sandi.

| ID | Nama | Role | Jabatan | Cakupan murid |
| --- | --- | --- | --- | --- |
| `t-wali-a` | Bu Rina Kartika | `WALI_KELAS` | Wali Kelas XI Perhotelan | Perhotelan, kelas XI |
| `t-bk` | Pak Damar Prasetyo | `GURU_BK` | Guru Bimbingan Konseling | **Semua murid** |
| `t-pkl` | Bu Sari Melati | `PEMBIMBING_PKL` | Pembimbing PKL | Murid dengan `pklStatus ≠ belum` |
| `t-kaprog` | Pak Yosef Anwar | `KAPROG` | Kepala Program PPLG | PPLG |
| `t-admin` | Admin Sekolah | `ADMIN` | Administrator | **Semua murid** |

> `DEFAULT_TEACHER_ID = 't-bk'` (Guru BK) — paling kaya untuk demo karena
> mencakup seluruh murid dan seluruh alert risiko.

Email (hanya data tampilan, tidak dipakai untuk login):

| ID | Email |
| --- | --- |
| `t-wali-a` | `rina.kartika@yadika.sch.id` |
| `t-bk` | `damar.prasetyo@yadika.sch.id` |
| `t-pkl` | `sari.melati@yadika.sch.id` |
| `t-kaprog` | `yosef.anwar@yadika.sch.id` |
| `t-admin` | `admin@yadika.sch.id` |

### Murid

Murid dapat masuk sebagai akun demo dari data seed, atau membuat akun sendiri
lewat onboarding (id `me`). Ada juga jalur "coba demo" dari onboarding.

`DEFAULT_STUDENT_ID = 'anisa'`.

| ID | Nama | Jurusan | Kelas | Status PKL | Tempat PKL |
| --- | --- | --- | --- | --- | --- |
| `anisa` | Anisa Rahmawati | Perhotelan | XI | sedang | Hotel Santika Premiere |
| `bagas` | Bagas Pratama | Perhotelan | X | belum | — |
| `citra` | Citra Lestari | Perhotelan | XII | selesai | Hotel Aryaduta |
| `dimas` | Dimas Saputra | Perhotelan | XI | sedang | Grand Hyatt Jakarta |
| `eka` | Eka Wulandari | Akuntansi | XI | belum | — |
| `fajar` | Fajar Nugroho | Akuntansi | XII | sedang | KPP Pratama |
| `gita` | Gita Puspita | Akuntansi | X | belum | — |
| `hendra` | Hendra Wijaya | Akuntansi | XI | selesai | Bank BRI Cabang Kota |
| `indah` | Indah Permata | PPLG | XII | sedang | Nusantara Digital Studio |
| `joko` | Joko Susilo | PPLG | XI | belum | — |
| `kiki` | Kiki Amelia | PPLG | X | belum | — |
| `lukman` | Lukman Hakim | PPLG | XII | selesai | Kode Kreatif Indonesia |

Akun murid dengan alert risiko contoh (muncul di `/guru/alert` untuk Guru BK):
`fajar` (eksploitasi PKL), `joko` (kecanduan gim), `citra` (krisis emosional).

## 2. Gerbang Peran (Role Gate)

Sebelum rute apa pun dirender, `AppRoutes` (`src/App.tsx`) memeriksa state:

| Kondisi | Yang dirender |
| --- | --- |
| `state.hydrated === false` | `Splash` (layar loading) |
| `state.role === null` | **AuthRoutes** (semua URL → `/masuk`) |
| `state.role === 'teacher'` | **TeacherRoutes** |
| `state.role === 'student'` | **StudentRoutes** |

## 3. Rute Auth

| Rute | Halaman | Catatan |
| --- | --- | --- |
| `/masuk` | `LoginScreen` | Pilih peran (Murid/Guru) lalu akun |
| `*` | — | Dialihkan ke `/masuk` |

## 4. Rute Murid

Bila `onboarded === false`, hanya `/onboarding` yang aktif.

| Rute | Halaman | Catatan |
| --- | --- | --- |
| `/onboarding` | `OnboardingScreen` | Hanya saat belum onboarding |
| `*` | — | Dialihkan ke `/onboarding` (saat belum onboarding) atau `/beranda` |

Setelah onboarding, rute berada di dalam layout `AppShell`:

| Rute | Halaman | Catatan |
| --- | --- | --- |
| `/beranda` | `HomeScreen` | Beranda / kartu konteks jurusan |
| `/jurnal` | `JournalScreen` | Daftar jurnal (route index) |
| `/jurnal/baru` | `JournalEditorScreen` | Tulis jurnal |
| `/jurnal/:id` | `JournalDetailScreen` | Detail jurnal |
| `/konsultasi` | `ConsultScreen` | Daftar sesi (route index) |
| `/konsultasi/:sessionId` | `ChatThreadScreen` | Utas percakapan dengan AI |
| `/perkembangan` | `ProgressScreen` | Radar Karakter & Kesiapan Kerja, lencana |
| `/resume` | `ResumeScreen` | Resume mingguan & portofolio |
| `/pkl` | `PklScreen` | Konteks PKL |
| `/profil` | `ProfileScreen` | Profil, tema, reset demo |
| `*` | — | Dialihkan ke `/beranda` |

## 5. Rute Guru

Semua rute berada di dalam layout `TeacherShell`.

| Rute | Halaman | Catatan |
| --- | --- | --- |
| `/guru` | `TeacherDashboard` | Dasbor agregat & antrean |
| `/guru/review` | `ReviewResumeScreen` | Review resume mingguan |
| `/guru/alert` | `RiskAlertsScreen` | Alert risiko & transkrip |
| `/guru/murid` | `StudentsScreen` | Manajemen murid + filter |
| `/guru/pkl` | `PklMonitoringScreen` | Monitoring murid PKL |
| `/guru/pengaturan` | `TeacherSettingsScreen` | Tampilan, aksesibilitas, notifikasi, privasi data murid |
| `*` | — | Dialihkan ke `/guru` |

## 6. Catatan Persistensi

- Rute tidak disimpan ke storage; yang disimpan adalah **state** (termasuk
  `role`). Refresh halaman mempertahankan peran yang sedang masuk.
- Untuk kembali ke layar login: gunakan **Logout** (set `role = null`), bukan
  sekadar mengubah URL.
- Untuk memuat ulang data seed: **Reset demo** di `/profil` atau hapus kunci
  `ruang-tumbuh:state:v1` di localStorage.
- Kunci preferensi terpisah dari state: `ruang-tumbuh:theme` (tema),
  `ruang-tumbuh:settings:v1` (tampilan & aksesibilitas, per perangkat),
  `ruang-tumbuh:teacher-settings:v1` (preferensi guru, per `teacherId`), dan
  `ruang-tumbuh:tour:v1` (status tur).
- "Reset demo" juga mengembalikan seluruh preferensi ke bawaan.
