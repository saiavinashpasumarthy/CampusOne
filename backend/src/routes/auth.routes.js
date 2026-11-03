import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'
import { registerCollege } from '../services/collegeRegistration.service.js'
const router = Router()

router.post('/register-college', async (req, res) => {
  try {
    const {
      collegeName,
      ownerName,
      email,
      phone,
      password,
    } = req.body

    if (
      !collegeName?.trim() ||
      !ownerName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'All registration fields are required.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.',
      })
    }

    const result = await registerCollege({
      collegeName,
      ownerName,
      email,
      phone,
      password,
    })

    return res.status(201).json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error('College registration error:', error)

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : 'College registration failed. Please try again.',
    })
  }
})

router.get(
  '/me',
  authenticate,
  authorizeRole(
    'SUPER_ADMIN',
    'COLLEGE_ADMIN',
    'WARDEN',
    'STUDENT',
  ),
  (req, res) => {
    res.status(200).json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        emailVerified: req.user.emailVerified,
        role: req.user.role,
        collegeId: req.user.collegeId,
      },
    })
  },
)

export default router
