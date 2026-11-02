
import { Router } from 'express'
import mongoose from 'mongoose'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'
import Subscription from '../models/subscription.js'
import College from '../models/college.js'
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_TRIAL_DAYS } from '../config/subscriptionPlans.js'

const router = Router()

router.use(authenticate, authorizeRole('SUPER_ADMIN'))

router.get('/plans', (_req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      plans: SUBSCRIPTION_PLANS,
      trialDurationDays: SUBSCRIPTION_TRIAL_DAYS,
    },
  })
})


router.get('/overview', async (req, res) => {
  try {
    const [
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      expiredSubscriptions,
      pendingSubscriptions,
      pastDueSubscriptions,
      cancelledSubscriptions,
      revenueResult,
    ] = await Promise.all([
      Subscription.countDocuments({ isCurrent: true }),

      Subscription.countDocuments({
        isCurrent: true,
        status: 'ACTIVE',
      }),

      Subscription.countDocuments({
        isCurrent: true,
        status: 'TRIAL',
      }),

      // Include historical expired subscriptions too.
      Subscription.countDocuments({
        status: 'EXPIRED',
      }),

      Subscription.countDocuments({
        isCurrent: true,
        status: 'PENDING',
      }),

      Subscription.countDocuments({
        isCurrent: true,
        status: 'PAST_DUE',
      }),

      // Include historical cancelled subscriptions too.
      Subscription.countDocuments({
        status: 'CANCELLED',
      }),

      Subscription.aggregate([
        {
          $match: {
            isCurrent: true,
            status: 'ACTIVE',
            paymentStatus: 'PAID',
            plan: { $in: ['BASIC', 'PRO', 'ENTERPRISE'] },
          },
        },
        {
          $group: {
            _id: null,
            monthlyRevenue: {
              $sum: {
                $cond: [
                  { $eq: ['$billingCycle', 'MONTHLY'] },
                  '$amount',
                  0,
                ],
              },
            },
            annualRevenue: {
              $sum: {
                $cond: [
                  { $eq: ['$billingCycle', 'ANNUAL'] },
                  '$amount',
                  0,
                ],
              },
            },
          },
        },
      ]),
    ])

    const revenue = revenueResult[0] || {
      monthlyRevenue: 0,
      annualRevenue: 0,
    }

    const monthlyRecurringRevenue =
      revenue.monthlyRevenue + revenue.annualRevenue / 12

    return res.status(200).json({
      success: true,
      data: {
        totalSubscriptions,
        activeSubscriptions,
        trialSubscriptions,
        expiredSubscriptions,
        pendingSubscriptions,
        pastDueSubscriptions,
        cancelledSubscriptions,
        monthlyRecurringRevenue,
        currency: 'INR',
      },
    })
  } catch (error) {
    console.error('Subscription overview error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription overview.',
    })
  }
})



router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      plan,
      status,
      billingCycle,
      scope = 'current',
      page = '1',
      limit = '10',
    } = req.query

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1)
    const pageSize = Math.min(
      50,
      Math.max(1, Number.parseInt(limit, 10) || 10),
    )

    const allowedScopes = ['current', 'history', 'all']
    const allowedPlans = ['FREE', 'BASIC', 'PRO', 'ENTERPRISE']
    const allowedStatuses = [
      'PENDING',
      'TRIAL',
      'ACTIVE',
      'PAST_DUE',
      'EXPIRED',
      'CANCELLED',
    ]
    const allowedBillingCycles = ['NONE', 'MONTHLY', 'ANNUAL']

    if (!allowedScopes.includes(scope)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription scope. Use current, history, or all.',
      })
    }

    const filter = {}

    if (scope === 'current') {
      filter.isCurrent = true
    } else if (scope === 'history') {
      filter.status = { $in: ['EXPIRED', 'CANCELLED'] }
    }

    if (plan) {
      if (!allowedPlans.includes(plan)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription plan filter.',
        })
      }

      filter.plan = plan
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription status filter.',
        })
      }

      if (scope === 'history' && !['EXPIRED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'History scope only supports EXPIRED and CANCELLED statuses.',
        })
      }

      filter.status = status
    }

    if (billingCycle) {
      if (!allowedBillingCycles.includes(billingCycle)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid billing cycle filter.',
        })
      }

      filter.billingCycle = billingCycle
    }

    const collegeFilter = {}

    if (typeof search === 'string' && search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      collegeFilter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { code: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
      ]
    }

    if (Object.keys(collegeFilter).length > 0) {
      const matchingColleges = await College.find(collegeFilter)
        .select('_id')
        .lean()

      const collegeIds = matchingColleges.map((college) => college._id)

      filter.collegeId = { $in: collegeIds }
    }

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate('collegeId', 'name code email status')
        .populate('createdBy', 'email role')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Subscription.countDocuments(filter),
    ])

    return res.status(200).json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
        scope,
      },
    })
  } catch (error) {
    return next(error)
  }
})


