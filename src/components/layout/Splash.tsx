import { Icon } from '../ui/Icon'

export function Splash({ label = 'Ruang Tumbuh' }: { label?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-16 w-16 animate-soft-pulse items-center justify-center rounded-full bg-accent-tint text-accent">
          <Icon name="sparkle" size={30} weight="fill" />
        </span>
        <p className="text-sm font-semibold text-fg-muted">{label}</p>
      </div>
    </div>
  )
}
