import { useMemo } from 'react'
import { useApp } from '../../store/AppContext'
import {
  maskStudentInitials,
  maskStudentName,
  useTeacherPrefs,
} from '../../lib/teacherSettings'

export function useStudentNaming() {
  const { currentTeacher } = useApp()
  const { prefs } = useTeacherPrefs(currentTeacher.id)
  const anonymize = prefs.anonymizeStudents

  return useMemo(
    () => ({
      name: (value: string) => (anonymize ? maskStudentName(value) : value),
      initials: (value: string) =>
        anonymize ? maskStudentInitials(value) : value,
    }),
    [anonymize],
  )
}
