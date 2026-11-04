import { auth } from '../firebase'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const CONSENT_ID_STORAGE_KEY = 'campusone-cookie-consent-id'

function getConsentId() {
  let consentId = localStorage.getItem(CONSENT_ID_STORAGE_KEY)

  if (!consentId) {
    consentId = globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(CONSENT_ID_STORAGE_KEY, consentId)
  }

  return consentId
}

async function cookieConsentRequest(path, options = {}) {
  const currentUser = auth.currentUser
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (currentUser) {
    const token = await currentUser.getIdToken()
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}.`,
    )
  }

  return data
}

export async function fetchCookieConsent() {
  const consentId = getConsentId()

  return cookieConsentRequest(
    `/cookie-consent?consentId=${encodeURIComponent(consentId)}`,
  )
}

export async function saveCookieConsent(preferences, source = 'BANNER') {
  return cookieConsentRequest('/cookie-consent', {
    method: 'POST',
    body: JSON.stringify({
      consentId: getConsentId(),
      preferences,
      source,
    }),
  })
}

export async function withdrawCookieConsent() {
  return cookieConsentRequest('/cookie-consent/withdraw', {
    method: 'POST',
    body: JSON.stringify({
      consentId: getConsentId(),
    }),
  })
}