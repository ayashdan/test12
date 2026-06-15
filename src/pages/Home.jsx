import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GAMES } from '../data/games'
import { MODES } from '../data/modes'
import { TEAMS } from '../data/teams'
import TeamDisplay, { StyleInjector } from '../components/ExerciseAnimation'
import DivisionBadge from '../components/MuscleSilhouette'
import { getCurrentNFLWeek, getWeekKey } from '../utils/dates'

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────

function BottomNav({ active, onNav }) {
  const tabs = [
    { id: 'picks', label: 'Picks', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { id: 'games', label: 'Games', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M2 12h20M12 5c-2 2-2 10 0 14M12 5c2 2 2 10 0 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )},
    { id: 'standings', label: 'Standings', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )},
    { id: 'record', label: 'Record', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline points="3,18 8,12 13,15 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="21" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )},
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#0b1120', borderTop: '1px solid #1e293b',
      display: 'flex', zIndex: 100,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '10px 4px 12px', background: 'none', border: 'none',
            cursor: 'pointer', color: isActive ? '#22c55e' : '#475569', transition: 'color 0.15s ease',
          }}>
            {t.icon}
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── FEATURED GAME CARD ───────────────────────────────────────────────────

function FeaturedGameCard({ game, onSwap }) {
  const away = TEAMS[game.away] || {}
  const home = TEAMS[game.home] || {}

  return (
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DivisionBadge division={`${away.conf} ${away.div}`} size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', lineHeight: 1.2 }}>
              {away.city} {away.name} @ {home.city} {home.name}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', marginTop: 2 }}>{game.net} · {game.time}</div>
          </div>
        </div>
        <button onClick={onSwap} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #1e293b', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 16 }}>⇄</button>
      </div>

      {/* Teams visual */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '18px 14px', background: '#0a1628', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <TeamDisplay abbr={game.away} size={80} />
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{away.city}</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#1e293b' }}>@</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <TeamDisplay abbr={game.home} size={80} />
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{home.city}</div>
        </div>
      </div>

      {game.type === 'primetime' && (
        <div style={{ padding: '8px 14px' }}>
          <div style={{ display: 'inline-block', background: '#facc1520', border: '1px solid #facc1540', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#facc15', fontFamily: "'DM Mono',monospace" }}>PRIMETIME GAME</div>
        </div>
      )}
    </div>
  )
}

function SmallGameRow({ game }) {
  const away = TEAMS[game.away] || {}
  const home = TEAMS[game.home] || {}

  return (
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: '#0a1628', overflow: 'hidden' }}>
        <TeamDisplay abbr={game.away} size={44} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 2 }}>
          {away.name} @ {home.name}
        </div>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono',monospace" }}>{game.time} · {game.net}</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: '#0a1628', overflow: 'hidden' }}>
        <TeamDisplay abbr={game.home} size={44} />
      </div>
    </div>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────

export default function HomePage({ mode, picks, completedWeeks, saveMode, savePicks }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState('picks')
  const [selectedWeek, setSelectedWeek] = useState(getCurrentNFLWeek())
  const [rating, setRating] = useState(0)
  const [featuredIdx, setFeaturedIdx] = useState(0)

  const modeObj = mode ? MODES[mode] : null
  const allGames = GAMES[selectedWeek] || []
  const modeGames = modeObj
    ? (mode === 'afc' || mode === 'nfc'
        ? allGames.filter(g => modeObj.filter(g, TEAMS))
        : allGames.filter(g => modeObj.filter(g)))
    : allGames.slice(0, 4)

  const weekKey = getWeekKey(selectedWeek)
  const weekPickData = picks[weekKey]
  const games = weekPickData
    ? allGames.filter(g => weekPickData.games?.includes(g.id))
    : modeGames.slice(0, 6)

  const fi = featuredIdx % Math.max(games.length, 1)
  const featured = games[fi]

  function handleStartPicks() {
    if (!weekPickData && games.length) savePicks(selectedWeek, games.map(g => g.id))
    navigate(`/workout/${selectedWeek}`)
  }

  function handleNav(tab) {
    setActiveTab(tab)
    if (tab === 'settings') navigate('/plan')
  }

  const btnPrimary = {
    background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#0b1120',
    border: 'none', borderRadius: 14, padding: '15px 20px',
    fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: '0.06em',
    fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase',
    boxShadow: '0 4px 24px rgba(34,197,94,0.25)',
  }

  const visibleWeeks = Array.from({ length: 4 }, (_, i) => i + 1)

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', color: '#f1f5f9', fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: 80 }}>
      <StyleInjector />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px 12px', position: 'sticky', top: 0, zIndex: 10, background: '#0b1120', borderBottom: '1px solid #111827' }}>
        <button onClick={() => navigate('/plan')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#f1f5f9' }}>My Picks</span>
          <span style={{ color: '#64748b', fontSize: 14 }}>▾</span>
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18 }}>🏈</button>
          <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18 }} title="Sign out">⚙️</button>
        </div>
      </div>

      <div style={{ padding: '12px 16px 0' }}>

        {!mode && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#111827', border: '1px dashed #1e293b', borderRadius: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏈</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>No mode selected</div>
            <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Choose a prediction mode to start picking games.</div>
            <button style={btnPrimary} onClick={() => navigate('/plan')}>Choose a Mode →</button>
          </div>
        )}

        {mode && (
          <>
            {/* Mode rating */}
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>How's your pick accuracy?</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(i => (
                  <button key={i} onClick={() => setRating(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: i <= rating ? '#22c55e' : '#334155', padding: '0 1px', lineHeight: 1 }}>★</button>
                ))}
              </div>
            </div>

            {/* Week tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
              {visibleWeeks.map(w => {
                const isActive = w === selectedWeek
                const isDone = !!completedWeeks[getWeekKey(w)]
                return (
                  <button key={w} onClick={() => { setSelectedWeek(w); setFeaturedIdx(0) }} style={{
                    flexShrink: 0, background: isActive ? '#1e3a5f' : '#111827',
                    border: `1px solid ${isActive ? '#3b82f6' : '#1e293b'}`, borderRadius: 20, padding: '6px 16px',
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#60a5fa' : isDone ? '#22c55e' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}>
                    {isDone ? '✓ ' : ''}Week {w}
                  </button>
                )
              })}
            </div>

            {/* Picks header */}
            <div style={{ marginBottom: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', marginBottom: 4 }}>NFL 2026 Season · {MODES[mode]?.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.08em', color: '#f1f5f9', textTransform: 'uppercase' }}>Week {selectedWeek} Matchups</div>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>{games.length} games to predict</div>
                </div>
                <button onClick={() => navigate(`/builder/${selectedWeek}`)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: '#94a3b8', fontSize: 14, flexShrink: 0 }}>✎</button>
              </div>
            </div>

            {games.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', background: '#111827', borderRadius: 14, border: '1px solid #1e293b', marginBottom: 12 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
                <div style={{ fontWeight: 700, color: '#94a3b8' }}>No games this week</div>
              </div>
            ) : (
              <>
                {featured && (
                  <FeaturedGameCard game={featured} onSwap={() => setFeaturedIdx(i => i + 1)} />
                )}
                {games.filter((_, i) => i !== fi).slice(0, 3).map(game => (
                  <SmallGameRow key={game.id} game={game} />
                ))}
                {games.length > 4 && (
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#475569', marginBottom: 12 }}>+{games.length - 4} more games</div>
                )}
                <button onClick={handleStartPicks} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 8 }}>
                  MAKE PICKS
                </button>
              </>
            )}
          </>
        )}
      </div>

      <BottomNav active={activeTab} onNav={handleNav} />
    </div>
  )
}
