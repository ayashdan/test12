import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GAMES } from '../data/games'
import { MODES } from '../data/modes'
import { TEAMS } from '../data/teams'
import TeamDisplay, { StyleInjector } from '../components/ExerciseAnimation'
import DivisionBadge from '../components/MuscleSilhouette'
import ScoreRing from '../components/ScoreRing'
import { useLiveScores, calcPoints } from '../hooks/useLiveScores'
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
    { id: 'leaderboard', label: 'Leaderboard', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M8 6H4v10h4V6zM14 3h-4v13h4V3zM20 9h-4v7h4V9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="2" y1="19" x2="22" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b1120', borderTop: '1px solid #1e293b', display: 'flex', zIndex: 100 }}>
      {tabs.map(t => {
        const isActive = active === t.id
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '10px 4px 12px', background: 'none', border: 'none',
            cursor: 'pointer', color: isActive ? '#22c55e' : '#475569', transition: 'color 0.15s ease',
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
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DivisionBadge division={`${away.conf} ${away.div}`} size={38} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', lineHeight: 1.2 }}>
              {away.city} {away.name} @ {home.city} {home.name}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', marginTop: 2 }}>{game.net} · {game.time}</div>
          </div>
        </div>
        <button onClick={onSwap} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #1e293b', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 16 }}>⇄</button>
      </div>
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
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: '#0a1628', overflow: 'hidden' }}>
        <TeamDisplay abbr={game.away} size={44} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 2 }}>{away.name} @ {home.name}</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>{game.time} · {game.net}</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: '#0a1628', overflow: 'hidden' }}>
        <TeamDisplay abbr={game.home} size={44} />
      </div>
    </div>
  )
}

function PicksTab({ mode, picks, completedWeeks, saveMode, savePicks, navigate }) {
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
    background: picksSubmitted ? '#1e293b' : 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: picksSubmitted ? '#64748b' : '#0b1120',
    border: 'none', borderRadius: 14, padding: '15px 20px',
    fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: '0.06em',
    fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase',
    boxShadow: picksSubmitted ? 'none' : '0 4px 24px rgba(34,197,94,0.25)',
  }

  if (!mode) return (
    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#111827', border: '1px dashed #1e293b', borderRadius: 16 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🏈</div>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>No mode selected</div>
      <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Choose a prediction mode to start picking games.</div>
      <button style={btnPrimary} onClick={() => navigate('/plan')}>Choose a Mode →</button>
    </div>
  )

  return (
    <>
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Rate your picks accuracy</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setRating(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: i <= rating ? '#22c55e' : '#334155', padding: '0 1px', lineHeight: 1 }}>★</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {[1,2,3,4].map(w => {
          const isActive = w === selectedWeek
          const isDone = !!completedWeeks[getWeekKey(w)]
          return (
            <button key={w} onClick={() => { setSelectedWeek(w); setFeaturedIdx(0) }} style={{
              flexShrink: 0, background: isActive ? '#1e3a5f' : '#111827',
              border: `1px solid ${isActive ? '#3b82f6' : '#1e293b'}`, borderRadius: 20, padding: '6px 16px',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#60a5fa' : isDone ? '#22c55e' : '#64748b',
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
            <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.08em', color: '#f1f5f9', textTransform: 'uppercase' }}>Week {selectedWeek} Matchups</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>{games.length} games · {picksSubmitted ? '✓ Picks submitted' : 'Picks open'}</div>
          </div>
          <button onClick={() => navigate(`/builder/${selectedWeek}`)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: '#94a3b8', fontSize: 14, flexShrink: 0 }}>✎</button>
        </div>
      </div>

      {games.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 20px', background: '#111827', borderRadius: 14, border: '1px solid #1e293b', marginBottom: 12 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
          <div style={{ fontWeight: 700, color: '#94a3b8' }}>No games selected</div>
        </div>
      ) : (
        <>
          {featured && <FeaturedGameCard game={featured} onSwap={() => setFeaturedIdx(i => i + 1)} />}
          {games.filter((_, i) => i !== fi).slice(0, 3).map(g => <SmallGameRow key={g.id} game={g} />)}
          {games.length > 4 && <div style={{ textAlign: 'center', fontSize: 12, color: '#475569', marginBottom: 12 }}>+{games.length - 4} more games</div>}
          <button onClick={handleStartPicks} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 8 }}>
            {picksSubmitted ? '✓ PICKS SUBMITTED' : 'MAKE PICKS'}
          </button>
        </>
      )}
    </>
  )
}

