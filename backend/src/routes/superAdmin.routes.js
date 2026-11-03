
import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'
import College from '../models/college.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
import { firebaseAuth } from '../config/firebase.js'
import UserStatusAudit from '../models/userStatusAudit.js'
const router = Router()

router.get(
  '/users',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (req, res, next) => {
    try {
      const {
        search,
        role,
        status,
        collegeId,
        page = '1',
        limit = '10',
      } = req.query

      const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1)
      const pageSize = Math.min(
        50,
        Math.max(1, Number.parseInt(limit, 10) || 10),
      )

      const filter = {}

      const allowedRoles = [
        'SUPER_ADMIN',
        'COLLEGE_ADMIN',
        'WARDEN',
        'STUDENT',
      ]

      const allowedStatuses = [
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'REJECTED',
      ]

      if (role) {
        if (!allowedRoles.includes(role)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid user role filter.',
          })
        }

        filter.role = role
      }

      if (status) {
        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid user status filter.',
          })
        }

        filter.status = status
      }

      if (collegeId) {
        if (!mongoose.isValidObjectId(collegeId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid college ID.',
          })
        }

        filter.collegeId = collegeId
      }

      if (typeof search === 'string' && search.trim()) {
        const escapedSearch = search
  .trim()
  .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

        filter.$or = [
          { email: { $regex: escapedSearch, $options: 'i' } },
          { firebaseUid: { $regex: escapedSearch, $options: 'i' } },
        ]
      }

      const [users, total] = await Promise.all([
        User.find(filter)
          .select('email role status collegeId createdAt updatedAt')
          .populate('collegeId', 'name code')
          .sort({ createdAt: -1 })
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .lean(),

        User.countDocuments(filter),
      ])

      return res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            page: pageNumber,
            limit: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
          },
        },
      })
    } catch (error) {
      return next(error)
    }
  },
)

router.patch(
  '/users/:userId/status',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (req, res, next) => {
    let firebaseUid
    let firebaseUpdated = false
    let databaseUpdated = false
    let previousStatus

    try {
      const { userId } = req.params
      const { action, reason } = req.body

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID.',
        })
      }

      if (!['SUSPEND', 'REACTIVATE'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be SUSPEND or REACTIVATE.',
        })
      }

      if (
        typeof reason !== 'string' ||
        reason.trim().length < 5 ||
        reason.trim().length > 500
      ) {
        return res.status(400).json({
          success: false,
          message: 'Reason must contain between 5 and 500 characters.',
        })
      }

      if (String(req.user._id) === userId) {
        return res.status(403).json({
          success: false,
          message: 'You cannot change your own account status.',
        })
      }

      const targetUser = await User.findById(userId)
        .select('_id firebaseUid email role status')

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        })
      }

      if (targetUser.role === 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Super Admin accounts cannot be managed here.',
        })
      }

      previousStatus = targetUser.status

      const newStatus =
        action === 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE'

      if (previousStatus !== (action === 'SUSPEND' ? 'ACTIVE' : 'SUSPENDED')) {
        return res.status(409).json({
          success: false,
          message:
            action === 'SUSPEND'
              ? 'Only active users can be suspended.'
              : 'Only suspended users can be reactivated.',
        })
      }

      firebaseUid = targetUser.firebaseUid

      // Update Firebase first. If later operations fail,
      // the catch block attempts to restore its previous state.
      await firebaseAuth.updateUser(firebaseUid, {
        disabled: action === 'SUSPEND',
      })

      firebaseUpdated = true

      // Update only if the account still has its expected status.
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          status: previousStatus,
        },
        {
          $set: {
            status: newStatus,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).select('_id email role status')

      if (!updatedUser) {
        throw new Error(
          'User status changed concurrently. Please refresh and try again.',
        )
      }

      databaseUpdated = true

      await UserStatusAudit.create({
        userId: targetUser._id,
        previousStatus,
        newStatus,
        reason: reason.trim(),
        performedBy: req.user._id,
      })

      return res.status(200).json({
        success: true,
        message:
          action === 'SUSPEND'
            ? 'User suspended successfully.'
            : 'User reactivated successfully.',
        data: {
          user: updatedUser,
          previousStatus,
          newStatus,
        },
      })
    } catch (error) {
      // Attempt to restore MongoDB if it was already changed.
      if (databaseUpdated) {
        try {
          await User.findOneAndUpdate(
            {
              _id: req.params.userId,
              status:
                previousStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
            },
            {
              $set: {
                status: previousStatus,
              },
            },
            {
              runValidators: true,
            },
          )
        } catch (rollbackError) {
          console.error('MongoDB rollback failed:', rollbackError)
        }
      }

      // Restore Firebase to its previous disabled state.
      if (firebaseUpdated && firebaseUid) {
        try {
          await firebaseAuth.updateUser(firebaseUid, {
            disabled: previousStatus !== 'ACTIVE',
          })
        } catch (rollbackError) {
          console.error('Firebase rollback failed:', rollbackError)
        }
      }

      return next(error)
    }
  },
)

