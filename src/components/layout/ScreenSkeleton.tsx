import { Skeleton, SkeletonCard } from '../ui/Skeleton'

export function ScreenSkeleton({
  variant = 'student',
}: {
  variant?: 'student' | 'teacher'
}) {
  return (
    <div className="ambient-bg relative flex min-h-dvh w-full justify-center bg-surface-2/50 lg:bg-surface-2">
      <div className="relative flex min-h-dvh w-full max-w-[560px] flex-col border-x border-border bg-bg lg:max-w-none lg:border-x-0 lg:bg-transparent">
        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <aside className="hidden lg:flex lg:h-dvh lg:w-[272px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
            <div className="flex items-center gap-3 border-b border-border px-5 py-5">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="mt-1.5 h-2.5 w-20" />
              </div>
            </div>
            <div className="flex flex-col gap-2 px-3 py-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-xl" />
              ))}
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col lg:h-dvh">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/85 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-md">
              <div className="flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </header>

            <main className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-8 lg:pb-14 lg:pt-6">
              <Skeleton className="h-28 w-full rounded-[var(--radius-card)] lg:col-span-5" />
              <Skeleton className="h-24 w-full rounded-[var(--radius-card)] lg:col-span-7" />
              <div className="flex flex-col gap-2.5 lg:col-span-7">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <div className="flex flex-col gap-2.5 lg:col-span-5">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </main>
          </div>
        </div>

        {variant === 'student' && (
          <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-border bg-bg/90 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 rounded-lg" />
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}
