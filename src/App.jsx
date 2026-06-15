import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useUserData } from './hooks/useUserData'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import ModePage from './pages/Plan'
import BuilderPage from './pages/Builder'
import PicksPage from './pages/Workout'

export default function App() {
  const { user } = useAuth()

  if (user === undefined) return <div style={{ minHeight: '100vh', background: '#020817' }} />

  if (!user) return <LoginPage />

  return <AuthedApp uid={user.uid} user={user} />
}

function AuthedApp({ uid, user }) {
  const data = useUserData(uid, user)

  if (data.loading) return (
    <div style={{ minHeight: '100vh', background: '#020817', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#475569', fontSize: 13 }}>Loading...</div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<HomePage {...data} user={user} />} />
      <Route path="/plan" element={<ModePage {...data} />} />
      <Route path="/builder/:dayIndex" element={<BuilderPage {...data} />} />
      <Route path="/workout/:dayIndex" element={<PicksPage {...data} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