router.get(
  '/users/:userId/audit',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (req, res, next) => {
    try {
      const { userId } = req.params

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID.',
        })
      }

      const userExists = await User.exists({ _id: userId })

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        })
      }

      const history = await UserStatusAudit.find({ userId })
        .populate('performedBy', 'email role')
        .sort({ createdAt: -1 })
        .lean()

      return res.status(200).json({
        success: true,
        data: {
          history,
        },
      })
    } catch (error) {
      return next(error)
    }
  },
)

router.get(
  '/colleges/:collegeId',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (req, res, next) => {
    try {
      const { collegeId } = req.params

      if (!mongoose.isValidObjectId(collegeId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid college ID.',
        })
      }

      const college = await College.findById(collegeId)
        .select(
          'name code email phone address status subscriptionPlan createdAt updatedAt approvedAt approvedBy',
        )
        .populate('approvedBy', 'email role')
        .lean()

      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found.',
        })
      }

      const [totalUsers, usersByRole, usersByStatus] = await Promise.all([
        User.countDocuments({ collegeId: college._id }),

        User.aggregate([
          { $match: { collegeId: college._id } },
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
            },
          },
        ]),

        User.aggregate([
          { $match: { collegeId: college._id } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]),
      ])

      return res.status(200).json({
        success: true,
        data: {
          college,
          userSummary: {
            totalUsers,
            byRole: Object.fromEntries(
              usersByRole.map(({ _id, count }) => [_id, count]),
            ),
            byStatus: Object.fromEntries(
              usersByStatus.map(({ _id, count }) => [_id, count]),
            ),
          },
        },
      })
    } catch (error) {
      return next(error)
    }
  },
)
router.get(
  '/colleges',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (req, res, next) => {
    try {
      const {
        status,
        search,
        page = '1',
        limit = '10',
      } = req.query

      const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1)
      const pageSize = Math.min(
        50,
        Math.max(1, Number.parseInt(limit, 10) || 10),
      )

      const filter = {}

      if (status) {
        const allowedStatuses = [
          'PENDING',
          'ACTIVE',
          'REJECTED',
          'SUSPENDED',
        ]

        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid college status filter.',
          })
        }

        filter.status = status
      }

      if (typeof search === 'string' && search.trim()) {
        const escapedSearch = search
  .trim()
  .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

        filter.$or = [
          { name: { $regex: escapedSearch, $options: 'i' } },
          { code: { $regex: escapedSearch, $options: 'i' } },
          { email: { $regex: escapedSearch, $options: 'i' } },
        ]
      }

      const [colleges, total] = await Promise.all([
        College.find(filter)
          .select(
            'name code email phone address status subscriptionPlan createdAt approvedAt',
          )
          .sort({ createdAt: -1 })
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .lean(),

        College.countDocuments(filter),
      ])

      return res.status(200).json({
        success: true,
        data: {
          colleges,
          pagination: {
            page: pageNumber,
            limit: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
          },
        },
      })
    } catch (error) {
      return next(error)
    }
  },
)

router.get(
  '/overview',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (_req, res, next) => {
    try {
      const totalColleges = await College.countDocuments()

const pendingApprovals = await College.countDocuments({
  status: 'PENDING',
})
const activeColleges = await College.countDocuments({
  status: 'ACTIVE',
})
const totalUsers = await User.countDocuments()
      return res.status(200).json({
        success: true,
        data: {
          totalColleges,
          pendingApprovals,
          activeColleges,
          totalUsers,
        },
      })
    } catch (error) {
      return next(error)
    }
  },
)


