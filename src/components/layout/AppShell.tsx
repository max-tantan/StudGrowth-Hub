import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutlet } from 'react-router-dom'
import { PhoneFrame } from './PhoneFrame'
import { Sidebar } from './Sidebar'
import { TabBar } from './TabBar'
import { StatusBar } from './StatusBar'
import { StudentCommandPalette } from './StudentCommandPalette'
import { PageTransition } from '../motion/PageTransition'

const TAB_ROOTS = new Set([
  '/beranda',
  '/jurnal',
  '/konsultasi',
  '/perkembangan',
  '/resume',
])

function isEditing(e: EventTarget | null) {
  if (!e || !(e instanceof HTMLElement)) return false
  const tag = e.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    e.isContentEditable
  )
}

export function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const outlet = useOutlet()
  const showTabs = TAB_ROOTS.has(pathname)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditing(e.target)) return
      const meta = e.metaKey || e.ctrlKey

      if (meta && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }

      if (e.key === 'n' && !meta && !e.altKey) {
        e.preventDefault()
        navigate('/jurnal/baru')
        return
      }

      if (e.key === '/' && !meta) {
        e.preventDefault()
        navigate('/jurnal', { state: { focusSearch: true } })
        return
      }

      if (e.key === 'Escape') {
        setPaletteOpen(false)
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <PhoneFrame>
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        <Sidebar onOpenPalette={openPalette} />
        <div className="flex min-w-0 flex-1 flex-col lg:h-dvh">
          <div className="flex min-w-0 flex-1 flex-col lg:overflow-y-auto">
            <PageTransition routeKey={pathname}>{outlet}</PageTransition>
          </div>
          <StatusBar />
        </div>
      </div>
      {showTabs && <TabBar />}
      {paletteOpen && <StudentCommandPalette onClose={closePalette} />}
    </PhoneFrame>
  )
}
