import type { ChatMode, ChatMessage, ChatSession } from '../types'
import { daysAgo } from '../lib/format'

function msg(
  id: string,
  role: ChatMessage['role'],
  text: string,
  at: string,
  extra: Partial<ChatMessage> = {},
): ChatMessage {
  return { id, role, text, at, ...extra }
}

function session(
  id: string,
  studentId: string,
  mode: ChatMode,
  title: string,
  startedAgo: number,
  lastAgo: number,
  messages: ChatMessage[],
  escalated = false,
): ChatSession {
  return {
    id,
    studentId,
    mode,
    title,
    messages,
    startedAt: daysAgo(startedAgo, 20, 5),
    lastAt: daysAgo(lastAgo, 20, 30),
    escalated,
  }
}

export const SEED_CHATS: ChatSession[] = [
  session(
    'cs-an-1',
    'anisa',
    'PKL',
    'Menghadapi tamu yang mengeluh',
    2,
    2,
    [
      msg('m1', 'user', 'Bu, saya deg-degan kalau ada tamu yang komplain. Takut salah jawab.', daysAgo(2, 20, 5)),
      msg(
        'm2',
        'ai',
        'Wajar banget merasa begitu, apalagi ini pengalaman PKL pertamamu. Santai dulu ya. Coba cerita: saat tamu komplain, kamu paling takut hal apa yang terjadi?',
        daysAgo(2, 20, 6),
        {
          suggestion: {
            kind: 'aksi',
            text: 'Latih satu kalimat pembuka: "Mohon maaf atas ketidaknyamanannya, saya bantu cek sekarang."',
          },
        },
      ),
      msg('m3', 'user', 'Takut disalahkan atasan, dan takut tamunya makin marah.', daysAgo(2, 20, 12)),
      msg(
        'm4',
        'ai',
        'Dua hal itu masuk akal. Kuncinya: dengarkan tamu sampai selesai tanpa memotong, catat intinya, lalu sampaikan apa yang akan kamu lakukan. Atasan biasanya lebih menghargai kalau kita lapor cepat dan jujur. Menurutmu, langkah pertama mana yang paling bisa kamu coba besok?',
        daysAgo(2, 20, 13),
        {
          suggestion: {
            kind: 'jurnal',
            text: 'Tulis jurnal: apa yang kamu rasakan sebelum & sesudah menghadapi tamu?',
          },
        },
      ),
    ],
  ),
  session(
    'cs-an-2',
    'anisa',
    'REFLEKSI',
    'Kenapa aku mudah lelah di shift malam',
    7,
    7,
    [
      msg('m1', 'user', 'Aku capek banget tiap shift malam. Susah fokus.', daysAgo(7, 21, 0)),
      msg(
        'm2',
        'ai',
        'Terima kasih sudah jujur. Capek di shift malam itu nyata, bukan berarti kamu lemah. Coba pikirkan: bagian mana yang paling menguras energi, fisiknya atau pikiran yang terus waspada?',
        daysAgo(7, 21, 1),
        {
          suggestion: {
            kind: 'aksi',
            text: 'Coba atur waktu tidur siang singkat 20 menit sebelum shift malam, dan jaga air minum tetap cukup.',
          },
        },
      ),
    ],
  ),
  session(
    'cs-an-3',
    'anisa',
    'KARIER',
    'Setelah lulus mau kerja atau kuliah?',
    14,
    14,
    [
      msg('m1', 'user', 'Aku bingung setelah lulus mau langsung kerja atau lanjut kuliah.', daysAgo(14, 16, 0)),
      msg(
        'm2',
        'ai',
        'Bagus kamu sudah memikirkan ini dari sekarang, tidak menunggu sampai lulus. Keduanya sama-sama jalur yang sah. Kalau boleh, mana yang saat ini paling bikin kamu penasaran: langsung bekerja sambil membangun pengalaman, atau kuliah sambil tetap praktik?',
        daysAgo(14, 16, 1),
        {
          suggestion: {
            kind: 'sumber',
            text: 'Di Perhotelan, sertifikat kompetensi dan pengalaman front office bisa jadi nilai plus untuk melamar maupun kuliah vokasi.',
          },
        },
      ),
    ],
  ),
  session(
    'cs-in-1',
    'indah',
    'BELAJAR',
    'Belajar React untuk proyek PKL',
    3,
    3,
    [
      msg('m1', 'user', 'Aku baru belajar React, masih bingung state. Ada tips?', daysAgo(3, 19, 0)),
      msg(
        'm2',
        'ai',
        'Wajar, state memang sering bikin bingung di awal. Mulai dari hal kecil: bayangkan state sebagai "hal yang bisa berubah dan membuat tampilan ikut berubah". Coba sebutkan satu fitur di proyekmu yang butuh berubah saat diklik, nanti kita pecah bareng.',
        daysAgo(3, 19, 1),
      ),
    ],
  ),
]
