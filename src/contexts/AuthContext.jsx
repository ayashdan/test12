import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth'
import { auth, provider } from '../firebase'

const AuthContext = createContext(null)

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    // Handle redirect result on mobile after returning from Google
    getRedirectResult(auth).catch(() => {})
    return onAuthStateChanged(auth, setUser)
  }, [])

  const login = () => isMobile()
    ? signInWithRedirect(auth, provider)
    : signInWithPopup(auth, provider)

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
