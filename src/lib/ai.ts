import type {
  AiSuggestion,
  ChatMode,
  Major,
  RiskFlag,
} from '../types'
import { MAJORS } from '../config/majors'
import { detectRisk, escalationTargets } from './risk'

export interface GenerateInput {
  mode: ChatMode
  major: Major
  studentName: string
  message: string
  turn: number
}

export interface AiTurn {
  text: string
  suggestion?: AiSuggestion
  risk?: RiskFlag
  escalatedTo?: string[]
}

export const MODE_META: Record<
  ChatMode,
  { label: string; desc: string; intro: string }
> = {
  REFLEKSI: {
    label: 'Refleksi',
    desc: 'Menengok kembali hari ini dan apa yang kamu pelajari.',
    intro:
      'Kita mulai dari hari ini ya. Ceritakan satu momen yang paling membekas, tidak perlu yang besar.',
  },
  BELAJAR: {
    label: 'Belajar & Praktik',
    desc: 'Belajar, praktik di lab/bengkel, dan proyek.',
    intro:
      'Ayo bahas belajar atau praktikmu. Bagian mana yang paling bikin kamu penasaran atau tersangkut?',
  },
  SOSIAL: {
    label: 'Sosial & Emosi',
    desc: 'Pergaulan, perasaan, dan hal yang membebani.',
    intro:
      'Aku di sini untuk mendengarkan, tanpa menghakimi. Apa yang paling mengganggu pikiranmu belakangan ini?',
  },
  KARIER: {
    label: 'Karier & Masa Depan',
    desc: 'Arah setelah lulus: kerja, kuliah, wirausaha.',
    intro:
      'Kita bicarakan masa depanmu. Setelah lulus, arah mana yang paling menarik untukmu: kerja, kuliah, atau wirausaha?',
  },
  PKL: {
    label: 'PKL',
    desc: 'Persiapan, kegiatan, dan kendala selama PKL.',
    intro:
      'Kita bicarakan PKL-mu. Mulai dari mana dulu: persiapan, kegiatan, atau ada kendala yang ingin kamu ceritakan?',
  },
}

interface Topic {
  keys: string[]
  reflect: string
  question: string
}

const TOPICS: Topic[] = [
  {
    keys: ['takut', 'cemas', 'deg-degan', 'gugup', 'khawatir', 'panik'],
    reflect: 'Rasa takut dan gugup itu tanda kamu peduli dengan hasilnya.',
    question: 'Kalau situasi itu terjadi lagi, hal apa yang paling kamu inginkan bisa kamu kendalikan?',
  },
  {
    keys: ['capek', 'lelah', 'ngantuk', 'lemes', 'berat dijalanin', 'jenuh'],
    reflect: 'Merasa lelah itu wajar, bukan berarti kamu lemah.',
    question: 'Apa satu hal kecil yang bisa mengembalikan energimu, walau cuma sedikit?',
  },
  {
    keys: ['salah', 'error', 'bug', 'gagal', 'keliru', 'kesalahan'],
    reflect: 'Kesalahan yang kamu sadari sendiri itu justru tanda kamu makin teliti.',
    question: 'Apa yang bisa kamu ubah di langkahmu supaya kesalahan yang sama tidak terulang?',
  },
  {
    keys: ['bingung', 'gak paham', 'tidak paham', 'susah', 'stuck', 'sulit'],
    reflect: 'Bingung itu bagian normal dari belajar hal baru.',
    question: 'Kalau masalahnya kamu pecah jadi langkah paling kecil, bagian mana yang dulu mau kamu coba?',
  },
  {
    keys: ['senang', 'bangga', 'berhasil', 'puas', 'seru', 'leg'],
    reflect: 'Kabar baik, dan kamu patut mengakuinya secara jujur.',
    question: 'Bagian mana dari keberhasilan itu yang paling kamu usahakan sendiri?',
  },
  {
    keys: ['teman', 'tim', 'kelompok', 'timku', 'rekan', 'konflik'],
    reflect: 'Bekerja dengan orang lain memang sering menguji kesabaran dan komunikasi.',
    question: 'Menurutmu, apa yang sebenarnya paling dibutuhkan rekannmu saat itu?',
  },
  {
    keys: ['kerja', 'kuliah', 'lulus', 'karier', 'portofolio', 'sertifikat', 'wirausaha'],
    reflect: 'Kamu sedang membangun arah yang bagus dengan memikirkannya sejak sekarang.',
    question: 'Langkah nyata apa yang bisa kamu mulai minggu ini untuk arah itu?',
  },
  {
    keys: ['tamu', 'pelanggan', 'klien', 'customer'],
    reflect: 'Menghadapi orang lain butuh kesabaran dan ketenangan, dan itu bisa dilatih.',
    question: 'Apa yang biasanya membuat orang itu akhirnya lebih tenang?',
  },
]

