import { createContext, useContext } from 'react'
import type { ChatMode, ChatSession, JournalEntry, Target } from '../types'
import type { AiTurn } from '../lib/ai'
import type { AppState, Derived, NewStudentInput } from './appState'

export interface AppContextValue extends Derived {
  state: AppState
  completeOnboarding: (input: NewStudentInput) => void
  enterDemo: (id: string) => void
  setCurrentStudent: (id: string) => void
  addJournal: (entry: JournalEntry) => void
  deleteJournal: (id: string) => void
  addTarget: (target: Target) => void
  setTarget: (id: string, patch: Partial<Target>) => void
  startChat: (mode: ChatMode) => ChatSession
  addUserMessage: (sessionId: string, text: string) => AiTurn
  addAiMessage: (sessionId: string, turn: AiTurn, at: string) => void
  resetDemo: () => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
