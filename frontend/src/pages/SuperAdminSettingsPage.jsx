
import { useCallback, useEffect, useState } from 'react'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'
import {
  Bell,
  Check,
  Eye,
  EyeOff,
  Globe,
  LockKeyhole,
  MonitorCog,
  Save,
  Settings2,
  ShieldCheck,
} from 'lucide-react'

import { auth } from '../firebase'
import { apiRequest } from '../services/api'

const SETTINGS_SECTIONS = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'maintenance', label: 'Maintenance', icon: MonitorCog },
]

const DEFAULT_SETTINGS = {
  general: {
    platformName: 'CampusOne',
    supportEmail: '',
    contactPhone: '',
  },
  preferences: {
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  },
  notifications: {
    platformAlerts: true,
    emailNotifications: true,
  },
  maintenance: {
    enabled: false,
    announcement: '',
  },
}

const initialPasswords = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />

        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          className="glass-input py-3 pl-11 pr-12 text-sm"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--glass-bg)]"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="glass-input py-3 text-sm"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="glass-input py-3 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function NumberField({ label, value, onChange, min, max }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="glass-input py-3 text-sm"
      />
    </div>
  )
}

function ToggleField({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] p-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && (
          <span className="mt-1 block text-xs text-[var(--color-text-muted)]">
            {description}
          </span>
        )}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--color-primary)]"
      />
    </label>
  )
}

function SectionFeedback({ feedback }) {
  if (!feedback) return null

  return (
    <div
      role="status"
      className={`rounded-xl border p-3 text-sm ${
        feedback.type === 'success'
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
          : 'border-red-500/20 bg-red-500/10 text-red-500'
      }`}
    >
      {feedback.message}
    </div>
  )
}

function SecuritySettings() {
  const [passwords, setPasswords] = useState(initialPasswords)
  const [visible, setVisible] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const updateField = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }))
    setFeedback(null)
  }

  const toggleVisibility = (field) => {
    setVisible((current) => ({ ...current, [field]: !current[field] }))
  }

  const passwordChecks = [
    { label: 'At least 8 characters', valid: passwords.newPassword.length >= 8 },
    { label: 'At least one uppercase letter', valid: /[A-Z]/.test(passwords.newPassword) },
    { label: 'At least one lowercase letter', valid: /[a-z]/.test(passwords.newPassword) },
    { label: 'At least one number', valid: /\d/.test(passwords.newPassword) },
    { label: 'At least one special character', valid: /[^A-Za-z0-9]/.test(passwords.newPassword) },
  ]

  const allChecksPassed = passwordChecks.every((check) => check.valid)

  async function handlePasswordChange(event) {
    event.preventDefault()
    setFeedback(null)

    if (!auth.currentUser || !auth.currentUser.email) {
      setFeedback({
        type: 'error',
        message: 'Your session has expired. Please sign in again.',
      })
      return
    }

    if (!allChecksPassed) {
      setFeedback({ type: 'error', message: 'Please meet all password requirements.' })
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirmation do not match.' })
      return
    }

    if (passwords.currentPassword === passwords.newPassword) {
      setFeedback({
        type: 'error',
        message: 'Your new password must be different from your current password.',
      })
      return
    }

    setLoading(true)

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwords.currentPassword,
      )

      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, passwords.newPassword)

      setPasswords(initialPasswords)
      setVisible({})
      setFeedback({
        type: 'success',
        message: 'Your password has been changed successfully.',
      })
    } catch (error) {
      let message = 'Unable to change your password. Please try again.'

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        message = 'Your current password is incorrect.'
      } else if (error.code === 'auth/weak-password') {
        message = 'Please choose a stronger password.'
      } else if (error.code === 'auth/requires-recent-login') {
        message = 'Please sign in again before changing your password.'
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.'
      }

      setFeedback({ type: 'error', message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Change password</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Update your Super Admin account password.
        </p>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <PasswordField
            id="currentPassword"
            label="Current password"
            value={passwords.currentPassword}
            onChange={(event) => updateField('currentPassword', event.target.value)}
            visible={!!visible.currentPassword}
            onToggle={() => toggleVisibility('currentPassword')}
            autoComplete="current-password"
          />

          <div className="hidden lg:block" />

          <PasswordField
            id="newPassword"
            label="New password"
            value={passwords.newPassword}
            onChange={(event) => updateField('newPassword', event.target.value)}
            visible={!!visible.newPassword}
            onToggle={() => toggleVisibility('newPassword')}
            autoComplete="new-password"
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            value={passwords.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
            visible={!!visible.confirmPassword}
            onToggle={() => toggleVisibility('confirmPassword')}
            autoComplete="new-password"
          />
        </div>

        <div className="rounded-2xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] p-4">
          <p className="mb-3 text-sm font-semibold">Password requirements</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {passwordChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-2 text-xs">
                <Check
                  size={15}
                  className={
                    check.valid
                      ? 'text-emerald-500'
                      : 'text-[var(--color-text-muted)] opacity-50'
                  }
                />
                <span className="text-[var(--color-text-muted)]">{check.label}</span>
              </div>
            ))}
          </div>
        </div>

        <SectionFeedback feedback={feedback} />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              loading ||
              !allChecksPassed ||
              !passwords.currentPassword ||
              !passwords.confirmPassword
            }
            className="glass-button-primary px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Updating password...' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  )
}

