import type {
  ChatSession,
  JournalEntry,
  Student,
  Target,
} from '../types'

const KEY = 'ruang-tumbuh:state:v1'

export interface PersistedState {
  onboarded: boolean
  currentStudentId: string
  students: Student[]
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
    return parsed
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
