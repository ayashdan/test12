import { useNavigate } from 'react-router-dom'
import { MODES } from '../data/modes'
import { S } from '../styles'

export default function ModePage({ mode, saveMode }) {
  const navigate = useNavigate()

  return (
    <div style={S.app}>
      <div style={S.container}>
        <div style={S.header}>
          <button style={S.btnGhost} onClick={() => navigate('/')}>← Back</button>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.05em', marginBottom: 6 }}>CHOOSE YOUR MODE</div>
        <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          Select which games you want to make predictions on each week.
        </div>

        {Object.entries(MODES).map(([key, m]) => {
          const isActive = mode === key
          return (
            <div key={key}
              style={{
                ...S.card,
                border: `1px solid ${isActive ? 'rgba(34,197,94,0.6)' : '#1e293b'}`,
                background: isActive ? 'rgba(34,197,94,0.06)' : '#0f172a',
                marginBottom: 12,
                cursor: 'pointer',
              }}
              onClick={() => { saveMode(key); navigate('/') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>{m.label}</div>
                  <div style={{
                    display: 'inline-block', marginTop: 4,
                    background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 4, fontSize: 10, fontWeight: 700,
                    padding: '2px 8px', letterSpacing: '0.04em',
                  }}>{m.subtitle}</div>
                </div>
                {isActive && <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 700 }}>✓ Active</div>}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{m.description}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