// ─── GAMES TAB ────────────────────────────────────────────────────────────

function GamesTab({ picks, user }) {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentNFLWeek())
  const { getScore, lastUpdated } = useLiveScores()

  const allGames = GAMES[selectedWeek] || []
  const weekPickData = picks[getWeekKey(selectedWeek)]
  const userPicks = weekPickData?.picks || {}

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {[1,2,3,4].map(w => (
            <button key={w} onClick={() => setSelectedWeek(w)} style={{
              flexShrink: 0, background: w === selectedWeek ? '#1e3a5f' : '#111827',
              border: `1px solid ${w === selectedWeek ? '#3b82f6' : '#1e293b'}`, borderRadius: 20, padding: '6px 16px',
              fontSize: 13, fontWeight: w === selectedWeek ? 700 : 500,
              color: w === selectedWeek ? '#60a5fa' : '#64748b', cursor: 'pointer',
            }}>Week {w}</button>
          ))}
        </div>
        {lastUpdated && <div style={{ fontSize: 10, color: '#334155', marginTop: 8 }}>Live scores updated {lastUpdated.toLocaleTimeString()}</div>}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#475569', marginBottom: 10 }}>NFL 2026 · WEEK {selectedWeek}</div>

      {allGames.map(game => {
        const away = TEAMS[game.away] || {}
        const home = TEAMS[game.home] || {}
        const score = getScore(game)
        const userPick = userPicks[game.id]
        const isLive = score?.status === 'live'
        const isFinal = score?.status === 'final'

        return (
          <div key={game.id} style={{ background: '#111827', border: `1px solid ${isLive ? '#22c55e44' : '#1e293b'}`, borderRadius: 14, padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: '#475569', fontWeight: 700 }}>{game.net} · {game.time}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {isLive && <span style={{ fontSize: 9, fontWeight: 700, background: '#22c55e', color: '#0b1120', borderRadius: 4, padding: '2px 6px' }}>● LIVE {score.clock}</span>}
                {isFinal && <span style={{ fontSize: 9, fontWeight: 700, background: '#1e293b', color: '#64748b', borderRadius: 4, padding: '2px 6px' }}>FINAL</span>}
                {userPick && (
                  <span style={{ fontSize: 9, fontWeight: 700, background: `${TEAMS[userPick]?.color}33`, color: TEAMS[userPick]?.color || '#22c55e', border: `1px solid ${TEAMS[userPick]?.color}55`, borderRadius: 4, padding: '2px 6px' }}>
                    Your pick: {userPick}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Away */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: away.color || '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: 'white', fontFamily: 'DM Mono' }}>{game.away}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isFinal && score.away < score.home ? '#475569' : '#f1f5f9' }}>{away.name}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>Away</div>
                </div>
              </div>

              {/* Score or time */}
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                {(isLive || isFinal) && score ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: score.away >= score.home ? '#f1f5f9' : '#475569', fontFamily: 'DM Mono' }}>{score.away}</span>
                    <span style={{ fontSize: 14, color: '#334155' }}>–</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: score.home >= score.away ? '#f1f5f9' : '#475569', fontFamily: 'DM Mono' }}>{score.home}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#475569', fontWeight: 700 }}>vs</div>
                )}
              </div>

              {/* Home */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isFinal && score.home < score.away ? '#475569' : '#f1f5f9' }}>{home.name}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>Home</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: home.color || '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: 'white', fontFamily: 'DM Mono' }}>{game.home}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

