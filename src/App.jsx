import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useUserData } from './hooks/useUserData'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import PlanPage from './pages/Plan'
import BuilderPage from './pages/Builder'
import WorkoutPage from './pages/Workout'

export default function App() {
  const { user } = useAuth()

  // Still resolving auth state — show blank dark screen
  if (user === undefined) return <div style={{ minHeight: '100vh', background: '#020817' }} />

  if (!user) return <LoginPage />

  return <AuthedApp uid={user.uid} />
}

function AuthedApp({ uid }) {
  const data = useUserData(uid)

  if (data.loading) return (
    <div style={{ minHeight: '100vh', background: '#020817', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#475569', fontSize: 13 }}>Loading...</div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<HomePage {...data} />} />
      <Route path="/plan" element={<PlanPage {...data} />} />
      <Route path="/builder/:dayIndex" element={<BuilderPage {...data} />} />
      <Route path="/workout/:dayIndex" element={<WorkoutPage {...data} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
