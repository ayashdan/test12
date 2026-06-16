import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GameCard from '../components/ExerciseCard'
import { MODES } from '../data/modes'
import { TEAMS } from '../data/teams'
import { espnToGame } from '../data/espnAdapter'
import { S } from '../styles'
import { getWeekKey } from '../utils/dates'
import { useNFLSchedule } from '../hooks/useNFLSchedule'

export default function BuilderPage({ mode, picks, savePicks }) {
  const navigate = useNavigate()
  const { dayIndex: weekParam } = useParams()
  const week = parseInt(weekParam, 10)

  const { games: espnGames, loading } = useNFLSchedule(week)
  const allGames = espnGames.map(espnToGame)

  const modeObj = MODES[mode] || MODES.all
  const filtered = mode === 'afc' || mode === 'nfc'
    ? allGames.filter(g => modeObj.filter(g, TEAMS))
    : allGames.filter(g => modeObj.filter(g))

  const weekKey = getWeekKey(week)
  const existing = picks[weekKey]
  const [selected, setSelected] = useState(existing?.games || [])
  const [divFilter, setDivFilter] = useState('All')

  const divisions = ['All', 'AFC', 'NFC', 'Primetime', 'Divisional']
  const displayed = divFilter === 'All' ? filtered
    : divFilter === 'Primetime' ? filtered.filter(g => g.type === 'primetime')
    : divFilter === 'Divisional' ? filtered.filter(g => g.type === 'divisional')
    : filtered.filter(g => TEAMS[g.away]?.conf === divFilter || TEAMS[g.home]?.conf === divFilter)

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleSave() {
    if (selected.length === 0) return
    savePicks(week, selected)
    navigate('/')
  }

  return (
    <div style={S.app}>
      <div style={S.container}>
        <div style={S.header}>
          <button style={S.btnGhost} onClick={() => navigate('/')}>← Back</button>
          <button style={{ ...S.btnPrimary, opacity: selected.length === 0 ? 0.4 : 1, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}
            onClick={handleSave}>Save ({selected.length})</button>
        </div>

        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4, color: 'var(--text1)' }}>Week {week} Games</div>
        <div style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 16 }}>Select the matchups you want to predict</div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button onClick={() => {
            const allSelected = displayed.every(g => selected.includes(g.id))
            setSelected(prev => allSelected
              ? prev.filter(id => !displayed.find(g => g.id === id))
              : [...new Set([...prev, ...displayed.map(g => g.id)])]
            )
          }} style={{
            background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
            border: '1px solid #3b82f6', borderRadius: 20, padding: '4px 12px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
            {displayed.every(g => selected.includes(g.id)) && displayed.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
          {divisions.map(d => {
            const isActive = divFilter === d
            return (
              <button key={d} onClick={() => setDivFilter(d)} style={{
                background: isActive ? 'rgba(34,197,94,0.18)' : 'transparent',
                color: isActive ? '#22c55e' : 'var(--text2)',
                border: `1px solid ${isActive ? '#22c55e' : 'var(--border)'}`,
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>{d}</button>
            )
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text4)' }}>Loading games...</div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: 'var(--text4)', marginBottom: 12 }}>{displayed.length} games available</div>
            {displayed.map(game => (
              <GameCard key={game.id} game={game}
                selected={selected.includes(game.id)}
                done={false}
                onToggle={() => toggle(game.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
