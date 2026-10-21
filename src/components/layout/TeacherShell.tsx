import { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Button'
import { useApp } from '../../store/AppContext'
import { recentPklUpdates, rosterForTeacher, teacherStats } from '../../lib/teacher'
import { useTeacherPrefs } from '../../lib/teacherSettings'
import { TeacherSidebar } from '../teacher/TeacherSidebar'
import { TeacherTopBar } from '../teacher/TeacherTopBar'
import { TeacherCommandPalette } from '../teacher/TeacherCommandPalette'
import { TeacherTabBar } from './TeacherTabBar'
import { PageTransition } from '../motion/PageTransition'
import { useTour } from '../tour/TourContext'

function isEditing(e: EventTarget | null) {
  if (!e || !(e instanceof HTMLElement)) return false
  const tag = e.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || e.isContentEditable
}

export function TeacherShell() {
  const { state, currentTeacher, logout } = useApp()
  const { start } = useTour()
  const { pathname } = useLocation()
  const students = rosterForTeacher(state, currentTeacher)
  const stats = teacherStats(state, students)
  const pklUpdates = recentPklUpdates(state, students)
  const { prefs } = useTeacherPrefs(currentTeacher.id)
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
      if (e.key === 'Escape') setPaletteOpen(false)
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="ambient-bg min-h-dvh w-full bg-bg">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px]">
        <TeacherSidebar
          reviewCount={stats.pendingReview}
          alertCount={stats.activeAlerts}
          pklCount={pklUpdates}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/85 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-md lg:hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
                <Icon name="sparkle" size={18} weight="fill" />
              </span>
              <p className="truncate text-sm font-extrabold text-fg">Ruang Guru</p>
            </div>
            <IconButton
              name="compass"
              label="Buka panduan"
              tone="ghost"
              onClick={start}
            />
            <NavLink to="/guru/alert" className="relative">
              <IconButton name="bell" label="Alert risiko" tone="ghost" />
              {prefs.notifyNewAlert && stats.activeAlerts > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {stats.activeAlerts}
                </span>
              )}
            </NavLink>
            <NavLink to="/guru/pengaturan">
              <IconButton name="gear" label="Pengaturan" tone="ghost" />
            </NavLink>
            <IconButton name="signOut" label="Keluar" tone="ghost" onClick={logout} />
          </header>

          <TeacherTopBar
            onOpenPalette={openPalette}
            alertCount={stats.activeAlerts}
          />

          <main className="flex-1 px-4 pb-20 pt-5 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
            <PageTransition routeKey={pathname}>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>

      <TeacherTabBar
        reviewCount={stats.pendingReview}
        alertCount={stats.activeAlerts}
      />

      {paletteOpen && <TeacherCommandPalette onClose={closePalette} />}
    </div>
  )
}
