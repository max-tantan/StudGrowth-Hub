import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { IconButton } from '../ui/Button'
import { TAB_NAV, SECONDARY_NAV } from './nav'
import { useApp } from '../../store/AppContext'
import { Avatar } from '../ui/Avatar'
import { setThemePreference, isDarkNow } from '../../lib/theme'

export function Sidebar() {
  const { currentStudent } = useApp()
  const [dark, setDark] = useState(isDarkNow)

  const toggleTheme = () => {
    const nextPref = dark ? 'light' : 'dark'
    setThemePreference(nextPref)
    setDark(!dark)
  }

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[272px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint text-accent-strong">
          <Icon name="sparkle" size={22} weight="fill" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-fg">Ruang Tumbuh</p>
          <p className="text-[11px] font-medium text-fg-subtle">StudGrowth Hub</p>
        </div>
      </div>

      {/* Main nav */}
      <nav aria-label="Navigasi utama" className="flex flex-col gap-0.5 px-2.5 py-3">
        {TAB_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-accent-tint text-accent-strong'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
              )
            }
          >
            <Icon name={item.icon} size={20} weight="duotone" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Secondary nav */}
      <div className="border-t border-border px-2.5 py-1">
        {SECONDARY_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-accent-tint text-accent-strong'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
              )
            }
          >
            <Icon name={item.icon} size={20} weight="duotone" />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer: identity + theme toggle */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-3.5">
        <NavLink to="/profil" className="flex min-w-0 flex-1 items-center gap-2.5">
          <Avatar name={currentStudent.name} initials={currentStudent.initials} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-fg">{currentStudent.name}</p>
            <p className="truncate text-[10.5px] font-medium text-fg-subtle">
              {currentStudent.major} · Kelas {currentStudent.grade}
            </p>
          </div>
        </NavLink>
          <IconButton name={dark ? 'sun' : 'moon'} label="Alihkan tema" tone="ghost" onClick={toggleTheme} className="shrink-0" />
      </div>
    </aside>
  )
}
