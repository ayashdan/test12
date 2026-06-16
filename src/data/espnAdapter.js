import { TEAMS } from './teams'

// Convert an ESPN game object (from useNFLSchedule) to the internal game format
// used by Builder, Workout, and PicksTab
export function espnToGame(g) {
  const awayTeam = TEAMS[g.away?.abbr]
  const homeTeam = TEAMS[g.home?.abbr]
  const isDivisional = awayTeam && homeTeam &&
    awayTeam.conf === homeTeam.conf &&
    awayTeam.div === homeTeam.div
  const isPrimetime = /NBC|ESPN|ABC|Amazon|Prime/i.test(g.network || '')

  return {
    id: g.id,
    away: g.away?.abbr || '',
    home: g.home?.abbr || '',
    time: g.azTimePart || '',
    net: g.network || '',
    type: isPrimetime ? 'primetime' : isDivisional ? 'divisional' : 'regular',
  }
}
