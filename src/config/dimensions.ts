import type { CharacterDimension } from '../types'

export const PPP_DIMENSIONS: CharacterDimension[] = [
  {
    id: 'beriman',
    label: 'Beriman, Bertakwa, Berakhlak Mulia',
    short: 'Berakhlak',
    group: 'PPP',
    description:
      'Menjaga nilai dan akhlak, jujur, serta memperlakukan orang lain dengan hormat.',
    color: 'var(--dim-1)',
  },
  {
    id: 'berkebinekaan',
    label: 'Berkebinekaan Global',
    short: 'Berkebinekaan',
    group: 'PPP',
    description:
      'Menghargai perbedaan, terbuka pada budaya dan sudut pandang baru.',
    color: 'var(--dim-2)',
  },
  {
    id: 'gotong-royong',
    label: 'Bergotong Royong',
    short: 'Gotong Royong',
    group: 'PPP',
    description:
      'Bekerja sama, berbagi beban, dan membantu teman tanpa diminta.',
    color: 'var(--dim-3)',
  },
  {
    id: 'mandiri',
    label: 'Mandiri',
    short: 'Mandiri',
    group: 'PPP',
    description:
      'Mengatur diri, berinisiatif, dan bertanggung jawab atas pilihan sendiri.',
    color: 'var(--dim-4)',
  },
  {
    id: 'bernalar-kritis',
    label: 'Bernalar Kritis',
    short: 'Bernalar Kritis',
    group: 'PPP',
    description:
      'Bertanya, menimbang bukti, dan memikirkan sebab serta akibat.',
    color: 'var(--dim-5)',
  },
  {
    id: 'kreatif',
    label: 'Kreatif',
    short: 'Kreatif',
    group: 'PPP',
    description:
      'Mencari cara baru, bereksperimen, dan mengubah ide jadi hasil.',
    color: 'var(--dim-6)',
  },
]

export const WORK_READINESS_DIMENSIONS: CharacterDimension[] = [
  {
    id: 'disiplin',
    label: 'Disiplin & Tepat Waktu',
    short: 'Disiplin',
    group: 'WORK_READINESS',
    description:
      'Hadir tepat waktu, menaati jadwal dan aturan kerja, konsisten.',
    color: 'var(--dim-1)',
  },
  {
    id: 'tanggung-jawab',
    label: 'Tanggung Jawab',
    short: 'Tanggung Jawab',
    group: 'WORK_READINESS',
    description:
      'Menyelesaikan tugas sampai tuntas dan berani mengakui kekurangan.',
    color: 'var(--dim-2)',
  },
  {
    id: 'etika-profesi',
    label: 'Etika Profesi & Integritas',
    short: 'Etika Profesi',
    group: 'WORK_READINESS',
    description:
      'Jujur, menjaga kerahasiaan, dan menaati prosedur dengan benar.',
    color: 'var(--dim-3)',
  },
  {
    id: 'komunikasi-tim',
    label: 'Komunikasi & Kerja Tim',
    short: 'Komunikasi',
    group: 'WORK_READINESS',
    description:
      'Menyampaikan informasi dengan jelas dan bekerja baik dengan orang lain.',
    color: 'var(--dim-4)',
  },
  {
    id: 'inisiatif',
    label: 'Inisiatif & Problem Solving',
    short: 'Inisiatif',
    group: 'WORK_READINESS',
    description:
      'Bergerak lebih dulu dan menyelesaikan masalah dengan akal.',
    color: 'var(--dim-5)',
  },
  {
    id: 'adaptasi',
    label: 'Adaptasi & Ketahanan',
    short: 'Adaptasi',
    group: 'WORK_READINESS',
    description:
      'Bertahan di bawah tekanan, tangguh saat gagal, dan cepat menyesuaikan diri.',
    color: 'var(--dim-6)',
  },
]

export const ALL_DIMENSIONS: CharacterDimension[] = [
  ...PPP_DIMENSIONS,
  ...WORK_READINESS_DIMENSIONS,
]

export function getDimension(id: string): CharacterDimension | undefined {
  return ALL_DIMENSIONS.find((d) => d.id === id)
}

export const DIMENSION_GROUP_LABEL: Record<
  CharacterDimension['group'],
  string
> = {
  PPP: 'Karakter',
  WORK_READINESS: 'Kesiapan Kerja',
}
