import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TEAMS } from '../data/teams'
import TeamDisplay, { StyleInjector } from '../components/ExerciseAnimation'
import { getWeekKey } from '../utils/dates'
import { useNFLSchedule } from '../hooks/useNFLSchedule'
import { espnToGame } from '../data/espnAdapter'

function fmtTime(s) {
  const m = Math.floor(s / 60), sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// ─── SCORE INPUTS ─────────────────────────────────────────────────────────

function ScorePrediction({ game, score, onChange }) {
  const inputStyle = {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 6px', fontSize: 26, fontWeight: 900,
    color: 'var(--text1)', textAlign: 'center', fontFamily: 'DM Mono, monospace',
    outline: 'none', boxSizing: 'border-box',
  }
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px', marginBottom: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.08em', textAlign: 'center', marginBottom: 12 }}>PREDICTED SCORE (optional · bonus points)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, fontWeight: 600 }}>{game.away}</div>
          <input type="number" min="0" max="99" placeholder="0"
            value={score?.away ?? ''}
            onChange={e => onChange({ ...score, away: e.target.value })}
            style={inputStyle} />
        </div>
        <div style={{ fontSize: 18, color: 'var(--border2)', fontWeight: 900, flexShrink: 0 }}>—</div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, fontWeight: 600 }}>{game.home}</div>
          <input type="number" min="0" max="99" placeholder="0"
            value={score?.home ?? ''}
            onChange={e => onChange({ ...score, home: e.target.value })}
            style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {[{ label: 'Correct winner', pts: '+3 pts' }, { label: 'Score diff ≤3', pts: '+2' }, { label: 'Exact score', pts: '+2 (total 5)' }].map(b => (
          <div key={b.label} style={{ fontSize: 10, color: 'var(--text4)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px' }}>
            {b.label} <span style={{ color: '#22c55e', fontWeight: 700 }}>{b.pts}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── GAME PICK ROW ────────────────────────────────────────────────────────

function GamePickRow({ game, pick, onPick, onClear }) {
  const away = TEAMS[game.away] || {}
  const home = TEAMS[game.home] || {}
  const isPicked = !!pick
  const pickedTeam = isPicked ? TEAMS[pick] : null

  return (
    <div style={{
      background: isPicked ? (pickedTeam?.color || '#22c55e') : 'var(--bg2)',
      border: isPicked ? 'none' : '1px solid var(--border)',
      borderRadius: 14, marginBottom: 8, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div onClick={() => !isPicked && onPick(game.away)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 8px',
            background: pick === game.away ? `${away.color}cc` : 'transparent',
            opacity: isPicked && pick !== game.away ? 0.3 : 1,
            cursor: isPicked ? 'default' : 'pointer',
            borderRight: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.15s' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: isPicked ? 'white' : 'var(--text1)', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{game.away}</div>
          <div style={{ fontSize: 11, color: isPicked ? 'rgba(255,255,255,0.5)' : 'var(--text3)', marginTop: 4 }}>Away</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: isPicked ? 20 : 13, color: isPicked ? 'rgba(255,255,255,0.8)' : 'var(--border2)', fontWeight: 900 }}>
          {isPicked ? '✓' : '@'}
        </div>
        <div onClick={() => !isPicked && onPick(game.home)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 8px',
            background: pick === game.home ? `${home.color}cc` : 'transparent',
            opacity: isPicked && pick !== game.home ? 0.3 : 1,
            cursor: isPicked ? 'default' : 'pointer',
            borderLeft: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.15s' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: isPicked ? 'white' : 'var(--text1)', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{game.home}</div>
          <div style={{ fontSize: 11, color: isPicked ? 'rgba(255,255,255,0.5)' : 'var(--text3)', marginTop: 4 }}>Home</div>
        </div>
      </div>
      {isPicked && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px', background: 'rgba(0,0,0,0.25)', cursor: 'pointer' }} onClick={onClear}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Change Pick</span>
        </div>
      )}
    </div>
  )
}

// ─── PICKS PAGE ───────────────────────────────────────────────────────────

export default function PicksPage({ picks: picksData, lockPick, lockScore, submitPicks }) {
  const navigate = useNavigate()
  const { dayIndex: weekParam } = useParams()
  const week = parseInt(weekParam, 10)

  const weekKey = getWeekKey(week)
  const weekPickData = picksData[weekKey] || { games: [], picks: {}, scores: {} }
  const { games: espnGames } = useNFLSchedule(week)
  const allGames = espnGames.map(espnToGame)
  const games = allGames.filter(g => weekPickData.games?.includes(g.id))

  const [gameIndex, setGameIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [localPicks, setLocalPicks] = useState(weekPickData.picks || {})
  const [localScores, setLocalScores] = useState(weekPickData.scores || {})

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const currentGame = games[gameIndex]
  const pickedCount = Object.keys(localPicks).length
  const isLastGame = gameIndex === games.length - 1
  const nextGame = games[gameIndex + 1]
  const currentPick = currentGame ? localPicks[currentGame.id] : null
  const currentScore = currentGame ? localScores[currentGame.id] : null

  function handlePick(teamAbbr) {
    if (!currentGame) return
    const updated = { ...localPicks, [currentGame.id]: teamAbbr }
    setLocalPicks(updated)
    lockPick(week, currentGame.id, teamAbbr)
  }
  function handleClear() {
    if (!currentGame) return
    const updated = { ...localPicks }
    delete updated[currentGame.id]
    setLocalPicks(updated)
  }
  function handleScoreChange(s) {
    if (!currentGame) return
    const updated = { ...localScores, [currentGame.id]: s }
    setLocalScores(updated)
    if (s.away !== '' || s.home !== '') lockScore(week, currentGame.id, s.away, s.home)
  }
  async function handleSubmit() {
    const pickedIds = games.filter(g => localPicks[g.id]).map(g => g.id)
    await submitPicks(week, pickedIds)
    navigate('/')
  }

  const currentAway = currentGame ? (TEAMS[currentGame.away] || {}) : {}
  const currentHome = currentGame ? (TEAMS[currentGame.home] || {}) : {}

  const btnPrimary = {
    background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#0b1120',
    border: 'none', borderRadius: 14, padding: '15px 20px',
    fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: '0.06em',
    fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase',
    boxShadow: '0 4px 24px rgba(34,197,94,0.25)',
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text1)', fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: 40 }}>
      <StyleInjector />

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Exit</button>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color: 'var(--text2)' }}>GAME {gameIndex + 1}/{games.length}</div>
        <button onClick={() => setGameIndex(0)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Games</button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
        {[{ label: 'Time', value: fmtTime(elapsed) }, { label: 'Picked', value: String(pickedCount) }, { label: 'Week', value: String(week) }].map((stat, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "'DM Mono',monospace", color: 'var(--text1)' }}>{stat.value}</div>
            {i < 2 && <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: '50%', background: 'var(--border2)' }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        {/* Current game card */}
        {currentGame && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text4)' }}>{currentGame.net} · {currentGame.time}</span>
              {currentGame.type === 'primetime' && <span style={{ fontSize: 10, fontWeight: 700, background: '#facc1520', color: '#facc15', border: '1px solid #facc1540', borderRadius: 4, padding: '2px 7px' }}>PRIMETIME</span>}
              {currentGame.type === 'divisional' && <span style={{ fontSize: 10, fontWeight: 700, background: '#f9731620', color: '#f97316', border: '1px solid #f9731640', borderRadius: 4, padding: '2px 7px' }}>RIVALRY</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <TeamDisplay abbr={currentGame.away} size={72} />
                <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{currentAway.city}</div>
              </div>
              <div style={{ fontSize: 22, color: 'var(--border2)', fontWeight: 900 }}>@</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <TeamDisplay abbr={currentGame.home} size={72} />
                <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{currentHome.city}</div>
              </div>
            </div>
          </div>
        )}

        <GamePickRow game={currentGame || { away: '', home: '' }} pick={currentPick} onPick={handlePick} onClear={handleClear} />

        {currentGame && currentPick && (
          <ScorePrediction game={currentGame} score={currentScore} onChange={handleScoreChange} />
        )}

        {!currentPick && (
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text4)', padding: '8px 0 16px', fontWeight: 600 }}>Tap a team to make your pick</div>
        )}

        {currentPick && !isLastGame && (
          <button onClick={() => setGameIndex(i => i + 1)} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 16, marginTop: 8 }}>
            Next Game →
          </button>
        )}
        {currentPick && isLastGame && (
          <button onClick={handleSubmit} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 16, marginTop: 8 }}>
            Submit All Picks 🏆
          </button>
        )}

        {nextGame && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>Next Game</div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--bg3)' }}>
                <TeamDisplay abbr={nextGame.away} size={48} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text1)', marginBottom: 2 }}>
                  {TEAMS[nextGame.away]?.name} @ {TEAMS[nextGame.home]?.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{nextGame.time} · {nextGame.net}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--bg3)' }}>
                <TeamDisplay abbr={nextGame.home} size={48} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
