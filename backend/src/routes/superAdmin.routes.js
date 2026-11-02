
import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'
import College from '../models/college.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
const router = Router()
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

const college = await College.findOneAndUpdate(
  {
    _id: collegeId,
    status: 'PENDING',
  },
  {
    $set: {
      status: approved ? 'ACTIVE' : 'REJECTED',
      approvedAt: approved ? new Date() : null,
      approvedBy: approved ? req.campusOneUser?._id ?? null : null,
    },
  },
  {
    new: true,
    runValidators: true,
  },
).select('_id name status approvedAt')

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

  return res.status(409).json({
    success: false,
    message: 'Only pending colleges can be approved or rejected.',
  })
}

      return res.status(200).json({
        success: true,
        message:
          decision === 'APPROVE'
            ? 'College approved successfully.'
            : 'College rejected successfully.',
        data: {
          college: {
            id: college._id,
            name: college.name,
            status: college.status,
            approvedAt: college.approvedAt,
          },
        },
      })
    } catch (error) {
      return next(error)
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
