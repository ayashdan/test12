import { TEAMS, DIVISION_COLORS } from '../data/teams'

// Division badge — replaces muscle silhouette
export default function DivisionBadge({ division, size = 40 }) {
  const color = DIVISION_COLORS[division] || '#475569'
  const parts = (division || '').split(' ')
  const conf = parts[0] || ''
  const div  = parts[1] || ''

  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.2),
      background: color, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 1, flexShrink: 0,
    }}>
      <div style={{ fontSize: size * 0.22, fontWeight: 900, color: 'white', letterSpacing: '0.04em', lineHeight: 1 }}>{conf}</div>
      <div style={{ fontSize: size * 0.17, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em', lineHeight: 1 }}>{div.toUpperCase()}</div>
    </div>
  )
}

// Team color dot — used in small spots where silhouette was shown
export function TeamDot({ abbr, size = 34 }) {
  const team = TEAMS[abbr]
  if (!team) return null
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.25),
      background: team.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontSize: size * 0.28, fontWeight: 900, color: 'white', fontFamily: 'DM Mono, monospace' }}>{abbr}</span>
    </div>
  )
}
