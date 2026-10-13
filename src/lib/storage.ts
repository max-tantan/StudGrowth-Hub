import type {
  ChatSession,
  JournalEntry,
  Student,
  Target,
  Teacher,
  UserRole,
} from '../types'

const KEY = 'ruang-tumbuh:state:v1'

export interface PersistedState {
  role?: UserRole | null
  onboarded: boolean
  currentStudentId: string
  currentTeacherId?: string
  students: Student[]
  teachers?: Teacher[]
  journals: JournalEntry[]
  targets: Target[]
  chats: ChatSession[]
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedState
    if (!parsed.students?.length || !parsed.currentStudentId) return null
    // Backward compatibility: earlier saved states predate role/teachers.
    return {
      ...parsed,
      role: parsed.role ?? 'student',
      currentTeacherId: parsed.currentTeacherId,
      teachers: parsed.teachers,
    }
  } catch {
    return null
  }
}

export function saveState(state: PersistedState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage may be full or unavailable; ignore for the mock
  }
}

export function clearState() {
  localStorage.removeItem(KEY)
}
