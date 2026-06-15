import { TEAMS } from '../data/teams'

// Team helmet display — replaces exercise animations
export default function TeamDisplay({ abbr, size = 60 }) {
  const team = TEAMS[abbr]
  if (!team) return null

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: 'block' }}>
      <ellipse cx="30" cy="30" rx="22" ry="21" fill={team.color} />
      <path d="M 44 36 Q 52 32 50 46 L 46 50 Q 48 40 40 44 Z" fill={team.accent} opacity="0.85" />
      <path d="M 10 22 Q 30 6 50 22" stroke={team.accent} strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="21" cy="19" rx="7" ry="4" fill="white" opacity="0.1" transform="rotate(-25 21 19)" />
      <text x="30" y="37" textAnchor="middle" dominantBaseline="middle"
        fontSize={abbr.length > 2 ? '10' : '12'} fontWeight="900"
        fill="white" fontFamily="DM Mono, monospace" opacity="0.95">{abbr}</text>
    </svg>
  )
}

export function StyleInjector() { return null }
