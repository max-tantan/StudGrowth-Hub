interface BloomPetal {
  color: string
  score: number
  label: string
}

interface GrowthBloomProps {
  petals: BloomPetal[]
  size?: number
  className?: string
}

export function GrowthBloom({ petals, size = 240, className }: GrowthBloomProps) {
  const c = 100
  const maxL = 72
  const n = Math.max(petals.length, 1)

  return (
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
        return (
          <path
            key={p.label}
            d={d}
            className="animate-bloom"
            style={{
              fill: p.color,
              fillOpacity: 0.22,
              stroke: p.color,
              strokeWidth: 1.5,
              transformOrigin: '50% 50%',
              animationDelay: `${i * 70}ms`,
            }}
          />
        )
      })}

      <circle cx={c} cy={c} r={7} style={{ fill: 'var(--accent-strong)' }} />
      <circle cx={c} cy={c} r={12} style={{ fill: 'none', stroke: 'var(--accent-strong)', strokeOpacity: 0.4 }} />
    </svg>
  )
}
