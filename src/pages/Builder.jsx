import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ExerciseCard from '../components/ExerciseCard'
import { MUSCLE_COLORS } from '../data/exercises'
import { S } from '../styles'
import { getPlanDay, getExercisesForDay, workoutKey } from '../utils/dates'

export default function BuilderPage({ plan, workouts, saveWorkout }) {
  const navigate = useNavigate()
  const { dayIndex: dayParam } = useParams()
  const dayIndex = parseInt(dayParam, 10)

  const planDay = getPlanDay(plan, dayIndex)
  const existing = workouts[workoutKey(dayIndex)]
  const [selected, setSelected] = useState(existing?.exercises || [])
  const [muscleFilter, setMuscleFilter] = useState('All')

  const allExercises = getExercisesForDay(planDay)
  const muscles = planDay ? [...new Set(planDay.muscles)] : []
  const filtered = muscleFilter === 'All' ? allExercises : allExercises.filter(e => e.muscle === muscleFilter)

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleSave() {
    if (selected.length === 0) return
    saveWorkout(dayIndex, selected)
    navigate('/')
  }

  return (
    <div style={S.app}>
      <div style={S.container}>
        <div style={S.header}>
          <button style={S.btnGhost} onClick={() => navigate('/')}>← Back</button>
          <button style={{ ...S.btnPrimary, opacity: selected.length === 0 ? 0.4 : 1, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}
            onClick={handleSave}>Save ({selected.length})</button>
        </div>

        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>{planDay?.name || 'Rest Day'}</div>
        <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>{planDay?.muscles.join(' · ') || ''}</div>

        {/* Muscle filter chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {['All', ...muscles].map(m => {
            const isActive = muscleFilter === m
            const color = MUSCLE_COLORS[m] || '#f97316'
            return (
              <button key={m} onClick={() => setMuscleFilter(m)} style={{
                background: isActive ? `${color}22` : 'transparent',
                color: isActive ? color : '#94a3b8',
                border: `1px solid ${isActive ? color : '#1e293b'}`,
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>{m}</button>
            )
          })}
        </div>

        <div style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>{filtered.length} exercises available</div>

        {filtered.map(ex => (
          <ExerciseCard key={ex.id} ex={ex}
            selected={selected.includes(ex.id)}
            done={false}
            onToggle={() => toggle(ex.id)}
          />
        ))}
      </div>
    </div>
  )
}
