import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    category: {
      type: String,
      enum: [
        'AUTHENTICATION',
        'USER_MANAGEMENT',
        'COLLEGE_MANAGEMENT',
        'SUBSCRIPTION',
        'SYSTEM',
        'SECURITY',
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },

    actorRole: {
      type: String,
      required: true,
      immutable: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      default: null,
      immutable: true,
    },

    targetType: {
      type: String,
      trim: true,
      default: null,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },

    userAgent: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
)

activityLogSchema.index({ createdAt: -1 })
activityLogSchema.index({ category: 1, createdAt: -1 })
activityLogSchema.index({ performedBy: 1, createdAt: -1 })
activityLogSchema.index({ collegeId: 1, createdAt: -1 })

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)

export default ActivityLog