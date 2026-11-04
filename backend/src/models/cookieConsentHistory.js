
import mongoose from 'mongoose'

const cookieConsentHistorySchema = new mongoose.Schema(
  {
    consentId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    essential: {
      type: Boolean,
      required: true,
      default: true,
    },

    functional: {
      type: Boolean,
      required: true,
      default: false,
    },

    analytics: {
      type: Boolean,
      required: true,
      default: false,
    },

    marketing: {
      type: Boolean,
      required: true,
      default: false,
    },

    policyVersion: {
      type: String,
      required: true,
      trim: true,
    },

    action: {
      type: String,
      enum: ['GIVEN', 'UPDATED', 'WITHDRAWN'],
      required: true,
    },

    source: {
      type: String,
      enum: ['BANNER', 'SETTINGS'],
      required: true,
    },

    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
  },
)

cookieConsentHistorySchema.index({
  consentId: 1,
  recordedAt: -1,
})

cookieConsentHistorySchema.index({
  userId: 1,
  recordedAt: -1,
})

const CookieConsentHistory = mongoose.model(
  'CookieConsentHistory',
  cookieConsentHistorySchema,
)

export default CookieConsentHistory
