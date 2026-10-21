# Sistem Desain

Ruang Tumbuh memakai bahasa visual "fresh & supportive": dominan biru muda +
hijau muda di atas netral sejuk, bersih, modern, dan terasa dewasa muda
(bukan kekanak-kanakan). Sumber token ada di [`src/index.css`](../src/index.css).

## 1. Token Desain

Token didefinisikan sebagai CSS variable di `:root` (mode terang) dan `.dark`
(mode gelap), lalu dipetakan ke Tailwind via `@theme inline`.

### Warna semantik

| Peran | Light | Dark | Kelas Tailwind |
| --- | --- | --- | --- |
| Latar halaman | `--bg` | `#0e181c` | `bg-bg` |
| Permukaan (kartu) | `--surface` | `#15232a` | `bg-surface` |
| Permukaan 2 (sunken) | `--surface-2` | `#1d2f38` | `bg-surface-2` |
| Permukaan 3 | `--surface-3` | `#263b45` | `bg-surface-3` |
| Border | `--border` | `#2a3f49` | `border-border` |
| Border kuat | `--border-strong` | `#3a5563` | `border-border-strong` |
| Teks utama | `--fg` | `#e9f2f4` | `text-fg` |
| Teks muted | `--fg-muted` | `#a9bec4` | `text-fg-muted` |
| Teks subtle | `--fg-subtle` | `#7c9299` | `text-fg-subtle` |
| Aksen | `--accent` | `#8ed0ee` | `bg-accent` / `text-accent` |
| Aksen tint | `--accent-tint` | `#12303e` | `bg-accent-tint` |
| Sukses | `--success` | — | `text-success` / `bg-success-tint` |
| Peringatan | `--warning` | — | `text-warning` / `bg-warning-tint` |
| Bahaya | `--danger` | — | `text-danger` / `bg-danger-tint` |
| Info | `--info` | — | `text-info` / `bg-info-tint` |

Setiap warna status punya pasangan `-tint` untuk latar lembut (dipakai di
`Chip` dan lencana).

### Palet kategorikal data-viz

Dipakai **khusus grafik/representasi data**, bukan untuk aksen UI. Didefinisikan
sebagai `--dim-1` … `--dim-6` dan dirujuk oleh `CharacterDimension.color`.
Contoh: radar chart dimensi, batang skor. Jangan pakai `--dim-*` untuk tombol
atau navigasi.

