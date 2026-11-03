
import mongoose from 'mongoose'

const cookieConsentSchema = new mongoose.Schema(
  {
    consentId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    essential: {
      type: Boolean,
      default: true,
      required: true,
    },

    functional: {
      type: Boolean,
      default: false,
      required: true,
    },

    analytics: {
      type: Boolean,
      default: false,
      required: true,
    },

    marketing: {
      type: Boolean,
      default: false,
      required: true,
    },

    policyVersion: {
      type: String,
      required: true,
      trim: true,
    },

    consentedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    withdrawnAt: {
      type: Date,
      default: null,
    },

    source: {
      type: String,
      enum: ['BANNER', 'SETTINGS'],
      default: 'BANNER',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

cookieConsentSchema.index({ userId: 1, updatedAt: -1 })

const CookieConsent = mongoose.model(
  'CookieConsent',
  cookieConsentSchema,
)

export default CookieConsent
