
import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Crown,
  LoaderCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react'

import { apiRequest } from '../services/api'

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0)

const formatDate = (date) => {
  if (!date) return '—'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return '—'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

const formatLabel = (value) => {
  if (!value) return '—'

  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

const metricConfig = [
  {
    key: 'totalSubscriptions',
    label: 'Total subscriptions',
    icon: Users,
    description: 'Current subscriptions',
  },
  {
    key: 'activeSubscriptions',
    label: 'Active subscriptions',
    icon: BadgeCheck,
    description: 'Currently active',
  },
  {
    key: 'trialSubscriptions',
    label: 'Free trials',
    icon: Clock3,
    description: 'Currently in trial',
  },
  {
    key: 'pendingSubscriptions',
    label: 'Pending payments',
    icon: CreditCard,
    description: 'Awaiting verification',
  },
  {
    key: 'expiredSubscriptions',
    label: 'Expired subscriptions',
    icon: AlertCircle,
    description: 'Including history',
  },
  {
    key: 'cancelledSubscriptions',
    label: 'Cancelled subscriptions',
    icon: XCircle,
    description: 'Including history',
  },
]

const planStyles = {
  FREE: {
    icon: ShieldCheck,
    description: 'Essential access for getting started.',
  },
  BASIC: {
    icon: BadgeCheck,
    description: 'For colleges beginning their digital journey.',
  },
  PRO: {
    icon: Crown,
    description: 'For colleges that need more from their platform.',
  },
  ENTERPRISE: {
    icon: Activity,
    description: 'For larger institutional requirements.',
  },
}

const scopes = [
  { value: 'current', label: 'Current' },
  { value: 'history', label: 'History' },
  { value: 'all', label: 'All subscriptions' },
]

const statuses = [
  'ALL',
  'PENDING',
  'TRIAL',
  'ACTIVE',
  'PAST_DUE',
  'EXPIRED',
  'CANCELLED',
]

const plans = ['ALL', 'FREE', 'BASIC', 'PRO', 'ENTERPRISE']

const paidPlans = ['BASIC', 'PRO', 'ENTERPRISE']

const billingCycles = ['ALL', 'NONE', 'MONTHLY', 'ANNUAL']

const getStatusStyle = (status) => {
  const styles = {
    ACTIVE: 'border-emerald-500/30 text-emerald-600',
    TRIAL: 'border-sky-500/30 text-sky-600',
    PENDING: 'border-amber-500/30 text-amber-600',
    PAST_DUE: 'border-orange-500/30 text-orange-600',
    EXPIRED: 'border-red-500/30 text-red-500',
    CANCELLED:
      'border-[var(--glass-border-subtle)] text-[var(--color-text-muted)]',
  }

  return (
    styles[status] ||
    'border-[var(--glass-border-subtle)] text-[var(--color-text-muted)]'
  )
}

const initialAssignForm = {
  collegeId: '',
  plan: 'BASIC',
  billingCycle: 'MONTHLY',
  startTrial: false,
}

const initialPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
}

export default function SuperAdminSubscriptionsPage() {
  const [overview, setOverview] = useState(null)
  const [planConfig, setPlanConfig] = useState(null)
  const [trialDurationDays, setTrialDurationDays] = useState(0)

  const [subscriptions, setSubscriptions] = useState([])
  const [colleges, setColleges] = useState([])

  const [pagination, setPagination] = useState(initialPagination)

  const [scope, setScope] = useState('current')
  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [billingCycle, setBillingCycle] = useState('ALL')

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const [verificationTarget, setVerificationTarget] = useState(null)
  const [paymentReference, setPaymentReference] = useState('')

  const [assignOpen, setAssignOpen] = useState(false)
  const [assignForm, setAssignForm] = useState(initialAssignForm)

  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancellationReason, setCancellationReason] = useState('')

  const [renewTarget, setRenewTarget] = useState(null)

  const fetchOverviewAndPlans = useCallback(async () => {
    const [overviewResponse, plansResponse] = await Promise.all([
      apiRequest('/super-admin/subscriptions/overview'),
      apiRequest('/super-admin/subscriptions/plans'),
    ])

    setOverview(overviewResponse.data)
    setPlanConfig(plansResponse.data.plans)
    setTrialDurationDays(plansResponse.data.trialDurationDays || 0)
  }, [])

  const fetchSubscriptions = useCallback(async (signal) => {
    const params = new URLSearchParams({
      scope,
      page: String(pagination.page),
      limit: String(pagination.limit),
    })

    if (search.trim()) params.set('search', search.trim())
    if (plan !== 'ALL') params.set('plan', plan)
    if (status !== 'ALL') params.set('status', status)
    if (billingCycle !== 'ALL') {
      params.set('billingCycle', billingCycle)
    }

    const response = await apiRequest(
      `/super-admin/subscriptions?${params.toString()}`,
    )

    if (!signal.cancelled) {
      setSubscriptions(response.data.subscriptions || [])
      setPagination((previous) => ({
        ...previous,
        ...response.data.pagination,
      }))
    }
  }, [
    scope,
    search,
    plan,
    status,
    billingCycle,
    pagination.page,
    pagination.limit,
  ])

  const fetchColleges = useCallback(async (signal) => {
    const response = await apiRequest(
      '/super-admin/colleges?limit=100',
    )

    if (!signal.cancelled) {
      setColleges(response.data.colleges || [])
    }
  }, [])

  useEffect(() => {
    const signal = { cancelled: false }

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        await Promise.all([
          fetchOverviewAndPlans(),
          fetchSubscriptions(signal),
          fetchColleges(signal),
        ])
      } catch (err) {
        if (!signal.cancelled) {
          setError(err.message || 'Unable to load subscription data.')
        }
      } finally {
        if (!signal.cancelled) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    }

    load()

    return () => {
      signal.cancelled = true
    }
  }, [
    fetchOverviewAndPlans,
    fetchSubscriptions,
    fetchColleges,
    refreshKey,
  ])

  const refreshData = () => {
    setRefreshing(true)
    setRefreshKey((key) => key + 1)
  }

  const updateFilter = (setter, value) => {
    setter(value)
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }))
  }

  const closeAllModals = () => {
    if (actionLoading) return

    setVerificationTarget(null)
    setPaymentReference('')
    setAssignOpen(false)
    setCancelTarget(null)
    setCancellationReason('')
    setRenewTarget(null)
    setActionError('')
  }

  const handleVerifyPayment = async (event) => {
    event.preventDefault()

    if (!verificationTarget || !paymentReference.trim()) {
      setActionError('Enter the payment reference before continuing.')
      return
    }

    setActionLoading(true)
    setActionError('')

    try {
      await apiRequest(
        `/super-admin/subscriptions/${encodeURIComponent(verificationTarget._id)}/verify-payment`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            paymentReference: paymentReference.trim(),
          }),
        },
      )

      setVerificationTarget(null)
      setPaymentReference('')
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setActionError(err.message || 'Payment verification failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAssignSubscription = async (event) => {
    event.preventDefault()

    setActionLoading(true)
    setActionError('')

    try {
      await apiRequest('/super-admin/subscriptions', {
        method: 'POST',
        body: JSON.stringify(assignForm),
      })

      setAssignOpen(false)
      setAssignForm(initialAssignForm)
      setPagination((previous) => ({
        ...previous,
        page: 1,
      }))
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setActionError(err.message || 'Could not assign subscription.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelSubscription = async (event) => {
    event.preventDefault()

    if (!cancelTarget || !cancellationReason.trim()) {
      setActionError('Please enter a cancellation reason.')
      return
    }

    setActionLoading(true)
    setActionError('')

    try {
      await apiRequest(
        `/super-admin/subscriptions/${encodeURIComponent(cancelTarget._id)}/cancel`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            cancellationReason: cancellationReason.trim(),
          }),
        },
      )

      setCancelTarget(null)
      setCancellationReason('')
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setActionError(err.message || 'Could not cancel subscription.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRenewSubscription = async (event) => {
    event.preventDefault()

    if (!renewTarget) return

    setActionLoading(true)
    setActionError('')

    try {
      await apiRequest(
        `/super-admin/subscriptions/${encodeURIComponent(renewTarget._id)}/renew`,
        {
          method: 'POST',
          body: JSON.stringify({
            plan: renewTarget.plan,
            billingCycle: renewTarget.billingCycle,
          }),
        },
      )

      setRenewTarget(null)
      setPagination((previous) => ({
        ...previous,
        page: 1,
      }))
      setScope('current')
      setStatus('ALL')
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setActionError(err.message || 'Could not renew subscription.')
    } finally {
      setActionLoading(false)
    }
  }

  const planEntries = planConfig ? Object.entries(planConfig) : []
  const totalPages = pagination.totalPages || 0

  return (
    <div className="space-y-8 text-[var(--color-text)]">
      {/* Page heading */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 text-sm text-[var(--color-text-muted)]">
            Platform / Subscriptions
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Subscription management
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">
            Monitor subscription activity, review plan pricing and manage
            college subscriptions across CampusOne.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActionError('')
              setAssignForm(initialAssignForm)
              setAssignOpen(true)
            }}
            className="glass-button-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
          >
            <Plus size={16} />
            Assign subscription
          </button>

          <button
            type="button"
            onClick={refreshData}
            disabled={loading || refreshing}
            className="glass-button inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? 'animate-spin' : ''}
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Main loading error */}
      {error && (
        <div
          role="alert"
          className="glass-panel rounded-2xl p-5 text-sm text-red-500"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>

            <button
              type="button"
              onClick={refreshData}
              className="underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Overview metrics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Subscription overview
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Live figures from the subscription database.
          </p>
        </div>

        {loading && !overview ? (
          <div className="glass-panel flex min-h-48 items-center justify-center rounded-2xl">
            <LoaderCircle
              size={26}
              className="animate-spin text-[var(--color-text-muted)]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {metricConfig.map((metric) => {
              const Icon = metric.icon

              return (
                <div
                  key={metric.key}
                  className="glass-panel rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight">
                        {overview?.[metric.key] ?? '—'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] p-3">
                      <Icon size={19} />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                    {metric.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Monthly recurring revenue */}
      <section className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard size={19} />
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                Monthly recurring revenue
              </p>
            </div>

            <p className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {overview
                ? formatCurrency(
                    overview.monthlyRecurringRevenue,
                    overview.currency || 'INR',
                  )
                : '—'}
            </p>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Based on current active paid subscriptions.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--glass-border-subtle)] px-4 py-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              Revenue calculation
            </p>
            <p className="mt-1 text-sm font-medium">
              Monthly fees + annual fees / 12
            </p>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Subscription plans
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Configured plans and pricing.
          </p>
        </div>

        {!planConfig && loading ? (
          <div className="glass-panel flex min-h-40 items-center justify-center rounded-2xl">
            <LoaderCircle
              size={24}
              className="animate-spin text-[var(--color-text-muted)]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {planEntries.map(([planKey, item]) => {
              const style = planStyles[planKey] || planStyles.FREE
              const Icon = style.icon

              return (
                <div
                  key={planKey}
                  className="glass-panel flex flex-col rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] p-2.5">
                      <Icon size={19} />
                    </div>

                    <span className="rounded-full border border-[var(--glass-border-subtle)] px-3 py-1 text-xs font-medium">
                      {item.trialEligible ? 'Trial eligible' : 'No trial'}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {item.name}
                  </h3>

                  <p className="mt-1 min-h-10 text-sm leading-5 text-[var(--color-text-muted)]">
                    {style.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Monthly
                      </p>
                      <p className="mt-1 text-xl font-semibold">
                        {formatCurrency(item.monthlyPrice, item.currency)}
                        <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                          / month
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Annual
                      </p>
                      <p className="mt-1 text-xl font-semibold">
                        {formatCurrency(item.annualPrice, item.currency)}
                        <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                          / year
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-[var(--glass-border-subtle)] pt-4">
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                      <CalendarDays size={14} />
                      {item.trialEligible
                        ? `${trialDurationDays}-day free trial`
                        : 'Trial not available'}
                    </div>

                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      {Array.isArray(item.features) && item.features.length > 0
                        ? `${item.features.length} configured features`
                        : 'Feature limits not configured'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Subscription directory */}
      <section className="glass-panel rounded-2xl p-4 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Subscription directory
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Search and review subscriptions across colleges.
            </p>
          </div>

          <span className="text-sm text-[var(--color-text-muted)]">
            {pagination.total} records
          </span>
        </div>

        {/* Scope tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {scopes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                updateFilter(setScope, item.value)
                setStatus('ALL')
              }}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                scope === item.value
                  ? 'border-[var(--color-primary)] bg-[var(--glass-bg)]'
                  : 'border-[var(--glass-border-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--glass-bg-subtle)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search and filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="relative block sm:col-span-2 xl:col-span-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) =>
                updateFilter(setSearch, event.target.value)
              }
              placeholder="Search college name, code or email..."
              className="w-full rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-primary)]"
            />
          </label>

          <select
            value={plan}
            onChange={(event) => updateFilter(setPlan, event.target.value)}
            className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
            aria-label="Filter by plan"
          >
            {plans.map((item) => (
              <option key={item} value={item}>
                {item === 'ALL' ? 'All plans' : formatLabel(item)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => updateFilter(setStatus, event.target.value)}
            className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
            aria-label="Filter by status"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item === 'ALL' ? 'All statuses' : formatLabel(item)}
              </option>
            ))}
          </select>

          <select
            value={billingCycle}
            onChange={(event) =>
              updateFilter(setBillingCycle, event.target.value)
            }
            className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
            aria-label="Filter by billing cycle"
          >
            {billingCycles.map((item) => (
              <option key={item} value={item}>
                {item === 'ALL' ? 'All billing cycles' : formatLabel(item)}
              </option>
            ))}
          </select>
        </div>

        {/* Directory table */}
        <div className="mt-5">
          {loading ? (
            <div className="glass-panel-subtle rounded-xl p-10 text-center text-sm text-[var(--color-text-muted)]">
              <LoaderCircle
                size={22}
                className="mx-auto mb-3 animate-spin"
              />
              Loading subscriptions...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="glass-panel-subtle rounded-xl p-5 text-sm text-red-500"
            >
              {error}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="glass-panel-subtle rounded-xl p-10 text-center">
              <CreditCard
                size={28}
                className="mx-auto mb-3 text-[var(--color-text-muted)]"
              />
              <p className="font-medium">No subscriptions found</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--glass-border-subtle)] text-[var(--color-text-muted)]">
                    <th className="px-3 py-3 font-medium">College</th>
                    <th className="px-3 py-3 font-medium">Plan</th>
                    <th className="px-3 py-3 font-medium">Billing</th>
                    <th className="px-3 py-3 font-medium">Amount</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Payment</th>
                    <th className="px-3 py-3 font-medium">Start date</th>
                    <th className="px-3 py-3 font-medium">End date</th>
                    <th className="px-3 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {subscriptions.map((subscription) => {
                    const college = subscription.collegeId

                    const canVerify =
                      subscription.isCurrent &&
                      subscription.status === 'PENDING' &&
                      subscription.paymentStatus === 'PENDING' &&
                      subscription.plan !== 'FREE'

                    const canCancel =
                      subscription.isCurrent &&
                      ['ACTIVE', 'TRIAL', 'PENDING', 'PAST_DUE'].includes(
                        subscription.status,
                      ) &&
                      subscription.plan !== 'FREE'

                    const canRenew = subscription.status === 'EXPIRED'

                    return (
                      <tr
                        key={subscription._id}
                        className="border-b border-[var(--glass-border-subtle)] transition-colors hover:bg-[var(--glass-bg-subtle)] last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="font-medium">
                            {college?.name || 'Unknown college'}
                          </p>
                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                            {college?.code || '—'} · {college?.email || '—'}
                          </p>
                        </td>

                        <td className="px-3 py-4 font-medium">
                          {formatLabel(subscription.plan)}
                        </td>

                        <td className="px-3 py-4">
                          {formatLabel(subscription.billingCycle)}
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap">
                          {formatCurrency(
                            subscription.amount,
                            subscription.currency,
                          )}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(subscription.status)}`}
                          >
                            {formatLabel(subscription.status)}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          {formatLabel(subscription.paymentStatus)}
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap">
                          {formatDate(subscription.startDate)}
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap">
                          {formatDate(
                            subscription.endDate ||
                              subscription.trialEndDate,
                          )}
                        </td>

                        <td className="px-3 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {canVerify && (
                              <button
                                type="button"
                                onClick={() => {
                                  setVerificationTarget(subscription)
                                  setPaymentReference('')
                                  setActionError('')
                                }}
                                className="glass-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                              >
                                <CheckCircle2 size={14} />
                                Verify
                              </button>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCancelTarget(subscription)
                                  setCancellationReason('')
                                  setActionError('')
                                }}
                                className="glass-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                              >
                                <Ban size={14} />
                                Cancel
                              </button>
                            )}

                            {canRenew && (
                              <button
                                type="button"
                                onClick={() => {
                                  setRenewTarget({
                                    subscription,
                                    plan: paidPlans.includes(subscription.plan)
                                      ? subscription.plan
                                      : 'BASIC',
                                    billingCycle:
                                      subscription.billingCycle === 'ANNUAL'
                                        ? 'ANNUAL'
                                        : 'MONTHLY',
                                  })
                                  setActionError('')
                                }}
                                className="glass-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                              >
                                <RotateCcw size={14} />
                                Renew
                              </button>
                            )}

                            {!canVerify && !canCancel && !canRenew && (
                              <span className="text-xs text-[var(--color-text-muted)]">
                                —
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && (
          <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[var(--glass-border-subtle)] pt-4 sm:flex-row sm:items-center">
            <p className="text-xs text-[var(--color-text-muted)]">
              Showing{' '}
              {pagination.total === 0
                ? 0
                : (pagination.page - 1) * pagination.limit + 1}
              {' '}to{' '}
              {Math.min(
                pagination.page * pagination.limit,
                pagination.total,
              )}
              {' '}of {pagination.total} subscriptions
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setPagination((previous) => ({
                    ...previous,
                    page: Math.max(1, previous.page - 1),
                  }))
                }
                disabled={pagination.page <= 1}
                className="glass-button inline-flex items-center gap-1 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="px-2 text-sm text-[var(--color-text-muted)]">
                {pagination.page} / {Math.max(1, totalPages)}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPagination((previous) => ({
                    ...previous,
                    page: Math.min(
                      totalPages,
                      previous.page + 1,
                    ),
                  }))
                }
                disabled={
                  pagination.page >= totalPages || totalPages === 0
                }
                className="glass-button inline-flex items-center gap-1 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Assign subscription modal */}
      {assignOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAllModals()
          }}
        >
          <form
            onSubmit={handleAssignSubscription}
            className="glass-panel my-auto w-full max-w-lg rounded-2xl p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Assign subscription
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Select a college and subscription plan.
                </p>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={closeAllModals}
                className="glass-button rounded-lg p-2 disabled:opacity-50"
                aria-label="Close assignment dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  College
                </span>
                <select
                  required
                  value={assignForm.collegeId}
                  onChange={(event) =>
                    setAssignForm((previous) => ({
                      ...previous,
                      collegeId: event.target.value,
                    }))
                  }
                  disabled={actionLoading}
                  className="w-full rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none"
                >
                  <option value="">Select a college</option>
                  {colleges
                    .filter((college) => college.status === 'ACTIVE')
                    .map((college) => (
                      <option key={college._id} value={college._id}>
                        {college.name} ({college.code})
                      </option>
                    ))}
                </select>
                {colleges.filter(
                  (college) => college.status === 'ACTIVE',
                ).length === 0 && (
                  <span className="mt-2 block text-xs text-[var(--color-text-muted)]">
                    No active colleges are available.
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Plan
                </span>
                <select
                  value={assignForm.plan}
                  onChange={(event) =>
                    setAssignForm((previous) => ({
                      ...previous,
                      plan: event.target.value,
                      billingCycle:
                        event.target.value === 'FREE' ? 'NONE' : 'MONTHLY',
                      startTrial: false,
                    }))
                  }
                  disabled={actionLoading}
                  className="w-full rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none"
                >
                  {paidPlans.concat('FREE').map((item) => (
                    <option key={item} value={item}>
                      {formatLabel(item)}
                    </option>
                  ))}
                </select>
              </label>

              {assignForm.plan !== 'FREE' && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">
                      Billing cycle
                    </span>
                    <select
                      value={assignForm.billingCycle}
                      onChange={(event) =>
                        setAssignForm((previous) => ({
                          ...previous,
                          billingCycle: event.target.value,
                        }))
                      }
                      disabled={actionLoading}
                      className="w-full rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="ANNUAL">Annual</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={assignForm.startTrial}
                      onChange={(event) =>
                        setAssignForm((previous) => ({
                          ...previous,
                          startTrial: event.target.checked,
                        }))
                      }
                      disabled={actionLoading}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    Start {trialDurationDays || 30}-day free trial
                  </label>
                </>
              )}
            </div>

            {actionError && (
              <p role="alert" className="mt-4 text-sm text-red-500">
                {actionError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeAllModals}
                disabled={actionLoading}
                className="glass-button rounded-xl px-4 py-2.5 text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading || !assignForm.collegeId}
                className="glass-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {actionLoading && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {actionLoading ? 'Assigning...' : 'Assign plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment verification modal */}
      {verificationTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAllModals()
          }}
        >
          <form
            onSubmit={handleVerifyPayment}
            className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Verify payment
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Confirm the payment details before activating this
                  subscription.
                </p>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={closeAllModals}
                className="glass-button rounded-lg p-2 disabled:opacity-50"
                aria-label="Close verification dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="glass-panel-subtle mt-5 rounded-xl p-4 text-sm">
              <p className="font-medium">
                {verificationTarget.collegeId?.name || 'Unknown college'}
              </p>
              <p className="mt-1 text-[var(--color-text-muted)]">
                {verificationTarget.plan} ·{' '}
                {formatLabel(verificationTarget.billingCycle)}
              </p>
              <p className="mt-2 font-semibold">
                {formatCurrency(
                  verificationTarget.amount,
                  verificationTarget.currency,
                )}
              </p>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-medium">
                Payment reference
              </span>
              <input
                type="text"
                value={paymentReference}
                onChange={(event) =>
                  setPaymentReference(event.target.value)
                }
                placeholder="Enter transaction ID or payment reference"
                required
                maxLength={200}
                disabled={actionLoading}
                className="glass-input w-full rounded-xl px-4 py-3 text-sm outline-none"
              />
            </label>

            {actionError && (
              <p role="alert" className="mt-3 text-sm text-red-500">
                {actionError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={closeAllModals}
                className="glass-button rounded-xl px-4 py-2.5 text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading || !paymentReference.trim()}
                className="glass-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {actionLoading && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {actionLoading ? 'Verifying...' : 'Confirm payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cancellation modal */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAllModals()
          }}
        >
          <form
            onSubmit={handleCancelSubscription}
            className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Cancel subscription
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  This immediately cancels the paid subscription and moves
                  the college to the Free plan.
                </p>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={closeAllModals}
                className="glass-button rounded-lg p-2 disabled:opacity-50"
                aria-label="Close cancellation dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="glass-panel-subtle mt-4 rounded-xl p-4 text-sm">
              <p className="font-medium">
                {cancelTarget.collegeId?.name || 'Unknown college'}
              </p>
              <p className="mt-1 text-[var(--color-text-muted)]">
                {cancelTarget.plan} ·{' '}
                {formatLabel(cancelTarget.billingCycle)}
              </p>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-medium">
                Cancellation reason
              </span>
              <textarea
                required
                maxLength={500}
                rows={3}
                value={cancellationReason}
                onChange={(event) =>
                  setCancellationReason(event.target.value)
                }
                placeholder="Enter the reason for cancellation..."
                disabled={actionLoading}
                className="glass-input w-full rounded-xl px-4 py-3 text-sm outline-none"
              />
            </label>

            {actionError && (
              <p role="alert" className="mt-3 text-sm text-red-500">
                {actionError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={closeAllModals}
                className="glass-button rounded-xl px-4 py-2.5 text-sm disabled:opacity-50"
              >
                Keep subscription
              </button>

              <button
                type="submit"
                disabled={actionLoading || !cancellationReason.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500 disabled:opacity-50"
              >
                {actionLoading && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {actionLoading ? 'Cancelling...' : 'Confirm cancellation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Renewal modal */}
      {renewTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAllModals()
          }}
        >
          <form
            onSubmit={handleRenewSubscription}
            className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Renew subscription
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Choose the plan and billing cycle for the new subscription.
                </p>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={closeAllModals}
                className="glass-button rounded-lg p-2 disabled:opacity-50"
                aria-label="Close renewal dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="glass-panel-subtle mt-4 rounded-xl p-4 text-sm">
              <p className="font-medium">
                {renewTarget.subscription.collegeId?.name ||
                  'Unknown college'}
              </p>
              <p className="mt-1 text-[var(--color-text-muted)]">
                Previous plan: {renewTarget.subscription.plan}
              </p>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-medium">
                New plan
              </span>
              <select
                value={renewTarget.plan}
                onChange={(event) =>
                  setRenewTarget((previous) => ({
                    ...previous,
                    plan: event.target.value,
                  }))
                }
                disabled={actionLoading}
                className="w-full rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none"
              >
                {paidPlans.map((item) => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium">
                Billing cycle
              </span>
              <select
                value={renewTarget.billingCycle}
                onChange={(event) =>
                  setRenewTarget((previous) => ({
                    ...previous,
                    billingCycle: event.target.value,
                  }))
                }
                disabled={actionLoading}
                className="w-full rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-3 py-3 text-sm outline-none"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
              </select>
            </label>

            {actionError && (
              <p role="alert" className="mt-3 text-sm text-red-500">
                {actionError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={closeAllModals}
                className="glass-button rounded-xl px-4 py-2.5 text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className="glass-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {actionLoading && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {actionLoading ? 'Renewing...' : 'Create renewal'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
