import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { Chip } from '../ui/Chip'
import { useApp } from '../../store/AppContext'
import { TEACHER_ROLE_META } from '../../config/teacherRoles'
import { isDarkNow, setThemePreference } from '../../lib/theme'
import { useTour } from '../tour/TourContext'
import { useTeacherPrefs } from '../../lib/teacherSettings'
import { TEACHER_NAV, TEACHER_NAV_GROUPS } from './teacherNav'

interface TeacherSidebarProps {
  reviewCount?: number
  alertCount?: number
  pklCount?: number
}

export function TeacherSidebar({
  reviewCount = 0,
  alertCount = 0,
  pklCount = 0,
}: TeacherSidebarProps) {
  const { currentTeacher, logout } = useApp()
  const { start } = useTour()
  const { prefs } = useTeacherPrefs(currentTeacher.id)
  const [dark, setDark] = useState(isDarkNow)
  const role = TEACHER_ROLE_META[currentTeacher.role]

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark'
    setThemePreference(next)
    setDark(!dark)
  }

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[284px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface/80 lg:backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-tint text-accent-strong">
          <Icon name="sparkle" size={22} weight="fill" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-fg">Ruang Tumbuh</p>
          <p className="text-[11px] font-medium text-fg-subtle">Ruang Guru</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Link
          to="/guru/pengaturan"
          className="flex items-center gap-3 rounded-[20px] border border-border bg-surface-2/60 p-3 transition-colors duration-200 hover:border-border-strong hover:bg-surface-2"
        >
          <Avatar name={currentTeacher.name} initials={currentTeacher.initials} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-fg">
              {currentTeacher.name}
            </p>
            <p className="truncate text-[11px] font-medium text-fg-subtle">
              {currentTeacher.title}
            </p>
          </div>
          <Icon
            name="gear"
            size={16}
            weight="duotone"
            className="shrink-0 text-fg-subtle"
          />
        </Link>
        <div className="mt-2 flex items-center gap-1.5 px-1">
          <Chip tone="accent" icon={role.icon}>
            {role.label}
          </Chip>
        </div>
      </div>

      <nav aria-label="Navigasi guru" className="mt-5 flex flex-col px-2.5">
        {TEACHER_NAV_GROUPS.map((group) => {
          const items = TEACHER_NAV.filter((n) => n.group === group)
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-1">
              <p className="px-3 pb-1.5 pt-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                {group}
              </p>
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const count =
                    item.badgeKey === 'review'
                      ? prefs.notifyWeeklyReview
                        ? reviewCount
                        : 0
                      : item.badgeKey === 'alert'
                        ? prefs.notifyNewAlert
                          ? alertCount
                          : 0
                        : item.badgeKey === 'pkl'
                          ? prefs.notifyPklUpdate
                            ? pklCount
                            : 0
                          : 0
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      data-tour={item.tour}
                      title={item.hint}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200',
                          isActive
                            ? 'bg-accent-tint text-accent-strong'
                            : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent" />
                          )}
                          <Icon
                            name={item.icon}
                            size={20}
                            weight={isActive ? 'fill' : 'duotone'}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {count > 0 && (
                            <span
                              className={cn(
                                'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold',
                                item.badgeKey === 'alert'
                                  ? 'bg-danger-tint text-danger'
                                  : item.badgeKey === 'pkl'
                                    ? 'bg-warning-tint text-warning'
                                    : 'bg-accent text-fg-on-accent',
                              )}
                            >
                              {count}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-border px-4 py-3.5">
        <div className="mb-2 flex items-center gap-1.5 rounded-xl border border-border bg-surface-2/50 px-3 py-2">
          <Icon name="shieldCheck" size={16} weight="duotone" className="shrink-0 text-info" />
          <p className="text-[11px] leading-tight text-fg-subtle">
            Data murid bersifat rahasia. Gunakan sesuai kode etik.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            name="compass"
            label="Buka panduan"
            tone="ghost"
            onClick={start}
          />
          <IconButton
            name={dark ? 'sun' : 'moon'}
            label="Alihkan tema"
            tone="ghost"
            onClick={toggleTheme}
          />
          <button
            type="button"
            onClick={logout}
            className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
          >
            <Icon name="signOut" size={18} />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  )
}
