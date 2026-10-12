import type { ComponentPropsWithoutRef } from 'react'
import { ICONS } from './icons'
import type { IconName } from './icons'

type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'name'> {
  name: IconName
  size?: number
  weight?: PhosphorWeight
}

export function Icon({
  name,
  size = 20,
  weight = 'regular',
  ...rest
}: IconProps) {
  const Glyph = ICONS[name]
  return (
    <Glyph
      size={size}
      weight={weight}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  )
}
