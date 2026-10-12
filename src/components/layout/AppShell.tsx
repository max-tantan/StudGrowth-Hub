import { Outlet, useLocation } from 'react-router-dom'
import { PhoneFrame } from './PhoneFrame'
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
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      {showTabs && <TabBar />}
    </PhoneFrame>
  )
}
