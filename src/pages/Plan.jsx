import { useNavigate } from 'react-router-dom'
import { PLANS } from '../data/plans'
import { S } from '../styles'

export default function PlanPage({ plan, savePlan }) {
  const navigate = useNavigate()

  return (
    <div style={S.app}>
      <div style={S.container}>
        <div style={S.header}>
          <button style={S.btnGhost} onClick={() => navigate('/')}>← Back</button>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.05em', marginBottom: 6 }}>CHOOSE YOUR PLAN</div>
        <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          Select a weekly training frequency. Your workout slots will be mapped across the week automatically.
        </div>

        {Object.entries(PLANS).map(([key, p]) => {
          const isActive = plan === key
          return (
            <div key={key}
              style={{
                ...S.card,
                border: `1px solid ${isActive ? 'rgba(249,115,22,0.6)' : '#1e293b'}`,
                background: isActive ? 'rgba(249,115,22,0.06)' : '#0f172a',
                marginBottom: 12,
                cursor: 'pointer',
              }}
              onClick={() => { savePlan(key); navigate('/') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>{p.label}</div>
                  <div style={{
                    display: 'inline-block', marginTop: 4,
                    background: 'rgba(249,115,22,0.15)', color: '#f97316',
                    border: '1px solid rgba(249,115,22,0.3)',
                    borderRadius: 4, fontSize: 10, fontWeight: 700,
                    padding: '2px 8px', letterSpacing: '0.04em',
                  }}>{p.subtitle}</div>
                </div>
                {isActive && <div style={{ color: '#f97316', fontSize: 12, fontWeight: 700 }}>✓ Active</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {p.days.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#f97316', fontWeight: 700, fontSize: 12, fontFamily: "'DM Mono', monospace", minWidth: 40 }}>Day {i + 1}</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</span>
                    <span style={{ color: '#475569', fontSize: 11 }}>— {d.muscles.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
