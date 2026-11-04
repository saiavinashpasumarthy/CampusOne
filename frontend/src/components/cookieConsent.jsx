
import { useEffect, useState } from 'react'
import { Cookie, Settings2, X } from 'lucide-react'
import {
  fetchCookieConsent,
  saveCookieConsent,
  withdrawCookieConsent,
} from '../services/cookieConsent'

const DEFAULT_PREFERENCES = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
}

const OPTIONAL_CATEGORIES = [
  {
    key: 'functional',
    title: 'Functional',
    description:
      'Remember optional preferences and improve convenience across visits.',
  },
  {
    key: 'analytics',
    title: 'Analytics',
    description:
      'Help us understand how the platform is used so we can improve it.',
  },
  {
    key: 'marketing',
    title: 'Marketing',
    description:
      'Allow marketing-related technologies if they are introduced in the future.',
  },
]

export default function CookieConsent() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')


  useEffect(() => {
    let active = true

    async function loadConsent() {
      try {
        const response = await fetchCookieConsent()

        if (!active) return

        const consent = response.consent

        if (consent?.preferences) {
          setPreferences({
            essential: true,
            functional: consent.preferences.functional === true,
            analytics: consent.preferences.analytics === true,
            marketing: consent.preferences.marketing === true,
          })

          setShowBanner(response.requiresRenewal === true)
        } else {
          setShowBanner(true)
        }
      } catch (err) {
        console.error('Unable to load cookie consent:', err)

        if (active) {
          setError(
            'We could not load your saved preferences. Please try again.',
          )
          setShowBanner(true)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadConsent()

    return () => {
      active = false
    }
  }, [])

useEffect(() => {
  function openCookieSettings() {
    setShowBanner(true)
    setShowSettings(true)
    setError('')
  }

  window.addEventListener(
    'campusone:open-cookie-settings',
    openCookieSettings,
  )

  return () => {
    window.removeEventListener(
      'campusone:open-cookie-settings',
      openCookieSettings,
    )
  }
}, [])


  function updatePreference(key, checked) {
    setPreferences((current) => ({
      ...current,
      [key]: checked,
      essential: true,
    }))
  }

  async function handleSave(nextPreferences, source = 'BANNER') {
    setSaving(true)
    setError('')

    try {
      await saveCookieConsent(nextPreferences, source)
      setPreferences(nextPreferences)
      setShowBanner(false)
      setShowSettings(false)
    } catch (err) {
      console.error('Unable to save cookie consent:', err)
      setError(
        err.message || 'Unable to save your preferences. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  function acceptAll() {
    handleSave(
      {
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
      },
      'BANNER',
    )
  }

  function rejectOptional() {
    handleSave(DEFAULT_PREFERENCES, 'BANNER')
  }

  function saveCustomPreferences() {
    handleSave(preferences, 'SETTINGS')
  }

async function handleWithdrawConsent() {
  setSaving(true)
  setError('')

  try {
    await withdrawCookieConsent()

    setPreferences(DEFAULT_PREFERENCES)
    setShowBanner(false)
    setShowSettings(false)
  } catch (err) {
    setError(
      err.message || 'Unable to withdraw consent. Please try again.',
    )
  } finally {
    setSaving(false)
  }
}

  if (loading || !showBanner) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5">
      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-consent-title"
        className="glass-panel mx-auto max-w-5xl rounded-2xl border border-[var(--color-border)] p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3 text-[var(--color-primary)]">
            <Cookie size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="cookie-consent-title"
              className="text-lg font-bold text-[var(--color-text)]"
            >
              Your privacy choices
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              CampusOne uses essential browser storage to support core
              functionality. Optional preferences are disabled unless you
              choose to enable them. You can change your choices later.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowBanner(false)}
            aria-label="Close cookie information"
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-secondary)]"
          >
            <X size={18} />
          </button>
        </div>

        {showSettings && (
          <div className="mt-5 space-y-3 border-t border-[var(--color-border)] pt-5">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-bg-secondary)] p-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Essential
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Required for core platform functionality.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-500">
                Always active
              </span>
            </div>

            {OPTIONAL_CATEGORIES.map((category) => (
              <label
                key={category.key}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-[var(--color-bg-secondary)] p-4"
              >
                <span>
                  <span className="block text-sm font-semibold text-[var(--color-text)]">
                    {category.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
                    {category.description}
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={preferences[category.key]}
                  onChange={(event) =>
                    updatePreference(category.key, event.target.checked)
                  }
                  className="h-4 w-4 shrink-0 accent-blue-500"
                />
              </label>
            ))}

            <button
              type="button"
              disabled={saving}
              onClick={saveCustomPreferences}
              className="glass-button-primary w-full justify-center px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save my preferences'}
            </button>
            
<button
  type="button"
  disabled={saving}
  onClick={handleWithdrawConsent}
  className="glass-button w-full justify-center px-5 py-3 text-sm font-semibold disabled:opacity-50"
>
  {saving ? 'Processing...' : 'Withdraw optional consent'}
</button>

          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={rejectOptional}
            className="glass-button px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Reject optional
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => setShowSettings((current) => !current)}
            className="glass-button px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            <Settings2 size={16} />
            {showSettings ? 'Hide preferences' : 'Customize'}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={acceptAll}
            className="glass-button-primary px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Accept all'}
          </button>
        </div>
      </section>
    </div>
  )
}
