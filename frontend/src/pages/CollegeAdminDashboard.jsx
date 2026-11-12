
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  BedDouble,
  ClipboardCheck,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  UserPlus,
  FileText,
  Wrench,
} from 'lucide-react'

const overviewStats = [
  {
    label: 'Total Students',
    value: '2,480',
    change: '+12.8%',
    description: 'Compared to last semester',
    icon: Users,
    iconStyle: 'bg-blue-500/10 text-blue-500',
  },
  {
    label: 'Active Hostels',
    value: '08',
    change: 'Across campus',
    description: 'All hostels operational',
    icon: Building2,
    iconStyle: 'bg-violet-500/10 text-violet-500',
  },
  {
    label: 'Bed Occupancy',
    value: '86.4%',
    change: '1,072 / 1,240',
    description: 'Currently occupied beds',
    icon: BedDouble,
    iconStyle: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    label: 'Pending Approvals',
    value: '24',
    change: 'Needs attention',
    description: 'Admission applications',
    icon: ClipboardCheck,
    iconStyle: 'bg-amber-500/10 text-amber-500',
  },
]

const hostelData = [
  { name: 'Boys Hostel A', occupied: 92, beds: '230 / 250' },
  { name: 'Boys Hostel B', occupied: 84, beds: '168 / 200' },
  { name: 'Girls Hostel A', occupied: 88, beds: '220 / 250' },
  { name: 'Girls Hostel B', occupied: 76, beds: '152 / 200' },
  { name: 'International Hostel', occupied: 90, beds: '180 / 200' },
]

const admissionData = [
  { label: 'Approved', value: 156, color: 'bg-emerald-500', width: '65%' },
  { label: 'Pending', value: 24, color: 'bg-amber-500', width: '25%' },
  { label: 'Rejected', value: 12, color: 'bg-rose-500', width: '10%' },
]

const activities = [
  {
    title: 'New admission application received',
    detail: 'Application #ADM-2026-184 · Rahul Sharma',
    time: '12 minutes ago',
    icon: UserPlus,
    style: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Fee payment completed',
    detail: '₹24,000 · Student ID STU-2048',
    time: '38 minutes ago',
    icon: CreditCard,
    style: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    title: 'Maintenance request submitted',
    detail: 'Girls Hostel A · Room 204',
    time: '1 hour ago',
    icon: Wrench,
    style: 'bg-amber-500/10 text-amber-500',
  },
  {
    title: 'Student documents submitted',
    detail: '3 documents awaiting verification',
    time: '2 hours ago',
    icon: FileText,
    style: 'bg-violet-500/10 text-violet-500',
  },
]

const quickActions = [
  {
    label: 'Review Admissions',
    description: 'Process new applications',
    icon: ClipboardCheck,
    path: '/college/admissions',
  },
  {
    label: 'Manage Students',
    description: 'View student records',
    icon: Users,
    path: '/college/students',
  },
  {
    label: 'Manage Hostels',
    description: 'Rooms and availability',
    icon: Building2,
    path: '/college/hostels',
  },
  {
    label: 'Fee Management',
    description: 'Payments and outstanding dues',
    icon: CreditCard,
    path: '/college/fees',
  },
]

function SectionHeading({ title, description, action, to }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {action && (
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
        >
          {action}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  )
}

export default function CollegeAdminDashboard() {
  return (
    <div className="space-y-8 pb-8">
      {/* Welcome */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            COLLEGE OVERVIEW
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome back, Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Here&apos;s what&apos;s happening across your campus today.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Academic session
          </p>
          <p className="mt-1 font-semibold text-slate-800 dark:text-white">
            2026 – 2027
          </p>
        </div>
      </section>

      {/* Overview cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon size={21} />
                </div>
                <ArrowUpRight
                  size={17}
                  className="text-slate-400"
                />
              </div>

              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </h3>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {stat.change}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {stat.description}
              </p>
            </div>
          )
        })}
      </section>

      {/* Main dashboard grid */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Hostel occupancy */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] xl:col-span-2">
          <SectionHeading
            title="Hostel Occupancy"
            description="Current bed utilization across your hostels"
            action="View all hostels"
            to="/college/hostels"
          />

          <div className="mb-6 flex flex-wrap items-center gap-5 rounded-xl bg-slate-50 p-4 dark:bg-white/[0.03]">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Overall occupancy
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                86.4%
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Occupied beds
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                1,072
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Available beds
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                168
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {hostelData.map((hostel) => (
              <div key={hostel.name}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {hostel.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {hostel.beds} · {hostel.occupied}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${hostel.occupied}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admissions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <SectionHeading
            title="Admissions"
            description="Application status overview"
            action="View applications"
            to="/college/admissions"
          />

          <div className="mb-7 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            {admissionData.map((item) => (
              <div
                key={item.label}
                className={item.color}
                style={{ width: item.width }}
              />
            ))}
          </div>

          <div className="space-y-5">
            {admissionData.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/college/admissions"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Review pending applications
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <SectionHeading
          title="Quick Actions"
          description="Frequently used administration tools"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={action.label}
                to={action.path}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-blue-400/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:text-blue-400">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {action.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-slate-400 transition group-hover:text-blue-500"
                />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Activity and alerts */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] xl:col-span-2">
          <SectionHeading
            title="Recent Activity"
            description="Latest updates from across your college"
          />

          <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {activities.map((activity) => {
              const Icon = activity.icon

              return (
                <div
                  key={activity.title}
                  className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.style}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {activity.detail}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">
                    {activity.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <SectionHeading
            title="Needs Attention"
            description="Items requiring your review"
          />

          <div className="space-y-3">
            <Link
              to="/college/admissions"
              className="flex items-start gap-3 rounded-xl border border-amber-200/70 bg-amber-50/70 p-3 transition hover:bg-amber-100/70 dark:border-amber-500/20 dark:bg-amber-500/[0.06]"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  24 pending admissions
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Applications awaiting final approval
                </p>
              </div>
            </Link>

            <Link
              to="/college/students"
              className="flex items-start gap-3 rounded-xl border border-blue-200/70 bg-blue-50/70 p-3 transition hover:bg-blue-100/70 dark:border-blue-500/20 dark:bg-blue-500/[0.06]"
            >
              <Clock3 size={19} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  8 document verifications
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Student documents need review
                </p>
              </div>
            </Link>

            <Link
              to="/college/fees"
              className="flex items-start gap-3 rounded-xl border border-rose-200/70 bg-rose-50/70 p-3 transition hover:bg-rose-100/70 dark:border-rose-500/20 dark:bg-rose-500/[0.06]"
            >
              <CreditCard size={19} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Fee dues pending
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Review outstanding student payments
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={15} />
            You&apos;re all caught up on critical alerts
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Dashboard figures are sample data and will be connected to live college records later.
      </p>
    </div>
  )
}
