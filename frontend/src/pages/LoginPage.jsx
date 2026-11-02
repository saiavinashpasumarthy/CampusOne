
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
  <main className="relative h-dvh overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-3xl" />
    </div>

    <div className="relative grid h-full min-h-0 lg:grid-cols-[1.1fr_0.9fr]">

      {/* LEFT SIDE — BRANDING & INFORMATION */}
      <section className="relative hidden h-full min-h-0 flex-col justify-between overflow-hidden border-r border-[var(--color-border)] px-8 py-6 lg:flex xl:px-14 xl:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-[var(--color-primary)] opacity-[0.08] blur-3xl"
        />

        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center text-2xl font-bold tracking-tight"
            aria-label="CampusOne home"
          >
            <span className="brand-campus">Campus</span>
            <span className="brand-one">One</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-primary)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            YOUR CAMPUS, CONNECTED
          </div>

          <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">
            Everything your
            <span className="brand-campus"> campus </span>
            needs, in
            <span className="block">one place.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--color-text-muted)] xl:text-base">
            A smarter way to manage campus life. Connect students,
            wardens and administrators through one seamless platform.
          </p>

          {/* Feature highlights */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              {
                number: '01',
                title: 'Simplified management',
                description: 'Manage hostel operations with clarity.',
              },
              {
                number: '02',
                title: 'Connected campus',
                description: 'Keep everyone on the same page.',
              },
              {
                number: '03',
                title: 'Secure access',
                description: 'Role-based access for every user.',
              },
              {
                number: '04',
                title: 'Better experiences',
                description: 'Make everyday campus tasks simpler.',
              },
            ].map((feature) => (
              <div
                key={feature.number}
                className="glass-panel-subtle rounded-xl p-3.5"
              >
                <span className="text-xs font-semibold tracking-widest text-[var(--color-primary)]">
                  {feature.number}
                </span>
                <h3 className="mt-3 text-sm font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <span>© {new Date().getFullYear()} CampusOne</span>
          <span>Built for a better campus experience.</span>
        </div>
      </section>

      {/* RIGHT SIDE — LOGIN FORM */}
      <section className="relative flex min-h-screen flex-col justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">

          {/* Mobile branding */}
          <div className="mb-10 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center text-2xl font-bold tracking-tight"
            >
              <span className="brand-campus">Campus</span>
              <span className="brand-one">One</span>
            </Link>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              YOUR CAMPUS, CONNECTED
            </p>
          </div>

          <Link
            to="/"
            className="mb-9 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg-subtle)] shadow-[var(--shadow-glass)]">
              <LockKeyhole size={22} />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              CampusOne Workspace
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              Sign in to access your CampusOne workspace.
            </p>
          </div>

          {user ? (
            <div className="space-y-5">
              <div className="glass-panel rounded-2xl p-5">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  Currently signed in as
                </p>
                <p className="mt-2 break-all text-sm font-semibold">
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
                className="glass-button-primary w-full px-5 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
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

          <div className="mt-9 border-t border-[var(--glass-border-subtle)] pt-5 text-center">
            <p className="text-xs leading-5 text-[var(--color-text-muted)]">
              Secure sign-in powered by Firebase Authentication.
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
)

}
