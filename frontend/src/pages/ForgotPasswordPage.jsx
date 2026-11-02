
import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'

import { auth } from '../firebase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email.trim())
      setMessage(
        'If an account matches that email, you can follow the password-reset instructions sent to it.'
      )
    } catch (err) {
      const messages = {
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/too-many-requests':
          'Too many attempts. Please wait a while and try again.',
        'auth/network-request-failed':
          'Network error. Check your connection and try again.',
      }

      setError(
        messages[err.code] ||
          'Unable to send reset instructions. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <section className="glass-panel relative w-full max-w-md rounded-3xl p-7 sm:p-10">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-opacity hover:opacity-75"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to sign in
        </Link>

        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg-subtle)]">
          <Mail size={23} aria-hidden="true" />
        </div>

        <p className="mb-2 text-xs font-semibold tracking-[0.2em]">
          CAMPUSONE
        </p>

        <h1 className="mb-3 text-3xl font-semibold">
          Forgot password?
        </h1>

        <p className="mb-7 text-sm leading-6 text-[var(--color-text-muted)]">
          Enter the email address associated with your account and we'll
          help you reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>

            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@college.edu"
              className="glass-input px-4 py-3"
            />
          </div>

          {message && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <p>{message}</p>
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="glass-button-primary w-full px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Sending instructions...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-[var(--color-primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
