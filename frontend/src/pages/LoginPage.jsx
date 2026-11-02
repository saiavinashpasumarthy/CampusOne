
import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'

import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, role, loading: authLoading, profileLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

const roleDashboard = {
  SUPER_ADMIN: '/super-admin',
  COLLEGE_OWNER: '/college',
  COLLEGE_ADMIN: '/college',
  WARDEN: '/warden',
  STUDENT: '/student',
}



  
async function handleSubmit(event) {
  event.preventDefault()
  setError('')
  setLoading(true)

  try {
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    )

    // Wait for AuthContext to load the user's CampusOne role.
    const roleDashboard = {
      SUPER_ADMIN: '/super-admin',
      COLLEGE_OWNER: '/college',
      COLLEGE_ADMIN: '/college',
      WARDEN: '/warden',
      STUDENT: '/student',
    }

    let attempts = 0
    let dashboard = null

    while (attempts < 30) {
      const token = await auth.currentUser.getIdToken()

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json().catch(() => ({}))

      if (response.ok && roleDashboard[data.user?.role]) {
        dashboard = roleDashboard[data.user.role]
        break
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          data.message || 'Your CampusOne account is not active or registered.',
        )
      }

      throw new Error(
        data.message || 'Unable to load your CampusOne profile.',
      )
    }

    if (!dashboard) {
      throw new Error('Could not determine your dashboard. Please try again.')
    }

    navigate(dashboard, { replace: true })
  } catch (err) {
    setError(
      err.message ||
        'Unable to sign in. Check your email and password, then try again.',
    )
  } finally {
    setLoading(false)
  }
}


  async function handleSignOut() {
    setError('')
    setLoading(true)

    try {
      await signOut(auth)
    } catch {
      setError('Unable to sign out right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 sm:px-6">
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <section className="glass-panel relative w-full max-w-md rounded-3xl p-6 sm:p-8">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-opacity hover:opacity-75"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>

        <div className="mb-7">
          <Link
            to="/"
            className="mb-6 inline-flex items-center text-xl font-bold tracking-tight"
            aria-label="CampusOne home"
          >
            <span className="brand-campus">Campus</span>
            <span className="brand-one">One</span>
          </Link>

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg-subtle)] shadow-[var(--shadow-glass)]">
            <LockKeyhole size={23} aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-semibold sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Sign in to access your CampusOne workspace.
          </p>
        </div>

        {user ? (
          <div className="space-y-5">
            <div className="glass-panel-subtle rounded-2xl p-4">
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Currently signed in as
              </p>
              <p className="mt-1 break-all text-sm font-semibold">
                {user.email || 'Authenticated user'}
              </p>
            </div>

            <button
  type="button"
  disabled={!role || profileLoading || authLoading}
  onClick={() => {
    if (roleDashboard[role]) {
      navigate(roleDashboard[role], { replace: true })
    }
  }}
  className="glass-button-primary w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
>
  Continue to workspace
</button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSignOut}
              className="glass-button w-full px-5 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>

            {error && (
              <p role="alert" className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@college.edu"
                  className="glass-input py-3 pl-11 pr-4 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="glass-input py-3 pl-11 pr-12 text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--glass-bg)]"
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary w-full px-5 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in to CampusOne'}
            </button>

            <p className="text-center text-sm text-[var(--color-text-muted)]">
              New institution?{' '}
              <Link
                to="/register-college"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Register your college
              </Link>
            </p>
          </form>
        )}

        <div className="mt-7 border-t border-[var(--glass-border-subtle)] pt-4 text-center">
          <p className="text-xs leading-5 text-[var(--color-text-muted)]">
            Secure sign-in powered by Firebase Authentication.
          </p>
        </div>
      </section>
    </main>
  )
}
