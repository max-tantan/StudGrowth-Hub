import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { TEACHER_NAV } from './teacherNav'
import { useApp } from '../../store/AppContext'
import { useTeacherPrefs } from '../../lib/teacherSettings'

interface TeacherTopBarProps {
  onOpenPalette: () => void
  alertCount: number
}

export function TeacherTopBar({ onOpenPalette, alertCount }: TeacherTopBarProps) {
  const { pathname } = useLocation()
  const { currentTeacher } = useApp()
  const { prefs } = useTeacherPrefs(currentTeacher.id)
  const active = TEACHER_NAV.find((n) =>
    n.end ? pathname === n.to : pathname.startsWith(n.to),
  )

  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b border-border bg-bg/85 px-6 backdrop-blur-md lg:flex xl:px-10">
      <div className="flex min-w-0 items-center gap-2.5">
        {active && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
            <Icon name={active.icon} size={17} weight="fill" />
          </span>
        )}
        <p className="truncate text-[13px] font-bold text-fg">
          <span className="font-semibold text-fg-subtle">Ruang Guru</span>
          {active && (
            <>
              <span className="mx-1.5 text-fg-subtle">/</span>
              {active.label}
            </>
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenPalette}
        className="group ml-auto flex w-full max-w-[340px] items-center gap-2.5 rounded-xl border border-border bg-surface-2/70 px-3 py-2 text-left text-[13px] text-fg-muted transition-colors duration-200 hover:border-border-strong hover:bg-surface-2 hover:text-fg"
      >
        <Icon name="search" size={16} className="shrink-0 text-fg-subtle" />
        <span className="flex-1 truncate">Cari murid, halaman, atau aksi…</span>
        <kbd className="rounded border border-border-strong bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold text-fg-subtle">
          ⌘K
        </kbd>
      </button>

      <div className="flex shrink-0 items-center gap-1.5">
        <NavLink
          to="/guru/alert"
          className={({ isActive }) =>
            cn(
              'relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200',
              isActive
                ? 'bg-accent-tint text-accent-strong'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )
          }
          aria-label="Alert risiko"
        >
          <Icon name="bell" size={19} weight="duotone" />
          {prefs.notifyNewAlert && alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </NavLink>
        <NavLink
          to="/guru/pengaturan"
          className={({ isActive }) =>
            cn(
              'flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200',
              isActive
                ? 'bg-accent-tint text-accent-strong'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )
          }
          aria-label="Pengaturan"
        >
          <Icon name="gear" size={19} weight="duotone" />
        </NavLink>
      </div>
    </header>
  )
}
