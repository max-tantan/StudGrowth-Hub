import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import type { DimensionScore } from '../../types'

interface GrowthRadarProps {
  scores: DimensionScore[]
  height?: number
  color?: string
}

export function GrowthRadar({
  scores,
  height = 260,
  color = 'var(--accent-strong)',
}: GrowthRadarProps) {
  const data = scores.map((s) => ({
    label: s.dimension.short,
    full: s.dimension.label,
    value: s.score,
  }))

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%" margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
          <PolarGrid stroke="var(--border-strong)" strokeDasharray="3 4" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: 'var(--fg-muted)', fontSize: 11, fontWeight: 600 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.24}
            strokeWidth={2}
            isAnimationActive
            animationDuration={650}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