const OPENERS = [
  'Terima kasih sudah cerita.',
  'Aku dengar kamu.',
  'Bagus kamu mau terbuka soal ini.',
  'Makasih sudah jujur.',
]

const FOLLOWUPS = [
  'Dari semua itu, mana yang paling terasa berat buat kamu?',
  'Kalau kamu lihat lagi, apa yang sebenarnya kamu butuhkan saat itu?',
  'Apa satu hal kecil yang bisa kamu coba besok?',
  'Menurutmu, langkah pertama yang realistis itu seperti apa?',
]

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length]
}

function topicFor(message: string): Topic | null {
  const lower = message.toLowerCase()
  return TOPICS.find((t) => t.keys.some((k) => lower.includes(k))) ?? null
}

function buildSuggestion(
  turn: number,
  major: Major,
  risk: RiskFlag | null,
): AiSuggestion | undefined {
  if (risk) {
    return {
      kind: 'sumber',
      text: 'Kalau kamu merasa tidak aman, segera hubungi orang dewasa yang kamu percaya. Kamu tidak sendirian.',
    }
  }
  const cfg = MAJORS[major]
  switch (turn % 3) {
    case 0:
      return { kind: 'jurnal', text: 'Tuangkan ini ke jurnal supaya kamu bisa melihat polanya nanti.' }
    case 1:
      return { kind: 'aksi', text: pick(cfg.smallActions, turn) }
    default:
      return { kind: 'sumber', text: `Fokus jurusan ${cfg.name}: ${pick(cfg.portfolioFocus, turn)}.` }
  }
}

function riskReply(flag: RiskFlag, studentName: string): AiTurn {
  const escalatedTo = escalationTargets(flag)
  const targetText = escalatedTo.join(', ')
  const base =
    flag.category.startsWith('pkl-')
      ? 'Terima kasih sudah bercerita tentang ini. Situasi seperti ini bukan salahmu, dan hal ini tidak boleh dibiarkan.'
      : 'Terima kasih sudah mempercayai aku dengan ini. Yang kamu rasakan itu nyata, dan kamu tidak sendirian.'

  const action =
    flag.severity === 'tinggi'
      ? `Keselamatanmu yang paling utama. Kalau kamu merasa tidak aman saat ini, segera cari orang dewasa yang bisa membantumu langsung ya.`
      : 'Kamu tidak perlu menghadapi ini sendiri.'

  const forwarding =
    flag.category.startsWith('pkl-')
      ? ` Dengan izinmu, ini perlu diteruskan ke ${targetText} agar kamu benar-benar terbantu dan aman.`
      : ` Supaya kamu terhubung dengan bantuan yang tepat, ini perlu diteruskan ke ${targetText}.`

  return {
    text:
      `${base} ${action}\n\n` +
      `Responsku tetap di sisimu, tidak untuk menghakimi. ${forwarding}\n\n` +
      `Kalau kamu siap, ceritakan lebih lanjut supaya langkah pertamanya bisa lebih jelas — misalnya: kapan kejadiannya, siapa yang bisa menemani, dan apa yang paling kamu butuhkan sekarang, ${studentName.split(' ')[0]}.`,
    risk: flag,
    escalatedTo,
    suggestion: {
      kind: 'sumber',
      text: `Hubungi: ${targetText}. Kamu boleh bercerita didampingi orang yang kamu percaya.`,
    },
  }
}

export function generateAiReply(input: GenerateInput): AiTurn {
  const { mode, major, studentName, message, turn } = input
  const risk = detectRisk(message)
  if (risk) return riskReply(risk, studentName)

  const topic = topicFor(message)
  const meta = MODE_META[mode]
  const opener = pick(OPENERS, message.length + turn)

  const reflect =
    topic?.reflect ??
    (turn === 0
      ? meta.intro
      : 'Apa yang kamu ceritakan itu masuk akal dan layak diperhatikan.')

  const question =
    topic?.question ?? pick(FOLLOWUPS, message.length + turn)

  const bridge =
    mode === 'KARIER'
      ? 'Kita susun pelan-pelan, sesuai jurusanmu.'
      : mode === 'PKL'
        ? 'Kita bahas sambil mengingat kondisimu selama PKL.'
        : 'Kita cerna bareng.'

  const text = `${opener} ${reflect} ${bridge}\n\n${question}`

  return {
    text,
    suggestion: buildSuggestion(turn, major, null),
  }
}
