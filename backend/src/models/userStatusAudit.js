
import mongoose from 'mongoose'

const userStatusAuditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    previousStatus: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      required: true,
    },

    newStatus: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

userStatusAuditSchema.index({ userId: 1, createdAt: -1 })

const UserStatusAudit = mongoose.model(
  'UserStatusAudit',
  userStatusAuditSchema,
)

export default UserStatusAudit
