import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GAMES } from '../data/games'
import { TEAMS } from '../data/teams'
import TeamDisplay, { StyleInjector } from '../components/ExerciseAnimation'
import { getWeekKey } from '../utils/dates'

function fmtTime(s) {
  const m = Math.floor(s / 60), sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// ─── GAME PICK ROW ────────────────────────────────────────────────────────

function GamePickRow({ game, pick, onPick, onClear }) {
  const away = TEAMS[game.away] || {}
  const home = TEAMS[game.home] || {}
  const isPicked = !!pick

  return (
    <div style={{ background: isPicked ? (TEAMS[pick]?.color || '#22c55e') : '#111827', border: isPicked ? 'none' : '1px solid #1e293b', borderRadius: 14, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Away */}
        <div onClick={() => !isPicked && onPick(game.away)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 8px',
            background: pick === game.away ? `${away.color}cc` : 'transparent',
            opacity: isPicked && pick !== game.away ? 0.35 : 1,
            cursor: isPicked ? 'default' : 'pointer',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            transition: 'all 0.15s ease' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{game.away}</div>
          <div style={{ fontSize: 11, color: isPicked && pick === game.away ? 'rgba(255,255,255,0.7)' : '#64748b', marginTop: 4 }}>Away</div>
        </div>
        {/* VS / check */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px', fontSize: isPicked ? 18 : 12, color: isPicked ? 'rgba(255,255,255,0.8)' : '#334155', fontWeight: 700 }}>
          {isPicked ? '✓' : '@'}
        </div>
        {/* Home */}
        <div onClick={() => !isPicked && onPick(game.home)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 8px',
            background: pick === game.home ? `${home.color}cc` : 'transparent',
            opacity: isPicked && pick !== game.home ? 0.35 : 1,
            cursor: isPicked ? 'default' : 'pointer',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
            transition: 'all 0.15s ease' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{game.home}</div>
          <div style={{ fontSize: 11, color: isPicked && pick === game.home ? 'rgba(255,255,255,0.7)' : '#64748b', marginTop: 4 }}>Home</div>
        </div>
      </div>
      {isPicked && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px', background: 'rgba(0,0,0,0.25)', cursor: 'pointer' }} onClick={onClear}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 700 }}>Change Pick</span>
        </div>
      )}
    </div>
  )
}

// ─── PICKS PAGE ───────────────────────────────────────────────────────────

export default function PicksPage({ picks: picksData, lockPick, submitPicks }) {
  const navigate = useNavigate()
  const { dayIndex: weekParam } = useParams()
  const week = parseInt(weekParam, 10)

  const weekKey = getWeekKey(week)
  const weekPicks = picksData[weekKey] || { games: [], picks: {} }
  const allGames = GAMES[week] || []
  const games = allGames.filter(g => weekPicks.games?.includes(g.id))

  const [gameIndex, setGameIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [localPicks, setLocalPicks] = useState(weekPicks.picks || {})

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const currentGame = games[gameIndex]
  const pickedCount = Object.keys(localPicks).length
  const isLastGame = gameIndex === games.length - 1
  const nextGame = games[gameIndex + 1]
  const currentPick = currentGame ? localPicks[currentGame.id] : null

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
  async function handleSubmit() {
    await submitPicks(week)
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
    <div style={{ background: '#0b1120', minHeight: '100vh', color: '#f1f5f9', fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: 40 }}>
      <StyleInjector />

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #111827' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Exit</button>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color: '#94a3b8' }}>GAME {gameIndex + 1}/{games.length}</div>
        <button onClick={() => setGameIndex(0)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Games</button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111827', padding: '10px 0' }}>
        {[{ label: 'Time', value: fmtTime(elapsed) }, { label: 'Picked', value: String(pickedCount) }, { label: 'Week', value: String(week) }].map((stat, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative', borderRight: i < 2 ? '1px solid #1e293b' : 'none' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "'DM Mono',monospace" }}>{stat.value}</div>
            {i < 2 && <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: '50%', background: '#334155' }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        {/* Current game card */}
        {currentGame && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{currentGame.net} · {currentGame.time}</span>
              {currentGame.type === 'primetime' && <span style={{ fontSize: 10, fontWeight: 700, background: '#facc1520', color: '#facc15', border: '1px solid #facc1540', borderRadius: 4, padding: '2px 7px' }}>PRIMETIME</span>}
              {currentGame.type === 'divisional' && <span style={{ fontSize: 10, fontWeight: 700, background: '#f9731620', color: '#f97316', border: '1px solid #f9731640', borderRadius: 4, padding: '2px 7px' }}>RIVALRY</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <TeamDisplay abbr={currentGame.away} size={72} />
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{currentAway.city}</div>
              </div>
              <div style={{ fontSize: 20, color: '#334155', fontWeight: 900 }}>@</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <TeamDisplay abbr={currentGame.home} size={72} />
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{currentHome.city}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pick row */}
        {currentGame && (
          <GamePickRow
            game={currentGame}
            pick={currentPick}
            onPick={handlePick}
            onClear={handleClear}
          />
        )}

        {!currentPick && (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#475569', padding: '8px 0 16px', fontWeight: 600 }}>Tap a team to make your pick</div>
        )}

        {currentPick && !isLastGame && (
          <button onClick={() => { setGameIndex(i => i + 1) }} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 16, marginTop: 8 }}>
            Next Game →
          </button>
        )}
        {currentPick && isLastGame && (
          <button onClick={handleSubmit} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 16, marginTop: 8 }}>
            Submit All Picks 🏆
          </button>
        )}

        {/* Next game preview */}
        {nextGame && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>Next Game</div>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#0a1628' }}>
                <TeamDisplay abbr={nextGame.away} size={48} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 2 }}>
                  {TEAMS[nextGame.away]?.name} @ {TEAMS[nextGame.home]?.name}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{nextGame.time} · {nextGame.net}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#0a1628' }}>
                <TeamDisplay abbr={nextGame.home} size={48} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
