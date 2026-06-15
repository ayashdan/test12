import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PLANS } from '../data/plans'
import { EXERCISES, MUSCLE_COLORS } from '../data/exercises'
import { getExercisesForDay, getPlanDay, dateFromDayIndex, workoutKey, todayIndex } from '../utils/dates'
import ExerciseAnimation, { StyleInjector } from '../components/ExerciseAnimation'
import MuscleSilhouette from '../components/MuscleSilhouette'

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────

function BottomNav({ active, onNav }) {
  const tabs = [
    { id: 'workout', label: 'Workout', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="11" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="18" y="11" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <line x1="6" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="9" y="9" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )},
    { id: 'exercises', label: 'Exercises', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )},
    { id: 'library', label: 'Library', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )},
    { id: 'progress', label: 'Progress', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline points="3,18 8,12 13,15 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="21" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )},
    { id: 'settings', label: 'Settings', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )},
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#0b1120', borderTop: '1px solid #1e293b',
      display: 'flex', zIndex: 100,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '10px 4px 12px', background: 'none', border: 'none',
            cursor: 'pointer', color: isActive ? '#f5c518' : '#475569', transition: 'color 0.15s ease',
          }}>
            {t.icon}
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── WARMUP CARD ──────────────────────────────────────────────────────────

function WarmupCard() {
  return (
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, background: '#0a1628', border: '1px solid #1e293b', overflow: 'hidden' }}>
        <svg viewBox="0 0 60 60" style={{ width: 52, height: 52 }}>
          <rect width="60" height="60" fill="#0a1628" />
          <circle cx="30" cy="12" r="7" fill="#c8d8ec" />
          <line x1="30" y1="19" x2="30" y2="38" stroke="#c8d8ec" strokeWidth="4" strokeLinecap="round" />
          <line x1="15" y1="25" x2="45" y2="25" stroke="#c8d8ec" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="38" x2="18" y2="52" stroke="#7a9ab8" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="38" x2="42" y2="52" stroke="#c8d8ec" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>General Warmup</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>5 min · Dynamic stretching</div>
      </div>
      <button style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer' }}>···</button>
    </div>
  )
}

// ─── FEATURED EXERCISE CARD ───────────────────────────────────────────────

function FeaturedExerciseCard({ ex, muscleColor, onSwap }) {
  return (
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MuscleSilhouette muscles={[ex.muscle]} size={34} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', lineHeight: 1.2 }}>{ex.name}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: muscleColor, marginTop: 2 }}>{ex.muscle.toUpperCase()}</div>
          </div>
        </div>
        <button onClick={onSwap} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #1e293b', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 16 }}>⇄</button>
      </div>
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#0a1628', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', position: 'relative', overflow: 'hidden' }}>
        <ExerciseAnimation exerciseId={ex.id} muscleColor={muscleColor} />
        <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', background: 'rgba(0,0,0,0.55)', color: '#64748b', borderRadius: 4, padding: '2px 6px' }}>ANIMATION</div>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.4)', border: '1px solid #1e293b', borderRadius: 8, padding: '5px 12px', fontSize: 13, fontWeight: 700, color: '#f1f5f9', fontFamily: "'DM Mono',monospace" }}>{ex.sets}</div>
      </div>
    </div>
  )
}

function SmallExerciseRow({ ex, muscleColor }) {
  return (
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: '#0a1628', border: '1px solid #1e293b', overflow: 'hidden' }}>
        <ExerciseAnimation exerciseId={ex.id} muscleColor={muscleColor} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 2 }}>{ex.name}</div>
        <div style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono',monospace" }}>{ex.sets}</div>
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', background: `${muscleColor}22`, color: muscleColor, border: `1px solid ${muscleColor}44`, borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>{ex.muscle.toUpperCase()}</span>
    </div>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────

