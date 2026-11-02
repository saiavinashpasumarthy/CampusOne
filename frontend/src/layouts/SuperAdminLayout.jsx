
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  Activity,
  Bell,
  Building2,
  Command,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'

const navigation = [
  { label: 'Overview', path: '/super-admin', icon: LayoutDashboard },
  { label: 'Colleges', path: '/super-admin/colleges', icon: Building2 },
  { label: 'Subscriptions', path: '/super-admin/subscriptions', icon: CreditCard },
  { label: 'Platform users', path: '/super-admin/users', icon: Users },
  { label: 'Activity logs', path: '/super-admin/activity-logs', icon: Activity },
  { label: 'Settings', path: '/super-admin/settings', icon: Settings },
]

export default function SuperAdminLayout() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  async function handleSignOut() {
    setLoggingOut(true)
    setError('')

    try {
      await signOut(auth)
    } catch {
      setError('Could not sign out. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden text-[var(--color-text)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`glass-panel-strong fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link
          to="/"
          className="mb-9 flex items-center gap-3 px-2"
          aria-label="CampusOne home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
            <Command size={21} aria-hidden="true" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            <span className="brand-campus">Campus</span>
            <span className="brand-one">One</span>
          </span>
        </Link>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Platform management
        </p>

        <nav className="flex-1 space-y-1" aria-label="Admin navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/super-admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                  isActive
                    ? 'border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] font-semibold shadow-[var(--shadow-glass)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--color-text)]'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="glass-panel-subtle rounded-2xl p-3">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={17} aria-hidden="true" />
            <span className="text-xs font-semibold">Super Admin</span>
          </div>
          <p className="break-all text-xs text-[var(--color-text-muted)]">
            {user?.email || 'Authenticated account'}
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="glass-panel-subtle sticky top-0 z-20 flex items-center justify-between gap-3 border-x-0 border-t-0 px-4 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setSidebarOpen((open) => !open)}
              className="glass-button h-10 w-10 shrink-0 lg:hidden"
            >
              {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
            </button>

            <div className="min-w-0">
              <p className="truncate text-xs text-[var(--color-text-muted)]">
                CampusOne / Platform
              </p>
              <h1 className="truncate text-xl font-semibold sm:text-2xl">
                {navigation.find((item) => item.path === window.location.pathname)?.label
                  || 'Platform management'}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Search (not connected)"
              title="Search will be connected later"
              className="glass-button h-10 w-10"
            >
              <Search size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="Notifications (not connected)"
              title="Notifications will be connected later"
              className="glass-button hidden h-10 w-10 sm:inline-flex"
            >
              <Bell size={18} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={loggingOut}
              className="glass-button gap-2 px-3 py-2 text-sm font-medium disabled:opacity-50 sm:px-4"
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="hidden sm:inline">
                {loggingOut ? 'Signing out...' : 'Sign out'}
              </span>
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-7 lg:p-9">
          <Outlet />

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <footer className="flex flex-col justify-between gap-2 border-t border-[var(--glass-border-subtle)] pt-5 text-xs text-[var(--color-text-muted)] sm:flex-row">
            <p>CampusOne Platform Administration</p>
            <p>Secure platform management workspace</p>
          </footer>
        </section>
      </div>
    </main>
  )
}
