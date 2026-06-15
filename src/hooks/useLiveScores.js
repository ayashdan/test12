import { useState, useEffect } from 'react'

const ESPN_MAP = { WSH: 'WAS', JAC: 'JAX' }
function mapAbbr(a) { return ESPN_MAP[a] || a }

export function useLiveScores() {
  const [scores, setScores] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  async function fetchScores() {
    try {
      const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard')
      const data = await res.json()
      const map = {}
      for (const event of data.events || []) {
        const comp = event.competitions?.[0]
        if (!comp) continue
        const awayC = comp.competitors?.find(c => c.homeAway === 'away')
        const homeC = comp.competitors?.find(c => c.homeAway === 'home')
        if (!awayC || !homeC) continue
        const away = mapAbbr(awayC.team.abbreviation)
        const home = mapAbbr(homeC.team.abbreviation)
        const key = `${away}@${home}`
        const statusName = comp.status?.type?.name || ''
        map[key] = {
          away: parseInt(awayC.score || '0'),
          home: parseInt(homeC.score || '0'),
          awayTeam: away,
          homeTeam: home,
          status: statusName === 'STATUS_FINAL' ? 'final'
            : statusName === 'STATUS_IN_PROGRESS' ? 'live' : 'pre',
          clock: comp.status?.displayClock || '',
          period: comp.status?.period || 0,
        }
      }
      setScores(map)
      setLastUpdated(new Date())
    } catch {
      // ESPN API unavailable (offseason or network error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
    const t = setInterval(fetchScores, 30000)
    return () => clearInterval(t)
  }, [])

  function getScore(game) {
    return scores[`${game.away}@${game.home}`] || null
  }

  return { scores, loading, lastUpdated, getScore, refresh: fetchScores }
}

// Points system:
//   Correct winner:           3 pts
//   + Score diff ≤ 7:        +1 pt  (total 4)
//   + Score diff ≤ 3:        +2 pts (total 5)
//   Exact score:              5 pts  (= correct + tight diff)
export function calcPoints(userPick, predicted, actual) {
  if (!actual || actual.status === 'pre') return null
  const winner = actual.away > actual.home ? actual.awayTeam : actual.homeTeam
  const isTie = actual.away === actual.home
  let pts = 0
  const breakdown = []

  if (!isTie && userPick === winner) {
    pts += 3
    breakdown.push({ label: 'Correct winner', pts: 3 })

    if (predicted?.away !== '' && predicted?.away != null && predicted?.home != null) {
      const pAway = parseInt(predicted.away)
      const pH = parseInt(predicted.home)
      if (!isNaN(pAway) && !isNaN(pH)) {
        if (pAway === actual.away && pH === actual.home) {
          pts += 2
          breakdown.push({ label: 'Exact score', pts: 2 })
        } else {
          const pDiff = Math.abs(pAway - pH)
          const aDiff = Math.abs(actual.away - actual.home)
          const err = Math.abs(pDiff - aDiff)
          if (err <= 3) { pts += 2; breakdown.push({ label: 'Score diff ≤3', pts: 2 }) }
          else if (err <= 7) { pts += 1; breakdown.push({ label: 'Score diff ≤7', pts: 1 }) }
        }
      }
    }
  }

  return { pts, breakdown, correct: !isTie && userPick === winner, winner }
}
