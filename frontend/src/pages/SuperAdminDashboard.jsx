
import { useEffect, useState } from 'react'
import {
  Activity,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ShieldCheck,
  Users,
  CreditCard,
} from 'lucide-react'

import { apiRequest } from '../services/api'

const metrics = [
  {
    label: 'Total colleges',
    note: 'Registered institutions',
    icon: Building2,
  },
  {
    label: 'Pending approvals',
    note: 'Colleges awaiting review',
    icon: Clock3,
  },
  {
    label: 'Active colleges',
    note: 'Approved institutions',
    icon: CreditCard,
  },
  {
    label: 'Platform users',
    note: 'All registered accounts',
    icon: Users,
  },
]

export default function SuperAdminDashboard() {
  const [totalColleges, setTotalColleges] = useState(null)
  const [pendingApprovals, setPendingApprovals] = useState(null)
  const [activeColleges, setActiveColleges] = useState(null)
  const [totalUsers, setTotalUsers] = useState(null)

  const [colleges, setColleges] = useState([])
  const [collegesLoading, setCollegesLoading] = useState(true)
  const [collegesError, setCollegesError] = useState('')

  const [decisionLoadingId, setDecisionLoadingId] = useState(null)
  const [decisionError, setDecisionError] = useState('')
  const [decisionSuccess, setDecisionSuccess] = useState('')

  const [apiStatus, setApiStatus] = useState('Checking...')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        const [overviewResponse, collegesResponse] = await Promise.all([
          apiRequest('/super-admin/overview'),
          apiRequest('/super-admin/colleges'),
        ])

        if (cancelled) return

        const overview = overviewResponse.data

        setTotalColleges(overview.totalColleges)
        setPendingApprovals(overview.pendingApprovals)
        setActiveColleges(overview.activeColleges)
        setTotalUsers(overview.totalUsers)

        setColleges(collegesResponse.data.colleges)
        setApiStatus('Authorized')
        setApiError('')
        setCollegesError('')
      } catch (error) {
        if (cancelled) return

        const message =
          error.message || 'Could not load Super Admin dashboard data.'

        setApiStatus('Unavailable')
        setApiError(message)
        setCollegesError(message)
      } finally {
        if (!cancelled) {
          setCollegesLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleCollegeDecision(collegeId, decision) {
    setDecisionLoadingId(collegeId)
    setDecisionError('')
    setDecisionSuccess('')

    try {
      const response = await apiRequest(
        `/super-admin/colleges/${collegeId}/decision`,
        {
          method: 'PATCH',
          body: JSON.stringify({ decision }),
        },
      )

      setDecisionSuccess(
        response.message ||
          `College ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully.`,
      )

      const [overviewResponse, collegesResponse] = await Promise.all([
        apiRequest('/super-admin/overview'),
        apiRequest('/super-admin/colleges'),
      ])

      const overview = overviewResponse.data

      setTotalColleges(overview.totalColleges)
      setPendingApprovals(overview.pendingApprovals)
      setActiveColleges(overview.activeColleges)
      setTotalUsers(overview.totalUsers)
      setColleges(collegesResponse.data.colleges)
    } catch (error) {
      setDecisionError(
        error.message || 'Could not update the college application.',
      )
    } finally {
      setDecisionLoadingId(null)
    }
  }

  const metricValues = {
    'Total colleges': totalColleges,
    'Pending approvals': pendingApprovals,
    'Active colleges': activeColleges,
    'Platform users': totalUsers,
  }

  return (
    <div className="space-y-6">
      {/* Overview introduction */}
      <section className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] px-3 py-1.5 text-xs font-medium">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus === 'Authorized'
                    ? 'bg-emerald-500'
                    : apiStatus === 'Unavailable'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                }`}
              />
              Platform overview
            </div>

            <h2 className="text-3xl font-semibold sm:text-4xl">
              Your platform, at a glance.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Manage institution onboarding, subscriptions, and the
              CampusOne ecosystem from one workspace.
            </p>
          </div>

          <div className="glass-panel-subtle flex shrink-0 items-center gap-3 rounded-2xl p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--glow-primary)]">
              <ShieldCheck size={23} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">Admin workspace</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {apiStatus === 'Authorized'
                  ? 'Connected to the backend'
                  : apiStatus}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live platform metrics */}
      <section
        aria-label="Platform metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(({ label, note, icon: Icon }) => (
          <article
            key={label}
            className="glass-panel glass-interactive rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {label}
                </p>
                <p className="mt-4 text-3xl font-semibold">
                  {metricValues[label] ?? '—'}
                </p>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)]">
                <Icon size={21} aria-hidden="true" />
              </span>
            </div>

            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              {note}
            </p>
          </article>
        ))}
      </section>

      {/* College onboarding and platform health */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">College onboarding</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Review new institutions joining CampusOne.
              </p>
            </div>
            <Building2 size={22} aria-hidden="true" />
          </div>

          {decisionError && (
            <p
              role="alert"
              className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500"
            >
              {decisionError}
            </p>
          )}

          {decisionSuccess && (
            <p
              role="status"
              className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600"
            >
              {decisionSuccess}
            </p>
          )}

          {collegesLoading ? (
            <div className="glass-panel-subtle rounded-xl p-6 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                Loading college applications...
              </p>
            </div>
          ) : collegesError ? (
            <div className="glass-panel-subtle rounded-xl p-5">
              <p role="alert" className="text-sm text-red-500">
                {collegesError}
              </p>
            </div>
          ) : colleges.length === 0 ? (
            <div className="glass-panel-subtle rounded-xl p-5 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border-subtle)]">
                <Clock3 size={21} aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold">
                No college applications yet
              </p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--color-text-muted)]">
                New college registrations will appear here when applications
                are submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {colleges.map((college) => (
                <article
                  key={college._id}
                  className="glass-panel-subtle rounded-xl p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h4 className="font-semibold">{college.name}</h4>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {college.code} · {college.email}
                      </p>
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        Plan: {college.subscriptionPlan}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-fit rounded-full border border-[var(--glass-border-subtle)] px-3 py-1 text-xs font-medium">
                        {college.status}
                      </span>

                      {college.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleCollegeDecision(college._id, 'APPROVE')
                            }
                            disabled={decisionLoadingId !== null}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {decisionLoadingId === college._id
                              ? 'Processing...'
                              : 'Approve'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleCollegeDecision(college._id, 'REJECT')
                            }
                            disabled={decisionLoadingId !== null}
                            className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {decisionLoadingId === college._id
                              ? 'Processing...'
                              : 'Reject'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs text-[var(--color-text-muted)]">
            Showing {colleges.length} college
            {colleges.length === 1 ? '' : 's'} from the live API.
          </p>
        </section>

        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Platform health</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Integration readiness
              </p>
            </div>
            <Activity size={22} aria-hidden="true" />
          </div>

          <div className="space-y-4">
            {[
              ['Frontend workspace', 'Available'],
              ['Firebase sign-in', 'Configured'],
              ['MongoDB connection', 'Backend connected'],
              ['Role authorization', apiStatus],
            ].map(([label, status]) => {
              const healthy = [
                'Authorized',
                'Available',
                'Configured',
                'Backend connected',
              ].includes(status)

              const Icon = healthy ? CheckCircle2 : Clock3

              return (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm">{label}</span>
                  <span className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Icon
                      size={15}
                      className={
                        healthy ? 'text-emerald-500' : 'text-amber-500'
                      }
                      aria-hidden="true"
                    />
                    {status}
                  </span>
                </div>
              )
            })}
          </div>

          {apiError && (
            <p role="alert" className="mt-3 text-xs text-red-500">
              {apiError}
            </p>
          )}

          <div className="glass-panel-subtle mt-6 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={19} aria-hidden="true" />
              <p className="text-sm font-semibold">
                Subscription management
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
              Monthly and annual plans will be managed here once the
              subscription model and APIs are implemented.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
