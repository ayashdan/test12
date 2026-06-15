import { useState, useEffect } from 'react'

// ESPN abbreviation → our abbreviation
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

// Points calculation given a user pick + predicted score vs actual ESPN score
export function calcPoints(userPick, predicted, actual) {
  if (!actual || actual.status === 'pre') return null
  const winner = actual.away > actual.home ? actual.awayTeam : actual.homeTeam
  const isTie = actual.away === actual.home
  let pts = 0
  const breakdown = []

  if (!isTie && userPick === winner) {
    pts += 10
    breakdown.push({ label: 'Correct winner', pts: 10 })

    if (predicted?.away !== '' && predicted?.home !== '' && predicted?.away != null) {
      const pAway = parseInt(predicted.away)
      const pH = parseInt(predicted.home)
      if (!isNaN(pAway) && !isNaN(pH)) {
        if (pAway === actual.away && pH === actual.home) {
          pts += 25
          breakdown.push({ label: 'Exact score', pts: 25 })
        } else {
          const pDiff = Math.abs(pAway - pH)
          const aDiff = Math.abs(actual.away - actual.home)
          const err = Math.abs(pDiff - aDiff)
          if (err <= 2) { pts += 12; breakdown.push({ label: 'Score diff ≤2', pts: 12 }) }
          else if (err <= 5) { pts += 7; breakdown.push({ label: 'Score diff ≤5', pts: 7 }) }
          else if (err <= 10) { pts += 3; breakdown.push({ label: 'Score diff ≤10', pts: 3 }) }
        }
      }
    }
  }

  return { pts, breakdown, correct: !isTie && userPick === winner, winner }
}
