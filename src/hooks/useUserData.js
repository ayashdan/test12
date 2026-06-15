import { useEffect, useState, useCallback } from 'react'
import {
  doc, collection, onSnapshot, setDoc, serverTimestamp,
  query, orderBy, limit, increment,
} from 'firebase/firestore'
import { db } from '../firebase'
import { getWeekKey } from '../utils/dates'

export function useUserData(uid, user) {
  const [mode, setMode] = useState(null)
  const [picks, setPicks] = useState({})
  const [completedWeeks, setCompletedWeeks] = useState({})
  const [streak, setStreak] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [correctPicks, setCorrectPicks] = useState(0)
  const [totalPicks, setTotalPicks] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)

  // Upsert leaderboard entry and global users registry when user signs in
  useEffect(() => {
    if (!uid || !user) return
    const profile = {
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL || '',
      email: user.email || '',
    }
    setDoc(doc(db, 'leaderboard', uid), profile, { merge: true })
    setDoc(doc(db, 'users', uid), { ...profile, uid, lastSeen: serverTimestamp() }, { merge: true })
  }, [uid, user])

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
        const d = snap.data() || {}
        setStreak(d.streak ?? 0)
        setTotalPoints(d.totalPoints ?? 0)
        setCorrectPicks(d.correctPicks ?? 0)
        setTotalPicks(d.totalPicks ?? 0)
      }),
      onSnapshot(
        collection(db, 'leaderboard'),
        snap => {
          const list = snap.docs
            .map(d => ({ uid: d.id, totalPoints: 0, ...d.data() }))
            .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
          let rank = null
          list.forEach((u, i) => { if (u.uid === uid) rank = i + 1 })
          setLeaderboard(list)
          setUserRank(rank)
        }
      ),
    ]

    return () => unsubs.forEach(u => u())
  }, [uid])

  const saveMode = useCallback((newMode) => {
    setDoc(doc(db, 'users', uid, 'profile', 'main'), { mode: newMode }, { merge: true })
  }, [uid])

  const savePicks = useCallback((week, selectedIds) => {
    const key = getWeekKey(week)
    setDoc(doc(db, 'users', uid, 'picks', key), { games: selectedIds, picks: {}, scores: {} }, { merge: true })
  }, [uid])

  const lockPick = useCallback((week, gameId, teamAbbr) => {
    const key = getWeekKey(week)
    setDoc(doc(db, 'users', uid, 'picks', key), { picks: { [gameId]: teamAbbr } }, { merge: true })
  }, [uid])

  const lockScore = useCallback((week, gameId, awayScore, homeScore) => {
    const key = getWeekKey(week)
    setDoc(doc(db, 'users', uid, 'picks', key), {
      scores: { [gameId]: { away: awayScore, home: homeScore } },
    }, { merge: true })
  }, [uid])

  const submitPicks = useCallback(async (week, pickedGames) => {
    const key = getWeekKey(week)
    const count = pickedGames?.length || 0

    await Promise.all([
      setDoc(doc(db, 'users', uid, 'completedWeeks', key), {
        completed: true,
        timestamp: serverTimestamp(),
      }),
    ])

    const updated = { ...completedWeeks, [key]: true }
    let s = 0
    for (let w = parseInt(week); w >= 1; w--) {
      if (updated[getWeekKey(w)]) s++
      else break
    }

    await Promise.all([
      setDoc(doc(db, 'users', uid, 'stats', 'main'), {
        streak: s,
        totalPicks: increment(count),
      }, { merge: true }),
      setDoc(doc(db, 'leaderboard', uid), {
        totalPicks: increment(count),
        streak: s,
      }, { merge: true }),
    ])
  }, [uid, completedWeeks])

  // Called from Record tab when ESPN results are available
  const applyResults = useCallback(async (earnedPoints, correct) => {
    await Promise.all([
      setDoc(doc(db, 'users', uid, 'stats', 'main'), {
        totalPoints: increment(earnedPoints),
        correctPicks: increment(correct),
      }, { merge: true }),
      setDoc(doc(db, 'leaderboard', uid), {
        totalPoints: increment(earnedPoints),
        correctPicks: increment(correct),
      }, { merge: true }),
    ])
  }, [uid])

  return {
    mode, picks, completedWeeks, streak, totalPoints, correctPicks, totalPicks,
    leaderboard, userRank, loading,
    saveMode, savePicks, lockPick, lockScore, submitPicks, applyResults,
  }
}
