import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { Chip } from '../ui/Chip'
import { Sheet } from '../ui/Sheet'
import { useApp } from '../../store/AppContext'
import { rosterForTeacher, teacherStats } from '../../lib/teacher'
import { TEACHER_ROLE_META } from '../../config/teacherRoles'
import { TeacherSidebar } from '../teacher/TeacherSidebar'
import { TEACHER_NAV } from '../teacher/teacherNav'

export function TeacherShell() {
  const { state, currentTeacher, logout } = useApp()
  const students = rosterForTeacher(state, currentTeacher)
  const stats = teacherStats(state, students)
  const [menuOpen, setMenuOpen] = useState(false)
  const role = TEACHER_ROLE_META[currentTeacher.role]

  return (
    <div className="ambient-bg min-h-dvh w-full bg-bg">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px]">
        <TeacherSidebar reviewCount={stats.pendingReview} alertCount={stats.activeAlerts} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/85 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-md lg:hidden">
            <IconButton
              name="listChecks"
              label="Buka menu"
              tone="ghost"
              onClick={() => setMenuOpen(true)}
            />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
                <Icon name="sparkle" size={18} weight="fill" />
              </span>
              <p className="truncate text-sm font-extrabold text-fg">Ruang Guru</p>
            </div>
            {stats.activeAlerts > 0 && (
              <NavLink to="/guru/alert" className="relative">
                <IconButton name="bell" label="Alert risiko" tone="ghost" />
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {stats.activeAlerts}
                </span>
              </NavLink>
            )}
          </header>

          <main className="flex-1 px-4 pb-20 pt-5 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
            <Outlet />
          </main>
        </div>
      </div>

      <Sheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Ruang Guru"
        description={`${currentTeacher.name} · ${role.label}`}
      >
        <div className="flex items-center gap-3 rounded-[18px] border border-border bg-surface-2/60 p-3">
          <Avatar name={currentTeacher.name} initials={currentTeacher.initials} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-fg">{currentTeacher.name}</p>
            <p className="truncate text-xs text-fg-subtle">{currentTeacher.email}</p>
          </div>
          <Chip tone="accent" icon={role.icon}>
            {role.tagline}
          </Chip>
        </div>

        <nav aria-label="Navigasi guru" className="mt-4 flex flex-col gap-1">
          {TEACHER_NAV.map((item) => {
            const count =
              item.badgeKey === 'review'
                ? stats.pendingReview
                : item.badgeKey === 'alert'
                  ? stats.activeAlerts
                  : 0
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-200',
                    isActive
                      ? 'bg-accent-tint text-accent-strong'
                      : 'bg-surface-2/50 text-fg-muted',
                  )
                }
              >
                <Icon name={item.icon} size={20} weight="duotone" />
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                      item.badgeKey === 'alert'
                        ? 'bg-danger-tint text-danger'
                        : 'bg-accent text-fg-on-accent',
                    )}
                  >
                    {count}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            setMenuOpen(false)
            logout()
          }}
          className="mt-4 flex w-full items-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <Icon name="signOut" size={18} />
          Keluar
        </button>
      </Sheet>
    </div>
  )
}
