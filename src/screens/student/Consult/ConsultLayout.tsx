import { Outlet } from 'react-router-dom'
import { ConsultList } from './ConsultList'

export function ConsultLayout() {
  return (
    <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
      <aside className="hidden flex-col overflow-y-auto border-r border-border lg:flex lg:w-[340px] lg:shrink-0">
        <ConsultList />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
