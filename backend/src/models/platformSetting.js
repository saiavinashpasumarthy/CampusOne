import mongoose from 'mongoose'

const platformSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'GLOBAL',
      unique: true,
      required: true,
      immutable: true,
    },

    general: {
      platformName: {
        type: String,
        default: 'CampusOne',
        trim: true,
      },
      supportEmail: {
        type: String,
        default: null,
        trim: true,
        lowercase: true,
      },
      contactPhone: {
        type: String,
        default: null,
        trim: true,
      },
    },

    preferences: {
      timezone: {
        type: String,
        default: 'Asia/Kolkata',
        trim: true,
      },
      dateFormat: {
        type: String,
        enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
        default: 'DD/MM/YYYY',
      },
      currency: {
        type: String,
        default: 'INR',
        uppercase: true,
        trim: true,
      },
    },

    security: {
      sessionTimeout: {
        type: Number,
        default: 30,
        min: 5,
        max: 1440,
      },
      maxLoginAttempts: {
        type: Number,
        default: 5,
        min: 3,
        max: 10,
      },
    },

    notifications: {
      platformAlerts: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },

    maintenance: {
      enabled: {
        type: Boolean,
        default: false,
      },
      announcement: {
        type: String,
        default: '',
        trim: true,
        maxlength: 1000,
      },
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const PlatformSetting = mongoose.model(
  'PlatformSetting',
  platformSettingSchema,
)

export default PlatformSetting