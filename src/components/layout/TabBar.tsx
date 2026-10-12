import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { TAB_NAV } from './nav'

export function TabBar() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="sticky bottom-0 z-30 border-t border-border bg-bg/90 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <ul className="flex items-stretch justify-around px-1.5 pt-1.5">
        {TAB_NAV.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[11px] font-semibold transition-colors duration-200',
                  isActive ? 'text-accent-strong' : 'text-fg-subtle hover:text-fg-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={tab.icon}
                    size={23}
                    weight={isActive ? 'fill' : 'regular'}
                  />
                  {tab.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
