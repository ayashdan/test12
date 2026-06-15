import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EXERCISES, MUSCLE_COLORS } from '../data/exercises'
import { getPlanDay, dateFromDayIndex, workoutKey } from '../utils/dates'
import ExerciseAnimation, { StyleInjector } from '../components/ExerciseAnimation'
import MuscleSilhouette from '../components/MuscleSilhouette'

// ─── HELPERS ──────────────────────────────────────────────────────────────

function parseExSets(setsStr) {
  // handles "4×6-8", "3×10-12", "3×15", "3×8ea"
  const parts = setsStr.split('×')
  const count = parseInt(parts[0]) || 3
  const repsMatch = (parts[1] || '10').match(/(\d+)(?:-(\d+))?/)
  return {
    count,
    repsLow: repsMatch ? parseInt(repsMatch[1]) : 10,
    repsHigh: repsMatch && repsMatch[2] ? parseInt(repsMatch[2]) : (repsMatch ? parseInt(repsMatch[1]) : 12),
  }
}

function initSetData(exercises) {
  const data = {}
  exercises.forEach(ex => {
    const { count, repsLow, repsHigh } = parseExSets(ex.sets)
    const reps = Math.round((repsLow + repsHigh) / 2)
    data[ex.id] = Array.from({ length: count }, () => ({ weight: 0, reps, done: false }))
  })
  return data
}

