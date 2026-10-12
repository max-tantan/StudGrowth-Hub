import { useState } from 'react'
import { cn } from '../../lib/cn'

interface BloomPetal {
  color: string
  score: number
  label: string
}

interface GrowthBloomProps {
  petals: BloomPetal[]
  size?: number
  className?: string
  interactive?: boolean
  onPetalClick?: (label: string) => void
}

export function GrowthBloom({
  petals,
  size = 240,
  className,
  interactive = false,
  onPetalClick,
}: GrowthBloomProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const c = 100
  const maxL = 72
  const n = Math.max(petals.length, 1)
  const active = interactive && hovered !== null ? petals[hovered] : null

  return (
    <div
      className="flex shrink-0 flex-col items-center"
      style={{ width: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={className}
        role="img"
        aria-label="Bunga pertumbuhan dimensi karakter"
      >
        {[0.42, 0.72, 1].map((f) => (
          <circle
            key={f}
            cx={c}
            cy={c}
            r={maxL * f}
            style={{ fill: 'none', stroke: 'var(--border-strong)' }}
            strokeDasharray="2 5"
            strokeWidth={1}
          />
        ))}

        {petals.map((p, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2
          const length = Math.max(20, (p.score / 100) * maxL)
          const width = length * 0.54
          const tipX = c + length * Math.cos(angle)
          const tipY = c + length * Math.sin(angle)
          const c1x = c + width * Math.cos(angle - 0.9)
          const c1y = c + width * Math.sin(angle - 0.9)
          const c2x = c + width * Math.cos(angle + 0.9)
          const c2y = c + width * Math.sin(angle + 0.9)
          const d = `M ${c} ${c} Q ${c1x} ${c1y} ${tipX} ${tipY} Q ${c2x} ${c2y} ${c} ${c}`
          const isActive = hovered === i
          return (
            <path
              key={p.label}
              d={d}
              className={cn(
                'animate-bloom',
                interactive && 'cursor-pointer transition-[fill-opacity,stroke-width] duration-200',
              )}
              style={{
                fill: p.color,
                fillOpacity: isActive ? 0.5 : 0.22,
                stroke: p.color,
                strokeWidth: isActive ? 2.5 : 1.5,
                transformOrigin: '50% 50%',
                animationDelay: `${i * 70}ms`,
              }}
              onMouseEnter={interactive ? () => setHovered(i) : undefined}
              onMouseLeave={interactive ? () => setHovered(null) : undefined}
              onClick={
                interactive && onPetalClick ? () => onPetalClick(p.label) : undefined
              }
            >
              <title>{`${p.label} · ${p.score}`}</title>
            </path>
          )
        })}

        <circle cx={c} cy={c} r={7} style={{ fill: 'var(--accent-strong)' }} />
        <circle
          cx={c}
          cy={c}
          r={12}
          style={{ fill: 'none', stroke: 'var(--accent-strong)', strokeOpacity: 0.4 }}
        />
      </svg>

      {interactive && (
        <div className="mt-1 flex h-5 items-center justify-center">
          {active && (
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold text-fg">
              {active.label} · <span className="font-mono">{active.score}</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}