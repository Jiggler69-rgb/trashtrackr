import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { auth, signInWithGoogle, signOutUser } from '../services/auth'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async () => {
        if (loading) return
        await signInWithGoogle()
      },
      signOut: async () => {
        await signOutUser()
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


