import { MUSCLE_COLORS, DIFF_COLOR } from '../data/exercises'
import MuscleSilhouette from './MuscleSilhouette'

function StatCircle({ value, label, active = false, color = '#334155' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 62, height: 62, borderRadius: '50%',
        border: `2.5px solid ${active ? color : '#1e293b'}`,
        background: active ? `${color}18` : '#0a1628',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 700, fontSize: 14,
          color: active ? color : '#475569',
          textAlign: 'center', lineHeight: 1.2,
        }}>{value}</span>
      </div>
      <span style={{
        fontSize: 10, color: '#475569', fontWeight: 600,
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  )
}

export default function ExerciseCard({ ex, selected, done, onToggle }) {
  const color = MUSCLE_COLORS[ex.muscle] || '#f97316'
  const diffColor = DIFF_COLOR[ex.diff]
  const [setsNum, repsStr] = ex.sets.split('×')

  return (
    <div onClick={onToggle} style={{
      background: done ? 'rgba(34,197,94,0.05)' : selected ? 'rgba(249,115,22,0.06)' : '#0f172a',
      border: `1px solid ${done ? 'rgba(34,197,94,0.4)' : selected ? 'rgba(249,115,22,0.55)' : '#1e293b'}`,
      borderRadius: 16,
      overflow: 'hidden',
      cursor: onToggle ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
      opacity: done ? 0.8 : 1,
      marginBottom: 12,
    }}>

      {/* ── Top bar: muscle tag + diff + video link ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px 0',
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: `${color}25`, color, border: `1px solid ${color}50`,
            borderRadius: 4, padding: '2px 8px', letterSpacing: '0.05em',
          }}>{ex.muscle.toUpperCase()}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: diffColor }}>{ex.diff}</span>
        </div>
        <a href={ex.url} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '4px 10px', textDecoration: 'none',
          }}>
          <span style={{ color, fontSize: 9 }}>▶</span>
          <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600 }}>Video</span>
        </a>
      </div>

      {/* ── Main area: figure + info ── */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* Muscle figure — large, dark bg panel */}
        <div style={{
          background: 'rgba(10,22,40,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px 10px',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          minWidth: 110,
        }}>
          <MuscleSilhouette muscles={[ex.muscle]} size={90} />
        </div>

        {/* Right panel: name + circles */}
        <div style={{ flex: 1, padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

          {/* Name + checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
            <div style={{
              fontWeight: 800, fontSize: 15, color: '#f8fafc', lineHeight: 1.3, flex: 1,
              textDecoration: done ? 'line-through' : 'none',
            }}>{ex.name}</div>
            {onToggle && (
              <div style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                border: `2px solid ${done ? 'transparent' : selected ? '#f97316' : '#334155'}`,
                background: done ? '#22c55e' : selected ? 'rgba(249,115,22,0.2)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: done ? '#fff' : selected ? '#f97316' : '#475569',
                transition: 'all 0.15s ease',
              }}>{done ? '✓' : selected ? '✓' : '+'}</div>
            )}
          </div>

          {/* Stat circles */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around' }}>
            <StatCircle value={repsStr || ex.sets} label="Reps" active color={color} />
            <StatCircle value={setsNum} label="Sets" active={false} />
            <StatCircle
              value={done ? '✓' : selected ? '✓' : '—'}
              label={done ? 'Done' : 'Status'}
              active={done || selected}
              color={done ? '#22c55e' : '#f97316'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
