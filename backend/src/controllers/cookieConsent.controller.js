import mongoose from 'mongoose'
import CookieConsent from '../models/cookieConsent.js'
import CookieConsentHistory from '../models/cookieConsentHistory.js'

const CURRENT_POLICY_VERSION = '1.0'

const DEFAULT_PREFERENCES = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
}

const CONSENT_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function validateConsentId(consentId) {
  return (
    typeof consentId === 'string' &&
    CONSENT_ID_REGEX.test(consentId)
  )
}

function getConsentId(req) {
  const consentId = req.body?.consentId ?? req.query?.consentId

  if (!validateConsentId(consentId)) {
    return null
  }

  return consentId
}

function getPreferences(body) {
  const preferences = {}

  for (const key of Object.keys(DEFAULT_PREFERENCES)) {
    if (typeof body[key] !== 'boolean') {
      return null
    }

    preferences[key] = body[key]
  }

  // Essential functionality cannot be disabled.
  preferences.essential = true

  return preferences
}

function getSource(source) {
  if (source === 'BANNER' || source === 'SETTINGS') {
    return source
  }

  return null
}

function sendError(res, status, message) {
  return res.status(status).json({
    success: false,
    message,
  })
}

function serializeConsent(consent) {
  return {
    consentId: consent.consentId,
    preferences: {
      essential: consent.essential,
      functional: consent.functional,
      analytics: consent.analytics,
      marketing: consent.marketing,
    },
    policyVersion: consent.policyVersion,
    consentedAt: consent.consentedAt,
    withdrawnAt: consent.withdrawnAt,
    source: consent.source,
    updatedAt: consent.updatedAt,
  }
}


async function findConsentForRequest({ userId, consentId, session }) {
  // Signed-in users can only access their own account's consent.
  if (userId) {
    let consentQuery = CookieConsent.findOne({ userId })

    if (session) {
      consentQuery = consentQuery.session(session)
    }

    let consent = await consentQuery

    if (consent) return consent

    // Allow a signed-in user to claim their own anonymous consent.
    let anonymousQuery = CookieConsent.findOne({
      consentId,
      userId: null,
    })

    if (session) {
      anonymousQuery = anonymousQuery.session(session)
    }

    consent = await anonymousQuery

    if (consent) {
  consent.userId = userId

  if (session) {
    await consent.save({ session })
  } else {
    await consent.save()
  }
}

return consent
  }

  // Anonymous visitors can only access anonymous consent records.
  let query = CookieConsent.findOne({
    consentId,
    userId: null,
  })

  if (session) {
    query = query.session(session)
  }

  return query
}


/**
 * GET /api/cookie-consent
 *
 * Retrieve the current consent preferences.
 */
export async function getCookieConsent(req, res, next) {
  try {
    const consentId = getConsentId(req)

    if (!consentId) {
      return sendError(
        res,
        400,
        'A valid consent ID is required.',
      )
    }

 const userId = req.user?._id ?? null

const consent = await findConsentForRequest({
  userId,
  consentId,
})

    if (!consent) {
      return res.status(200).json({
        success: true,
        consent: null,
        policyVersion: CURRENT_POLICY_VERSION,
        defaultPreferences: DEFAULT_PREFERENCES,
      })
    }

    return res.status(200).json({
      success: true,
      consent: serializeConsent(consent),
      requiresRenewal:
        consent.policyVersion !== CURRENT_POLICY_VERSION,
    })
  } catch (error) {
    return next(error)
  }
}

/**
 * POST /api/cookie-consent
 *
 * Save or update consent preferences.
 */
export async function saveCookieConsent(req, res, next) {
  const mongoSession = await mongoose.startSession()

  try {
    const consentId = getConsentId(req)

    if (!consentId) {
      return sendError(
        res,
        400,
        'A valid consent ID is required.',
      )
    }

    const preferences = getPreferences(req.body?.preferences ?? {})

    if (!preferences) {
      return sendError(
        res,
        400,
        'All consent preferences must be provided as boolean values.',
      )
    }

    const source = getSource(req.body.source)

if (!source) {
  return sendError(
    res,
    400,
    'A valid consent source is required.',
  )
}

const userId = req.user?._id ?? null

    let savedConsent

    await mongoSession.withTransaction(async () => {
    let consent = await findConsentForRequest({
  userId,
  consentId,
  session: mongoSession,
})

      const isNewConsent = !consent

      if (!consent) {
        consent = new CookieConsent({
          consentId,
          userId,
          ...preferences,
          policyVersion: CURRENT_POLICY_VERSION,
          consentedAt: new Date(),
          withdrawnAt: null,
          source,
        })
      } else {
        consent.userId = userId ?? consent.userId
        consent.set(preferences)
        consent.policyVersion = CURRENT_POLICY_VERSION
        consent.consentedAt = new Date()
        consent.withdrawnAt = null
        consent.source = source
      }

      await consent.save({ session: mongoSession })

      await CookieConsentHistory.create(
        [
          {
            consentId: consent.consentId,
            userId: consent.userId,
            ...preferences,
            policyVersion: CURRENT_POLICY_VERSION,
            action: isNewConsent ? 'GIVEN' : 'UPDATED',
            source,
          },
        ],
        { session: mongoSession },
      )

      savedConsent = consent
    })

    return res.status(200).json({
      success: true,
      message: 'Cookie preferences saved successfully.',
      consent: serializeConsent(savedConsent),
    })
  } catch (error) {
    if (error.code === 11000) {
      return sendError(
        res,
        409,
        'A consent record already exists. Please refresh and try again.',
      )
    }

    return next(error)
  } finally {
    await mongoSession.endSession()
  }
}

/**
 * POST /api/cookie-consent/withdraw
 *
 * Disable all optional consent categories.
 */
export async function withdrawCookieConsent(req, res, next) {
  const mongoSession = await mongoose.startSession()

  try {
    const consentId = getConsentId(req)

    if (!consentId) {
      return sendError(
        res,
        400,
        'A valid consent ID is required.',
      )
    }

    const userId = req.user?._id ?? null
    let updatedConsent = null

    await mongoSession.withTransaction(async () => {
      const consent = await findConsentForRequest({
  userId,
  consentId,
  session: mongoSession,
})

      if (!consent) {
        return
      }

      consent.essential = true
      consent.functional = false
      consent.analytics = false
      consent.marketing = false
      consent.withdrawnAt = new Date()
      consent.consentedAt = new Date()
      consent.source = 'SETTINGS'

      await consent.save({ session: mongoSession })

      await CookieConsentHistory.create(
        [
          {
            consentId: consent.consentId,
            userId: consent.userId,
            essential: true,
            functional: false,
            analytics: false,
            marketing: false,
            policyVersion: consent.policyVersion,
            action: 'WITHDRAWN',
            source: 'SETTINGS',
          },
        ],
        { session: mongoSession },
      )

      updatedConsent = consent
    })

    if (!updatedConsent) {
      return res.status(200).json({
        success: true,
        message: 'No existing optional consent was found.',
        consent: null,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Optional cookie consent withdrawn successfully.',
      consent: serializeConsent(updatedConsent),
    })
  } catch (error) {
    return next(error)
  } finally {
    await mongoSession.endSession()
  }
}