import type { ReactNode } from 'react'

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="ambient-bg relative flex min-h-dvh w-full justify-center bg-surface-2/50 lg:bg-surface-2">
      <div className="relative flex min-h-dvh w-full max-w-[560px] flex-col border-x border-border bg-bg lg:max-w-none lg:border-x-0 lg:bg-transparent">
        {children}
      </div>
    </div>
  )
}
