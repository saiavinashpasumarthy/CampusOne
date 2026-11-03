
import { useCallback, useEffect, useState } from 'react'
import {
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
  ShieldCheck,
  Clock3,
  Ban,
  UserRound,
  X,
} from 'lucide-react'
import { apiRequest } from '../services/api'

const ROLES = [
  'SUPER_ADMIN',
  'COLLEGE_ADMIN',
  'WARDEN',
  'STUDENT',
]

const STATUSES = ['ACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED']

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
  }).format(date)
}

function getStatusStyles(status) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'SUSPENDED':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'REJECTED':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

function getRoleIcon(role) {
  if (role === 'SUPER_ADMIN') return ShieldCheck
  if (role === 'STUDENT') return UserRound
  return Building2
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
          <Icon
            size={20}
            className="text-[var(--color-primary)]"
          />
        </div>
      </div>
    </div>
  )
}

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState([])
  const [colleges, setColleges] = useState([])

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [collegeId, setCollegeId] = useState('')

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadColleges = useCallback(async () => {
    try {
      const response = await apiRequest(
        '/super-admin/colleges?limit=100',
      )

      return response.data?.colleges || []
    } catch (err) {
      console.error('Failed to load colleges:', err)
      return []
    }
  }, [])

  const loadUsers = useCallback(
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
        if (role) params.set('role', role)
        if (status) params.set('status', status)
        if (collegeId) params.set('collegeId', collegeId)

        const response = await apiRequest(
          `/super-admin/users?${params.toString()}`,
        )

        setUsers(response.data?.users || [])
        setPagination((previous) => ({
          ...previous,
          ...(response.data?.pagination || {}),
        }))
      } catch (err) {
        setUsers([])
        setError(err.message || 'Unable to load platform users.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [
      pagination.page,
      pagination.limit,
      search,
      role,
      status,
      collegeId,
    ],
  )

  useEffect(() => {
    loadColleges().then(setColleges)
  }, [loadColleges])

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers()
    }, 0)

    return () => clearTimeout(timeout)
  }, [loadUsers])

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
    setRole('')
    setStatus('')
    setCollegeId('')
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }))
  }

  const hasActiveFilters = Boolean(
    search || role || status || collegeId,
  )

  const activeCount = users.filter(
    (user) => user.status === 'ACTIVE',
  ).length

  const pendingCount = users.filter(
    (user) => user.status === 'PENDING',
  ).length

  const suspendedCount = users.filter(
    (user) => user.status === 'SUSPENDED',
  ).length

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
            <Users size={16} />
            <span>Platform Management</span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Platform Users
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            View and monitor all registered users across CampusOne.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadUsers({ refresh: true })}
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
          title="Total Users"
          value={pagination.total.toLocaleString('en-IN')}
          icon={Users}
          description="Matching your current filters"
        />

        <MetricCard
          title="Active Users"
          value={activeCount}
          icon={ShieldCheck}
          description="On this page"
        />

        <MetricCard
          title="Pending Users"
          value={pendingCount}
          icon={Clock3}
          description="On this page"
        />

        <MetricCard
          title="Suspended Users"
          value={suspendedCount}
          icon={Ban}
          description="On this page"
        />
      </div>

      {/* Filters */}
      <section className="glass-panel space-y-4 p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter
              size={18}
              className="text-[var(--color-primary)]"
            />

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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
              placeholder="Search email or Firebase UID"
              className="glass-input w-full py-2.5 pl-10 pr-3 text-sm"
            />
          </div>

          <select
            value={role}
            onChange={(event) =>
              updateFilter(setRole, event.target.value)
            }
            className="glass-input w-full px-3 py-2.5 text-sm"
          >
            <option value="">All roles</option>
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              updateFilter(setStatus, event.target.value)
            }
            className="glass-input w-full px-3 py-2.5 text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>

          <select
            value={collegeId}
            onChange={(event) =>
              updateFilter(setCollegeId, event.target.value)
            }
            className="glass-input w-full px-3 py-2.5 text-sm"
          >
            <option value="">All colleges</option>
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name} ({college.code})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* User table */}
      <section className="glass-panel overflow-hidden">
        <div className="flex flex-col justify-between gap-2 border-b border-[var(--glass-border-subtle)] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-[var(--color-text)]">
              User directory
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {pagination.total.toLocaleString('en-IN')} matching users
            </p>
          </div>

          <span className="text-xs text-[var(--color-text-muted)]">
            Showing {users.length} of {pagination.total}
          </span>
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm font-medium text-red-500">
              Unable to load users
            </p>

            <p className="mt-1 text-sm text-red-500/80">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadUsers({ refresh: true })}
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
              Loading platform users...
            </p>
          </div>
        ) : !error && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-2xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] p-4">
              <Users
                size={28}
                className="text-[var(--color-text-muted)]"
              />
            </div>

            <h3 className="mt-4 font-semibold text-[var(--color-text)]">
              No users found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
              {hasActiveFilters
                ? 'Try changing your search or filters.'
                : 'There are no platform users to display yet.'}
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
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[var(--glass-border-subtle)] text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-5 py-4 font-medium">User</th>
                    <th className="px-5 py-4 font-medium">Role</th>
                    <th className="px-5 py-4 font-medium">College</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const RoleIcon = getRoleIcon(user.role)

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-[var(--glass-border-subtle)] last:border-b-0 transition-colors hover:bg-[var(--glass-bg-subtle)]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)]">
                              <UserRound
                                size={18}
                                className="text-[var(--color-primary)]"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate text-sm font-medium text-[var(--color-text)]">
                                {user.email}
                              </p>

                              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                ID: {String(user._id).slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                            <RoleIcon
                              size={15}
                              className="text-[var(--color-text-muted)]"
                            />
                            {formatLabel(user.role)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {user.collegeId ? (
                            <div>
                              <p className="max-w-[220px] truncate text-sm font-medium text-[var(--color-text)]">
                                {user.collegeId.name || 'Unnamed college'}
                              </p>

                              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                {user.collegeId.code || '—'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--color-text-muted)]">
                              Platform-wide
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyles(user.status)}`}
                          >
                            {formatLabel(user.status)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-4 border-t border-[var(--glass-border-subtle)] p-5 sm:flex-row sm:items-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                Page {pagination.page} of{' '}
                {Math.max(1, pagination.totalPages)}
                {' · '}
                {pagination.total} total users
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
    </div>
  )
}
