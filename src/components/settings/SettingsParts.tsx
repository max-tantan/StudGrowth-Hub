import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/icons'
import { Switch } from '../ui/Switch'

export function SettingsSectionTitle({
  icon,
  children,
}: {
  icon: IconName
  children: ReactNode
}) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-fg">
      <Icon name={icon} size={17} weight="duotone" className="text-accent-strong" />
      {children}
    </h2>
  )
}

export function SettingsDivider() {
  return <div className="h-px bg-border" />
}

export function SettingItem({
  label,
  description,
  children,
  inline = false,
  id,
}: {
  label: string
  description: string
  children: ReactNode
  inline?: boolean
  id?: string
}) {
  return (
    <div
      className={cn(
        'flex gap-3',
        inline ? 'items-center justify-between' : 'flex-col gap-3',
      )}
    >
      <div className="min-w-0 flex-1">
        <p id={id ? `${id}-label` : undefined} className="text-sm font-bold text-fg">
          {label}
        </p>
        <p
          id={id ? `${id}-desc` : undefined}
          className="mt-0.5 text-xs text-fg-muted text-pretty"
        >
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

export function ToggleSetting({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <SettingItem label={label} description={description} inline id={id}>
      <Switch
        checked={checked}
        onChange={onChange}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
      />
    </SettingItem>
  )
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-sm font-semibold text-fg">{value}</span>
    </div>
  )
}
