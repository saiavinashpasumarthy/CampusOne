
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    collegeName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError(
      'Registration backend is not connected yet. Your details have not been submitted.',
    )
  }

  const fields = [
    {
      name: 'collegeName',
      label: 'College name',
      placeholder: 'Institution name',
      type: 'text',
      autoComplete: 'organization',
    },
    {
      name: 'ownerName',
      label: 'Contact person',
      placeholder: 'Full name',
      type: 'text',
      autoComplete: 'name',
    },
    {
      name: 'email',
      label: 'Work email',
      placeholder: 'name@college.edu',
      type: 'email',
      autoComplete: 'email',
    },
    {
      name: 'phone',
      label: 'Contact number',
      placeholder: 'Phone number',
      type: 'tel',
      autoComplete: 'tel',
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'At least 8 characters',
      type: 'password',
      autoComplete: 'new-password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm password',
      placeholder: 'Re-enter password',
      type: 'password',
      autoComplete: 'new-password',
    },
  ]

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-4 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <section className="glass-panel relative my-auto w-full max-w-3xl rounded-3xl p-5 sm:p-7 lg:p-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-opacity hover:opacity-75"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sign in
          </Link>

          <span className="text-xs font-semibold tracking-[0.18em]">
            CAMPUSONE
          </span>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg-subtle)]">
            <Building2 size={20} aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Register your college
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Request a workspace for your institution.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className="min-w-0">
                <label
                  htmlFor={field.name}
                  className="mb-1.5 block text-sm font-medium"
                >
                  {field.label}
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  minLength={
                    field.name === 'password' ||
                    field.name === 'confirmPassword'
                      ? 8
                      : undefined
                  }
                  placeholder={field.placeholder}
                  className="glass-input px-3.5 py-2.5 text-sm"
                />
              </div>
            ))}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 text-sm"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="glass-button-primary w-full px-5 py-3 text-sm font-semibold"
          >
            Request college registration
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--glass-border-subtle)] pt-4 text-xs text-[var(--color-text-muted)]">
          <p>College registration requires platform approval.</p>

          <Link
            to="/login"
            className="font-semibold text-[var(--color-primary)] hover:underline"
          >
            Already registered? Sign in
          </Link>
        </div>
      </section>
    </main>
  )
}