router.post('/', async (req, res, next) => {
  const {
    collegeId,
    plan,
    billingCycle,
    startTrial = false,
  } = req.body

  const allowedPlans = ['FREE', 'BASIC', 'PRO', 'ENTERPRISE']
  const allowedCycles = ['NONE', 'MONTHLY', 'ANNUAL']

  if (!mongoose.isValidObjectId(collegeId)) {
    return res.status(400).json({
      success: false,
      message: 'A valid college ID is required.',
    })
  }

  if (!allowedPlans.includes(plan)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription plan.',
    })
  }

  if (!allowedCycles.includes(billingCycle)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid billing cycle.',
    })
  }

  if (typeof startTrial !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'startTrial must be a boolean.',
    })
  }

  if (
    (plan === 'FREE' && billingCycle !== 'NONE') ||
    (plan !== 'FREE' && !['MONTHLY', 'ANNUAL'].includes(billingCycle)) ||
    (plan === 'FREE' && startTrial)
  ) {
    return res.status(400).json({
      success: false,
      message: 'The selected plan and billing cycle are incompatible.',
    })
  }

  const college = await College.findById(collegeId)

  if (!college) {
    return res.status(404).json({
      success: false,
      message: 'College not found.',
    })
  }

  const existingSubscription = await Subscription.findOne({
    collegeId,
    isCurrent: true,
  })

  if (existingSubscription) {
    return res.status(409).json({
      success: false,
      message: 'This college already has a current subscription.',
    })
  }

  const planConfig = SUBSCRIPTION_PLANS[plan]
  const amount =
    billingCycle === 'ANNUAL'
      ? planConfig.annualPrice
      : billingCycle === 'MONTHLY'
        ? planConfig.monthlyPrice
        : 0

  if (startTrial && !planConfig.trialEligible) {
    return res.status(400).json({
      success: false,
      message: 'This plan is not eligible for a free trial.',
    })
  }

  try {
    const session = await mongoose.startSession()
    let createdSubscription

    try {
      await session.withTransaction(async () => {
        const usedTrial = startTrial
          ? await Subscription.exists({
              collegeId,
              trialStartDate: { $ne: null },
            }).session(session)
          : null

        if (usedTrial) {
          throw new Error('TRIAL_ALREADY_USED')
        }

        const now = new Date()
        const trialEndDate = startTrial
          ? new Date(
              now.getTime() +
                SUBSCRIPTION_TRIAL_DAYS * 24 * 60 * 60 * 1000,
            )
          : null

        const subscriptionData = {
          collegeId,
          plan,
          status: startTrial
            ? 'TRIAL'
            : plan === 'FREE'
              ? 'ACTIVE'
              : 'PENDING',
          billingCycle,
          amount,
          currency: planConfig.currency,
          startDate: now,
          endDate: trialEndDate,
          trialStartDate: startTrial ? now : null,
          trialEndDate,
          paymentStatus: startTrial
            ? 'NOT_REQUIRED'
            : plan === 'FREE'
              ? 'NOT_REQUIRED'
              : 'PENDING',
          autoRenew: false,
          isCurrent: true,
          createdBy: req.user._id,
        }

        const [subscription] = await Subscription.create(
          [subscriptionData],
          { session },
        )

        await College.updateOne(
          { _id: collegeId },
          { $set: { subscriptionPlan: plan } },
          { session },
        )

        createdSubscription = subscription
      })
    } finally {
      await session.endSession()
    }

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully.',
      data: {
        subscription: createdSubscription,
      },
    })
  } catch (error) {
    if (error.message === 'TRIAL_ALREADY_USED') {
      return res.status(409).json({
        success: false,
        message: 'This college has already used its free trial.',
      })
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This college already has a current subscription.',
      })
    }

    return next(error)
  }
})

