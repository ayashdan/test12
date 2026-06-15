import { useState, useEffect, useRef } from 'react'

function formatAZTime(isoDate) {
  const d = new Date(isoDate)
  const opts = { timeZone: 'America/Phoenix', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }
  const parts = new Intl.DateTimeFormat('en-US', opts).formatToParts(d)
  const get = (t) => parts.find(p => p.type === t)?.value || ''
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
  const now = Date.now()
  const gameTime = new Date(isoDate).getTime()
  const diff = gameTime - now
  if (diff <= 0) return null
  const totalSec = Math.floor(diff / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return { days, hours, minutes, seconds }
}

function deriveWinPct(odds) {
  if (!odds) return { homeWinPct: null, awayWinPct: null }
  const homeML = odds.homeTeamOdds?.moneyLine
  const awayML = odds.awayTeamOdds?.moneyLine
  if (homeML == null || awayML == null) return { homeWinPct: null, awayWinPct: null }
  const calcPct = (ml) => ml < 0
    ? (Math.abs(ml) / (Math.abs(ml) + 100)) * 100
    : (100 / (ml + 100)) * 100
  const homePct = calcPct(homeML)
  const awayPct = calcPct(awayML)
  const total = homePct + awayPct
  return {
    homeWinPct: Math.round((homePct / total) * 1000) / 10,
    awayWinPct: Math.round((awayPct / total) * 1000) / 10,
  }
}

function parseEvent(event) {
  const comp = event.competitions?.[0]
  if (!comp) return null

  const dateStr = comp.date || event.date
  const { azDate, azTimePart, azTime } = formatAZTime(dateStr)
  const countdown = calcCountdown(dateStr)

  const state = comp.status?.type?.state || 'pre'
  const period = comp.status?.period || 0
  const clock = comp.status?.displayClock || ''
  let statusText = comp.status?.type?.description || ''
  if (state === 'in') statusText = `Q${period} ${clock}`
  else if (state === 'post') statusText = 'Final'

  const competitors = comp.competitors || []
  const homeComp = competitors.find(c => c.homeAway === 'home') || {}
  const awayComp = competitors.find(c => c.homeAway === 'away') || {}

  const teamObj = (c) => ({
    abbr: c.team?.abbreviation || '',
    name: c.team?.displayName || '',
    city: c.team?.location || '',
    score: c.score != null ? parseInt(c.score) : null,
    color: c.team?.color ? `#${c.team.color}` : '#555555',
    logo: c.team?.logo || '',
  })

  const odds = comp.odds?.[0]
  const predictor = comp.predictor
  let homeWinPct = predictor?.homeTeam?.gameProjection ?? null
  let awayWinPct = predictor?.awayTeam?.gameProjection ?? null
  if (homeWinPct == null && awayWinPct == null) {
    const derived = deriveWinPct(odds)
    homeWinPct = derived.homeWinPct
    awayWinPct = derived.awayWinPct
  }

  const broadcast = comp.broadcasts?.[0]?.names?.[0] || null

  return {
    id: event.id,
    date: dateStr,
    azTime,
    azDate,
    azTimePart,
    countdown,
    status: state,
    statusText,
    away: teamObj(awayComp),
    home: teamObj(homeComp),
    spread: odds?.details || null,
    overUnder: odds?.overUnder ?? null,
    homeWinPct,
    awayWinPct,
    network: broadcast,
  }
}

async function fetchWeek(week) {
  const url = (type) =>
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=${type}&week=${week}&dates=2026`

  let res = await fetch(url(2))
  let data = await res.json()
  if (!data.events?.length) {
    res = await fetch(url(1))
    data = await res.json()
  }
  return (data.events || []).map(parseEvent).filter(Boolean)
}

export function useNFLSchedule(week) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchWeek(week)
        if (!cancelled) setGames(result)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to fetch schedule')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    intervalRef.current = setInterval(load, 60000)

    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
    }
  }, [week])

  return { games, loading, error }
}