// ─── LEADERBOARD TAB ──────────────────────────────────────────────────────

function LeaderboardTab({ leaderboard, userRank, user }) {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Leaderboard</div>
      <div style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Top pickers for the 2026 NFL season</div>

      {leaderboard.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
          <div style={{ fontWeight: 700 }}>No picks yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Submit your first picks to appear here</div>
        </div>
      )}

      {leaderboard.map((entry, i) => {
        const isMe = entry.uid === user?.uid
        const accuracy = entry.totalPicks > 0 ? Math.round((entry.correctPicks || 0) / entry.totalPicks * 100) : null
        return (
          <div key={entry.uid} style={{
            background: isMe ? 'rgba(34,197,94,0.08)' : '#111827',
            border: `1px solid ${isMe ? 'rgba(34,197,94,0.4)' : '#1e293b'}`,
            borderRadius: 14, padding: '12px 16px', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: i < 3 ? 22 : 13, fontWeight: 900, color: '#475569', minWidth: 28, textAlign: 'center', fontFamily: 'DM Mono' }}>
              {i < 3 ? medals[i] : `#${i + 1}`}
            </div>
            {entry.photoURL ? (
              <img src={entry.photoURL} alt="" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} referrerPolicy="no-referrer" />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                {(entry.displayName || '?')[0].toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: isMe ? '#22c55e' : '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.displayName || 'Anonymous'}{isMe ? ' (you)' : ''}
              </div>
              <div style={{ fontSize: 11, color: '#475569' }}>
                {entry.totalPicks || 0} picks · {accuracy != null ? `${accuracy}% acc` : '—'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#facc15', fontFamily: 'DM Mono' }}>{entry.totalPoints || 0}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>pts</div>
            </div>
          </div>
        )
      })}

      {userRank && userRank > 25 && (
        <div style={{ textAlign: 'center', fontSize: 13, color: '#475569', padding: '8px 0' }}>Your rank: #{userRank}</div>
      )}
    </>
  )
}

// ─── RECORD TAB ───────────────────────────────────────────────────────────

function RecordTab({ picks, totalPoints, correctPicks, totalPicks, streak, applyResults }) {
  const { getScore } = useLiveScores()

  // Calculate accuracy
  const accuracy = totalPicks > 0 ? Math.round(correctPicks / totalPicks * 100) : 0

  // Collect all picks for display
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

  const statCard = (label, value, sub, color = '#f1f5f9') => (
    <div style={{ flex: 1, background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: 'DM Mono' }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{sub}</div>}
    </div>
  )

  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>My Record</div>
      <div style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>2026 NFL Season</div>

      {/* Stats grid */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {statCard('Points', totalPoints, 'earned', '#facc15')}
        {statCard('Correct', correctPicks, `of ${totalPicks}`, '#22c55e')}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {statCard('Accuracy', totalPicks > 0 ? `${accuracy}%` : '—', 'pick accuracy')}
        {statCard('Streak', streak, 'weeks in a row')}
      </div>

      {/* Points breakdown */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 12 }}>POINTS BREAKDOWN</div>
        {[
          { label: 'Correct winner', pts: '10 pts' },
          { label: 'Score diff ≤10', pts: '+3 pts' },
          { label: 'Score diff ≤5', pts: '+7 pts' },
          { label: 'Score diff ≤2', pts: '+12 pts' },
          { label: 'Exact score', pts: '+25 pts' },
        ].map(b => (
          <div key={b.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>{b.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', fontFamily: 'DM Mono' }}>{b.pts}</span>
          </div>
        ))}
      </div>

      {/* Pick history */}
      {allPickEntries.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 10 }}>PICK HISTORY</div>
          {allPickEntries.slice().reverse().map((entry, i) => {
            const pickedTeam = TEAMS[entry.pick] || {}
            const result = entry.result
            return (
              <div key={i} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 12, padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                      {TEAMS[entry.game.away]?.name} @ {TEAMS[entry.game.home]?.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Week {entry.week} · Picked: <span style={{ color: pickedTeam.color || '#22c55e', fontWeight: 700 }}>{entry.pick}</span></div>
                    {entry.predicted?.away !== undefined && entry.predicted?.away !== '' && (
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>Predicted: {entry.predicted.away}–{entry.predicted.home}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {result ? (
                      <>
                        <div style={{ fontSize: 16, fontWeight: 900, color: result.correct ? '#22c55e' : '#ef4444', fontFamily: 'DM Mono' }}>
                          {result.correct ? `+${result.pts}` : '0'}
                        </div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{result.correct ? 'correct' : 'wrong'}</div>
                        {entry.score && <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{entry.score.away}–{entry.score.home} {entry.score.status}</div>}
                      </>
                    ) : (
                      <div style={{ fontSize: 10, color: '#475569', background: '#1e293b', borderRadius: 6, padding: '3px 8px' }}>Pending</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}

      {allPickEntries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px', color: '#475569' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700 }}>No picks yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Head to the Picks tab to make your first predictions</div>
        </div>
      )}
    </>
  )
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────

function SettingsTab({ mode, saveMode, navigate, logout }) {
  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Settings</div>
      <div style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Prediction mode & account</div>

      <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 10 }}>PREDICTION MODE</div>
      {Object.entries(MODES).map(([key, m]) => {
        const isActive = mode === key
        return (
          <div key={key} onClick={() => saveMode(key)} style={{
            background: isActive ? 'rgba(34,197,94,0.06)' : '#111827',
            border: `1px solid ${isActive ? 'rgba(34,197,94,0.4)' : '#1e293b'}`,
            borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{m.subtitle}</div>
              </div>
              {isActive && <span style={{ fontSize: 18, color: '#22c55e' }}>✓</span>}
            </div>
          </div>
        )
      })}

      <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginTop: 24, marginBottom: 10 }}>ACCOUNT</div>
      <button onClick={logout} style={{
        width: '100%', background: '#111827', border: '1px solid #1e293b', borderRadius: 12,
        padding: '14px', color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer',
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
  const [activeTab, setActiveTab] = useState('picks')

  function handleNav(tab) { setActiveTab(tab) }

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', color: '#f1f5f9', fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: 80 }}>
      <StyleInjector />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px 12px', position: 'sticky', top: 0, zIndex: 10, background: '#0b1120', borderBottom: '1px solid #111827' }}>
        <div style={{ fontWeight: 900, fontSize: 22, background: 'linear-gradient(135deg,#22c55e,#facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'DM Mono' }}>BLITZ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#facc15', fontFamily: 'DM Mono' }}>{totalPoints}</div>
            <div style={{ fontSize: 9, color: '#475569' }}>POINTS</div>
          </div>
          {streak > 0 && (
            <div style={{ background: '#22c55e20', border: '1px solid #22c55e40', borderRadius: 8, padding: '4px 10px' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#22c55e', fontFamily: 'DM Mono' }}>🔥{streak}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        {activeTab === 'picks' && <PicksTab mode={mode} picks={picks} completedWeeks={completedWeeks} saveMode={saveMode} savePicks={savePicks} navigate={navigate} />}
        {activeTab === 'games' && <GamesTab picks={picks} user={user} />}
        {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={leaderboard} userRank={userRank} user={user} />}
        {activeTab === 'record' && <RecordTab picks={picks} totalPoints={totalPoints} correctPicks={correctPicks} totalPicks={totalPicks} streak={streak} applyResults={applyResults} />}
        {activeTab === 'settings' && <SettingsTab mode={mode} saveMode={saveMode} navigate={navigate} logout={logout} />}
      </div>

      <BottomNav active={activeTab} onNav={handleNav} />
    </div>
  )
}
