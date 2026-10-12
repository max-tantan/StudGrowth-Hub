import { Outlet, useLocation } from 'react-router-dom'
import { PhoneFrame } from './PhoneFrame'
import { Sidebar } from './Sidebar'
import { TabBar } from './TabBar'

const TAB_ROOTS = new Set([
  '/beranda',
  '/jurnal',
  '/konsultasi',
  '/perkembangan',
  '/resume',
])

export function AppShell() {
  const { pathname } = useLocation()
  const showTabs = TAB_ROOTS.has(pathname)

  return (
    <PhoneFrame>
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col lg:h-dvh lg:overflow-y-auto">
          <Outlet />
        </div>
      </div>
      {showTabs && <TabBar />}
    </PhoneFrame>
  )
}
