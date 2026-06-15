import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth'
import { auth, provider } from '../firebase'

const AuthContext = createContext(null)

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export function AuthProvider({ children }) {
  // undefined = still loading, null = signed out, object = signed in
  const [user, setUser] = useState(undefined)
  const [redirectPending, setRedirectPending] = useState(true)

  useEffect(() => {
    // Process redirect result first, then listen for auth state
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) setUser(result.user)
      })
      .catch(() => {})
      .finally(() => setRedirectPending(false))

    return onAuthStateChanged(auth, u => {
      if (!redirectPending) setUser(u)
    })
  }, [])

  // Show nothing while processing redirect (avoids flash back to login)
  useEffect(() => {
    if (!redirectPending) {
      const unsub = onAuthStateChanged(auth, setUser)
      return unsub
    }
  }, [redirectPending])

  const login = () => isMobile()
    ? signInWithRedirect(auth, provider)
    : signInWithPopup(auth, provider)

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user: redirectPending ? undefined : user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
