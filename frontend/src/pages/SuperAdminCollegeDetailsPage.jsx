import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
  Ban,
  Power,
} from 'lucide-react'
import { apiRequest } from '../services/api'

const statusStyles = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
  PENDING: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
  REJECTED: 'bg-rose-500/10 text-rose-600 ring-rose-500/20',
  SUSPENDED: 'bg-slate-500/10 text-slate-500 ring-slate-500/20',
}

const roleLabels = {
  COLLEGE_OWNER: 'College owners',
  COLLEGE_ADMIN: 'College administrators',
  WARDEN: 'Wardens',
  STUDENT: 'Students',
  SUPER_ADMIN: 'Super admins',
}

const statusLabels = {
  ACTIVE: 'Active accounts',
  PENDING: 'Pending accounts',
  SUSPENDED: 'Suspended accounts',
  REJECTED: 'Rejected accounts',
}

function formatDate(value) {
  if (!value) return 'Not available'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Not available'

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
      <div className="mb-3 flex items-center gap-3">
        <span className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
          <Icon size={19} />
        </span>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>

      <p className="break-words text-xl font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}

function CountList({ title, items, labels, emptyMessage }) {
  const entries = Object.entries(items ?? {})

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
      <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, count]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-3 dark:bg-white/5"
            >
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {labels[key] ?? key.replaceAll('_', ' ')}
              </span>

              <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function SuperAdminCollegeDetailsPage() {
  const { collegeId } = useParams()

  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState('')

  const loadDetails = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      try {
        const response = await apiRequest(
          `/super-admin/colleges/${encodeURIComponent(collegeId)}`,
        )

        if (!response.success || !response.data?.college) {
          throw new Error('The college details response was incomplete.')
        }

        setDetails(response.data)
      } catch (err) {
        setError(err.message || 'Unable to load college details.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [collegeId],
  )

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) loadDetails()
    })

    return () => {
      cancelled = true
    }
  }, [loadDetails])

  const handleStatusChange = async (nextStatus) => {
    if (updatingStatus || refreshing) return

    const collegeName = details?.college?.name ?? 'this college'
    const action =
      nextStatus === 'SUSPENDED' ? 'suspend' : 'reactivate'

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${collegeName}?`,
    )

    if (!confirmed) return

    setUpdatingStatus(true)
    setStatusMessage('')
    setStatusError('')

    try {
      const response = await apiRequest(
        `/super-admin/colleges/${encodeURIComponent(collegeId)}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: nextStatus }),
        },
      )

      if (!response.success) {
        throw new Error(response.message || 'Unable to update college status.')
      }

      setStatusMessage(
        response.message || 'College status updated successfully.',
      )

      await loadDetails(true)
    } catch (err) {
      setStatusError(err.message || 'Unable to update college status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
        <RefreshCw className="animate-spin" size={20} />
        Loading college details...
      </div>
    )
  }

  if (error && !details) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          Unable to load college
        </h1>

        <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => loadDetails()}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try again
          </button>

          <Link
            to="/super-admin/colleges"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200"
          >
            Back to colleges
          </Link>
        </div>
      </div>
    )
  }

  const { college, userSummary = {} } = details

  const statusClass =
    statusStyles[college.status] ??
    'bg-slate-500/10 text-slate-600 ring-slate-500/20'

  return (
    <div className="space-y-6">
      {/* College header and status controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/super-admin/colleges"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Back to colleges
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {college.name}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass}`}
            >
              {college.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            College code: {college.code}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {college.status === 'ACTIVE' && (
            <button
              type="button"
              onClick={() => handleStatusChange('SUSPENDED')}
              disabled={updatingStatus || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-400"
            >
              <Ban size={16} />
              {updatingStatus ? 'Updating...' : 'Suspend College'}
            </button>
          )}

          {college.status === 'SUSPENDED' && (
            <button
              type="button"
              onClick={() => handleStatusChange('ACTIVE')}
              disabled={updatingStatus || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Power size={16} />
              {updatingStatus ? 'Updating...' : 'Reactivate College'}
            </button>
          )}

          <button
            type="button"
            onClick={() => loadDetails(true)}
            disabled={refreshing || updatingStatus}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <RefreshCw
              size={16}
              className={refreshing ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Status operation feedback */}
      {statusMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          {statusMessage}
        </div>
      )}

      {statusError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-700 dark:text-rose-400"
        >
          {statusError}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-400"
        >
          Refresh failed: {error}. Showing the last successfully loaded data.
        </div>
      )}

      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          label="Associated users"
          value={userSummary.totalUsers ?? 0}
          icon={Users}
        />

        <InfoCard
          label="Subscription plan"
          value={college.subscriptionPlan ?? 'Not assigned'}
          icon={ShieldCheck}
        />

        <InfoCard
          label="Registered"
          value={formatDate(college.createdAt)}
          icon={CalendarDays}
        />

        <InfoCard
          label="Last updated"
          value={formatDate(college.updatedAt)}
          icon={Clock3}
        />
      </div>

      {/* College information */}
      <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
            <Building2 size={20} />
          </span>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              College information
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Registered contact and administrative details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contact email
              </p>

              <p className="mt-1 break-all text-sm font-medium text-slate-800 dark:text-slate-200">
                {college.email || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {college.phone || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin size={18} className="mt-0.5 text-slate-400" />

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Address
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {college.address || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approval information */}
      <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          {college.status === 'ACTIVE' ? (
            <CheckCircle2 className="text-emerald-500" size={21} />
          ) : (
            <XCircle className="text-slate-400" size={21} />
          )}

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Approval information
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Current review and approval record
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Approval date
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {formatDate(college.approvedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Approved by
            </p>

            <p className="mt-1 break-all text-sm font-medium text-slate-800 dark:text-slate-200">
              {college.approvedBy?.email || 'Not available'}
            </p>

            {college.approvedBy?.role && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {college.approvedBy.role}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Associated user summaries */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CountList
          title="Users by role"
          items={userSummary.byRole}
          labels={roleLabels}
          emptyMessage="No associated user accounts have been recorded."
        />

        <CountList
          title="Users by account status"
          items={userSummary.byStatus}
          labels={statusLabels}
          emptyMessage="No account status counts are available."
        />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        College details and user counts come from the latest successful API
        response. Status changes are saved to the backend and reflected after
        the college details refresh.
      </p>
    </div>
  )
}