function GeneralSettings({ settings, update }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Platform information</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Configure the name and contact details displayed across CampusOne.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="Platform name"
          value={settings.general.platformName}
          onChange={(value) => update('general', 'platformName', value)}
        />
        <TextField
          label="Support email"
          type="email"
          value={settings.general.supportEmail}
          onChange={(value) => update('general', 'supportEmail', value)}
        />
        <TextField
          label="Contact phone"
          type="tel"
          value={settings.general.contactPhone}
          onChange={(value) => update('general', 'contactPhone', value)}
        />
      </div>
    </div>
  )
}

function PreferencesSettings({ settings, update }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Regional preferences</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Set the default timezone, date format and currency for the platform.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Timezone"
          value={settings.preferences.timezone}
          onChange={(value) => update('preferences', 'timezone', value)}
          options={[
            { value: 'Asia/Kolkata', label: 'India Standard Time (Asia/Kolkata)' },
            { value: 'UTC', label: 'UTC' },
            { value: 'Asia/Dubai', label: 'Gulf Standard Time (Asia/Dubai)' },
            { value: 'Europe/London', label: 'London (Europe/London)' },
            { value: 'America/New_York', label: 'Eastern Time (America/New_York)' },
          ]}
        />

        <SelectField
          label="Date format"
          value={settings.preferences.dateFormat}
          onChange={(value) => update('preferences', 'dateFormat', value)}
          options={[
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          ]}
        />

        <SelectField
          label="Currency"
          value={settings.preferences.currency}
          onChange={(value) => update('preferences', 'currency', value)}
          options={[
            { value: 'INR', label: 'Indian Rupee (INR)' },
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'GBP', label: 'British Pound (GBP)' },
          ]}
        />
      </div>
    </div>
  )
}

function PlatformSecuritySettings({ settings, update }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Platform security policies</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Configure the default session and login security limits.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <NumberField
          label="Session timeout (minutes)"
          value={settings.security.sessionTimeout}
          min={5}
          max={1440}
          onChange={(value) => update('security', 'sessionTimeout', value)}
        />
        <NumberField
          label="Maximum login attempts"
          value={settings.security.maxLoginAttempts}
          min={3}
          max={10}
          onChange={(value) => update('security', 'maxLoginAttempts', value)}
        />
      </div>

      <div className="rounded-xl border border-[var(--glass-border-subtle)] bg-[var(--glass-bg-subtle)] p-4 text-sm text-[var(--color-text-muted)]">
        These values are stored as platform policies. They will only affect
        authentication behavior once the corresponding backend enforcement is implemented.
      </div>

      <div className="border-t border-[var(--glass-border-subtle)] pt-6">
        <SecuritySettings />
      </div>
    </div>
  )
}

function NotificationSettings({ settings, update }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Notification preferences</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Choose which platform-level notifications are enabled.
        </p>
      </div>

      <div className="space-y-3">
        <ToggleField
          label="Platform alerts"
          description="Enable important system and platform alerts."
          checked={settings.notifications.platformAlerts}
          onChange={(value) => update('notifications', 'platformAlerts', value)}
        />
        <ToggleField
          label="Email notifications"
          description="Enable platform email notifications."
          checked={settings.notifications.emailNotifications}
          onChange={(value) => update('notifications', 'emailNotifications', value)}
        />
      </div>
    </div>
  )
}

