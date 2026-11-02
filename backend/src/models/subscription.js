
import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },

    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'],
      required: true,
    },

    status: {
      type: String,
      enum: [
        'PENDING',
        'TRIAL',
        'ACTIVE',
        'PAST_DUE',
        'EXPIRED',
        'CANCELLED',
      ],
      default: 'PENDING',
      required: true,
      index: true,
    },

    billingCycle: {
      type: String,
      enum: ['NONE', 'MONTHLY', 'ANNUAL'],
      default: 'NONE',
      required: true,
    },

    amount: {
      type: Number,
      min: 0,
      required: true,
    },

    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
      required: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    trialStartDate: {
      type: Date,
      default: null,
    },

    trialEndDate: {
      type: Date,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: [
        'NOT_REQUIRED',
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED',
      ],
      default: 'PENDING',
      required: true,
    },
    
paymentReference: {
  type: String,
  trim: true,
  default: null,
},

paymentVerifiedAt: {
  type: Date,
  default: null,
},

paymentVerifiedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
},

    autoRenew: {
      type: Boolean,
      default: false,
    },

    isCurrent: {
      type: Boolean,
      default: true,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// A college can have only one current subscription.
// Older subscriptions remain available as history.
subscriptionSchema.index(
  { collegeId: 1 },
  {
    unique: true,
    partialFilterExpression: { isCurrent: true },
  },
)

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription
