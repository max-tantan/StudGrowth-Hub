# Dokumentasi Ruang Tumbuh

Kumpulan dokumen untuk **Ruang Tumbuh (StudGrowth Hub)** — aplikasi pendamping
karakter dan kesiapan kerja untuk murid SMK, lengkap dengan modul guru.

## Peta Dokumen

| Dokumen | Isi | Cocok untuk |
| --- | --- | --- |
| [`product-spec.md`](product-spec.md) | Kebutuhan produk: konteks SMK, dimensi, mode AI, deteksi risiko, resume, peran guru | Semua orang, terutama produk & desain |
| [`architecture.md`](architecture.md) | Stack, struktur folder, routing, state, alur data, persistensi | Developer baru, reviewer |
| [`data-model.md`](data-model.md) | Tipe/entitas, relasi, data seed, skema localStorage | Developer fitur & data |
| [`design-system.md`](design-system.md) | Token warna/tipografi, komponen UI, konvensi visual, motion | Frontend & desain |
| [`roles-and-routing.md`](roles-and-routing.md) | Dua role pengguna, login, gating rute, cakupan data guru | Developer fitur & QA |
| [`scoring-and-risk.md`](scoring-and-risk.md) | Rumus skor, lencana, streak, deteksi & eskalasi risiko | Developer fitur & data |
| [`conventions.md`](conventions.md) | Aturan kode, penamaan, script, checklist kontribusi | Kontributor |

## Urutan Baca yang Disarankan

1. **Baru di proyek?** Mulai dari [`product-spec.md`](product-spec.md) untuk
   memahami produk, lalu [`architecture.md`](architecture.md) untuk peta kode.
2. **Mengerjakan fitur data/skor/risiko?** Baca [`data-model.md`](data-model.md)
   dan [`scoring-and-risk.md`](scoring-and-risk.md).
3. **Mengerjakan UI?** Baca [`design-system.md`](design-system.md) dan
   [`conventions.md`](conventions.md).
4. **Menambah role atau halaman?** Baca [`roles-and-routing.md`](roles-and-routing.md).

## Konvensi Dokumentasi

- Bahasa: **Bahasa Indonesia**; istilah teknis dapat tetap Bahasa Inggris.
- Semua tautan antar-dokumen memakai **path relatif** (mis. `architecture.md`).
- Diagram memakai **Mermaid** agar dapat dirender langsung di GitHub/markdown viewer.
- Setiap kali perilaku kode berubah, perbarui dokumen terkait di PR yang sama.
