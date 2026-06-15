import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { GAMES } from '../data/games'
import { MODES } from '../data/modes'
import { TEAMS } from '../data/teams'
import TeamDisplay, { StyleInjector } from '../components/ExerciseAnimation'
import DivisionBadge from '../components/MuscleSilhouette'
import { useLiveScores, calcPoints } from '../hooks/useLiveScores'
import { getCurrentNFLWeek, getWeekKey } from '../utils/dates'
import GroupsTab from '../components/GroupsTab'
import { useGroups } from '../hooks/useGroups'
import { useNFLSchedule } from '../hooks/useNFLSchedule'

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
    { id: 'groups', label: 'Groups', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="18" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M22 20c0-2.761-1.79-5-4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )},
    { id: 'people', label: 'People', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )},
  ]
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg)', borderTop: '1px solid var(--border)', display: 'flex', zIndex: 100 }}>
      {tabs.map(t => {
        const isActive = active === t.id
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '10px 4px 12px', background: 'none', border: 'none',
            cursor: 'pointer', color: isActive ? '#22c55e' : 'var(--text4)', transition: 'color 0.15s ease',
          }}>
            {t.icon}
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── PICKS TAB ────────────────────────────────────────────────────────────

function FeaturedGameCard({ game, onSwap }) {
  const away = TEAMS[game.away] || {}
  const home = TEAMS[game.home] || {}
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DivisionBadge division={`${away.conf} ${away.div}`} size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text1)', lineHeight: 1.2 }}>
              {away.city} {away.name} @ {home.city} {home.name}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', marginTop: 2 }}>{game.net} · {game.time}</div>
          </div>
        </div>
        <button onClick={onSwap} style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', fontSize: 16 }}>⇄</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '18px 14px', background: 'var(--bg3)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <TeamDisplay abbr={game.away} size={80} />
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>{away.city}</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--border2)' }}>@</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <TeamDisplay abbr={game.home} size={80} />
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>{home.city}</div>
        </div>
      </div>
      {game.type === 'primetime' && (
        <div style={{ padding: '8px 14px' }}>
          <div style={{ display: 'inline-block', background: '#facc1520', border: '1px solid #facc1540', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#facc15' }}>PRIMETIME GAME</div>
        </div>
      )}
    </div>
  )
}

function SmallGameRow({ game }) {
  const away = TEAMS[game.away] || {}
  const home = TEAMS[game.home] || {}
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'var(--bg3)', overflow: 'hidden' }}>
        <TeamDisplay abbr={game.away} size={44} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text1)', marginBottom: 2 }}>{away.name} @ {home.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{game.time} · {game.net}</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'var(--bg3)', overflow: 'hidden' }}>
        <TeamDisplay abbr={game.home} size={44} />
      </div>
    </div>
  )
}

