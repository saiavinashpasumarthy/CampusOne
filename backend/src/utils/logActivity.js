
import ActivityLog from '../models/activityLog.js'

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'newpassword',
  'oldpassword',
  'confirmpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'idtoken',
  'authorization',
  'otp',
  'verificationcode',
  'resetcode',
  'secret',
  'apikey',
  'clientsecret',
  'privatekey',
])

const normalizeKey = (key) =>
  String(key).toLowerCase().replace(/[^a-z0-9]/g, '')

const sanitizeMetadata = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeMetadata)
  }

  if (value && typeof value === 'object') {
    // Avoid accidentally storing non-plain objects.
    if (
      Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null
    ) {
      return '[REDACTED]'
    }

    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !SENSITIVE_KEYS.has(normalizeKey(key)))
        .map(([key, nestedValue]) => [
          key,
          sanitizeMetadata(nestedValue),
        ]),
    )
  }

  if (typeof value === 'string') {
    return value.slice(0, 2000)
  }

  return value
}

const logActivity = async ({
  req,
  action,
  category,
  description,
  targetType = null,
  targetId = null,
  collegeId = null,
  metadata = {},
}) => {
  try {
    const actor = req.campusOneUser

    if (!actor?._id || !actor?.role) {
      throw new Error('Activity log requires an authenticated user.')
    }

    await ActivityLog.create({
      action,
      category,
      description,
      performedBy: actor._id,
      actorRole: actor.role,
      collegeId,
      targetType,
      targetId,
      metadata: sanitizeMetadata(metadata),
      ipAddress: req.ip || null,
      userAgent: req.get('user-agent') || null,
    })
  } catch (error) {
    // Logging failures must not undo an action that has already succeeded.
    console.error('Activity logging failed:', error)
  }
}

export default logActivity
