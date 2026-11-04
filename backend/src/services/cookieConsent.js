const CONSENT_ID_KEY = 'campusone-consent-id'

export function getConsentId() {
  let consentId = localStorage.getItem(CONSENT_ID_KEY)

  if (!consentId) {
    if (!globalThis.crypto?.randomUUID) {
      throw new Error(
        'Your browser does not support secure consent identification.',
      )
    }

    consentId = globalThis.crypto.randomUUID()

    localStorage.setItem(CONSENT_ID_KEY, consentId)
  }

  return consentId
}