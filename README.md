# Ruang Tumbuh — StudGrowth Hub

Aplikasi pendamping **karakter** dan **kesiapan kerja** untuk murid SMK, lengkap
dengan modul guru. Murid membangun kebiasaan refleksi lewat jurnal dan
konsultasi, sementara guru mendampingi lewat dasbor, review resume, monitoring
PKL, dan alert risiko.

Aplikasi ini **frontend-only** (mock): seluruh data disimpan di `localStorage`
browser, tanpa backend.

## Fitur Utama

**Untuk murid**

- **Onboarding** pilih jurusan (Perhotelan, Akuntansi, PPLG) & kelas.
- **Jurnal harian** dengan mood, tag dimensi, dan bukti.
- **Konsultasi AI** bergaya coaching (Refleksi, Belajar, Sosial & Emosi,
  Karier, PKL) dengan deteksi risiko.
- **Perkembangan**: radar 6 dimensi Profil Pelajar Pancasila + 6 dimensi
  Kesiapan Kerja, lencana, dan target.
- **Resume mingguan & portofolio** termasuk catatan PKL.
- **Halaman PKL** untuk konteks praktik kerja.

**Untuk guru** (5 peran)

- **Dasbor** agregat: statistik, antrean review, alert risiko.
- **Review Resume** mingguan per murid.
- **Alert Risiko** hasil eskalasi konsultasi.
- **Manajemen Murid** dengan pencarian & filter.
- **Monitoring PKL** murid yang sedang praktik.

## Stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 4 · react-router-dom 7 ·
Phosphor Icons · Recharts.

## Menjalankan

Prasyarat: Node.js yang mendukung Vite 8.

```bash
npm install
npm run dev      # dev server (HMR)
```

Script lain:

```bash
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm run preview  # pratinjau hasil build
```

## Login Demo

Di halaman `/masuk`, pilih tab **Guru** dan pilih salah satu akun. Akun default
adalah **Guru BK** (`t-bk`) — cakupan seluruh murid dan seluruh alert risiko,
sehingga paling kaya untuk demo. Untuk murid, pilih tab **Murid**.

> Data seed disimpan di `localStorage`. Bila ingin memuat ulang data seed
> terbaru, gunakan **Reset demo** di halaman Profil atau hapus kunci
> `ruang-tumbuh:state:v1`.

## Struktur Singkat

```
src/
├── components/   # UI primitif + komponen domain (ui, layout, teacher, …)
├── config/       # Dimensi, jurusan, lencana, role guru
├── data/         # Data seed (murid, guru, jurnal, target, chat)
├── lib/          # Logika murni (skor, risiko, AI, selector guru, storage)
├── routes/       # AuthRoutes, StudentRoutes, TeacherRoutes
├── screens/      # Halaman: auth, student, teacher
├── store/        # State global (reducer + context)
└── types/        # Tipe domain
```

Penjelasan lengkap ada di [`docs/architecture.md`](docs/architecture.md).

## Dokumentasi

| Dokumen | Isi |
| --- | --- |
| [`docs/README.md`](docs/README.md) | Indeks & urutan baca |
| [`docs/product-spec.md`](docs/product-spec.md) | Kebutuhan produk |
| [`docs/architecture.md`](docs/architecture.md) | Stack, struktur, routing, state |
| [`docs/data-model.md`](docs/data-model.md) | Tipe, relasi, seed, persistensi |
| [`docs/design-system.md`](docs/design-system.md) | Token & komponen UI |
| [`docs/roles-and-routing.md`](docs/roles-and-routing.md) | Role, login, gating rute |
| [`docs/scoring-and-risk.md`](docs/scoring-and-risk.md) | Skor, lencana, risiko |
| [`docs/conventions.md`](docs/conventions.md) | Konvensi & kontribusi |
