import { useState, useEffect, useRef } from 'react'

const AZ_TZ = 'America/Phoenix'

function formatAZTime(dateStr) {
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('en-US', { timeZone: AZ_TZ, weekday: 'short', month: 'short', day: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { timeZone: AZ_TZ, hour: 'numeric', minute: '2-digit' })
  return { azDate: date, azTimePart: time, azTime: `${date} · ${time}` }
}

function getCountdown(dateStr) {
  const diff = new Date(dateStr) - new Date()
  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function mlToWinPct(ml) {
  if (!ml) return null
  return ml < 0
    ? Math.round(Math.abs(ml) / (Math.abs(ml) + 100) * 100)
    : Math.round(100 / (ml + 100) * 100)
}

function parseGames(events) {
  return events.map(event => {
    const comp = event.competitions?.[0]
    if (!comp) return null

    const home = comp.competitors?.find(c => c.homeAway === 'home')
    const away = comp.competitors?.find(c => c.homeAway === 'away')
    const status = comp.status?.type?.state || 'pre'
    const period = comp.status?.period || 0
    const clock = comp.status?.displayClock || ''
    const { azDate, azTimePart, azTime } = formatAZTime(event.date)

    let statusText = azTimePart
    if (status === 'in') statusText = period ? `Q${period} ${clock}` : 'Live'
    if (status === 'post') statusText = 'Final'

    const odds = comp.odds?.[0]
    const predictor = comp.predictor
    let homeWinPct = predictor?.homeTeam?.gameProjection
      ? Math.round(predictor.homeTeam.gameProjection)
      : null
    let awayWinPct = predictor?.awayTeam?.gameProjection
      ? Math.round(predictor.awayTeam.gameProjection)
      : null

    if (!homeWinPct && odds?.homeTeamOdds?.moneyLine) {
      homeWinPct = mlToWinPct(odds.homeTeamOdds.moneyLine)
      awayWinPct = homeWinPct ? 100 - homeWinPct : null
    }

    const network = comp.broadcasts?.[0]?.names?.[0] || comp.geoBroadcasts?.[0]?.media?.shortName || null

    return {
      id: event.id,
      date: event.date,
      azDate, azTimePart, azTime,
      countdown: getCountdown(event.date),
      status,
      statusText,
      away: {
        abbr: away?.team?.abbreviation || '',
        name: away?.team?.shortDisplayName || away?.team?.displayName || '',
        city: away?.team?.location || '',
        score: away?.score || '0',
        color: '#' + (away?.team?.color || '1a1a2e'),
      },
      home: {
        abbr: home?.team?.abbreviation || '',
        name: home?.team?.shortDisplayName || home?.team?.displayName || '',
        city: home?.team?.location || '',
        score: home?.score || '0',
        color: '#' + (home?.team?.color || '1a1a2e'),
      },
      spread: odds?.details || null,
      overUnder: odds?.overUnder || null,
      homeWinPct,
      awayWinPct,
      network,
    }
  }).filter(Boolean)
}

export function useNFLSchedule(week) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSchedule() {
      try {
        // Try regular season first
        let url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}&dates=2026`
        let res = await fetch(url)
        let data = await res.json()
        let events = data.events || []

        // Fall back to preseason if no regular season games found
        if (!events.length) {
          url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=1&week=${week}&dates=2026`
          res = await fetch(url)
          data = await res.json()
          events = data.events || []
        }

        if (!cancelled) {
          setGames(parseGames(events))
          setError(null)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError('Could not load schedule')
          setLoading(false)
        }
      }
    }

    setLoading(true)
    fetchSchedule()
    timerRef.current = setInterval(fetchSchedule, 60000)

    return () => {
      cancelled = true
      clearInterval(timerRef.current)
    }
  }, [week])

  // Countdown ticker — updates every second
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Recompute countdowns on each tick without re-fetching
  const gamesWithCountdown = games.map(g => ({ ...g, countdown: getCountdown(g.date) }))

  return { games: gamesWithCountdown, loading, error }
}