function PicksTab({ mode, picks, completedWeeks, savePicks, navigate }) {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentNFLWeek())
  const [rating, setRating] = useState(0)
  const [featuredIdx, setFeaturedIdx] = useState(0)

  const modeObj = mode ? MODES[mode] : null
  const allGames = GAMES[selectedWeek] || []
  const modeGames = modeObj
    ? (mode === 'afc' || mode === 'nfc' ? allGames.filter(g => modeObj.filter(g, TEAMS)) : allGames.filter(g => modeObj.filter(g)))
    : allGames.slice(0, 4)

  const weekKey = getWeekKey(selectedWeek)
  const weekPickData = picks[weekKey]
  const games = weekPickData ? allGames.filter(g => weekPickData.games?.includes(g.id)) : modeGames.slice(0, 6)
  const fi = featuredIdx % Math.max(games.length, 1)
  const featured = games[fi]
  const picksSubmitted = !!completedWeeks[weekKey]

  function handleStartPicks() {
    if (!weekPickData && games.length) savePicks(selectedWeek, games.map(g => g.id))
    navigate(`/workout/${selectedWeek}`)
  }

  const btnPrimary = {
    background: picksSubmitted ? 'var(--bg3)' : 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: picksSubmitted ? 'var(--text3)' : '#0b1120',
    border: `1px solid ${picksSubmitted ? 'var(--border)' : 'transparent'}`,
    borderRadius: 14, padding: '15px 20px', fontWeight: 800, fontSize: 15,
    cursor: 'pointer', letterSpacing: '0.06em', fontFamily: "'DM Sans',sans-serif",
    textTransform: 'uppercase', boxShadow: picksSubmitted ? 'none' : '0 4px 24px rgba(34,197,94,0.25)',
  }

  if (!mode) return (
    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg2)', border: '1px dashed var(--border)', borderRadius: 16 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🏈</div>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: 'var(--text1)' }}>No mode selected</div>
      <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Choose a prediction mode to start picking games.</div>
      <button style={btnPrimary} onClick={() => navigate('/plan')}>Choose a Mode →</button>
    </div>
  )

  return (
    <>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>Rate your picks accuracy</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setRating(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: i <= rating ? '#22c55e' : 'var(--border2)', padding: '0 1px', lineHeight: 1 }}>★</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {[1,2,3,4].map(w => {
          const isActive = w === selectedWeek
          const isDone = !!completedWeeks[getWeekKey(w)]
          return (
            <button key={w} onClick={() => { setSelectedWeek(w); setFeaturedIdx(0) }} style={{
              flexShrink: 0,
              background: isActive ? 'rgba(59,130,246,0.15)' : 'var(--bg2)',
              border: `1px solid ${isActive ? '#3b82f6' : 'var(--border)'}`,
              borderRadius: 20, padding: '6px 16px',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#60a5fa' : isDone ? '#22c55e' : 'var(--text3)',
              cursor: 'pointer',
            }}>
              {isDone ? '✓ ' : ''}Week {w}
            </button>
          )
        })}
      </div>

      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', marginBottom: 4 }}>NFL 2026 · {MODES[mode]?.label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.08em', color: 'var(--text1)', textTransform: 'uppercase' }}>Week {selectedWeek} Matchups</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 2 }}>{games.length} games · {picksSubmitted ? '✓ Picks submitted' : 'Picks open'}</div>
          </div>
          <button onClick={() => navigate(`/builder/${selectedWeek}`)} style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: 'var(--text2)', fontSize: 14, flexShrink: 0 }}>✎</button>
        </div>
      </div>

      {games.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)', marginBottom: 12 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
          <div style={{ fontWeight: 700, color: 'var(--text2)' }}>No games selected</div>
        </div>
      ) : (
        <>
          {featured && <FeaturedGameCard game={featured} onSwap={() => setFeaturedIdx(i => i + 1)} />}
          {games.filter((_, i) => i !== fi).slice(0, 3).map(g => <SmallGameRow key={g.id} game={g} />)}
          {games.length > 4 && <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text4)', marginBottom: 12 }}>+{games.length - 4} more games</div>}
          <button onClick={handleStartPicks} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 8 }}>
            {picksSubmitted ? '✓ PICKS SUBMITTED' : 'MAKE PICKS'}
          </button>
        </>
      )}
    </>
  )
}

// ─── GAMES TAB ────────────────────────────────────────────────────────────

