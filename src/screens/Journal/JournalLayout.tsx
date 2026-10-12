import { Link, Outlet } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { JournalList } from './JournalList'

export function JournalLayout() {
  return (
    <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
      <aside className="hidden flex-col border-r border-border lg:flex lg:w-[380px] lg:shrink-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <h2 className="flex-1 text-[15px] font-bold text-fg">Jurnal</h2>
          <Link to="/jurnal/baru">
            <Button size="sm" icon="plus">
              Tulis
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-3 p-3.5">
          <JournalList />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}