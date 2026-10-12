import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/Button'

interface TopBarProps {
  title?: ReactNode
  subtitle?: string
  showBack?: boolean
  backTo?: string
  onBack?: () => void
  right?: ReactNode
  className?: string
}

export function TopBar({
  title,
  subtitle,
  showBack = false,
  backTo,
  onBack,
  right,
  className,
}: TopBarProps) {
  const navigate = useNavigate()
  const handleBack = () => {
    if (onBack) onBack()
    else if (backTo) navigate(backTo)
    else navigate(-1)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-bg/85 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-md',
        className,
      )}
    >
      {showBack && (
        <IconButton
          name="arrowLeft"
          label="Kembali"
          tone="ghost"
          onClick={handleBack}
          className="-ml-2"
        />
      )}
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className="truncate text-lg font-bold text-fg">{title}</h1>
        )}
        {subtitle && (
          <p className="truncate text-xs text-fg-muted">{subtitle}</p>
        )}
      </div>
      {right && <div className="flex items-center gap-1">{right}</div>}
    </header>
  )
}
