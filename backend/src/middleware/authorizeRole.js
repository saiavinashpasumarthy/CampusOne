
import User from '../models/user.js'
import College from '../models/college.js'

export function authorizeRole(...allowedRoles) {
  return async function roleAuthorization(req, res, next) {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({
          success: false,
          message: 'Authentication is required.',
        })
      }

      const user = await User.findOne({
        firebaseUid: req.user.uid,
      })
        .select('_id firebaseUid name email role status collegeId')
        .lean()

      if (!user) {
        return res.status(403).json({
          success: false,
          message: 'Your account is not registered in CampusOne.',
        })
      }

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          message: 'Your CampusOne account is not active.',
        })
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource.',
        })
      }

      let college = null

      if (user.role !== 'SUPER_ADMIN') {
        if (!user.collegeId) {
          return res.status(403).json({
            success: false,
            message: 'Your account is not associated with a college.',
          })
        }

        college = await College.findById(user.collegeId)
          .select('_id status')
          .lean()

        if (!college) {
          return res.status(403).json({
            success: false,
            message: 'Your associated college could not be found.',
          })
        }

        if (college.status !== 'ACTIVE') {
          return res.status(403).json({
            success: false,
            message: 'Your college is not active. Please contact your college administrator.',
          })
        }
      }

      req.user = {
        ...req.user,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        collegeId: user.collegeId?.toString() ?? null,
      }

      req.campusOneUser = user

      return next()
    } catch (error) {
      return next(error)
    }
  }
}
