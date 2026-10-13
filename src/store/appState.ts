import type {
  BadgeAward,
  ChatMessage,
  ChatMode,
  ChatSession,
  DimensionScore,
  Grade,
  JournalEntry,
  Major,
  PklStatus,
  Student,
  Target,
  Teacher,
  UserRole,
} from '../types'
import { SEED_STUDENTS, DEFAULT_STUDENT_ID } from '../data/students'
import { SEED_JOURNALS } from '../data/journals'
import { SEED_TARGETS } from '../data/targets'
import { SEED_CHATS } from '../data/chats'
import { DEFAULT_TEACHER_ID, SEED_TEACHERS, getTeacher } from '../data/teachers'
import {
  characterAverage,
  computeBadges,
  currentStreak,
  scoreGroup,
} from '../lib/scoring'
import type { PersistedState } from '../lib/storage'

export interface AppState {
  hydrated: boolean
  role: UserRole | null
  onboarded: boolean
  currentStudentId: string
  currentTeacherId: string
  students: Student[]
  teachers: Teacher[]
  journals: JournalEntry[]
  targets: Target[]
  chats: ChatSession[]
}

export function createInitialState(): AppState {
  return {
    hydrated: false,
    role: null,
    onboarded: false,
    currentStudentId: DEFAULT_STUDENT_ID,
    currentTeacherId: DEFAULT_TEACHER_ID,
    students: SEED_STUDENTS,
    teachers: SEED_TEACHERS,
    journals: SEED_JOURNALS,
    targets: SEED_TARGETS,
    chats: SEED_CHATS,
  }
}

export interface NewStudentInput {
  name: string
  major: Major
  grade: Grade
  pklStatus: PklStatus
  pklPlacement?: string
}

export type AppAction =
  | { type: 'HYDRATE'; payload?: PersistedState }
  | { type: 'LOGIN'; payload: { role: UserRole; teacherId?: string } }
  | { type: 'LOGOUT' }
  | { type: 'COMPLETE_ONBOARDING'; payload: NewStudentInput }
  | { type: 'ENTER_DEMO'; payload: string }
  | { type: 'SET_STUDENT'; payload: string }
  | { type: 'ADD_JOURNAL'; payload: JournalEntry }
  | { type: 'DELETE_JOURNAL'; payload: string }
  | { type: 'ADD_TARGET'; payload: Target }
  | { type: 'SET_TARGET'; payload: { id: string; patch: Partial<Target> } }
  | { type: 'ADD_SESSION'; payload: ChatSession }
  | {
      type: 'APPEND_MESSAGE'
      payload: { sessionId: string; message: ChatMessage; escalated?: boolean }
    }
  | { type: 'RESET' }

let idCounter = 0
function uid(prefix: string): string {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

function makeStudent(input: NewStudentInput): Student {
  const name = input.name.trim() || 'Murid Baru'
  const parts = name.split(' ')
  const initials = (
    parts[0][0] + (parts[1]?.[0] ?? '')
  ).toUpperCase()
  return {
    id: 'me',
    name,
    major: input.major,
    grade: input.grade,
    pklStatus: input.pklStatus,
    pklPlacement: input.pklPlacement,
    initials,
    joinedAt: new Date().toISOString(),
  }
}

export { uid }

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE': {
      if (!action.payload) return { ...state, hydrated: true }
      const persisted = action.payload
      return {
        ...state,
        ...persisted,
        role: persisted.role ?? state.role,
        currentTeacherId: persisted.currentTeacherId ?? state.currentTeacherId,
        teachers: persisted.teachers?.length ? persisted.teachers : state.teachers,
        hydrated: true,
      }
    }
    case 'LOGIN':
      return {
        ...state,
        role: action.payload.role,
        currentTeacherId: action.payload.teacherId ?? state.currentTeacherId,
      }
    case 'LOGOUT':
      return { ...state, role: null }
    case 'COMPLETE_ONBOARDING': {
      const student = makeStudent(action.payload)
      const others = state.students.filter((s) => s.id !== 'me')
      return {
        ...state,
        onboarded: true,
        currentStudentId: 'me',
        students: [student, ...others],
      }
    }
    case 'ENTER_DEMO':
      return { ...state, onboarded: true, currentStudentId: action.payload }
    case 'SET_STUDENT':
      return { ...state, currentStudentId: action.payload }
    case 'ADD_JOURNAL':
      return { ...state, journals: [action.payload, ...state.journals] }
    case 'DELETE_JOURNAL':
      return {
        ...state,
        journals: state.journals.filter((j) => j.id !== action.payload),
      }
    case 'ADD_TARGET':
      return { ...state, targets: [action.payload, ...state.targets] }
    case 'SET_TARGET':
      return {
        ...state,
        targets: state.targets.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.patch } : t,
        ),
      }
    case 'ADD_SESSION':
      return { ...state, chats: [action.payload, ...state.chats] }
    case 'APPEND_MESSAGE':
      return {
        ...state,
        chats: state.chats.map((c) =>
          c.id === action.payload.sessionId
            ? {
                ...c,
                messages: [...c.messages, action.payload.message],
                lastAt: action.payload.message.at,
                escalated: c.escalated || action.payload.escalated,
              }
            : c,
        ),
      }
    case 'RESET':
      return { ...createInitialState(), hydrated: true }
    default:
      return state
  }
}

/* ------------------------------ selectors ------------------------------ */

export interface Derived {
  currentStudent: Student
  currentTeacher: Teacher
  characterScores: DimensionScore[]
  workScores: DimensionScore[]
  pppAverage: number
  wrAverage: number
  badges: BadgeAward[]
  streak: number
  journalCount: number
}

export function derive(state: AppState): Derived {
  const currentStudent =
    state.students.find((s) => s.id === state.currentStudentId) ??
    state.students[0]
  const currentTeacher = getTeacher(state.teachers, state.currentTeacherId)
  const id = currentStudent.id
  const characterScores = scoreGroup(
    'PPP',
    id,
    state.journals,
    state.targets,
    state.chats,
  )
  const workScores = scoreGroup(
    'WORK_READINESS',
    id,
    state.journals,
    state.targets,
    state.chats,
  )
  return {
    currentStudent,
    currentTeacher,
    characterScores,
    workScores,
    pppAverage: characterAverage(characterScores),
    wrAverage: characterAverage(workScores),
    badges: computeBadges(id, state.journals, state.targets, state.chats),
    streak: currentStreak(state.journals, id),
    journalCount: state.journals.filter((j) => j.studentId === id).length,
  }
}

export function createSession(studentId: string, mode: ChatMode): ChatSession {
  const now = new Date().toISOString()
  const titles: Record<ChatMode, string> = {
    REFLEKSI: 'Refleksi hari ini',
    BELAJAR: 'Belajar & praktik',
    SOSIAL: 'Sosial & emosi',
    KARIER: 'Karier & masa depan',
    PKL: 'Seputar PKL',
  }
  return {
    id: uid('cs'),
    studentId,
    mode,
    title: titles[mode],
    messages: [],
    startedAt: now,
    lastAt: now,
  }
}
