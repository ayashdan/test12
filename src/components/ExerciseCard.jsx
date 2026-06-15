import { TEAMS } from '../data/teams'

const TYPE_LABEL = { primetime: 'PRIMETIME', divisional: 'RIVALRY', regular: 'REGULAR' }
const TYPE_COLOR = { primetime: '#facc15', divisional: '#f97316', regular: '#60a5fa' }

export default function GameCard({ game, selected, done, onToggle }) {
  const away = TEAMS[game.away] || {}
  const home = TEAMS[game.home] || {}
  const typeColor = TYPE_COLOR[game.type] || '#60a5fa'
  const typeLabel = TYPE_LABEL[game.type] || ''

  return (
    <div onClick={onToggle} style={{
      background: selected ? 'rgba(34,197,94,0.06)' : '#0f172a',
      border: `1px solid ${selected ? 'rgba(34,197,94,0.4)' : '#1e293b'}`,
      borderRadius: 12, padding: 14, marginBottom: 8, cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Teams */}
        <div style={{ flex: 1 }}>
          {/* Away */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: away.color || '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: 'white', fontFamily: 'DM Mono, monospace' }}>{game.away}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>{away.city} {away.name}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>Away</div>
            </div>
          </div>
          {/* Home */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: home.color || '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: 'white', fontFamily: 'DM Mono, monospace' }}>{game.home}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>{home.city} {home.name}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{game.time} · {game.net}</div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', background: `${typeColor}22`, color: typeColor, border: `1px solid ${typeColor}44`, borderRadius: 4, padding: '2px 6px' }}>{typeLabel}</span>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: selected ? '#22c55e' : 'transparent',
            border: `2px solid ${selected ? '#22c55e' : '#334155'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0b1120', fontSize: 13,
          }}>
            {selected && '✓'}
          </div>
        </div>
      </div>
    </div>
  )
}
