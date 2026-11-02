
import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

export default function RoutePlaceholder({ title, description }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-border)]">
          <Construction size={30} aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]">
          CampusOne
        </p>

        <h1 className="mb-4 text-3xl font-semibold">
          {title}
        </h1>

        <p className="mb-8 text-base leading-7 text-[var(--color-text-muted)]">
          {description}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 transition-opacity hover:opacity-75"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to home
        </Link>
      </section>
    </main>
  )
}
