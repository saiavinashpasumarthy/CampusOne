
import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ShieldCheck,
  Building2,
  Users,
  Clock3,
  Eye,
} from 'lucide-react'
import { apiRequest } from '../services/api'

const CATEGORIES = [
  'AUTHENTICATION',
  'USER_MANAGEMENT',
  'COLLEGE_MANAGEMENT',
  'SUBSCRIPTION',
  'SYSTEM',
  'SECURITY',
]

const ACTIONS = [
  'USER_SUSPENDED',
  'USER_REACTIVATED',
  'COLLEGE_APPROVED',
  'COLLEGE_REJECTED',
  'COLLEGE_SUSPENDED',
  'COLLEGE_REACTIVATED',
]

function formatLabel(value = '') {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getCategoryStyles(category) {
  switch (category) {
    case 'USER_MANAGEMENT':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'COLLEGE_MANAGEMENT':
      return 'bg-violet-500/10 text-violet-500 border-violet-500/20'
    case 'AUTHENTICATION':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'SECURITY':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

function getActionStyles(action) {
  if (action.includes('SUSPENDED') || action.includes('REJECTED')) {
    return 'text-red-500'
  }

  if (action.includes('APPROVED') || action.includes('REACTIVATED')) {
    return 'text-emerald-500'
  }

  return 'text-[var(--color-text)]'
}

function MetricCard({ title, value, icon: Icon, description }) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-[var(--color-text-muted)]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] p-3">
          <Icon size={20} className="text-[var(--color-primary)]" />
        </div>
      </div>
    </div>
  )
}

