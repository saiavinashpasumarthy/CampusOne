import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'

const router = Router()

router.get(
  '/me',
  authenticate,
  authorizeRole(
    'SUPER_ADMIN',
    'COLLEGE_OWNER',
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
