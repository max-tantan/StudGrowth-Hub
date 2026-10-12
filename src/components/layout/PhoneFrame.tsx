import type { ReactNode } from 'react'

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh w-full justify-center bg-surface-2/50">
      <div className="relative flex min-h-dvh w-full max-w-[560px] flex-col border-x border-border bg-bg">
        {children}
      </div>
    </div>
  )
}
