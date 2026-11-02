import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  RefreshCw,
  Search,
  Settings2,
} from 'lucide-react'
import { apiRequest } from '../services/api'

const statuses = ['ALL', 'PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED']

export default function SuperAdminCollegesPage() {
  const [colleges, setColleges] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState('')

  const loadColleges = useCallback(async (signal) => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({ limit: '50' })

      if (search.trim()) params.set('search', search.trim())
      if (status !== 'ALL') params.set('status', status)

      const response = await apiRequest(
        `/super-admin/colleges?${params.toString()}`,
      )

      if (!signal.cancelled) {
        setColleges(response.data.colleges)
      }
    } catch (err) {
      if (!signal.cancelled) {
        setError(err.message || 'Could not load colleges.')
      }
    } finally {
      if (!signal.cancelled) {
        setLoading(false)
      }
    }
  }, [search, status])

  useEffect(() => {
    const signal = { cancelled: false }

    Promise.resolve().then(() => loadColleges(signal))

    return () => {
      signal.cancelled = true
    }
  }, [loadColleges, refreshKey])

  return (
    <div className="space-y-6 text-[var(--color-text)]">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/super-admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to overview
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)]">
              <Building2 size={24} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Colleges
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Find institutions and manage each college individually.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="glass-button inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
            aria-hidden="true"
          />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>

      <section className="glass-panel rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <label className="relative block flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by college name, code, or email..."
              className="w-full rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </label>

          <label className="flex items-center gap-3 text-sm">
            <span className="text-[var(--color-text-muted)]">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item === 'ALL'
                    ? 'All statuses'
                    : item.charAt(0) + item.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="glass-panel-subtle rounded-xl p-8 text-center text-sm text-[var(--color-text-muted)]">
              Loading colleges...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="glass-panel-subtle rounded-xl p-5 text-sm text-red-500"
            >
              {error}
              <button
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                className="ml-3 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          ) : colleges.length === 0 ? (
            <div className="glass-panel-subtle rounded-xl p-8 text-center">
              <Building2
                size={28}
                className="mx-auto mb-3 text-[var(--color-text-muted)]"
                aria-hidden="true"
              />
              <p className="font-medium">No colleges found</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Try a different search term or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--glass-border-subtle)] text-[var(--color-text-muted)]">
                    <th className="px-3 py-3 font-medium">College</th>
                    <th className="px-3 py-3 font-medium">Code</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    <th className="px-3 py-3 font-medium">Plan</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {colleges.map((college) => (
                    <tr
                      key={college._id}
                      className="border-b border-[var(--glass-border-subtle)] transition-colors hover:bg-[var(--glass-bg-subtle)] last:border-0"
                    >
                      <td className="px-3 py-4 font-medium">
                        {college.name}
                      </td>
                      <td className="px-3 py-4">{college.code}</td>
                      <td className="px-3 py-4">{college.email}</td>
                      <td className="px-3 py-4">
                        {college.subscriptionPlan}
                      </td>
                      <td className="px-3 py-4">
                        <span className="inline-flex rounded-full border border-[var(--glass-border-subtle)] px-3 py-1 text-xs font-medium">
                          {college.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-right">
                        <Link
                          to={`/super-admin/colleges/${encodeURIComponent(college._id)}`}
                          className="glass-button inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold"
                          aria-label={`Manage ${college.name}`}
                        >
                          <Settings2 size={15} aria-hidden="true" />
                          Manage
                          <ExternalLink
                            size={13}
                            aria-hidden="true"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && (
          <p className="mt-4 text-xs text-[var(--color-text-muted)]">
            Showing {colleges.length} college
            {colleges.length === 1 ? '' : 's'} on this page.
          </p>
        )}
      </section>
    </div>
  )
}
