import { useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { ChatMessage } from '../types'
import { generateAiReply } from '../lib/ai'
import { clearState, loadState, saveState } from '../lib/storage'
import { resetTourSeen } from '../lib/tour'
import { resetSettings } from '../lib/settings'
import { resetTheme } from '../lib/theme'
import { resetAllTeacherPrefs } from '../lib/teacherSettings'
import { AppContext } from './AppContext'
import type { AppContextValue } from './AppContext'
import {
  appReducer,
  createInitialState,
  createSession,
  derive,
  uid,
} from './appState'
import type { NewStudentInput } from './appState'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    appReducer,
    undefined,
    createInitialState,
  )

  useEffect(() => {
    const persisted = loadState()
    dispatch({ type: 'HYDRATE', payload: persisted ?? undefined })
  }, [])

  useEffect(() => {
    if (!state.hydrated) return
    saveState({
      role: state.role,
      onboarded: state.onboarded,
      currentStudentId: state.currentStudentId,
      currentTeacherId: state.currentTeacherId,
      students: state.students,
      teachers: state.teachers,
      journals: state.journals,
      targets: state.targets,
      chats: state.chats,
    })
  }, [state])

  const derived = useMemo(() => derive(state), [state])

  const value = useMemo<AppContextValue>(() => {
    const currentStudentId = state.currentStudentId

    return {
      state,
      ...derived,
      loginAsStudent: () => dispatch({ type: 'LOGIN', payload: { role: 'student' } }),
      loginAsTeacher: (teacherId: string) =>
        dispatch({ type: 'LOGIN', payload: { role: 'teacher', teacherId } }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      completeOnboarding: (input: NewStudentInput) => {
        dispatch({ type: 'COMPLETE_ONBOARDING', payload: input })
      },
      enterDemo: (id: string) => dispatch({ type: 'ENTER_DEMO', payload: id }),
      setCurrentStudent: (id: string) => {
        dispatch({ type: 'SET_STUDENT', payload: id })
      },
      addJournal: (entry) => dispatch({ type: 'ADD_JOURNAL', payload: entry }),
      deleteJournal: (id) => dispatch({ type: 'DELETE_JOURNAL', payload: id }),
      addTarget: (target) => dispatch({ type: 'ADD_TARGET', payload: target }),
      setTarget: (id, patch) =>
        dispatch({ type: 'SET_TARGET', payload: { id, patch } }),
      startChat: (mode) => {
        const session = createSession(currentStudentId, mode)
        dispatch({ type: 'ADD_SESSION', payload: session })
        return session
      },
      addUserMessage: (sessionId, text) => {
        const session = state.chats.find((c) => c.id === sessionId)
        const at = new Date().toISOString()
        const userMessage: ChatMessage = {
          id: uid('m'),
          role: 'user',
          text,
          at,
        }
        dispatch({
          type: 'APPEND_MESSAGE',
          payload: { sessionId, message: userMessage },
        })
        return generateAiReply({
          mode: session?.mode ?? 'REFLEKSI',
          major: derived.currentStudent.major,
          studentName: derived.currentStudent.name,
          message: text,
          turn: session?.messages.length ?? 0,
        })
      },
      addAiMessage: (sessionId, turn, at) => {
        const message: ChatMessage = {
          id: uid('m'),
          role: 'ai',
          text: turn.text,
          at,
          suggestion: turn.suggestion,
          risk: turn.risk,
          escalatedTo: turn.escalatedTo,
        }
        dispatch({
          type: 'APPEND_MESSAGE',
          payload: { sessionId, message, escalated: Boolean(turn.risk) },
        })
      },
      resetDemo: () => {
        clearState()
        resetTourSeen()
        resetSettings()
        resetTheme()
        resetAllTeacherPrefs()
        dispatch({ type: 'RESET' })
      },
    }
  }, [state, derived])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
