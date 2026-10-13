import { TopBar } from '../../../components/layout/TopBar'
import { ConsultList } from './ConsultList'

export function ConsultScreen() {
  // On desktop this renders only as the index placeholder inside ConsultLayout.
  // On mobile it shows the full list (hidden on desktop via classes).
  return (
    <>
      {/* mobile-only TopBar; desktop uses inline header inside ConsultList */}
      <TopBar
        title="Konsultasi"
        subtitle="Asisten pendamping · simulasi (mock)"
        className="lg:hidden"
      />

      <div className="flex flex-1 flex-col lg:hidden">
        <ConsultList />
      </div>

      {/* Desktop placeholder when no session is selected */}
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <div className="flex max-w-xs flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-fg-subtle">
            <svg
              width="28"
              height="28"
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path d="M216 48H40a8 8 0 0 0-8 8v144a8 8 0 0 0 8 8h176a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8ZM72 120h16v32h-8a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16h-8v-32h8a8 8 0 0 0 0-16H72a8 8 0 0 0 0 16Zm52.8 40a8 8 0 0 0 15.48 4.19l.08-.21.27-.73a23.8 23.8 0 0 1 1.24-2.74 29.1 29.1 0 0 1 3.53-4.73 36.8 36.8 0 0 1 5.24-4.58 42 42 0 0 0 4.32-3.48 19.7 19.7 0 0 0 3-3.42 11.7 11.7 0 0 0 1.28-3 8.7 8.7 0 0 0 .23-1.93 7.6 7.6 0 0 0-1.26-4.4 9.5 9.5 0 0 0-8.4-4.24 9.2 9.2 0 0 0-7.2 3.36 8.6 8.6 0 0 0-1.75 5.4 7 7 0 0 0 .17 1.49 1.4 1.4 0 0 0 .05.16 8 8 0 0 1-15.45-4.17A23.3 23.3 0 0 1 131 92.8a24.9 24.9 0 0 1 10.4-6.86 26.2 26.2 0 0 1 13.6-1.33 26.1 26.1 0 0 1 17.5 10.79 24.1 24.1 0 0 1 2.95 13.26 26 26 0 0 1-2.19 8.9 25.7 25.7 0 0 1-5.47 7.9q-2.67 2.87-6.12 5.53a37.1 37.1 0 0 0-5.08 4.5L157 136h11a8 8 0 0 1 0 16h-28a8 8 0 0 1-5.84-2.64l-.17-.19Z" />
            </svg>
          </span>
          <p className="text-sm font-bold text-fg">
            Pilih percakapan atau mulai topik baru
          </p>
          <p className="text-[13px] text-fg-muted text-pretty">
            Dari panel samping, pilih topik konsultasi atau buka percakapan
            sebelumnya.
          </p>
        </div>
      </div>
    </>
  )
}
