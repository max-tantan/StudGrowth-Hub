import type {
  ChatMode,
  JournalEntry,
  MoodLevel,
  PklStatus,
  RiskFlag,
  Student,
  Target,
  Teacher,
} from '../types'
import type { AppState } from '../store/appState'
import {
  characterAverage,
  computeBadges,
  currentStreak,
  scoreGroup,
} from './scoring'
import { startOfWeek, formatShort } from './format'

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

export const PKL_STATUS_META: Record<PklStatus, { label: string; tone: Tone }> = {
  belum: { label: 'Belum PKL', tone: 'neutral' },
  sedang: { label: 'Sedang PKL', tone: 'warning' },
  selesai: { label: 'Selesai PKL', tone: 'success' },
}

/* --------------------------- roster / scope --------------------------- */

export function rosterForTeacher(state: AppState, teacher: Teacher): Student[] {
  const all = state.students
  switch (teacher.role) {
    case 'WALI_KELAS':
      return all.filter(
        (s) =>
          (!teacher.major || s.major === teacher.major) &&
          (!teacher.grade || s.grade === teacher.grade),
      )
    case 'PEMBIMBING_PKL':
      return all.filter((s) => s.pklStatus !== 'belum')
    case 'KAPROG':
      return all.filter((s) => !teacher.major || s.major === teacher.major)
    case 'GURU_BK':
    case 'ADMIN':
    default:
      return all
  }
}

/* --------------------------- weekly summary --------------------------- */

export interface WeekSummary {
  id: string
  label: string
  rangeStart: string
  rangeEnd: string
  entries: JournalEntry[]
  moodSummary: { mood: MoodLevel; count: number }[]
  targetsTouched: Target[]
  chatCount: number
}

export function buildWeekSummary(
  studentId: string,
  state: AppState,
  offset = 0,
): WeekSummary {
  const start = startOfWeek()
  start.setDate(start.getDate() - offset * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  const entries = state.journals
    .filter(
      (j) =>
        j.studentId === studentId &&
        +new Date(j.date) >= +start &&
        +new Date(j.date) <= +end,
    )
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  const moodCount = new Map<MoodLevel, number>()
  for (const e of entries) moodCount.set(e.mood, (moodCount.get(e.mood) ?? 0) + 1)

  const targetsTouched = state.targets.filter(
    (t) =>
      t.studentId === studentId &&
      t.due &&
      +new Date(t.due) >= +start &&
      +new Date(t.due) <= +end,
  )

  const chatCount = state.chats.filter(
    (c) =>
      c.studentId === studentId &&
      c.messages.some((m) => {
        const t = +new Date(m.at)
        return t >= +start && t <= +end
      }),
  ).length

  return {
    id: start.toISOString(),
    label:
      offset === 0
        ? 'Minggu ini'
        : `${formatShort(start.toISOString())} – ${formatShort(end.toISOString())}`,
    rangeStart: start.toISOString(),
    rangeEnd: end.toISOString(),
    entries,
    moodSummary: [...moodCount.entries()]
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count),
    targetsTouched,
    chatCount,
  }
}

/* --------------------------- student overview --------------------------- */

export interface StudentOverview {
  student: Student
  journalCount: number
  streak: number
  pppAverage: number
  wrAverage: number
  lastJournalAt: string | null
  badgeCount: number
  riskCount: number
  thisWeekEntries: number
  pendingReview: boolean
}

export function studentOverview(
  state: AppState,
  student: Student,
): StudentOverview {
  const journals = state.journals.filter((j) => j.studentId === student.id)
  const ppp = scoreGroup('PPP', student.id, state.journals, state.targets, state.chats)
  const wr = scoreGroup(
    'WORK_READINESS',
    student.id,
    state.journals,
    state.targets,
    state.chats,
  )
  const last = journals.reduce<JournalEntry | null>(
    (acc, j) => (!acc || +new Date(j.date) > +new Date(acc.date) ? j : acc),
    null,
  )
  const alerts = alertsForStudent(state, student.id)
  const week = buildWeekSummary(student.id, state, 0)

  return {
    student,
    journalCount: journals.length,
    streak: currentStreak(state.journals, student.id),
    pppAverage: characterAverage(ppp),
    wrAverage: characterAverage(wr),
    lastJournalAt: last?.date ?? null,
    badgeCount: computeBadges(
      student.id,
      state.journals,
      state.targets,
      state.chats,
    ).length,
    riskCount: alerts.length,
    thisWeekEntries: week.entries.length,
    pendingReview: week.entries.length > 0,
  }
}

export function overviewsFor(
  state: AppState,
  students: Student[],
): StudentOverview[] {
  return students.map((s) => studentOverview(state, s))
}

/* --------------------------- risk alerts --------------------------- */

export interface RiskAlert {
  id: string
  student: Student
  studentId: string
  flag: RiskFlag
  excerpt: string
  at: string
  sessionId: string
  sessionTitle: string
  mode: ChatMode
  targets: string[]
}

function alertsForStudent(state: AppState, studentId: string): RiskAlert[] {
  const out: RiskAlert[] = []
  for (const session of state.chats) {
    if (session.studentId !== studentId) continue
    for (const message of session.messages) {
      if (!message.risk) continue
      const student = state.students.find((s) => s.id === studentId)
      if (!student) continue
      out.push({
        id: `${session.id}:${message.id}`,
        student,
        studentId,
        flag: message.risk,
        excerpt: message.text,
        at: message.at,
        sessionId: session.id,
        sessionTitle: session.title,
        mode: session.mode,
        targets:
          message.escalatedTo ??
          (message.risk.category.startsWith('pkl-')
            ? ['Guru BK', 'Pembimbing PKL', 'Kaprog']
            : ['Guru BK']),
      })
    }
  }
  return out.sort((a, b) => +new Date(b.at) - +new Date(a.at))
}

export function allRiskAlerts(state: AppState, students?: Student[]): RiskAlert[] {
  const scope = students ?? state.students
  return scope
    .flatMap((s) => alertsForStudent(state, s.id))
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
}

/* --------------------------- aggregate stats --------------------------- */

export interface TeacherStats {
  totalStudents: number
  pendingReview: number
  activeAlerts: number
  highAlerts: number
  pklOngoing: number
  pppAverage: number
  wrAverage: number
}

export function teacherStats(
  state: AppState,
  students: Student[],
): TeacherStats {
  const overviews = overviewsFor(state, students)
  const alerts = allRiskAlerts(state, students)
  const ppp = overviews.length
    ? Math.round(overviews.reduce((s, o) => s + o.pppAverage, 0) / overviews.length)
    : 0
  const wr = overviews.length
    ? Math.round(overviews.reduce((s, o) => s + o.wrAverage, 0) / overviews.length)
    : 0
  return {
    totalStudents: students.length,
    pendingReview: overviews.filter((o) => o.pendingReview).length,
    activeAlerts: alerts.length,
    highAlerts: alerts.filter((a) => a.flag.severity === 'tinggi').length,
    pklOngoing: students.filter((s) => s.pklStatus === 'sedang').length,
    pppAverage: ppp,
    wrAverage: wr,
  }
}

const PKL_UPDATE_WINDOW_DAYS = 7

export function recentPklUpdates(state: AppState, students: Student[]): number {
  const ids = new Set(students.map((s) => s.id))
  const since = Date.now() - PKL_UPDATE_WINDOW_DAYS * 86_400_000
  return state.journals.filter(
    (j) => j.pkl && ids.has(j.studentId) && +new Date(j.date) >= since,
  ).length
}
