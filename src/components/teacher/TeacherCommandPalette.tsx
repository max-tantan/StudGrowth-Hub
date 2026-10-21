import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { CommandPalette } from '../ui/CommandPalette'
import type { CommandGroup, CommandItem } from '../ui/CommandPalette'
import { isDarkNow, setThemePreference } from '../../lib/theme'
import { rosterForTeacher } from '../../lib/teacher'
import { useTour } from '../tour/TourContext'
import { TEACHER_NAV } from './teacherNav'
import { MAJORS } from '../../config/majors'
import type { IconName } from '../ui/icons'
import { useStudentNaming } from './useStudentNaming'

export function TeacherCommandPalette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { state, currentTeacher } = useApp()
  const { start } = useTour()
  const roster = rosterForTeacher(state, currentTeacher)
  const { name } = useStudentNaming()

  const getGroups = useCallback(
    (query: string): CommandGroup[] => {
      const q = query.trim().toLowerCase()

      const pages: CommandItem[] = TEACHER_NAV.map((n) => ({
        id: n.to,
        label: n.label,
        hint: n.hint,
        icon: n.icon,
        run: () => {
          navigate(n.to)
          onClose()
        },
      }))

      const actions: CommandItem[] = [
        {
          id: 'teacher-review-queue',
          label: 'Tinjau antrean review',
          hint: 'Buka rekap mingguan murid',
          icon: 'clipboard' as IconName,
          run: () => {
            navigate('/guru/review')
            onClose()
          },
        },
        {
          id: 'teacher-alert-priority',
          label: 'Lihat alert prioritas tinggi',
          hint: 'Sinyal risiko dari konsultasi',
          icon: 'shieldWarning' as IconName,
          run: () => {
            navigate('/guru/alert')
            onClose()
          },
        },
        {
          id: 'teacher-students',
          label: 'Kelola data murid',
          hint: 'Filter, cari, dan ringkas perkembangan',
          icon: 'users3' as IconName,
          run: () => {
            navigate('/guru/murid')
            onClose()
          },
        },
        {
          id: 'teacher-pkl',
          label: 'Monitoring PKL',
          hint: 'Catatan harian dan penempatan',
          icon: 'briefcase' as IconName,
          run: () => {
            navigate('/guru/pkl')
            onClose()
          },
        },
        {
          id: 'teacher-settings',
          label: 'Pengaturan guru',
          hint: 'Tampilan, aksesibilitas, notifikasi, privasi',
          icon: 'gear' as IconName,
          run: () => {
            navigate('/guru/pengaturan')
            onClose()
          },
        },
        {
          id: 'teacher-guide',
          label: 'Buka panduan Ruang Guru',
          hint: 'Tur layar langkah demi langkah',
          icon: 'compass' as IconName,
          run: () => {
            onClose()
            start()
          },
        },
        {
          id: 'teacher-theme',
          label: isDarkNow() ? 'Mode terang' : 'Mode gelap',
          hint: '',
          icon: isDarkNow() ? ('sun' as IconName) : ('moon' as IconName),
          run: () => {
            setThemePreference(isDarkNow() ? 'light' : 'dark')
            onClose()
          },
        },
      ]

      const students: CommandItem[] =
        q.length >= 2
          ? roster
              .filter((s) => name(s.name).toLowerCase().includes(q))
              .slice(0, 6)
              .map((s) => ({
                id: s.id,
                label: name(s.name),
                hint: `${MAJORS[s.major].name} · Kelas ${s.grade}`,
                icon: 'users3' as IconName,
                run: () => {
                  navigate(`/guru/murid?murid=${s.id}`)
                  onClose()
                },
              }))
          : []

      const groups: CommandGroup[] = []

      const pageMatch = pages.filter((p) => !q || p.label.toLowerCase().includes(q))
      if (pageMatch.length) groups.push({ group: 'Halaman', data: pageMatch })

      const actionMatch = actions.filter((p) => !q || p.label.toLowerCase().includes(q))
      if (actionMatch.length) groups.push({ group: 'Aksi', data: actionMatch })

      if (students.length) groups.push({ group: 'Murid', data: students })

      return groups
    },
    [navigate, onClose, roster, start, name],
  )

  return (
    <CommandPalette
      onClose={onClose}
      getGroups={getGroups}
      placeholder="Cari murid, halaman, atau aksi…"
      emptyText="Tidak ada hasil"
    />
  )
}