function GameCard({ game, userPick }) {
  const isLive = game.status === 'in'
  const isFinal = game.status === 'post'
  const isPre = game.status === 'pre'

  const awayColor = game.away.color || '#555'
  const homeColor = game.home.color || '#555'

  const countdownStr = game.countdown
    ? [
        game.countdown.days > 0 ? `${game.countdown.days}d` : null,
        game.countdown.hours > 0 ? `${game.countdown.hours}h` : null,
        `${game.countdown.minutes}m`,
      ].filter(Boolean).join(' ')
    : null

  const showWinPct = isPre && game.homeWinPct != null && game.awayWinPct != null
  const awayPct = Math.round(game.awayWinPct)
  const homePct = Math.round(game.homeWinPct)

  return (
    <div style={{
      background: 'var(--bg2)',
      border: `1px solid ${isLive ? '#ef444433' : 'var(--border)'}`,
      borderRadius: 16,
      marginBottom: 12,
      overflow: 'hidden',
    }}>
      {/* Top bar: date + network */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 6px' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)' }}>{game.azDate}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {isLive && (
            <span style={{ fontSize: 9, fontWeight: 800, background: '#ef4444', color: 'white', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.05em' }}>● LIVE</span>
          )}
          {isFinal && (
            <span style={{ fontSize: 9, fontWeight: 700, background: 'var(--bg3)', color: 'var(--text3)', borderRadius: 4, padding: '2px 6px' }}>FINAL</span>
          )}
          {game.network && (
            <span style={{ fontSize: 9, fontWeight: 800, background: 'var(--bg3)', color: 'var(--text2)', borderRadius: 4, padding: '2px 6px', border: '1px solid var(--border)' }}>{game.network}</span>
          )}
        </div>
      </div>

      {/* Teams row */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Away team */}
        <div style={{ flex: 1, background: `${awayColor}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 10px', gap: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: awayColor, fontFamily: "'DM Mono',monospace", letterSpacing: '0.05em' }}>{game.away.abbr}</span>
          <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>{game.away.city}</span>
        </div>

        {/* Center: score or countdown */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', minWidth: 90, background: 'var(--bg3)' }}>
          {(isLive || isFinal) ? (
            <>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--text1)', fontFamily: "'DM Mono',monospace" }}>{game.away.score ?? '–'}</span>
                <span style={{ fontSize: 14, color: 'var(--text4)' }}>–</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--text1)', fontFamily: "'DM Mono',monospace" }}>{game.home.score ?? '–'}</span>
              </div>
              {isLive && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, marginTop: 2 }}>{game.statusText}</span>}
              {isFinal && <span style={{ fontSize: 10, color: 'var(--text4)', marginTop: 2 }}>Final</span>}
            </>
          ) : (
            <>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>{game.azTimePart}</span>
              {countdownStr && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', marginTop: 3 }}>{countdownStr}</span>
              )}
            </>
          )}
        </div>

        {/* Home team */}
        <div style={{ flex: 1, background: `${homeColor}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 10px', gap: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: homeColor, fontFamily: "'DM Mono',monospace", letterSpacing: '0.05em' }}>{game.home.abbr}</span>
          <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>{game.home.city}</span>
        </div>
      </div>

      {/* Win probability bar (pre-game only) */}
      {showWinPct && (
        <div style={{ padding: '10px 14px 8px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.08em', marginBottom: 4, textAlign: 'center' }}>WIN PROBABILITY (ESPN FPI)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: awayColor, minWidth: 30, textAlign: 'right' }}>{awayPct}%</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--bg3)', display: 'flex' }}>
              <div style={{ width: `${awayPct}%`, background: awayColor, transition: 'width 0.4s ease' }} />
              <div style={{ flex: 1, background: homeColor }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: homeColor, minWidth: 30 }}>{homePct}%</span>
          </div>
        </div>
      )}

      {/* Footer: spread + user pick */}
      {(game.spread || game.overUnder != null || userPick) && (
        <div style={{ padding: '6px 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {game.spread && <span style={{ fontSize: 10, color: 'var(--text4)' }}>{game.spread}</span>}
            {game.overUnder != null && <span style={{ fontSize: 10, color: 'var(--text4)' }}>O/U {game.overUnder}</span>}
          </div>
          {userPick && (
            <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6, padding: '2px 8px' }}>
              Your pick: {userPick} ✓
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 100, height: 12, background: 'var(--bg3)', borderRadius: 6 }} />
        <div style={{ width: 40, height: 12, background: 'var(--bg3)', borderRadius: 6 }} />
      </div>
      <div style={{ display: 'flex', height: 72 }}>
        <div style={{ flex: 1, background: 'var(--bg3)' }} />
        <div style={{ width: 90, background: 'var(--bg2)' }} />
        <div style={{ flex: 1, background: 'var(--bg3)' }} />
      </div>
    </div>
  )
}

function GamesTab({ picks }) {
  const [selectedWeek, setSelectedWeek] = useState(1)
  const { games, loading, error } = useNFLSchedule(selectedWeek)

  // Flatten all user picks for quick lookup by game id
  const userPickMap = {}
  Object.values(picks).forEach(data => {
    Object.entries(data.picks || {}).forEach(([gameId, pick]) => {
      userPickMap[gameId] = pick
    })
  })

  return (
    <>
      {/* Week selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {Array.from({ length: 18 }, (_, i) => i + 1).map(w => {
            const isActive = w === selectedWeek
            return (
              <button key={w} onClick={() => setSelectedWeek(w)} style={{
                flexShrink: 0,
                background: isActive ? 'rgba(34,197,94,0.15)' : 'var(--bg2)',
                border: `1px solid ${isActive ? '#22c55e' : 'var(--border)'}`,
                borderRadius: 20, padding: '5px 12px',
                fontSize: 12, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#22c55e' : 'var(--text3)', cursor: 'pointer',
              }}>W{w}</button>
            )
          })}
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text4)', marginBottom: 12 }}>
        NFL 2026 · WEEK {selectedWeek}
      </div>

      {loading && (
        <>
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </>
      )}

      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📡</div>
          <div style={{ fontWeight: 700, color: 'var(--text2)', marginBottom: 4 }}>Schedule unavailable</div>
          <div style={{ fontSize: 12, color: 'var(--text4)' }}>{error}</div>
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--bg2)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
          <div style={{ fontWeight: 700, color: 'var(--text2)' }}>No games scheduled for this week</div>
        </div>
      )}

      {!loading && !error && games.map(game => (
        <GameCard key={game.id} game={game} userPick={userPickMap[game.id]} />
      ))}
    </>
  )
}

// ─── RECORD TAB ───────────────────────────────────────────────────────────

function RecordTab({ picks, totalPoints, correctPicks, totalPicks, streak }) {
  const { getScore } = useLiveScores()
  const accuracy = totalPicks > 0 ? Math.round(correctPicks / totalPicks * 100) : 0

  const allPickEntries = []
  Object.entries(picks).forEach(([weekKey, data]) => {
    const week = parseInt(weekKey.replace('2026-week-', ''))
    const games = GAMES[week] || []
    Object.entries(data.picks || {}).forEach(([gameId, pick]) => {
      const game = games.find(g => g.id === gameId)
      if (!game) return
      const score = getScore(game)
      const predicted = data.scores?.[gameId]
      const result = score ? calcPoints(pick, predicted, score) : null
      allPickEntries.push({ week, game, pick, predicted, score, result })
    })
  })

  const statCard = (label, value, sub, color = 'var(--text1)') => (
    <div style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: 'DM Mono' }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text1)', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 2 }}>{sub}</div>}
    </div>
  )

  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: 'var(--text1)' }}>My Record</div>
      <div style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 16 }}>2026 NFL Season</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {statCard('Points', totalPoints, 'earned', '#facc15')}
        {statCard('Correct', correctPicks, `of ${totalPicks}`, '#22c55e')}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {statCard('Accuracy', totalPicks > 0 ? `${accuracy}%` : '—', 'pick accuracy')}
        {statCard('Streak', streak, 'weeks in a row')}
      </div>

      {/* Points breakdown */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.1em', marginBottom: 12 }}>POINTS BREAKDOWN</div>
        {[
          { label: 'Correct winner', pts: '3 pts' },
          { label: 'Score diff ≤7', pts: '+1 pt' },
          { label: 'Score diff ≤3', pts: '+2 pts' },
          { label: 'Exact score', pts: '5 pts total' },
        ].map(b => (
          <div key={b.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>{b.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', fontFamily: 'DM Mono' }}>{b.pts}</span>
          </div>
        ))}
      </div>

      {allPickEntries.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.1em', marginBottom: 10 }}>PICK HISTORY</div>
          {allPickEntries.slice().reverse().map((entry, i) => {
            const pickedTeam = TEAMS[entry.pick] || {}
            return (
              <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text1)' }}>
                      {TEAMS[entry.game.away]?.name} @ {TEAMS[entry.game.home]?.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 2 }}>
                      Week {entry.week} · Picked: <span style={{ color: pickedTeam.color || '#22c55e', fontWeight: 700 }}>{entry.pick}</span>
                    </div>
                    {entry.predicted?.away !== undefined && entry.predicted?.away !== '' && (
                      <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 1 }}>Predicted: {entry.predicted.away}–{entry.predicted.home}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {entry.result ? (
                      <>
                        <div style={{ fontSize: 16, fontWeight: 900, color: entry.result.correct ? '#22c55e' : '#ef4444', fontFamily: 'DM Mono' }}>
                          {entry.result.correct ? `+${entry.result.pts}` : '0'}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text4)' }}>{entry.result.correct ? 'correct' : 'wrong'}</div>
                        {entry.score && <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 2 }}>{entry.score.away}–{entry.score.home}</div>}
                      </>
                    ) : (
                      <div style={{ fontSize: 10, color: 'var(--text4)', background: 'var(--bg3)', borderRadius: 6, padding: '3px 8px' }}>Pending</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}

      {allPickEntries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text4)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, color: 'var(--text1)' }}>No picks yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Head to the Picks tab to make your first predictions</div>
        </div>
      )}
    </>
  )
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────

// ─── PEOPLE TAB ───────────────────────────────────────────────────────────

function PeopleTab({ leaderboard, uid }) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--text1)', marginBottom: 4 }}>People</div>
      <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>{leaderboard.length} players in the app</div>
      {leaderboard.map((person, i) => {
        const isMe = person.uid === uid
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
        return (
          <div key={person.uid} style={{
            background: isMe ? 'rgba(34,197,94,0.06)' : 'var(--bg2)',
            border: `1px solid ${isMe ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
            borderRadius: 14, padding: '12px 14px', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text4)', minWidth: 28, textAlign: 'center', fontFamily: 'DM Mono' }}>
              {medal || `#${i + 1}`}
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: 'var(--text2)', flexShrink: 0 }}>
              {(person.displayName || '?')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: isMe ? '#22c55e' : 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {person.displayName || 'Unknown'}{isMe ? ' (you)' : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#facc15', fontFamily: 'DM Mono' }}>{person.totalPoints || 0}</div>
              <div style={{ fontSize: 10, color: 'var(--text4)' }}>pts</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────

function SettingsTab({ mode, saveMode, logout }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: 'var(--text1)' }}>Settings</div>
      <div style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 20 }}>Prediction mode & preferences</div>

      {/* Theme toggle */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.1em', marginBottom: 10 }}>APPEARANCE</div>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text1)' }}>{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</div>
          <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 2 }}>Tap to switch</div>
        </div>
        <div onClick={toggleTheme} style={{
          width: 52, height: 28, borderRadius: 14,
          background: theme === 'dark' ? '#22c55e' : 'var(--border2)',
          position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
        }}>
          <div style={{
            position: 'absolute', top: 3, left: theme === 'dark' ? 27 : 3,
            width: 22, height: 22, borderRadius: '50%', background: 'white',
            transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }} />
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.1em', marginBottom: 10 }}>PREDICTION MODE</div>
      {Object.entries(MODES).map(([key, m]) => {
        const isActive = mode === key
        return (
          <div key={key} onClick={() => saveMode(key)} style={{
            background: isActive ? 'rgba(34,197,94,0.06)' : 'var(--bg2)',
            border: `1px solid ${isActive ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
            borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text1)' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 2 }}>{m.subtitle}</div>
              </div>
              {isActive && <span style={{ fontSize: 18, color: '#22c55e' }}>✓</span>}
            </div>
          </div>
        )
      })}

      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text4)', letterSpacing: '0.1em', marginTop: 24, marginBottom: 10 }}>ACCOUNT</div>
      <button onClick={logout} style={{
        width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '14px', color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer',
      }}>
        Sign Out
      </button>
    </>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────

export default function HomePage({ mode, picks, completedWeeks, totalPoints, correctPicks, totalPicks, streak, leaderboard, userRank, saveMode, savePicks, applyResults, user }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('picks')
  const { groups, loading: groupsLoading, isGlobalAdmin, createGroup, joinGroup, getGroupMembers, adjustPoints, promoteAdmin, demoteAdmin, removeMember, leaveGroup, getAllUsers, addMemberByUid } = useGroups(user?.uid, user?.displayName, user?.photoURL)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text1)', fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: 80 }}>
      <StyleInjector />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px 12px', position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Football SVG logo with floating numbers */}
          <div style={{ position: 'relative', width: 44, height: 44 }}>
            {/* Floating score numbers */}
            <span style={{ position: 'absolute', top: -8, left: -4, fontSize: 9, fontWeight: 900, color: '#22c55e', fontFamily: 'DM Mono,monospace', animation: 'none', opacity: 0.9 }}>21</span>
            <span style={{ position: 'absolute', top: -8, right: -4, fontSize: 9, fontWeight: 900, color: '#facc15', fontFamily: 'DM Mono,monospace', opacity: 0.9 }}>17</span>
            <svg width="44" height="34" viewBox="0 0 44 34" fill="none" style={{ position: 'absolute', top: 6, left: 0 }}>
              {/* Ball body */}
              <ellipse cx="22" cy="17" rx="20" ry="13" fill="#c2410c" />
              <ellipse cx="22" cy="17" rx="20" ry="13" fill="url(#footballGrad)" />
              {/* Lace vertical line */}
              <line x1="22" y1="8" x2="22" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              {/* Lace stitches */}
              <line x1="22" y1="11" x2="26" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="14" x2="26" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="17" x2="26" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="20" x2="26" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="23" x2="26" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              {/* White stripe lines */}
              <path d="M7 12 Q22 8 37 12" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M7 22 Q22 26 37 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
              <defs>
                <linearGradient id="footballGrad" x1="0" y1="0" x2="44" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22, background: 'linear-gradient(135deg,#22c55e,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'DM Mono', lineHeight: 1 }}>BLITZ</div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text4)', fontFamily: 'DM Mono' }}>NFL PICKS</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {streak > 0 && (
            <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '4px 10px' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#22c55e', fontFamily: 'DM Mono' }}>🔥{streak}</div>
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#facc15', fontFamily: 'DM Mono' }}>{totalPoints}</div>
            <div style={{ fontSize: 9, color: 'var(--text4)' }}>POINTS</div>
          </div>
          {/* Theme toggle icon */}
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text3)', padding: 0 }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        {activeTab === 'picks' && <PicksTab mode={mode} picks={picks} completedWeeks={completedWeeks} savePicks={savePicks} navigate={navigate} />}
        {activeTab === 'games' && <GamesTab picks={picks} />}
        {activeTab === 'groups' && <GroupsTab uid={user?.uid} user={user} leaderboard={leaderboard} groups={groups} loading={groupsLoading} isGlobalAdmin={isGlobalAdmin} createGroup={createGroup} joinGroup={joinGroup} adjustPoints={adjustPoints} promoteAdmin={promoteAdmin} demoteAdmin={demoteAdmin} removeMember={removeMember} leaveGroup={leaveGroup} getGroupMembers={getGroupMembers} getAllUsers={getAllUsers} addMemberByUid={addMemberByUid} />}
        {activeTab === 'people' && <PeopleTab leaderboard={leaderboard} uid={user?.uid} />}
        {activeTab === 'record' && <RecordTab picks={picks} totalPoints={totalPoints} correctPicks={correctPicks} totalPicks={totalPicks} streak={streak} applyResults={applyResults} />}
        {activeTab === 'settings' && <SettingsTab mode={mode} saveMode={saveMode} logout={logout} />}
      </div>

      <BottomNav active={activeTab} onNav={setActiveTab} />
    </div>
  )
}
