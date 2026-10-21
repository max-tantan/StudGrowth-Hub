import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODE_META } from '../../lib/ai'
import { isDarkNow, setThemePreference } from '../../lib/theme'
import { useApp } from '../../store/AppContext'
import { CommandPalette } from '../ui/CommandPalette'
import type { CommandGroup, CommandItem } from '../ui/CommandPalette'
import { TAB_NAV, SECONDARY_NAV } from './nav'
import type { IconName } from '../ui/icons'
import type { ChatMode } from '../../types'

const MODES: ChatMode[] = ['REFLEKSI', 'BELAJAR', 'SOSIAL', 'KARIER', 'PKL']

export function StudentCommandPalette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { state, startChat } = useApp()

  const getGroups = useCallback(
    (query: string): CommandGroup[] => {
      const q = query.trim().toLowerCase()

      const pages: CommandItem[] = [
        ...TAB_NAV.map((n) => ({
          id: n.to,
          label: n.label,
          hint: '',
          icon: n.icon,
          run: () => {
            navigate(n.to)
            onClose()
          },
        })),
        ...SECONDARY_NAV.map((n) => ({
          id: n.to,
          label: n.label,
          hint: '',
          icon: n.icon,
          run: () => {
            navigate(n.to)
            onClose()
          },
        })),
      ]

      const actions: CommandItem[] = [
        {
          id: 'new-journal',
          label: 'Tulis jurnal baru',
          hint: '',
          icon: 'note' as IconName,
          run: () => {
            navigate('/jurnal/baru')
            onClose()
          },
        },
        ...MODES.map((m) => ({
          id: `chat-${m}`,
          label: `Konsultasi: ${MODE_META[m].label}`,
          hint: MODE_META[m].desc,
          icon: 'consult' as IconName,
          run: () => {
            const session = startChat(m)
            navigate(`/konsultasi/${session.id}`)
            onClose()
          },
        })),
        {
          id: 'theme',
          label: isDarkNow() ? 'Mode terang' : 'Mode gelap',
          hint: '',
          icon: isDarkNow() ? ('sun' as IconName) : ('moon' as IconName),
          run: () => {
            setThemePreference(isDarkNow() ? 'light' : 'dark')
            onClose()
          },
        },
      ]

      const journals: CommandItem[] =
        q.length >= 2
          ? state.journals
              .filter((j) => j.title.toLowerCase().includes(q))
              .slice(0, 5)
              .map((j) => ({
                id: j.id,
                label: j.title,
                hint: 'Buka jurnal',
                icon: 'journal' as IconName,
                run: () => {
                  navigate(`/jurnal/${j.id}`)
                  onClose()
                },
              }))
          : []

      const groups: CommandGroup[] = []

      const pageMatch = pages.filter((p) => !q || p.label.toLowerCase().includes(q))
      if (pageMatch.length) groups.push({ group: 'Halaman', data: pageMatch })

      const actionMatch = actions.filter((p) => !q || p.label.toLowerCase().includes(q))
      if (actionMatch.length) groups.push({ group: 'Aksi', data: actionMatch })

      if (journals.length) groups.push({ group: 'Jurnal', data: journals })

      return groups
    },
    [navigate, onClose, startChat, state.journals],
  )

  return (
    <CommandPalette
      onClose={onClose}
      getGroups={getGroups}
      placeholder="Cari halaman, aksi, atau jurnal…"
      overlayClassName="hidden lg:flex"
    />
  )
}
