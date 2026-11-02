
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    let cancelled = false

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (cancelled) return

      setUser(firebaseUser)
      setProfile(null)
      setProfileError('')

      if (!firebaseUser) {
        setProfileLoading(false)
        setLoading(false)
        return
      }

      setProfileLoading(true)

      try {
        const response = await apiRequest('/auth/me')

        if (!cancelled) {
          setProfile(response.user ?? null)
        }
      } catch (error) {
        if (!cancelled) {
          setProfileError(error.message || 'Unable to load your CampusOne profile.')
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false)
          setLoading(false)
        }
      }
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const value = {
    user,
    profile,
    role: profile?.role ?? null,
    collegeId: profile?.collegeId ?? null,
    loading,
    profileLoading,
    profileError,
    isAuthenticated: Boolean(user),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