router.patch('/:subscriptionId/verify-payment', async (req, res, next) => {
  const { subscriptionId } = req.params
  const { paymentReference } = req.body

  if (!mongoose.isValidObjectId(subscriptionId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription ID.',
    })
  }

  if (
    typeof paymentReference !== 'string' ||
    !paymentReference.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: 'Payment reference is required.',
    })
  }

  try {
    const session = await mongoose.startSession()
    let updatedSubscription = null

    try {
      await session.withTransaction(async () => {
        const subscription = await Subscription.findOne({
          _id: subscriptionId,
          isCurrent: true,
        }).session(session)

        if (!subscription) {
          const error = new Error('SUBSCRIPTION_NOT_FOUND')
          throw error
        }

        if (
          !['BASIC', 'PRO', 'ENTERPRISE'].includes(subscription.plan)
        ) {
          throw new Error('PAYMENT_NOT_REQUIRED')
        }

        if (
          subscription.status !== 'PENDING' ||
          subscription.paymentStatus !== 'PENDING'
        ) {
          throw new Error('SUBSCRIPTION_NOT_PENDING')
        }

        const now = new Date()

        subscription.status = 'ACTIVE'
        subscription.paymentStatus = 'PAID'
        subscription.startDate = now
        subscription.endDate =
          subscription.billingCycle === 'ANNUAL'
            ? new Date(
                now.getFullYear() + 1,
                now.getMonth(),
                now.getDate(),
              )
            : new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate(),
              )

        subscription.autoRenew = false

        // Store the manually verified payment reference.
        subscription.paymentReference = paymentReference.trim()
        subscription.paymentVerifiedAt = now
        subscription.paymentVerifiedBy = req.user._id

        await subscription.save({ session })

        updatedSubscription = subscription
      })
    } finally {
      await session.endSession()
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated.',
      data: {
        subscription: updatedSubscription,
      },
    })
  } catch (error) {
    const errors = {
      SUBSCRIPTION_NOT_FOUND: [404, 'Current subscription not found.'],
      PAYMENT_NOT_REQUIRED: [400, 'Payment verification is not applicable to this plan.'],
      SUBSCRIPTION_NOT_PENDING: [409, 'Subscription is not awaiting payment verification.'],
    }

    if (errors[error.message]) {
      const [statusCode, message] = errors[error.message]

      return res.status(statusCode).json({
        success: false,
        message,
      })
    }

    return next(error)
  }
})

router.patch('/:subscriptionId/cancel', async (req, res, next) => {
  const { subscriptionId } = req.params
  const { cancellationReason } = req.body

  if (!mongoose.isValidObjectId(subscriptionId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription ID.',
    })
  }

  if (
    typeof cancellationReason !== 'string' ||
    !cancellationReason.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: 'A cancellation reason is required.',
    })
  }

  if (cancellationReason.trim().length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Cancellation reason cannot exceed 500 characters.',
    })
  }

  try {
    const session = await mongoose.startSession()
    let cancelledSubscription = null
    let freeSubscription = null

    try {
      await session.withTransaction(async () => {
        const subscription = await Subscription.findOne({
          _id: subscriptionId,
          isCurrent: true,
        }).session(session)

        if (!subscription) {
          throw new Error('SUBSCRIPTION_NOT_FOUND')
        }

        if (subscription.plan === 'FREE') {
          throw new Error('FREE_PLAN_CANNOT_BE_CANCELLED')
        }

        if (
          ['CANCELLED', 'EXPIRED'].includes(subscription.status)
        ) {
          throw new Error('SUBSCRIPTION_NOT_CANCELLABLE')
        }

        const college = await College.findById(
          subscription.collegeId,
        ).session(session)

        if (!college) {
          throw new Error('COLLEGE_NOT_FOUND')
        }

        const now = new Date()

        subscription.status = 'CANCELLED'
        subscription.isCurrent = false
        subscription.cancelledAt = now
        subscription.cancellationReason =
          cancellationReason.trim()
        subscription.autoRenew = false

        await subscription.save({ session })

        const [newFreeSubscription] = await Subscription.create(
          [
            {
              collegeId: subscription.collegeId,
              plan: 'FREE',
              status: 'ACTIVE',
              billingCycle: 'NONE',
              amount: 0,
              currency: 'INR',
              startDate: now,
              paymentStatus: 'NOT_REQUIRED',
              autoRenew: false,
              isCurrent: true,
              createdBy: req.user._id,
            },
          ],
          { session },
        )

        college.subscriptionPlan = 'FREE'
        await college.save({ session })

        cancelledSubscription = subscription
        freeSubscription = newFreeSubscription
      })
    } finally {
      await session.endSession()
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription cancelled. College moved to the FREE plan.',
      data: {
        cancelledSubscription,
        freeSubscription,
      },
    })
  } catch (error) {
    const errors = {
      SUBSCRIPTION_NOT_FOUND: [
        404,
        'Current subscription not found.',
      ],
      FREE_PLAN_CANNOT_BE_CANCELLED: [
        400,
        'The FREE plan cannot be cancelled.',
      ],
      SUBSCRIPTION_NOT_CANCELLABLE: [
        409,
        'This subscription cannot be cancelled.',
      ],
      COLLEGE_NOT_FOUND: [
        404,
        'Associated college not found.',
      ],
    }

    if (errors[error.message]) {
      const [statusCode, message] = errors[error.message]

      return res.status(statusCode).json({
        success: false,
        message,
      })
    }

    return next(error)
  }
})


