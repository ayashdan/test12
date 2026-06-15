import { useEffect, useState, useCallback } from 'react'
import { doc, collection, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { getWeekKey } from '../utils/dates'

export function useUserData(uid) {
  const [mode, setMode] = useState(null)
  const [picks, setPicks] = useState({})
  const [completedWeeks, setCompletedWeeks] = useState({})
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return

    let loadedCount = 0
    const markLoaded = () => { if (++loadedCount >= 3) setLoading(false) }

    const unsubs = [
      onSnapshot(doc(db, 'users', uid, 'profile', 'main'), snap => {
        setMode(snap.data()?.mode ?? null)
        markLoaded()
      }),
      onSnapshot(collection(db, 'users', uid, 'picks'), snap => {
        const map = {}
        snap.forEach(d => { map[d.id] = d.data() })
        setPicks(map)
        markLoaded()
      }),
      onSnapshot(collection(db, 'users', uid, 'completedWeeks'), snap => {
        const map = {}
        snap.forEach(d => { map[d.id] = true })
        setCompletedWeeks(map)
        markLoaded()
      }),
      onSnapshot(doc(db, 'users', uid, 'stats', 'main'), snap => {
        setStreak(snap.data()?.streak ?? 0)
      }),
    ]

    return () => unsubs.forEach(u => u())
  }, [uid])

  const saveMode = useCallback((newMode) => {
    setDoc(doc(db, 'users', uid, 'profile', 'main'), { mode: newMode }, { merge: true })
  }, [uid])

  const savePicks = useCallback((week, selectedIds) => {
    const key = getWeekKey(week)
    setDoc(
      doc(db, 'users', uid, 'picks', key),
      { games: selectedIds, picks: {} },
      { merge: true }
    )
  }, [uid])

  const lockPick = useCallback((week, gameId, teamAbbr) => {
    const key = getWeekKey(week)
    setDoc(
      doc(db, 'users', uid, 'picks', key),
      { picks: { [gameId]: teamAbbr } },
      { merge: true }
    )
  }, [uid])

  const submitPicks = useCallback(async (week) => {
    const key = getWeekKey(week)

    await Promise.all([
      setDoc(doc(db, 'users', uid, 'completedWeeks', key), {
        completed: true,
        timestamp: serverTimestamp(),
      }),
    ])

    // streak = consecutive weeks submitted
    const updated = { ...completedWeeks, [key]: true }
    let s = 0
    for (let w = parseInt(week); w >= 1; w--) {
      if (updated[getWeekKey(w)]) s++
      else break
    }
    setDoc(doc(db, 'users', uid, 'stats', 'main'), { streak: s }, { merge: true })
  }, [uid, completedWeeks])

  return { mode, picks, completedWeeks, streak, loading, saveMode, savePicks, lockPick, submitPicks }
}