router.patch(
  '/colleges/:collegeId/decision',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (req, res, next) => {
    let session
    let firebaseUserUid
    let firebaseWasEnabled = false

    try {
      const { collegeId } = req.params
      const { decision } = req.body

      if (!mongoose.isValidObjectId(collegeId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid college ID.',
        })
      }

      if (!['APPROVE', 'REJECT'].includes(decision)) {
        return res.status(400).json({
          success: false,
          message: 'Decision must be APPROVE or REJECT.',
        })
      }

      const approved = decision === 'APPROVE'

      const pendingCollege = await College.findOne({
        _id: collegeId,
        status: 'PENDING',
      }).lean()

      if (!pendingCollege) {
        const existingCollege = await College.findById(collegeId)
          .select('status')
          .lean()

        if (!existingCollege) {
          return res.status(404).json({
            success: false,
            message: 'College not found.',
          })
        }

        return res.status(409).json({
          success: false,
          message: 'Only pending colleges can be approved or rejected.',
        })
      }

      const collegeAdmin = await User.findOne({
        collegeId: pendingCollege._id,
        role: 'COLLEGE_ADMIN',
        status: 'PENDING',
      }).select('_id firebaseUid email')

      if (!collegeAdmin) {
        return res.status(409).json({
          success: false,
          message: 'No pending College Admin account was found for this college.',
        })
      }

      firebaseUserUid = collegeAdmin.firebaseUid

      // For approval, enable Firebase before committing MongoDB changes.
      // If the database transaction fails, restore the disabled state.
      if (approved) {
        await firebaseAuth.updateUser(firebaseUserUid, {
          disabled: false,
        })

        firebaseWasEnabled = true
      }

      session = await mongoose.startSession()

      let updatedCollege
      let updatedAdmin

      await session.withTransaction(async () => {
        updatedCollege = await College.findOneAndUpdate(
          {
            _id: collegeId,
            status: 'PENDING',
          },
          {
            $set: {
              status: approved ? 'ACTIVE' : 'REJECTED',
              approvedAt: approved ? new Date() : null,
              approvedBy: approved
                ? req.campusOneUser?._id ?? null
                : null,
            },
          },
          {
            new: true,
            runValidators: true,
            session,
          },
        )

        if (!updatedCollege) {
          throw new Error('College status changed concurrently.')
        }

        updatedAdmin = await User.findOneAndUpdate(
          {
            _id: collegeAdmin._id,
            collegeId: pendingCollege._id,
            status: 'PENDING',
          },
          {
            $set: {
              status: approved ? 'ACTIVE' : 'REJECTED',
            },
          },
          {
            new: true,
            runValidators: true,
            session,
          },
        )

        if (!updatedAdmin) {
          throw new Error('College Admin status changed concurrently.')
        }
      })

      return res.status(200).json({
        success: true,
        message: approved
          ? 'College and College Admin approved successfully.'
          : 'College and College Admin rejected successfully.',
        data: {
          college: {
            id: updatedCollege._id,
            name: updatedCollege.name,
            status: updatedCollege.status,
            approvedAt: updatedCollege.approvedAt,
          },
          admin: {
            id: updatedAdmin._id,
            email: updatedAdmin.email,
            role: updatedAdmin.role,
            status: updatedAdmin.status,
          },
        },
      })
    } catch (error) {
      // If MongoDB fails after Firebase was enabled,
      // restore the Firebase account to disabled.
      if (firebaseWasEnabled && firebaseUserUid) {
  try {
    const currentAdmin = await User.findOne({
      firebaseUid: firebaseUserUid,
    })
      .select('status')
      .lean()

    await firebaseAuth.updateUser(firebaseUserUid, {
      disabled: !currentAdmin || currentAdmin.status !== 'ACTIVE',
    })
  } catch (rollbackError) {
    console.error(
      'Firebase approval rollback failed:',
      rollbackError,
    )
  }
}
      return next(error)
    } finally {
      if (session) {
        await session.endSession()
      }
    }
  },
)


router.patch(
  '/colleges/:collegeId/status',
  authenticate,
  authorizeRole('SUPER_ADMIN'),
  async (req, res, next) => {
    try {
      const { collegeId } = req.params
      const { status } = req.body

      if (!mongoose.isValidObjectId(collegeId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid college ID.',
        })
      }

      if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be ACTIVE or SUSPENDED.',
        })
      }
const allowedCurrentStatuses = ['ACTIVE', 'SUSPENDED']

if (!allowedCurrentStatuses.includes(status)) {
  return res.status(400).json({
    success: false,
    message: 'Status must be ACTIVE or SUSPENDED.',
  })
}

const previousStatus = status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'

const college = await College.findOneAndUpdate(
  {
    _id: collegeId,
    status: previousStatus,
  },
  {
    $set: {
      status,
    },
  },
  {
    new: true,
    runValidators: true,
  },
).select('_id name status updatedAt')

if (!college) {
  const existingCollege = await College.findById(collegeId)
    .select('status')
    .lean()

  if (!existingCollege) {
    return res.status(404).json({
      success: false,
      message: 'College not found.',
    })
  }

  if (!allowedCurrentStatuses.includes(existingCollege.status)) {
    return res.status(409).json({
      success: false,
      message:
        'Only active or suspended colleges can use this status action. Pending and rejected colleges must follow the review workflow.',
    })
  }

  return res.status(409).json({
    success: false,
    message: `College is already ${existingCollege.status.toLowerCase()}.`,
  })
}

      return res.status(200).json({
        success: true,
        message:
          status === 'SUSPENDED'
            ? 'College suspended successfully.'
            : 'College reactivated successfully.',
        data: {
          college: {
            id: college._id,
            name: college.name,
            previousStatus,
            status: college.status,
            updatedAt: college.updatedAt,
          },
        },
      })
    } catch (error) {
      return next(error)
    }
  },
)

export default router