router.post('/:subscriptionId/renew', async (req, res, next) => {
  const { subscriptionId } = req.params
  const { plan, billingCycle } = req.body

  if (!mongoose.isValidObjectId(subscriptionId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription ID.',
    })
  }

  const allowedPlans = ['BASIC', 'PRO', 'ENTERPRISE']
  const allowedCycles = ['MONTHLY', 'ANNUAL']

  if (!allowedPlans.includes(plan)) {
    return res.status(400).json({
      success: false,
      message: 'A valid paid subscription plan is required.',
    })
  }

  if (!allowedCycles.includes(billingCycle)) {
    return res.status(400).json({
      success: false,
      message: 'Billing cycle must be MONTHLY or ANNUAL.',
    })
  }

  try {
    const session = await mongoose.startSession()
    let renewedSubscription = null

    try {
      await session.withTransaction(async () => {
        const expiredSubscription = await Subscription.findOne({
          _id: subscriptionId,
          status: 'EXPIRED',
        }).session(session)

        if (!expiredSubscription) {
          throw new Error('EXPIRED_SUBSCRIPTION_NOT_FOUND')
        }

        const college = await College.findById(
          expiredSubscription.collegeId,
        ).session(session)

        if (!college) {
          throw new Error('COLLEGE_NOT_FOUND')
        }

        const currentSubscription = await Subscription.findOne({
          collegeId: expiredSubscription.collegeId,
          isCurrent: true,
        }).session(session)

        if (
          currentSubscription &&
          currentSubscription.plan !== 'FREE'
        ) {
          throw new Error('CURRENT_SUBSCRIPTION_EXISTS')
        }

        if (
          !currentSubscription &&
          expiredSubscription.isCurrent !== true
        ) {
          throw new Error('CURRENT_SUBSCRIPTION_NOT_FOUND')
        }

        const planConfig = SUBSCRIPTION_PLANS[plan]

        const amount =
          billingCycle === 'ANNUAL'
            ? planConfig.annualPrice
            : planConfig.monthlyPrice

        // Preserve the expired subscription as historical data.
        if (expiredSubscription.isCurrent) {
          expiredSubscription.isCurrent = false
          await expiredSubscription.save({ session })
        }

        // Retire the current FREE subscription before creating the renewal.
        if (currentSubscription) {
          currentSubscription.isCurrent = false
          await currentSubscription.save({ session })
        }

        const [subscription] = await Subscription.create(
          [
            {
              collegeId: expiredSubscription.collegeId,
              plan,
              status: 'PENDING',
              billingCycle,
              amount,
              currency: planConfig.currency,
              startDate: null,
              endDate: null,
              paymentStatus: 'PENDING',
              autoRenew: false,
              isCurrent: true,
              createdBy: req.user._id,
            },
          ],
          { session },
        )

        college.subscriptionPlan = plan
        await college.save({ session })

        renewedSubscription = subscription
      })
    } finally {
      await session.endSession()
    }

    return res.status(201).json({
      success: true,
      message: 'Renewal created successfully. Payment verification is pending.',
      data: {
        subscription: renewedSubscription,
      },
    })
  } catch (error) {
    const errors = {
      EXPIRED_SUBSCRIPTION_NOT_FOUND: [
        404,
        'Expired subscription not found.',
      ],
      COLLEGE_NOT_FOUND: [
        404,
        'Associated college not found.',
      ],
      CURRENT_SUBSCRIPTION_EXISTS: [
        409,
        'The college already has a paid current subscription.',
      ],
      CURRENT_SUBSCRIPTION_NOT_FOUND: [
        409,
        'No eligible current subscription was found for renewal.',
      ],
    }

    if (errors[error.message]) {
      const [statusCode, message] = errors[error.message]

      return res.status(statusCode).json({
        success: false,
        message,
      })
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This college already has a current subscription.',
      })
    }

    return next(error)
  }
})


export default router
