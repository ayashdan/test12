import { PLANS } from '../data/plans'
import { EXERCISES } from '../data/exercises'

export function getMonday(d) {
  const date = new Date(d)
  const diff = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function getWeekKey() {
  return getMonday(new Date()).toISOString().slice(0, 10)
}

export function todayIndex() {
  return (new Date().getDay() + 6) % 7
}

export function dateFromDayIndex(dayIndex) {
  const monday = getMonday(new Date())
  const d = new Date(monday)
  d.setDate(d.getDate() + dayIndex)
  return d.toISOString().slice(0, 10)
}

export function workoutKey(dayIndex) {
  return `${getWeekKey()}-${dayIndex}`
}

export function getPlanDay(plan, dayIndex) {
  if (!plan) return null
  const days = PLANS[plan].days
  if (dayIndex >= days.length) return null
  return days[dayIndex % days.length]
}

export function getExercisesForDay(planDay) {
  if (!planDay) return []
  return EXERCISES.filter(e => planDay.muscles.includes(e.muscle))
}
