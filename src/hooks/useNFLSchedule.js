import { useState, useEffect, useCallback } from 'react'

function formatAZTime(isoDate) {
  const date = new Date(isoDate)
  const options = { timeZone: 'America/Phoenix', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date)
  const get = type => parts.find(p => p.type === type)?.value || ''
  const weekday = get('weekday')
  const month = get('month')
  const day = get('day')
  const hour = get('hour')
  const minute = get('minute')
  const dayperiod = get('dayPeriod')
  const azDate = `${weekday}, ${month} ${day}`
  const azTimePart = `${hour}:${minute} ${dayperiod}`
  return { azDate, azTimePart, azTime: `${azDate} · ${azTimePart}` }
}

function calcCountdown(isoDate) {
  const diff = new Date(isoDate) - new Date()
  if (diff <= 0) return null
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

function calcWinPct(competition) {
  const predictor = competition.predictor
  if (predictor?.homeTeam?.gameProjection != null && predictor?.awayTeam?.gameProjection != null) {
    return {
      homeWinPct: parseFloat(predictor.homeTeam.gameProjection),
      awayWinPct: parseFloat(predictor.awayTeam.gameProjection),
    }
  }
  const odds = competition.odds?.[0]
  if (odds) {
    const homeML = odds.homeTeamOdds?.moneyLine
    const awayML = odds.awayTeamOdds?.moneyLine
    if (homeML != null && awayML != null) {
      const homeRaw = homeML < 0
        ? Math.abs(homeML) / (Math.abs(homeML) + 100) * 100
        : 100 / (homeML + 100) * 100
      const awayRaw = awayML < 0
        ? Math.abs(awayML) / (Math.abs(awayML) + 100) * 100
        : 100 / (awayML + 100) * 100
      const total = homeRaw + awayRaw
      return {
        homeWinPct: Math.round(homeRaw / total * 1000) / 10,
        awayWinPct: Math.round(awayRaw / total * 1000) / 10,
      }
    }
  }
  return { homeWinPct: null, awayWinPct: null }
}

function parseEvent(event) {
  const comp = event.competitions?.[0]
  if (!comp) return null

  const isoDate = comp.date || event.date
  const { azDate, azTimePart, azTime } = formatAZTime(isoDate)

  const statusState = comp.status?.type?.state || 'pre'
  const period = comp.status?.period || 0
  const clock = comp.status?.displayClock || ''
  let statusText
  if (statusState === 'in') {
    statusText = `Q${period} ${clock}`
  } else if (statusState === 'post') {
    statusText = 'Final'
  } else {
    statusText = azTimePart
  }

  const homeComp = comp.competitors?.find(c => c.homeAway === 'home') || {}
  const awayComp = comp.competitors?.find(c => c.homeAway === 'away') || {}

  const homeTeam = homeComp.team || {}
  const awayTeam = awayComp.team || {}

  const odds = comp.odds?.[0]
  const spread = odds?.details || null
  const overUnder = odds?.overUnder ?? null

  const { homeWinPct, awayWinPct } = calcWinPct(comp)

  const network = comp.broadcasts?.[0]?.names?.[0] || null

  return {
    id: event.id,
    date: isoDate,
    azTime,
    azDate,
    azTimePart,
    countdown: calcCountdown(isoDate),
    status: statusState,
    statusText,
    away: {
      abbr: awayTeam.abbreviation || '',
      name: awayTeam.displayName || '',
      city: awayTeam.location || '',
      score: awayComp.score ?? null,
      color: awayTeam.color ? `#${awayTeam.color}` : '#555',
      logo: awayTeam.logo || '',
    },
    home: {
      abbr: homeTeam.abbreviation || '',
      name: homeTeam.displayName || '',
      city: homeTeam.location || '',
      score: homeComp.score ?? null,
      color: homeTeam.color ? `#${homeTeam.color}` : '#555',
      logo: homeTeam.logo || '',
    },
    spread,
    overUnder,
    homeWinPct,
    awayWinPct,
    network,
  }
}

async function fetchGames(week) {
  const base = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
  let url = `${base}?seasontype=2&week=${week}&dates=2026`
  let res = await fetch(url)
  let data = await res.json()
  if (!data.events?.length) {
    url = `${base}?seasontype=1&week=${week}&dates=2026`
    res = await fetch(url)
    data = await res.json()
  }
  return (data.events || []).map(parseEvent).filter(Boolean)
}

export function useNFLSchedule(week) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchGames(week)
      setGames(result)
    } catch (e) {
      setError(e.message || 'Failed to fetch schedule')
    } finally {
      setLoading(false)
    }
  }, [week])

  useEffect(() => {
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [load])

  return { games, loading, error }
}
