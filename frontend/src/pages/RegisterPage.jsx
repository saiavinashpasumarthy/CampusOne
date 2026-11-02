
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Users,
  Layers3,
} from 'lucide-react'

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
    <main className="relative h-dvh overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--color-primary)] opacity-[0.07] blur-3xl" />
      </div>

      <div className="relative grid h-full min-h-0 lg:grid-cols-[1.1fr_0.9fr]">

        {/* LEFT PANEL — BRANDING */}
        <section className="relative hidden h-full min-h-0 flex-col justify-between overflow-hidden border-r border-[var(--color-border)] px-8 py-6 lg:flex xl:px-14 xl:py-7">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-[var(--color-primary)] opacity-[0.08] blur-3xl"
          />

          {/* Brand */}
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

          {/* Main information */}
          <div className="relative z-10 my-auto max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-primary)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
              JOIN THE CAMPUSONE NETWORK
            </div>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight xl:text-5xl">
              Bring your
              <span className="brand-campus"> campus </span>
              together.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--color-text-muted)] xl:text-base">
              Give your institution a smarter way to manage hostel
              operations, connect people and simplify everyday campus
              administration.
            </p>

            {/* Benefits */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="glass-panel-subtle rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Building2 size={18} />
                  <span className="text-xs font-semibold tracking-wide">
                    ONE WORKSPACE
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold">
                  Centralized management
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  Manage your institution from one platform.
                </p>
              </div>

              <div className="glass-panel-subtle rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Users size={18} />
                  <span className="text-xs font-semibold tracking-wide">
                    CONNECTED PEOPLE
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold">
                  Better coordination
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  Bring students and staff together.
                </p>
              </div>

              <div className="glass-panel-subtle rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-semibold tracking-wide">
                    CONTROLLED ACCESS
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold">
                  Secure administration
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  Role-based access for your institution.
                </p>
              </div>

              <div className="glass-panel-subtle rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Layers3 size={18} />
                  <span className="text-xs font-semibold tracking-wide">
                    SIMPLE WORKFLOWS
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold">
                  Streamlined operations
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  Make everyday tasks easier to manage.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
              <CheckCircle2
                size={20}
                className="shrink-0 text-[var(--color-primary)]"
              />
              <p className="text-xs leading-5 text-[var(--color-text-muted)]">
                Every college registration request is reviewed before
                workspace access is granted.
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
            <span>© {new Date().getFullYear()} CampusOne</span>
            <span>YOUR CAMPUS, CONNECTED</span>
          </div>
        </section>

        {/* RIGHT PANEL — REGISTRATION FORM */}
        <section className="relative flex h-full min-h-0 flex-col justify-center overflow-hidden px-5 py-4 sm:px-10 lg:px-9 xl:px-14">

          <div className="mx-auto w-full max-w-lg">

            {/* Mobile branding */}
            <div className="mb-5 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center text-2xl font-bold tracking-tight"
              >
                <span className="brand-campus">Campus</span>
                <span className="brand-one">One</span>
              </Link>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                YOUR CAMPUS, CONNECTED
              </p>
            </div>

            {/* Back navigation */}
            <Link
              to="/login"
              className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to sign in
            </Link>

            {/* Heading */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg-subtle)] shadow-[var(--shadow-glass)]">
                <Building2 size={21} aria-hidden="true" />
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  CampusOne Workspace
                </p>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Register your college
                </h2>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Request a workspace for your institution.
                </p>
              </div>
            </div>

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.name} className="min-w-0">
                    <label
                      htmlFor={field.name}
                      className="mb-1.5 block text-xs font-semibold"
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
                      className="glass-input py-2.5 pl-3.5 pr-3 text-sm"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 text-xs leading-5"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="glass-button-primary flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                Request college registration
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--glass-border-subtle)] pt-4 text-xs text-[var(--color-text-muted)]">
              <p>Registration requires platform approval.</p>

              <Link
                to="/login"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Already registered? Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