export default function HomePage({ plan, workouts, completedDays, savePlan, saveWorkout }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState('workout')
  const [selectedDay, setSelectedDay] = useState(todayIndex())
  const [rating, setRating] = useState(0)
  const [featuredIdx, setFeaturedIdx] = useState(0)

  const planDays = plan ? PLANS[plan].days : []
  const currentDay = planDays[selectedDay] || null
  const dayExercises = currentDay ? getExercisesForDay(currentDay) : []
  const wKey = workoutKey(selectedDay)
  const workout = workouts[wKey]
  const exercises = workout
    ? EXERCISES.filter(e => workout.exercises?.includes(e.id))
    : dayExercises.slice(0, 6)
  const fi = featuredIdx % Math.max(exercises.length, 1)
  const featured = exercises[fi]

  function handleStartWorkout() {
    if (!workout && exercises.length) saveWorkout(selectedDay, exercises.map(e => e.id))
    navigate(`/workout/${selectedDay}`)
  }

  function handleNav(tab) {
    setActiveTab(tab)
    if (tab === 'settings') navigate('/plan')
  }

  const btnPrimary = {
    background: 'linear-gradient(135deg,#f5c518,#f97316)', color: '#0b1120',
    border: 'none', borderRadius: 14, padding: '15px 20px',
    fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: '0.06em',
    fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase',
    boxShadow: '0 4px 24px rgba(245,197,24,0.25)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', color: '#f1f5f9', fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: 80 }}>
      <StyleInjector />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px 12px', position: 'sticky', top: 0, zIndex: 10, background: '#0b1120', borderBottom: '1px solid #111827' }}>
        <button onClick={() => navigate('/plan')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#f1f5f9' }}>My Plan</span>
          <span style={{ color: '#64748b', fontSize: 14 }}>▾</span>
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18 }}>📅</button>
          <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18 }} title="Sign out">⚙️</button>
        </div>
      </div>

      <div style={{ padding: '12px 16px 0' }}>

        {!plan && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#111827', border: '1px dashed #1e293b', borderRadius: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>No plan selected</div>
            <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Choose a weekly workout plan to get started.</div>
            <button style={btnPrimary} onClick={() => navigate('/plan')}>Choose a Plan →</button>
          </div>
        )}

        {plan && (
          <>
            {/* Star rating */}
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Do you like your plan?</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(i => (
                  <button key={i} onClick={() => setRating(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: i <= rating ? '#f5c518' : '#334155', padding: '0 1px', lineHeight: 1 }}>★</button>
                ))}
              </div>
            </div>

            {/* Day tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
              {planDays.map((d, i) => {
                const isActive = i === selectedDay
                const isDone = !!completedDays[dateFromDayIndex(i)]
                return (
                  <button key={i} onClick={() => { setSelectedDay(i); setFeaturedIdx(0) }} style={{
                    flexShrink: 0, background: isActive ? '#1e3a5f' : '#111827',
                    border: `1px solid ${isActive ? '#3b82f6' : '#1e293b'}`, borderRadius: 20, padding: '6px 16px',
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#60a5fa' : isDone ? '#22c55e' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}>
                    {isDone ? '✓ ' : ''}Day {i + 1}
                  </button>
                )
              })}
            </div>

            {/* Workout header */}
            <div style={{ marginBottom: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', marginBottom: 4 }}>Week 1/5 · Foundations</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.08em', color: '#f1f5f9', textTransform: 'uppercase' }}>Upcoming Workout</div>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>{currentDay?.name || 'Rest Day'}</div>
                </div>
                <button onClick={() => navigate(`/builder/${selectedDay}`)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: '#94a3b8', fontSize: 14, flexShrink: 0 }}>✎</button>
              </div>
            </div>

            {exercises.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', background: '#111827', borderRadius: 14, border: '1px solid #1e293b', marginBottom: 12 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🏖️</div>
                <div style={{ fontWeight: 700, color: '#94a3b8' }}>Rest Day</div>
              </div>
            ) : (
              <>
                <WarmupCard />
                {featured && (
                  <FeaturedExerciseCard ex={featured} muscleColor={MUSCLE_COLORS[featured.muscle] || '#f97316'} onSwap={() => setFeaturedIdx(i => i + 1)} />
                )}
                {exercises.filter((_, i) => i !== fi).slice(0, 3).map(ex => (
                  <SmallExerciseRow key={ex.id} ex={ex} muscleColor={MUSCLE_COLORS[ex.muscle] || '#f97316'} />
                ))}
                {exercises.length > 4 && (
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#475569', marginBottom: 12 }}>+{exercises.length - 4} more exercises</div>
                )}
                <button onClick={handleStartWorkout} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 8 }}>
                  START WORKOUT
                </button>
              </>
            )}
          </>
        )}
      </div>

      <BottomNav active={activeTab} onNav={handleNav} />
    </div>
  )
}
