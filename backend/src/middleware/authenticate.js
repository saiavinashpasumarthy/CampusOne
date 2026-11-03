
import { firebaseAuth } from '../config/firebase.js'
import User from '../models/user.js'

export async function authenticate(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required.',
    })
  }

  const token = authorization.slice(7).trim()

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required.',
    })
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token)

    const user = await User.findOne({
      firebaseUid: decodedToken.uid,
    }).select('_id name email role collegeId status')

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User account is not registered on CampusOne.',
      })
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your CampusOne account is not active.',
      })
    }

    req.user = {
      _id: user._id,
      uid: decodedToken.uid,
      name: user.name,
      email: decodedToken.email ?? user.email,
      emailVerified: decodedToken.email_verified ?? false,
      role: user.role,
      collegeId: user.collegeId,
      status: user.status,
    }

    return next()
  } catch (error) {
    console.error('Authentication middleware error:', error)

    if (
      error.code === 'auth/id-token-expired' ||
      error.code === 'auth/argument-error' ||
      error.code === 'auth/invalid-id-token' ||
      error.code === 'auth/user-disabled' ||
      error.code === 'auth/id-token-revoked'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid, expired, or disabled authentication session.',
      })
    }

    return next(error)
  }
}
