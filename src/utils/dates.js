// NFL 2026 season starts Sept 10, 2026
const SEASON_START = new Date('2026-09-10')
const TOTAL_WEEKS = 18

export function getCurrentNFLWeek() {
  const today = new Date()
  const diff = Math.floor((today - SEASON_START) / (7 * 24 * 60 * 60 * 1000))
  if (diff < 0) return 1
  if (diff >= TOTAL_WEEKS) return TOTAL_WEEKS
  return diff + 1
}

export function getWeekKey(week) {
  return `2026-week-${week ?? getCurrentNFLWeek()}`
}

export function picksKey(week) {
  return getWeekKey(week)
}

export function weekLabel(week) {
  return `Week ${week}`
}

export function allWeeks() {
  return Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1)
}
