# Konvensi & Kontribusi

Panduan singkat agar perubahan konsisten dengan basis kode yang ada.

## 1. Konfigurasi & Script

| Script | Perintah | Kegunaan |
| --- | --- | --- |
| Dev | `npm run dev` | Jalankan dev server (HMR) |
| Build | `npm run build` | `tsc -b && vite build` — typecheck lalu bundel |
| Lint | `npm run lint` | `oxlint` |
| Preview | `npm run preview` | Pratinjau hasil build |

Migrasi/penambahan perpustakaan tidak memakai alat khusus — cukup `npm install`.
Proyek memakai Tailwind v4 via plugin Vite (`@tailwindcss/vite`) tanpa
`tailwind.config`; token ditaruh di `src/index.css`.

## 2. TypeScript

`tsconfig.app.json` sangat ketat. Yang paling sering menggagalkan build:

- **`noUnusedLocals` / `noUnusedParameters`** — hapus impor, variabel, dan
  parameter yang tidak terpakai. Impor yang hanya dipakai sebagai tipe **wajib**
  diimpor dengan `import type`.
- **`verbatimModuleSyntax`** — campur `import` nilai dan tipe secara eksplisit;
  jangan mengandalkan penghapusan otomatis.
- **`erasableSyntaxOnly`** — hindari sintaks yang tidak bisa dihapus; jangan
  pakai `enum` atau `namespace`. Gunakan union type + objek `as const`.
- **`noFallthroughCasesInSwitch`** — setiap `case` harus diakhiri `break`/
  `return`.

Hindari `any`. Untuk nilai yang mungkin kosong, pakai tipe union eksplisit
(`undefined` / `null`).

## 3. Struktur & Penamaan

- **Berkas komponen**: `PascalCase.tsx` (mis. `StatTile.tsx`).
- **Berkas logika/config/data**: `camelCase.ts` (mis. `teacher.ts`,
  `teacherNav.ts`).
- **Komponen**: fungsi bernama yang diekspor (`export function StatTile(...)`),
  bukan default export — kecuali halaman yang di-`lazy` (lihat di bawah).
- **Halaman/lazy**: `screens/.../<Nama>Screen.tsx` atau
  `screens/teacher/Dashboard/TeacherDashboard.tsx`. Saat di-`lazy`, peta
  `.then((m) => ({ default: m.NamaKomponen }))`.
- **Hook**: diawali `use`; hook konteks ada di `store/` (mis. `useApp`).
- **Konstanta**: `UPPER_SNAKE_CASE` (mis. `TEACHER_NAV`, `DEFAULT_TEACHER_ID`).

### Menaruh kode di mana

- **`lib/`** — logika murni tanpa React (skor, risiko, selector, format).
- **`config/`** — konfigurasi relatif tetap (dimensi, jurusan, lencana, role).
- **`data/`** — data seed yang bisa berubah.
- **`components/`** — komponen yang dipakai ulang. `components/ui/` untuk
  primitif desain.
- **`screens/`** — halaman ber-rute; usahakan tipis, delegasikan tampilan ke
  komponen.

## 4. Gaya Kode

- **Tanpa komentar** di kode kecuali diminta; utamakan nama yang jelas.
- **Styling**: Tailwind utility + token (`text-fg`, `bg-surface`, `border-border`,
  `rounded-[var(--radius-card)]`). Hindari warna hex langsung di JSX — pakai
  token dari `src/index.css`.
- **ClassName dinamis**: gunakan `cn()` dari `src/lib/cn.ts`.
- **Ikon**: selalu lewat `<Icon name="..." />` / registry `ICONS`; jangan impor
  Phosphor langsung di komponen.
- **Aksesibilitas**: tombol ikon wajib punya `label`; kontrol interaktif pakai
  elemen semantik + ARIA yang sesuai.

## 5. Kedalaman Impor (Penting)

Screen berada dua tingkat di bawah `src/` (`screens/<domain>/<Fitur>/`), jadi:

| Lokasi berkas | Prefiks ke `components`/`lib`/`store`/`types` |
| --- | --- |
| `src/screens/student/<Fitur>/*` | `../../../` |
| `src/screens/teacher/<Fitur>/*` | `../../../` |
| `src/screens/auth/*` (satu tingkat) | `../../` |
| `src/routes/*`, `src/components/*/*` | `../` atau `../../` |

Salah hitung kedalaman adalah penyebab umum error impor saat memindah berkas.

## 6. Menambah Data Seed

1. Tambahkan entri di berkas `src/data/` yang sesuai.
2. Bila perlu tipe baru, tambahkan di `src/types/index.ts`.
3. Bila data harus muncul di state awal, pastikan dimuat di
   `createInitialState()` (`src/store/appState.ts`).

> State ikut dipersist ke `localStorage`. Perubahan seed **tidak otomatis**
> terlihat di browser yang sudah pernah dibuka. Klik **Reset demo** di halaman
> Profil (memanggil `resetDemo()`), atau hapus `localStorage`.

## 7. Checklist Sebelum Commit

1. `npm run lint` bersih (tanpa error; warning baru sebaiknya dihindari).
2. `npm run build` sukses (typecheck + bundel).
3. Tidak ada impor/variabel tak terpakai.
4. Tidak menambah komentar yang tidak diminta.
5. Perbarui dokumen terkait di `docs/` bila perilaku berubah
   (lihat [`README.md`](README.md)).
6. Jangan commit perubahan yang tidak diminta.
