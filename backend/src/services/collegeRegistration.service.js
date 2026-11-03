
import mongoose from 'mongoose'
import { firebaseAuth } from '../config/firebase.js'
import College from '../models/college.js'
import User from '../models/user.js'

function generateCollegeCode(collegeName) {
  const prefix = collegeName
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6) || 'CAMPUS'

  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()

  return `${prefix}-${suffix}`
}

export async function registerCollege({
  collegeName,
  ownerName,
  email,
  phone,
  password,
}) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedCollegeName = collegeName.trim()

  const existingUser = await User.findOne({ email: normalizedEmail }).lean()

  if (existingUser) {
    const error = new Error('An account with this email already exists.')
    error.statusCode = 409
    throw error
  }

  const existingCollege = await College.findOne({
    name: {
      $regex: `^${normalizedCollegeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      $options: 'i',
    },
  }).lean()

  if (existingCollege) {
    const error = new Error('This college is already registered.')
    error.statusCode = 409
    throw error
  }

  let firebaseUser = null
  let mongoSession = null

  try {
    firebaseUser = await firebaseAuth.createUser({
      email: normalizedEmail,
      password,
      displayName: ownerName.trim(),
      disabled: true,
    })

    mongoSession = await mongoose.startSession()

    await mongoSession.withTransaction(async () => {
      const collegeCode = generateCollegeCode(normalizedCollegeName)

      const [college] = await College.create(
        [
          {
            name: normalizedCollegeName,
            code: collegeCode,
            email: normalizedEmail,
            phone: phone.trim(),
            status: 'PENDING',
            subscriptionPlan: 'FREE',
          },
        ],
        { session: mongoSession },
      )

      await User.create(
        [
          {
            firebaseUid: firebaseUser.uid,
            name: ownerName.trim(),
            email: normalizedEmail,
            role: 'COLLEGE_ADMIN',
            collegeId: college._id,
            status: 'PENDING',
          },
        ],
        { session: mongoSession },
      )
    })

    return {
      message: 'College registration submitted successfully. Your application is awaiting Super Admin approval.',
    }
  } catch (error) {
    if (firebaseUser) {
      try {
        await firebaseAuth.deleteUser(firebaseUser.uid)
      } catch (cleanupError) {
        console.error('Firebase registration cleanup failed:', cleanupError)
      }
    }

    throw error
  } finally {
    if (mongoSession) {
      await mongoSession.endSession()
    }
  }
}
