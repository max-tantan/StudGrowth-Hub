import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/Button'
import { Icon } from '../ui/Icon'

const CRUMB_LABELS: Record<string, string> = {
  '/beranda': 'Beranda',
  '/jurnal': 'Jurnal',
  '/konsultasi': 'Konsultasi',
  '/perkembangan': 'Tumbuh',
  '/resume': 'Resume',
  '/pkl': 'PKL',
  '/profil': 'Profil',
}

interface TopBarProps {
  title?: ReactNode
  subtitle?: string
  showBack?: boolean
  backTo?: string
  onBack?: () => void
  right?: ReactNode
  className?: string
  lgHideText?: boolean
}

export function TopBar({
  title,
  subtitle,
  showBack = false,
  backTo,
  onBack,
  right,
  className,
  lgHideText = false,
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
          className="-ml-2 lg:hidden"
        />
      )}
      {showBack && backTo && (
        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 flex-1 items-center gap-2 lg:flex"
        >
          <Link
            to={backTo}
            className="shrink-0 text-[13px] font-semibold text-fg-subtle transition-colors hover:text-fg"
          >
            {CRUMB_LABELS[backTo] ?? 'Kembali'}
          </Link>
          <Icon
            name="caretRight"
            size={12}
            weight="bold"
            className="shrink-0 text-fg-subtle"
          />
          {title && <h1 className="truncate text-lg font-bold text-fg">{title}</h1>}
        </nav>
      )}
      <div
        className={cn(
          'min-w-0 flex-1',
          showBack && backTo && 'lg:hidden',
          lgHideText && 'lg:hidden',
        )}
      >
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
