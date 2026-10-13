import { Link } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { JournalList } from './JournalList'

export function JournalScreen() {
  const { state, currentStudent, streak } = useApp()

  const total = state.journals.filter(
    (j) => j.studentId === currentStudent.id,
  ).length

  return (
    <>
      <TopBar
        title="Jurnal"
        subtitle={`${total} catatan · runtutan ${streak} hari`}
        className="lg:hidden"
        right={
          <Link to="/jurnal/baru">
            <Button size="sm" icon="plus">
              Tulis
            </Button>
          </Link>
        }
      />

      {/* Mobile: full list (desktop uses the sidebar pane) */}
      <main className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4 lg:hidden">
        <JournalList />
      </main>

      {/* Desktop placeholder when no entry is selected */}
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <div className="flex max-w-xs flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-fg-subtle">
            <Icon name="journal" size={28} weight="duotone" />
          </span>
          <p className="text-sm font-bold text-fg">
            Pilih catatan atau tulis yang baru
          </p>
          <p className="text-[13px] text-fg-muted text-pretty">
            Dari panel samping, buka jurnal untuk membacanya di sini, atau mulai
            catatan baru.
          </p>
        </div>
      </div>
    </>
  )
}