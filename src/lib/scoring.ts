import type {
  BadgeAward,
  ChatSession,
  CharacterDimension,
  DimensionScore,
  JournalEntry,
  Target,
} from '../types'
import { BADGES } from '../config/badges'
import {
  PPP_DIMENSIONS,
  WORK_READINESS_DIMENSIONS,
} from '../config/dimensions'
import { clamp } from './format'

function recencyWeight(iso: string): number {
  const days = (Date.now() - new Date(iso).getTime()) / 86_400_000
  if (days <= 7) return 2
  if (days <= 30) return 1.5
  return 1
}

export function scoreGroup(
  group: CharacterDimension['group'],
  studentId: string,
  journals: JournalEntry[],
  targets: Target[],
  chats: ChatSession[],
): DimensionScore[] {
  const dims =
    group === 'PPP' ? PPP_DIMENSIONS : WORK_READINESS_DIMENSIONS
  const mine = journals.filter((j) => j.studentId === studentId)
  const myTargets = targets.filter((t) => t.studentId === studentId)
  const myChats = chats.filter((c) => c.studentId === studentId)

  const pklTurns = myChats.filter(
    (c) => c.mode === 'PKL' || c.mode === 'KARIER',
  ).length

  return dims.map((dimension) => {
    const tagged = mine.filter((j) => j.dimensions.includes(dimension.id))
    const mentions = tagged.reduce((sum, j) => sum + recencyWeight(j.date), 0)
    const targetBonus = myTargets
      .filter((t) => t.dimensionId === dimension.id)
      .reduce((sum, t) => sum + (t.status === 'selesai' ? 12 : t.progress * 0.06), 0)
    const chatBonus = group === 'WORK_READINESS' ? pklTurns * 1.5 : 0
    const score = clamp(Math.round(16 + mentions * 8.5 + targetBonus + chatBonus))
    return { dimension, score, mentions: tagged.length }
  })
}

export function characterAverage(scores: DimensionScore[]): number {
  if (!scores.length) return 0
  return Math.round(scores.reduce((s, d) => s + d.score, 0) / scores.length)
}

export function currentStreak(journals: JournalEntry[], studentId: string): number {
  const days = new Set(
    journals
      .filter((j) => j.studentId === studentId)
      .map((j) => new Date(j.date).toDateString()),
  )
  let streak = 0
  const cursor = new Date()
  for (let i = 0; i < 60; i++) {
    if (days.has(cursor.toDateString())) {
      streak++
    } else if (i > 0 || streak > 0) {
      if (i === 0) {
        // allow today to be missing without breaking the streak
      } else {
        break
      }
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function computeBadges(
  studentId: string,
  journals: JournalEntry[],
  targets: Target[],
  chats: ChatSession[],
): BadgeAward[] {
  const mine = journals
    .filter((j) => j.studentId === studentId)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
  const ppp = scoreGroup('PPP', studentId, journals, targets, chats)
  const wr = scoreGroup('WORK_READINESS', studentId, journals, targets, chats)
  const scoreOf = (id: string) =>
    [...ppp, ...wr].find((s) => s.dimension.id === id)?.score ?? 0

  const distinctDays = new Set(mine.map((j) => new Date(j.date).toDateString()))
  const pklCount = mine.filter((j) => j.pkl).length
  const latest = mine.at(-1)?.date ?? new Date().toISOString()

  const earned: Record<string, boolean> = {
    'mulai-tumbuh': mine.length >= 1,
    'konsisten-7': distinctDays.size >= 7,
    'refleksi-mendalam': mine.length >= 20,
    'bintang-tim': scoreOf('gotong-royong') >= 75,
    'siap-kerja': wr.every((s) => s.score >= 70),
    'pejuang-pkl': pklCount >= 3,
    'pelayan-teladan': scoreOf('gotong-royong') >= 78,
    'tenang-tekanan': scoreOf('adaptasi') >= 78,
    'teliti-detail': scoreOf('bernalar-kritis') >= 78,
    'jujur-angka': scoreOf('etika-profesi') >= 78,
    'pantang-menyerah': scoreOf('adaptasi') >= 80,
    'rekan-satu-tim': scoreOf('komunikasi-tim') >= 80,
  }

  const studentMajor = chats.find((c) => c.studentId === studentId) // not needed
  void studentMajor

  return BADGES.filter((b) => earned[b.id]).map((b) => ({
    badgeId: b.id,
    earnedAt: latest,
  }))
}

export function resumeHighlights(
  journals: JournalEntry[],
  studentId: string,
  limit = 3,
): string[] {
  return journals
    .filter((j) => j.studentId === studentId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit)
    .map((j) => j.title)
}
