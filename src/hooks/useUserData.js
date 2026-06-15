import { useEffect, useState, useCallback } from 'react'
import {
  doc, collection, onSnapshot, setDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { getWeekKey, dateFromDayIndex } from '../utils/dates'

export function useUserData(uid) {
  const [plan, setPlan] = useState(null)
  const [workouts, setWorkouts] = useState({})
  const [completedDays, setCompletedDays] = useState({})
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return

    let loadedCount = 0
    const markLoaded = () => { if (++loadedCount >= 3) setLoading(false) }

    const unsubs = [
      onSnapshot(doc(db, 'users', uid, 'profile', 'main'), snap => {
        setPlan(snap.data()?.plan ?? null)
        markLoaded()
      }),
      onSnapshot(collection(db, 'users', uid, 'workouts'), snap => {
        const map = {}
        snap.forEach(d => { map[d.id] = d.data() })
        setWorkouts(map)
        markLoaded()
      }),
      onSnapshot(collection(db, 'users', uid, 'completedDays'), snap => {
        const map = {}
        snap.forEach(d => { map[d.id] = true })
        setCompletedDays(map)
        markLoaded()
      }),
      onSnapshot(doc(db, 'users', uid, 'stats', 'main'), snap => {
        setStreak(snap.data()?.streak ?? 0)
      }),
    ]

    return () => unsubs.forEach(u => u())
  }, [uid])

  const savePlan = useCallback((newPlan) => {
    setDoc(doc(db, 'users', uid, 'profile', 'main'), { plan: newPlan }, { merge: true })
  }, [uid])

  const saveWorkout = useCallback((dayIndex, selectedIds) => {
    const key = `${getWeekKey()}-${dayIndex}`
    setDoc(
      doc(db, 'users', uid, 'workouts', key),
      { exercises: selectedIds, done: [] },
      { merge: true }
    )
  }, [uid])

  const finishWorkout = useCallback(async (dayIndex, doneIds) => {
    const key = `${getWeekKey()}-${dayIndex}`
    const date = dateFromDayIndex(dayIndex)

    await Promise.all([
      setDoc(
        doc(db, 'users', uid, 'workouts', key),
        { done: doneIds },
        { merge: true }
      ),
      setDoc(doc(db, 'users', uid, 'completedDays', date), {
        completed: true,
        timestamp: serverTimestamp(),
      }),
    ])

    // recalculate streak with the new day included
    const updated = { ...completedDays, [date]: true }
    let s = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (updated[d.toISOString().slice(0, 10)]) s++
      else break
    }
    setDoc(doc(db, 'users', uid, 'stats', 'main'), { streak: s }, { merge: true })
  }, [uid, completedDays])

  return { plan, workouts, completedDays, streak, loading, savePlan, saveWorkout, finishWorkout }
}