### Radius & shadow

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--radius-card` | `18px` | Kartu, panel |
| `--radius-input` | `12px` | Input/field |
| `--radius-pill` | `999px` | Tombol, chip, badge |
| `--shadow-sm` | halus | Kartu default |
| `--shadow-md` / `--shadow-card` | sedang | Kartu terangkat |
| `--shadow-lg` / `--shadow-float` | besar | Sheet, elemen mengapung |

## 2. Tipografi

| Peran | Font | Token |
| --- | --- | --- |
| Teks utama | Plus Jakarta Sans (variabel) | `font-sans` |
| Angka/teknis | IBM Plex Mono | `font-mono` |

- Body: `16px`, line-height `1.5`, letter-spacing `-0.006em`.
- Heading: `letter-spacing: -0.02em`, line-height `1.15`, `text-wrap: balance`.
- Utilitas bantu: `.text-balance`, `.text-pretty`.

Font dimuat di `src/main.tsx` via `@fontsource-variable/plus-jakarta-sans` dan
`@fontsource/ibm-plex-mono`.

## 3. Primitif UI (`src/components/ui/`)

| Komponen | Ringkas | Props kunci |
| --- | --- | --- |
| `Button` | Tombol pill; ada `IconButton` untuk ikon bulat | `variant` (`primary/secondary/ghost/soft/danger`), `size` (`sm/md/lg`), `block`, `icon`, `iconRight` |
| `Card` | Wadah sudut membulat | `variant` (`default/sunken/outline/accent`), `padded` |
| `Chip` | Label kecil berwarna | `tone` (`neutral/accent/success/warning/danger/info`), `icon` |
| `SegmentedControl<T>` | Tab bersegmen | `options`, `value`, `onChange`, `size` |
| `Sheet` | Panel bawah portal (dialog) | `open`, `onClose`, `title`, `description`, `footer` |
| `Field` | Label + input + pesan error | — |
| `SearchInput` | Input pencarian dengan ikon | — |
| `EmptyState` | Tampilan saat data kosong | — |
| `Skeleton` | Placeholder loading (belum dipakai; rute memakai `fallback={null}`) | — |
| `Progress` | Bar progres | — |
| `Avatar` | Bulat dari inisial | — |
| `Icon` | Pembungkus ikon Phosphor | `name`, `size`, `weight` |

`Icon` + registry `ICONS` di `icons.ts` memusatkan pemakaian ikon. Nama ikon
bertipe `IconName`, sehingga salah tulis nama ikon tertangkap typechecker.

> Untuk props lengkap tiap komponen, buka berkasnya langsung di
> `src/components/ui/`.

## 4. Ikon

- Sumber: `@phosphor-icons/react`.
- Registry: `src/components/ui/icons.ts` (`ICONS`, `IconName`).
- Peta khusus: `DIMENSION_ICON`, `BADGE_ICON`, `MODE_ICON`, `MAJOR_ICON`,
  `MOOD_ICON`.
- Konvensi `weight`: `regular` (default), `bold` (tombol/aksi), `fill` (status
  aktif/terpilih), `duotone` (ikon dekoratif besar).

**Menambah ikon baru:** impor dari Phosphor di `icons.ts`, tambahkan entri dengan
kunci camelCase, lalu pakai lewat `<Icon name="..." />`. Tidak perlu impor ikon
langsung di komponen.

## 5. Pola Premium & Komposisi

- **Double-bezel**: kartu stat/panel penting memakai dua lapis (bingkai luar
  tipis + isi permukaan) untuk memberi kesan berlapis dan mahal. Contoh:
  `StatTile`, kartu PKL.
- **Eyebrow tags**: label kecil huruf besar di atas judul untuk konteks
  (mis. role guru, kategori).
- **Asymmetric bento**: dasbor guru disusun pada grid 12 kolom dengan ukuran
  panel berbeda agar tidak monoton.
- **Ambient background**: kelas `.ambient-bg` menambahkan atmosfer gradien
  radial + titik halus khusus layar ≥1024px; mobile tidak terpengaruh.

## 6. Motion

Animasi memakai **Motion for React** (`motion`, impor dari `motion/react`),
bukan framework baru. Prinsip: hanya untuk memotivasi perhatian/transisi,
tidak dekoratif berlebihan, dan utamakan properti `transform`/`opacity`.

### Preferensi gerak

Disimpan di `SettingsState.motion` (`src/lib/settings.ts`) dan diatur di
Pengaturan → Tampilan → **Animasi**:

| Nilai | Label | Efek |
| --- | --- | --- |
| `system` (default) | Sistem | Ikut preferensi OS (`reducedMotion="user"`) |
| `reduce` | Reduksi | Paksa nonaktif (`reducedMotion="always"`) |
| `full` | Penuh | Paksa aktif, menimpa OS (`reducedMotion="never"`) |

`MotionProvider` (`src/components/motion/MotionProvider.tsx`) memetakan nilai
ini ke `<MotionConfig reducedMotion>`. Untuk animasi CSS murni, `applySettings`
menoggle kelas `html.motion-reduce` / `html.motion-full`; aturan di
`src/index.css` memakai `html:not(.motion-full)` agar opsi "Penuh" bisa
menimpa `prefers-reduced-motion`. Hook `useMotionEnabled()` menggabungkan
setting + `useReducedMotion()` untuk animasi berbasis JS (mis. `CountUp`).

### Primitif

| Berkas | Kegunaan |
| --- | --- |
| `components/motion/Reveal.tsx` | Muncul (rise/fade/bloom) saat masuk viewport |
| `components/motion/Stagger.tsx` | `Stagger` + `StaggerItem` untuk entrance berurutan |
| `components/motion/PageTransition.tsx` | Transisi antar rute (`AnimatePresence`) |
| `components/motion/CountUp.tsx` | Angka naik via `animate()` + `MotionValue` |
| `components/motion/transitions.ts` | Token easing/durasi (`EASE_SETTLE`, `SPRING_SETTLE`) |
| `components/motion/useMotionEnabled.ts` | Cek apakah gerak diizinkan |

### Keyframes CSS

Tetap dipakai untuk kasus non-JS: `.animate-rise`, `.animate-bloom`, dan
`.animate-soft-pulse`. Transisi komponen memakai
`cubic-bezier(0.16, 1, 0.3, 1)` (halus, "settling"). Semua otomatis
dinonaktifkan mengikuti kebijakan gerak di atas.

## 7. Responsif

- **Student**: mobile-first (shell dengan tab bar bawah, `AppShell`); naik ke
  desktop dengan sidebar.
- **Teacher**: desktop-first (`TeacherShell` dengan sidebar tetap + versi sheet
  untuk layar kecil).
- Tinggi mengikuti `min-h-dvh` agar aman di peramban mobile; padding bawah
  menghormati `env(safe-area-inset-bottom)`.

## 8. Aksesibilitas

- `:focus-visible` global: outline aksen 2px dengan offset.
- Kontrol interaktif memakai elemen semantik dan atribut ARIA
  (`role="tablist"`, `aria-selected`, `aria-label`, `aria-modal`).
- `IconButton` mewajibkan `label` untuk `aria-label`/`title`.
- Kontras teks memakai token `--fg`, `--fg-muted`, `--fg-subtle` yang sudah
  dikalibrasi untuk light & dark.
- Tur guide: dialog memakai `role="dialog"`, `aria-modal="true"`, focus
  dipindah ke kartu tiap langkah, focus di trap di dalam kartu, `Escape`
  menutup tur.

## 9. Tur Guide (Panduan)

Tur adalah lapisan onboarding yang berjalan sekali per role lalu bisa diulang
manual. Isi tur (copy, urutan langkah, rute tujuan) berada di
`src/config/tour.ts`; orkestrasi di `src/components/tour/`.

| Berkas | Tanggung jawab |
| --- | --- |
| `config/tour.ts` | `STUDENT_*` / `TEACHER_*` + `TOUR_COPY` (intro, langkah, outro) |
| `lib/tour.ts` | Status "sudah dilihat" per role di `localStorage` (`ruang-tumbuh:tour:v1`) |
| `components/tour/TourProvider.tsx` | Auto-start setelah login, transisi fase, navigasi rute per langkah |
| `components/tour/Spotlight.tsx` | Cakram spotlight + scrim + halo "napas" |
| `components/tour/TourCard.tsx` | Kartu intro/langkah/outro, penempatan, focus trap, keyboard |
| `components/tour/useTargetRect.ts` | Melacak posisi elemen ber-`data-tour` |

### Pola visual

- **Tunas Cahaya**: elemen yang sedang dijelaskan disorot memakai
  `box-shadow` berlapis — cincin aksen 2px + scrim `var(--tour-scrim)` sepanjang
  `100vmax`. Halo `--inset-3` memakai keyframe `tour-breathe`.
- **Progress batang tumbuh**: progres langkah digambar sebagai batang accent
  dengan ujung ikon `leaf`; makin panjang = makin dekat selesai.
- Kartu memakai token yang sama seperti komponen lain: `bg-surface`,
  `border-border`, `rounded-[var(--radius-card)]`, `shadow-[var(--shadow-lg)]`.
  Tidak ada warna hex di dalam JSX.

### Menandai target

Elemen yang ingin disorot diberi atribut `data-tour="<id>"`; id yang sama
boleh dipakai di beberapa tempat (mis. nav versi mobile dan desktop).
Pencarian memilih elemen yang terlihat (lebar & tinggi > 4px) paling dekat
ke tengah viewport. Langkah boleh punya `route`; provider menavigasi ke rute
tersebut lalu menunggu target muncul.

Daftar id aktif: `student-beranda`, `student-mulai`, `student-jurnal`,
`student-konsultasi`, `student-tumbuh`, `student-resume`, `student-pkl`,
`student-profil`, `teacher-dasbor`, `teacher-antrean`, `teacher-alert-kartu`,
`teacher-review`, `teacher-alert`, `teacher-murid`, `teacher-pkl`,
`teacher-aktivitas`.

### Aturan main

- Z-index: spotlight & catcher `z-[60]`, kartu `z-[61]` (portal ke `body`).
- Keyboard: `→`/`Enter` lanjut, `←` kembali, `Esc` keluar, `Tab` terjebak di
  kartu. Tombol pintasan global (`n`, `/`, `⌘K`) tidak aktif selama tur
  terbuka karena handler tur memakai fase capture.
- Tur berhenti otomatis bila pengguna keluar dari akun.
- Ulangi manual: Pengaturan → Panduan (murid) dan ikon kompas di sidebar/header
  (guru). `Atur ulang data demo` juga menghapus status tur.
