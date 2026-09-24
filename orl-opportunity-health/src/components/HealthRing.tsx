import { BAND_META } from '../lib/health.ts'
import type { Band } from '../types.ts'

type Props = {
  weeks: number
  band: Band
  size?: number
  title: string
}

export function HealthRing({ weeks, band, size = 44, title }: Props) {
  const stroke = Math.max(3, Math.round(size * 0.09))
  const radius = (size - stroke) / 2
  const center = size / 2
  const digits = String(weeks).length
  const fontSize = size >= 80 ? Math.round(size * 0.28) : digits >= 3 ? 11 : 13

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={title}
      className="shrink-0"
    >
      <title>{title}</title>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#e7e5e4"
        strokeWidth={stroke}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={BAND_META[band].stroke}
        strokeWidth={stroke}
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#1c1917"
        fontSize={fontSize}
        fontWeight={600}
        fontFamily="IBM Plex Sans, ui-sans-serif, sans-serif"
      >
        {weeks}
      </text>
    </svg>
  )
}
