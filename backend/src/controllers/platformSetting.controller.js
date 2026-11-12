import PlatformSetting from '../models/platformSetting.js'
import logActivity from '../utils/logActivity.js'

const DEFAULT_SETTINGS = {
  key: 'GLOBAL',
}

export const getPlatformSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSetting.findOneAndUpdate(
      { key: 'GLOBAL' },
      { $setOnInsert: DEFAULT_SETTINGS },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).lean()

    return res.status(200).json({
      success: true,
      data: { settings },
    })
  } catch (error) {
    return next(error)
  }
}

export const updatePlatformSettings = async (req, res, next) => {
  try {
    const { general, preferences, security, notifications, maintenance } =
      req.body

    const allowedSections = {
      general: ['platformName', 'supportEmail', 'contactPhone'],
      preferences: ['timezone', 'dateFormat', 'currency'],
      security: ['sessionTimeout', 'maxLoginAttempts'],
      notifications: ['platformAlerts', 'emailNotifications'],
      maintenance: ['enabled', 'announcement'],
    }

    const updates = {}

    for (const [section, allowedFields] of Object.entries(allowedSections)) {
      const values = req.body[section]

      if (values === undefined) continue

      if (
        !values ||
        typeof values !== 'object' ||
        Array.isArray(values)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${section} settings.`,
        })
      }

      for (const field of Object.keys(values)) {
        if (!allowedFields.includes(field)) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${section} setting: ${field}.`,
          })
        }

        updates[`${section}.${field}`] = values[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid settings provided.',
      })
    }

    updates.updatedBy = req.user._id

    const settings = await PlatformSetting.findOneAndUpdate(
      { key: 'GLOBAL' },
      {
        $set: updates,
        $setOnInsert: { key: 'GLOBAL' },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    )

    await logActivity({
      req,
      action: 'PLATFORM_SETTINGS_UPDATED',
      category: 'SYSTEM',
      description: 'Platform settings were updated.',
      targetType: 'SYSTEM',
      targetId: settings._id,
      metadata: {
        updatedSections: Object.keys(req.body).filter((key) =>
          Object.hasOwn(allowedSections, key),
        ),
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Platform settings updated successfully.',
      data: { settings },
    })
  } catch (error) {
    return next(error)
  }
}