function MaintenanceSettings({ settings, update }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Maintenance mode</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Configure the platform maintenance status and announcement.
        </p>
      </div>

      <ToggleField
        label="Enable maintenance mode"
        description="Stores the maintenance-mode setting. This alone does not block user access."
        checked={settings.maintenance.enabled}
        onChange={(value) => update('maintenance', 'enabled', value)}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">
          Maintenance announcement
        </label>
        <textarea
          rows={5}
          maxLength={1000}
          value={settings.maintenance.announcement}
          onChange={(event) =>
            update('maintenance', 'announcement', event.target.value)
          }
          placeholder="Enter the maintenance announcement..."
          className="glass-input min-h-32 resize-y py-3 text-sm"
        />
        <p className="mt-1 text-right text-xs text-[var(--color-text-muted)]">
          {settings.maintenance.announcement.length}/1000
        </p>
      </div>
    </div>
  )
}

export default function SuperAdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('security')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const loadSettings = useCallback(async () => {
    try {
      const response = await apiRequest('/super-admin/settings')
      const savedSettings = response.data?.settings

      if (savedSettings) {
        setSettings({
          general: { ...DEFAULT_SETTINGS.general, ...savedSettings.general },
          preferences: {
            ...DEFAULT_SETTINGS.preferences,
            ...savedSettings.preferences,
          },
          security: {
            ...DEFAULT_SETTINGS.security,
            ...savedSettings.security,
          },
          notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...savedSettings.notifications,
          },
          maintenance: {
            ...DEFAULT_SETTINGS.maintenance,
            ...savedSettings.maintenance,
          },
        })
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Unable to load platform settings.',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSettings()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [loadSettings])

  const updateSetting = (section, field, value) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }))
    setFeedback(null)
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)

    try {
      const response = await apiRequest('/super-admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      })

      const savedSettings = response.data?.settings

      if (savedSettings) {
        setSettings({
          general: { ...DEFAULT_SETTINGS.general, ...savedSettings.general },
          preferences: {
            ...DEFAULT_SETTINGS.preferences,
            ...savedSettings.preferences,
          },
          security: {
            ...DEFAULT_SETTINGS.security,
            ...savedSettings.security,
          },
          notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...savedSettings.notifications,
          },
          maintenance: {
            ...DEFAULT_SETTINGS.maintenance,
            ...savedSettings.maintenance,
          },
        })
      }

      setFeedback({
        type: 'success',
        message: response.message || 'Platform settings saved successfully.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Unable to save platform settings.',
      })
    } finally {
      setSaving(false)
    }
  }

  const activeItem = SETTINGS_SECTIONS.find(
    (section) => section.id === activeSection,
  )

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          SUPER ADMIN
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Manage your account security and platform configuration.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-2xl p-3">
          <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Settings menu
          </p>

          <nav className="space-y-1">
            {SETTINGS_SECTIONS.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(section.id)
                    setFeedback(null)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--glass-bg)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--glass-bg-subtle)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <Icon size={18} />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="glass-panel min-w-0 rounded-2xl p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--glass-border-subtle)] pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--glass-bg-subtle)] text-[var(--color-primary)]">
              {activeItem && <activeItem.icon size={21} />}
            </div>

            <div>
              <h2 className="text-base font-semibold">
                {activeItem?.label} settings
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Configure your {activeItem?.label.toLowerCase()} preferences.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                Loading platform settings...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeSection === 'general' && (
                <GeneralSettings settings={settings} update={updateSetting} />
              )}

              {activeSection === 'preferences' && (
                <PreferencesSettings settings={settings} update={updateSetting} />
              )}

              {activeSection === 'security' && (
                <PlatformSecuritySettings settings={settings} update={updateSetting} />
              )}

              {activeSection === 'notifications' && (
                <NotificationSettings settings={settings} update={updateSetting} />
              )}

              {activeSection === 'maintenance' && (
                <MaintenanceSettings settings={settings} update={updateSetting} />
              )}

              {activeSection !== 'security' && (
                <>
                  <SectionFeedback feedback={feedback} />

                  <div className="flex justify-end border-t border-[var(--glass-border-subtle)] pt-5">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="glass-button-primary flex items-center gap-2 px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? 'Saving settings...' : 'Save changes'}
                    </button>
                  </div>
                </>
              )}

              {activeSection === 'security' && (
                <>
                  <SectionFeedback feedback={feedback} />

                  <div className="flex justify-end border-t border-[var(--glass-border-subtle)] pt-5">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="glass-button-primary flex items-center gap-2 px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? 'Saving settings...' : 'Save security policies'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
