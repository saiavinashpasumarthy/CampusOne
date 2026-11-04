import ActivityLog from '../models/activityLog.js'

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
      metadata,
      ipAddress: req.ip || null,
      userAgent: req.get('user-agent') || null,
    })
  } catch (error) {
    // Logging failures must not undo an action that has already succeeded.
    console.error('Activity logging failed:', error)
  }
}

export default logActivity