export default function SuperAdminActivityLogsPage() {
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [selectedLog, setSelectedLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadLogs = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        if (refresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError('')

        const params = new URLSearchParams({
          page: String(pagination.page),
          limit: String(pagination.limit),
        })

        if (search) params.set('search', search)
        if (category) params.set('category', category)
        if (action) params.set('action', action)
        if (from) params.set('from', from)
        if (to) params.set('to', to)

        const response = await apiRequest(
          `/super-admin/activity-logs?${params.toString()}`,
        )

        setLogs(response.data?.logs || [])
        setPagination((previous) => ({
          ...previous,
          ...(response.data?.pagination || {}),
        }))
      } catch (err) {
        setLogs([])
        setError(err.message || 'Unable to load activity logs.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [
      pagination.page,
      pagination.limit,
      search,
      category,
      action,
      from,
      to,
    ],
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadLogs()
    }, 0)

    return () => clearTimeout(timeout)
  }, [loadLogs])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim())
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const updateFilter = (setter, value) => {
    setter(value)
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }))
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setCategory('')
    setAction('')
    setFrom('')
    setTo('')
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }))
  }

  const hasActiveFilters = Boolean(
    search || category || action || from || to,
  )

  const categoryCounts = logs.reduce((counts, log) => {
    counts[log.category] = (counts[log.category] || 0) + 1
    return counts
  }, {})

  const goToPage = (nextPage) => {
    setPagination((previous) => ({
      ...previous,
      page: nextPage,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <Activity size={16} />
            <span>Platform Monitoring</span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Activity Logs
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Monitor important actions performed across the CampusOne platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLogs({ refresh: true })}
          disabled={loading || refreshing}
          className="glass-button inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Activities"
          value={pagination.total.toLocaleString('en-IN')}
          icon={Activity}
          description="Matching current filters"
        />

        <MetricCard
          title="User Management"
          value={categoryCounts.USER_MANAGEMENT || 0}
          icon={Users}
          description="On this page"
        />

        <MetricCard
          title="College Management"
          value={categoryCounts.COLLEGE_MANAGEMENT || 0}
          icon={Building2}
          description="On this page"
        />

        <MetricCard
          title="Other Activities"
          value={logs.filter(
            (log) =>
              !['USER_MANAGEMENT', 'COLLEGE_MANAGEMENT'].includes(
                log.category,
              ),
          ).length}
          icon={ShieldCheck}
          description="On this page"
        />
      </div>

      {/* Filters */}
      <section className="glass-panel space-y-4 p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[var(--color-primary)]" />
            <h2 className="font-semibold text-[var(--color-text)]">
              Search and filters
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) =>
                updateFilter(setSearchInput, event.target.value)
              }
              placeholder="Search activity..."
              className="glass-input w-full py-2.5 pl-10 pr-3 text-sm"
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              updateFilter(setCategory, event.target.value)
            }
            className="glass-input w-full px-3 py-2.5 text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>

          <select
            value={action}
            onChange={(event) =>
              updateFilter(setAction, event.target.value)
            }
            className="glass-input w-full px-3 py-2.5 text-sm"
          >
            <option value="">All actions</option>
            {ACTIONS.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>

          <div>
            <label className="mb-1.5 block text-xs text-[var(--color-text-muted)]">
              From date
            </label>
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) =>
                updateFilter(setFrom, event.target.value)
              }
              className="glass-input w-full px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-[var(--color-text-muted)]">
              To date
            </label>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) =>
                updateFilter(setTo, event.target.value)
              }
              className="glass-input w-full px-3 py-2.5 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Activity table */}
      <section className="glass-panel overflow-hidden">
        <div className="flex flex-col justify-between gap-2 border-b border-[var(--glass-border-subtle)] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-[var(--color-text)]">
              Platform activity
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {pagination.total.toLocaleString('en-IN')} matching records
            </p>
          </div>

          <span className="text-xs text-[var(--color-text-muted)]">
            Showing {logs.length} of {pagination.total}
          </span>
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm font-medium text-red-500">
              Unable to load activity logs
            </p>
            <p className="mt-1 text-sm text-red-500/80">{error}</p>
            <button
              type="button"
              onClick={() => loadLogs({ refresh: true })}
              className="mt-3 text-sm font-medium text-red-500 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading && !error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <RefreshCw
              size={24}
              className="animate-spin text-[var(--color-primary)]"
            />
            <p className="text-sm text-[var(--color-text-muted)]">
              Loading activity logs...
            </p>
          </div>
        ) : !error && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-2xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] p-4">
              <Clock3
                size={28}
                className="text-[var(--color-text-muted)]"
              />
            </div>

            <h3 className="mt-4 font-semibold text-[var(--color-text)]">
              No activity found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
              {hasActiveFilters
                ? 'Try changing your search or filters.'
                : 'Platform actions will appear here as they are recorded.'}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-[var(--glass-border-subtle)] text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-5 py-4 font-medium">Activity</th>
                    <th className="px-5 py-4 font-medium">Category</th>
                    <th className="px-5 py-4 font-medium">Performed by</th>
                    <th className="px-5 py-4 font-medium">Target</th>
                    <th className="px-5 py-4 font-medium">Date & time</th>
                    <th className="px-5 py-4 font-medium">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-b border-[var(--glass-border-subtle)] last:border-b-0 transition-colors hover:bg-[var(--glass-bg-subtle)]"
                    >
                      <td className="px-5 py-4">
                        <p className={`text-sm font-semibold ${getActionStyles(log.action)}`}>
                          {formatLabel(log.action)}
                        </p>
                        <p className="mt-1 max-w-[280px] text-xs text-[var(--color-text-muted)]">
                          {log.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getCategoryStyles(log.category)}`}>
                          {formatLabel(log.category)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {log.performedBy?.email || 'Unknown user'}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {formatLabel(log.actorRole)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-[var(--color-text)]">
                          {log.targetType || '—'}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {log.collegeId?.name || log.metadata?.targetEmail || '—'}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">
                        {formatDate(log.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="glass-button inline-flex items-center gap-2 px-3 py-2 text-xs"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-4 border-t border-[var(--glass-border-subtle)] p-5 sm:flex-row sm:items-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                Page {pagination.page} of{' '}
                {Math.max(1, pagination.totalPages)}
                {' · '}
                {pagination.total} total activities
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loading}
                  className="glass-button inline-flex items-center gap-1 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={
                    pagination.page >= pagination.totalPages ||
                    loading ||
                    pagination.totalPages === 0
                  }
                  className="glass-button inline-flex items-center gap-1 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Activity details dialog */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLog(null)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-details-title"
            className="glass-panel-strong w-full max-w-xl space-y-5 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Activity details
                </p>
                <h2
                  id="activity-details-title"
                  className="mt-2 text-xl font-semibold text-[var(--color-text)]"
                >
                  {formatLabel(selectedLog.action)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                aria-label="Close details"
                className="glass-button h-9 w-9"
              >
                <X size={17} />
              </button>
            </div>

            <p className="text-sm text-[var(--color-text-muted)]">
              {selectedLog.description}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Performed by</p>
                <p className="mt-1 break-all text-sm text-[var(--color-text)]">
                  {selectedLog.performedBy?.email || 'Unknown user'}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Actor role</p>
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {formatLabel(selectedLog.actorRole)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Category</p>
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {formatLabel(selectedLog.category)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Target type</p>
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {selectedLog.targetType || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-text-muted)]">College</p>
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {selectedLog.collegeId?.name || 'Platform-wide'}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Date & time</p>
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {formatDate(selectedLog.createdAt)}
                </p>
              </div>
            </div>

            {selectedLog.metadata &&
              Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                    Additional information
                  </p>
                  <pre className="max-h-52 overflow-auto rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] p-4 text-xs text-[var(--color-text)]">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
          </section>
        </div>
      )}
    </div>
  )
}
