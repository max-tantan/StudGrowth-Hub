import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <span className="mb-2 inline-flex items-center rounded-full bg-accent-tint px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-strong">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-fg lg:text-[32px] lg:leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-[62ch] text-sm text-fg-muted text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
