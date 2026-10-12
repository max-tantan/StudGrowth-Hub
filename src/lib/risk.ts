import type { RiskCategory, RiskFlag, RiskSeverity } from '../types'

interface Rule {
  category: RiskCategory
  severity: RiskSeverity
  label: string
  keywords: string[]
}

const RULES: Rule[] = [
  {
    category: 'self-harm',
    severity: 'tinggi',
    label: 'Keselamatan diri',
    keywords: [
      'menyakiti diri',
      'nyakitin diri',
      'ingin mati',
      'pengen mati',
      'mengakhiri hidup',
      'bunuh diri',
      'capek hidup',
      'gak mau hidup',
      'tidak mau hidup',
    ],
  },
  {
    category: 'krisis',
    severity: 'tinggi',
    label: 'Krisis emosional',
    keywords: [
      'putus asa',
      'tidak ada harapan',
      'gak ada harapan',
      'panik berat',
      'serangan panik',
      'tidak kuat lagi',
      'gak kuat lagi',
    ],
  },
  {
    category: 'kekerasan',
    severity: 'tinggi',
    label: 'Kekerasan',
    keywords: [
      'dipukul',
      'ditampar',
      'dikeroyok',
      'diancam',
      'kekerasan',
      'disiksa',
    ],
  },
  {
    category: 'pkl-pelecehan',
    severity: 'tinggi',
    label: 'Perlakuan tidak pantas di tempat kerja',
    keywords: [
      'pelecehan',
      'dilecehkan',
      'perlakuan tidak pantas',
      'diganggu secara',
      'disentuh',
      'catcalling',
      'dilecehkan',
    ],
  },
  {
    category: 'bullying',
    severity: 'sedang',
    label: 'Perundungan',
    keywords: [
      'dibully',
      'bully',
      'perundungan',
      'dipalak',
      'diejek terus',
      'dihina terus',
      'dikucilkan',
      'dijauhi teman',
    ],
  },
  {
    category: 'pkl-eksploitasi',
    severity: 'sedang',
    label: 'Dugaan eksploitasi di tempat PKL',
    keywords: [
      'tidak dibayar',
      'gak dibayar',
      'belum dibayar',
      'jam kerja berlebihan',
      'lembur terus',
      'tanpa uang saku',
      'disuruh kerja di luar',
      'diperas',
      'kerja terus tanpa istirahat',
    ],
  },
  {
    category: 'pkl-keselamatan',
    severity: 'sedang',
    label: 'Keselamatan kerja',
    keywords: [
      'kecelakaan kerja',
      'terluka',
      'alat tidak aman',
      'bahaya di tempat kerja',
      'tidak ada safety',
      'tanpa pengaman',
    ],
  },
  {
    category: 'ekonomi',
    severity: 'sedang',
    label: 'Tekanan ekonomi',
    keywords: [
      'berhenti sekolah',
      'putus sekolah',
      'gak bisa bayar',
      'tidak mampu bayar',
      'harus kerja buat keluarga',
      'biaya sekolah',
    ],
  },
  {
    category: 'kecanduan',
    severity: 'sedang',
    label: 'Kecanduan gim atau media sosial',
    keywords: [
      'kecanduan game',
      'kecanduan gim',
      'main game terus',
      'kecanduan medsos',
      'main hp terus',
      'gak bisa berhenti main',
    ],
  },
]

export function detectRisk(text: string): RiskFlag | null {
  const lower = text.toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return {
        category: rule.category,
        severity: rule.severity,
        label: rule.label,
      }
    }
  }
  return null
}

export function escalationTargets(flag: RiskFlag): string[] {
  if (flag.category.startsWith('pkl-')) {
    return ['Guru BK', 'Pembimbing PKL', 'Kaprog']
  }
  return ['Guru BK']
}

export const SUPPORT_CONTACTS = [
  'Guru BK di sekolahmu',
  'Pembimbing PKL / wali kelas',
  'Orang tua atau keluarga yang kamu percaya',
  'Guru yang kamu anggap aman untuk bercerita',
]
