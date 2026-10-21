import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { TEACHER_NAV } from '../teacher/teacherNav'

export function TeacherTabBar({
  reviewCount,
  alertCount,
}: {
  reviewCount: number
  alertCount: number
}) {
  return (
    <nav
      aria-label="Navigasi guru"
      className="sticky bottom-0 z-30 border-t border-border bg-bg/90 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <ul className="flex items-stretch justify-around px-1.5 pt-1.5">
        {TEACHER_NAV.map((item) => {
          const count =
            item.badgeKey === 'review'
              ? reviewCount
              : item.badgeKey === 'alert'
                ? alertCount
                : 0
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                data-tour={item.tour}
                className={({ isActive }) =>
                  cn(
                    'relative flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[11px] font-semibold transition-colors duration-200',
                    isActive
                      ? 'text-accent-strong'
                      : 'text-fg-subtle hover:text-fg-muted',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icon
                        name={item.icon}
                        size={23}
                        weight={isActive ? 'fill' : 'regular'}
                      />
                      {count > 0 && (
                        <span
                          className={cn(
                            'absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ring-2 ring-bg',
                            item.badgeKey === 'alert'
                              ? 'bg-danger'
                              : 'bg-accent',
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </span>
                    {item.shortLabel ?? item.label}
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}