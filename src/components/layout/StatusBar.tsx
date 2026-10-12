import { useApp } from '../../store/AppContext'

const KBD = 'inline-flex items-center rounded border border-border-strong bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none text-fg-subtle'

export function StatusBar() {
  const { streak, journalCount } = useApp()
  return (
    <footer className="hidden items-center justify-between border-t border-border bg-bg/80 px-4 py-1.5 text-[11px] text-fg-subtle backdrop-blur lg:flex">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-accent-strong">{streak}</span>
          <span>hari runtutan</span>
        </span>
        <span className="h-3 w-px bg-border" />
        <span>{journalCount} jurnal</span>
        <span className="h-3 w-px bg-border" />
        <span>Tersimpan otomatis</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={KBD}>⌘K</span>
        <span className="hidden text-fg-subtle xl:inline">Menu</span>
        <span className={KBD}>/</span>
        <span className="hidden text-fg-subtle xl:inline">Cari</span>
        <span className={KBD}>N</span>
        <span className="hidden text-fg-subtle xl:inline">Jurnal baru</span>
        <span className={KBD}>Esc</span>
        <span className="hidden text-fg-subtle xl:inline">Tutup</span>
      </div>
    </footer>
  )
}
