
import mongoose from 'mongoose'
import Subscription from '../models/subscription.js'
import College from '../models/college.js'

export async function processExpiredSubscriptions() {
  const now = new Date()
  const session = await mongoose.startSession()

  const results = {
    expiredTrials: 0,
    expiredPaidSubscriptions: 0,
    freeSubscriptionsCreated: 0,
  }

  try {
    await session.withTransaction(async () => {
      const expiredSubscriptions = await Subscription.find({
        isCurrent: true,
        $or: [
          {
            status: 'TRIAL',
            trialEndDate: { $ne: null, $lte: now },
          },
          {
            status: 'ACTIVE',
            plan: { $in: ['BASIC', 'PRO', 'ENTERPRISE'] },
            endDate: { $ne: null, $lte: now },
          },
        ],
      }).session(session)

      for (const subscription of expiredSubscriptions) {
        const college = await College.findById(
          subscription.collegeId,
        ).session(session)

        if (!college) {
          continue
        }

        const wasTrial = subscription.status === 'TRIAL'

        subscription.status = 'EXPIRED'
        subscription.isCurrent = false

        await subscription.save({ session })

        await Subscription.create(
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
            },
          ],
          { session },
        )

        college.subscriptionPlan = 'FREE'
        await college.save({ session })

        if (wasTrial) {
          results.expiredTrials += 1
        } else {
          results.expiredPaidSubscriptions += 1
        }

        results.freeSubscriptionsCreated += 1
      }
    })

    return results
  } finally {
    await session.endSession()
  }
}