function fmtTime(s) {
  const m = Math.floor(s / 60), sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// ─── REST TIMER OVERLAY ───────────────────────────────────────────────────

function RestTimerOverlay({ restLeft, restTotal, onSkip, onAdjust }) {
  const r = 80, sz = 210, sw = 9
  const circ = 2 * Math.PI * r
  const filled = circ * (restLeft / restTotal)
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11,17,32,0.75)', backdropFilter: 'blur(6px)', borderRadius: 14 }}
      onClick={onSkip}>
      <div style={{ position: 'relative', width: sz, height: sz }} onClick={e => e.stopPropagation()}>
        <svg width={sz} height={sz} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={sz/2} cy={sz/2} r={r} fill="#0f1e34" stroke="#1e3a5f" strokeWidth={sw} />
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#f5c518" strokeWidth={sw}
            strokeDasharray={circ} strokeDashoffset={circ - filled}
            strokeLinecap="round" transform={`rotate(-90 ${sz/2} ${sz/2})`}
            style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f5c518', letterSpacing: '0.05em' }}>Tap to Skip</div>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>Rest: 1:00 min</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
            <button onClick={() => onAdjust(-15)} style={{ background: '#1e3a5f', border: 'none', color: '#94a3b8', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>-15</button>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#f5c518', fontFamily: "'DM Mono',monospace", lineHeight: 1, minWidth: 72, textAlign: 'center' }}>{fmtTime(restLeft)}</div>
            <button onClick={() => onAdjust(+15)} style={{ background: '#1e3a5f', border: 'none', color: '#94a3b8', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>+15</button>
          </div>
          <button style={{ background: '#1e3a5f', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: '#94a3b8', fontSize: 13, marginTop: 2 }}>✎</button>
        </div>
      </div>
    </div>
  )
}

// ─── SET ROW ──────────────────────────────────────────────────────────────

function SetLogRow({ set, setIndex, isDone, onLog, onRedo, onWeightChange, onRepsChange }) {
  const adj = (label, onClick) => (
    <button onClick={onClick} style={{ background: '#1e293b', border: 'none', color: '#94a3b8', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{label}</button>
  )
  return (
    <div style={{ background: isDone ? '#f5c518' : '#111827', border: isDone ? 'none' : '1px solid #1e293b', borderRadius: 12, marginBottom: 8, overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
      {/* Weight */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 6px', borderRight: `1px solid ${isDone ? 'rgba(0,0,0,0.1)' : '#1e293b'}` }}>
        {!isDone && <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 3 }}>{setIndex === 0 ? 'Suggested' : `Set ${setIndex + 1}`}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {!isDone && adj('−', () => onWeightChange(Math.max(0, set.weight - 5)))}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: isDone ? 30 : 26, fontWeight: 800, color: isDone ? '#0b1120' : '#f1f5f9', fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{set.weight || '0'}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: isDone ? '#0b1120' : '#64748b', marginLeft: 2 }}>lb</span>
          </div>
          {!isDone && adj('+', () => onWeightChange(set.weight + 5))}
        </div>
      </div>
      {/* Reps */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 6px', borderRight: `1px solid ${isDone ? 'rgba(0,0,0,0.1)' : '#1e293b'}` }}>
        {!isDone && <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 3 }}>reps</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {!isDone && adj('−', () => onRepsChange(Math.max(1, set.reps - 1)))}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: isDone ? 30 : 26, fontWeight: 800, color: isDone ? '#0b1120' : '#f1f5f9', fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{set.reps}</span>
            {isDone && <span style={{ fontSize: 12, fontWeight: 600, color: '#0b1120', marginLeft: 2 }}>reps</span>}
          </div>
          {!isDone && adj('+', () => onRepsChange(set.reps + 1))}
        </div>
      </div>
      {/* Action */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', background: isDone ? 'rgba(0,0,0,0.12)' : 'transparent', cursor: 'pointer', minWidth: 68 }}
        onClick={isDone ? onRedo : onLog}>
        <span style={{ fontSize: 20, color: isDone ? '#0b1120' : '#f5c518' }}>✓</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? '#0b1120' : '#94a3b8', marginTop: 2 }}>{isDone ? 'Redo' : 'Log'}</span>
      </div>
    </div>
  )
}

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────

export default function WorkoutPage({ plan, workouts, completedDays, finishWorkout }) {
  const navigate = useNavigate()
  const { dayIndex: dayParam } = useParams()
  const dayIndex = parseInt(dayParam, 10)

  const workout = workouts[workoutKey(dayIndex)] || { exercises: [], done: [] }
  const exercises = EXERCISES.filter(e => workout.exercises?.includes(e.id))

  const [exIndex, setExIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [setData, setSetData] = useState(() => initSetData(exercises))
  const [isResting, setIsResting] = useState(false)
  const [restLeft, setRestLeft] = useState(60)
  const REST_TOTAL = 60

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!isResting) return
    if (restLeft <= 0) { setIsResting(false); return }
    const t = setTimeout(() => setRestLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [isResting, restLeft])

  const currentEx = exercises[exIndex]
  const exSets = currentEx ? (setData[currentEx.id] || []) : []
  const doneSets = exSets.filter(s => s.done)
  const nextPendingIdx = exSets.findIndex(s => !s.done)
  const totalVolume = Object.values(setData).flat().filter(s => s.done).reduce((a, s) => a + s.weight * s.reps, 0)
  const totalReps = Object.values(setData).flat().filter(s => s.done).reduce((a, s) => a + s.reps, 0)

  function logSet(exId, idx) {
    setSetData(prev => {
      const sets = [...(prev[exId] || [])]; sets[idx] = { ...sets[idx], done: true }
      return { ...prev, [exId]: sets }
    })
    setIsResting(true); setRestLeft(REST_TOTAL)
  }
  function redoSet(exId, idx) {
    setSetData(prev => {
      const sets = [...(prev[exId] || [])]; sets[idx] = { ...sets[idx], done: false }
      return { ...prev, [exId]: sets }
    })
    setIsResting(false)
  }
  function updateSet(exId, idx, field, val) {
    setSetData(prev => {
      const sets = [...(prev[exId] || [])]; sets[idx] = { ...sets[idx], [field]: val }
      return { ...prev, [exId]: sets }
    })
  }
  function logAllSets() {
    if (!currentEx) return
    setSetData(prev => ({ ...prev, [currentEx.id]: (prev[currentEx.id] || []).map(s => ({ ...s, done: true })) }))
  }
  async function handleFinish() {
    const doneIds = exercises.filter(ex => (setData[ex.id] || []).some(s => s.done)).map(ex => ex.id)
    await finishWorkout(dayIndex, doneIds.length ? doneIds : exercises.map(e => e.id))
    navigate('/')
  }

  const allCurrentDone = exSets.length > 0 && exSets.every(s => s.done)
  const isLastEx = exIndex === exercises.length - 1
  const nextEx = exercises[exIndex + 1]
  const color = currentEx ? (MUSCLE_COLORS[currentEx.muscle] || '#f97316') : '#f97316'

  const btnPrimary = {
    background: 'linear-gradient(135deg,#f5c518,#f97316)', color: '#0b1120',
    border: 'none', borderRadius: 14, padding: '15px 20px',
    fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: '0.06em',
    fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase',
    boxShadow: '0 4px 24px rgba(245,197,24,0.2)',
  }

  return (
    <div style={{ background: '#0b1120', minHeight: '100vh', color: '#f1f5f9', fontFamily: "'DM Sans','Segoe UI',sans-serif", paddingBottom: 40 }}>
      <StyleInjector />

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #111827' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Exit</button>
        <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color: '#94a3b8' }}>EXERCISE {exIndex + 1}/{exercises.length}</div>
        <button onClick={() => setExIndex(0)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Exercises</button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', borderBottom: '1px solid #111827', padding: '10px 0' }}>
        {[{ label: 'Time', value: fmtTime(elapsed) }, { label: 'Volume', value: `${totalVolume.toLocaleString()} lb` }, { label: 'Reps', value: String(totalReps) }].map((stat, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative', borderRight: i < 2 ? '1px solid #1e293b' : 'none' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "'DM Mono',monospace" }}>{stat.value}</div>
            {i < 2 && <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: '50%', background: '#334155' }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        {/* Current exercise card + rest overlay */}
        {currentEx && (
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#0a1628' }}>
                <ExerciseAnimation exerciseId={currentEx.id} muscleColor={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', marginBottom: 7, lineHeight: 1.3 }}>{currentEx.name}</div>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', background: color, color: '#0b1120', borderRadius: 6, padding: '3px 9px' }}>{currentEx.muscle.toUpperCase()}</span>
              </div>
              <button style={{ background: '#1e293b', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: '#64748b', fontSize: 15, flexShrink: 0 }}>≡</button>
            </div>
            {isResting && (
              <RestTimerOverlay restLeft={restLeft} restTotal={REST_TOTAL}
                onSkip={() => setIsResting(false)}
                onAdjust={d => setRestLeft(s => Math.max(0, s + d))} />
            )}
          </div>
        )}

        {/* Max/history summary */}
        {doneSets.length > 0 && (
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, paddingLeft: 2 }}>
            Max Weight Lifted{'  '}
            <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{Math.max(...doneSets.map(s => s.weight))} lb</span>
            {'  ·  '}
            <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{doneSets[doneSets.length - 1]?.reps} reps</span>
            {'  ·  Today'}
          </div>
        )}

        {/* Set rows */}
        {exSets.map((set, i) => {
          if (!set.done && i !== nextPendingIdx) return null
          return (
            <SetLogRow key={i} set={set} setIndex={i} isDone={set.done}
              onLog={() => logSet(currentEx.id, i)}
              onRedo={() => redoSet(currentEx.id, i)}
              onWeightChange={w => updateSet(currentEx.id, i, 'weight', w)}
              onRepsChange={r => updateSet(currentEx.id, i, 'reps', r)} />
          )
        })}

        {/* Log All Sets */}
        {!allCurrentDone && (
          <button onClick={logAllSets} style={{ width: '100%', background: '#111827', border: '1px solid #1e293b', borderRadius: 12, padding: '14px', color: '#64748b', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>
            Log All Sets
          </button>
        )}

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <button style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Customize Exercise</button>
        </div>

        {allCurrentDone && !isLastEx && (
          <button onClick={() => { setExIndex(i => i + 1); setIsResting(false) }} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 16 }}>
            Next Exercise →
          </button>
        )}
        {allCurrentDone && isLastEx && (
          <button onClick={handleFinish} style={{ ...btnPrimary, width: '100%', textAlign: 'center', marginBottom: 16 }}>
            Complete Workout 🎯
          </button>
        )}

        {/* Next exercise preview */}
        {nextEx && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f5c518', marginBottom: 8 }}>Next Exercise</div>
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
              <div style={{ width: 58, height: 58, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#0a1628' }}>
                <ExerciseAnimation exerciseId={nextEx.id} muscleColor={MUSCLE_COLORS[nextEx.muscle] || '#f97316'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 3 }}>{nextEx.name}</div>
                <div style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono',monospace" }}>{nextEx.sets}</div>
              </div>
              <MuscleSilhouette muscles={[nextEx.muscle]} size={40} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
