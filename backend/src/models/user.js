import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
  type: String,
  required: true,
  trim: true,
},
    role: {
      type: String,
      enum: [
        'SUPER_ADMIN',
        'COLLEGE_ADMIN',
        'WARDEN',
        'STUDENT',
      ],
      required: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'],
      default: 'PENDING',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// A platform Super Admin must not belong to an individual college.
// All other roles must eventually be associated with a college.
userSchema.pre('validate', function validateTenantMembership() {
  if (this.role === 'SUPER_ADMIN' && this.collegeId != null) {
    this.invalidate(
      'collegeId',
      'A platform Super Admin cannot belong to a college.',
    )
  }

  if (this.role !== 'SUPER_ADMIN' && this.collegeId == null) {
    this.invalidate(
      'collegeId',
      'A college membership is required for this role.',
    )
  }
})

const User = mongoose.model('User', userSchema)

export default User