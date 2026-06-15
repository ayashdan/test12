import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, getRedirectResult, signOut } from 'firebase/auth'
import { auth, provider } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    // Clear any stale redirect state left over from previous signInWithRedirect attempts.
    // Without this, users who hit the old redirect flow get "missing initial state" forever.
    getRedirectResult(auth).catch(() => {})
    return onAuthStateChanged(auth, setUser)
  }, [])

  const login = () => signInWithPopup(auth, provider)
  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
