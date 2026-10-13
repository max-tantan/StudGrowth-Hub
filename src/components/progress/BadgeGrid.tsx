import { motion } from 'motion/react'
import type { BadgeAward, Major } from '../../types'
import { BADGES } from '../../config/badges'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { BADGE_ICON } from '../ui/icons'
import { EASE_SETTLE } from '../motion/transitions'

interface BadgeGridProps {
  major: Major
  awards: BadgeAward[]
}

export function BadgeGrid({ major, awards }: BadgeGridProps) {
  const earnedIds = new Set(awards.map((a) => a.badgeId))
  const relevant = BADGES.filter(
    (b) => b.major === 'UMUM' || b.major === major,
  )
  const earnedCount = relevant.filter((b) => earnedIds.has(b.id)).length

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-fg">
          {earnedCount} dari {relevant.length} lencana terbuka
        </p>
        <span className="font-mono text-xs text-fg-subtle">
          {Math.round((earnedCount / relevant.length) * 100)}%
        </span>
      </div>
      <motion.ul
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {relevant.map((badge) => {
          const earned = earnedIds.has(badge.id)
          return (
            <motion.li
              key={badge.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: EASE_SETTLE },
                },
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-[var(--radius-card)] border p-3 text-center transition-colors',
                earned
                  ? 'border-accent/25 bg-accent-tint'
                  : 'border-border bg-surface-2/60',
              )}
            >
              <span
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  earned
                    ? 'bg-surface text-accent-strong'
                    : 'bg-surface-3 text-fg-subtle',
                )}
              >
                <Icon
                  name={BADGE_ICON[badge.kind]}
                  size={24}
                  weight={earned ? 'fill' : 'regular'}
                />
              </span>
              <p
                className={cn(
                  'text-[12.5px] font-bold leading-tight',
                  earned ? 'text-fg' : 'text-fg-muted',
                )}
              >
                {badge.name}
              </p>
              <p className="text-[11px] leading-snug text-fg-subtle text-pretty">
                {badge.description}
              </p>
              {!earned && (
                <span className="mt-auto inline-flex items-center gap-1 text-[10px] font-semibold text-fg-subtle">
                  <Icon name="lock" size={11} weight="bold" /> Terkunci
                </span>
              )}
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}
