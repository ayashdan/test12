import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signInWithPopup, signInWithRedirect,
  getRedirectResult, setPersistence, browserLocalPersistence, signOut,
} from 'firebase/auth'
import { auth, provider } from '../firebase'

const AuthContext = createContext(null)

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    // On mobile, check if we're returning from a redirect sign-in
    if (isMobile()) {
      getRedirectResult(auth)
        .then(result => { if (result?.user) setUser(result.user) })
        .catch(() => {})
    }
    return onAuthStateChanged(auth, setUser)
  }, [])

  const login = async () => {
    if (isMobile()) {
      // Store auth persistence in localStorage so Safari doesn't lose state
      await setPersistence(auth, browserLocalPersistence)
      return signInWithRedirect(auth, provider)
    }
    return signInWithPopup(auth, provider)
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
