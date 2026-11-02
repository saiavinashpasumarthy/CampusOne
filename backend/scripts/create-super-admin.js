
import 'dotenv/config'
import mongoose from 'mongoose'
import { getAuth } from 'firebase-admin/auth'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'
import '../src/config/firebase.js'
import User from '../src/models/user.js'

async function createSuperAdmin() {
  const uid = process.env.SUPER_ADMIN_FIREBASE_UID

  if (!uid) {
    throw new Error(
      'Set SUPER_ADMIN_FIREBASE_UID in your local backend environment first.',
    )
  }

  await connectDatabase()

  // Verify that this UID belongs to an existing Firebase account.
  const firebaseUser = await getAuth().getUser(uid)

  // Never silently promote an existing CampusOne user.
  const existingUser = await User.findOne({ firebaseUid: uid })

  if (existingUser) {
    throw new Error(
      'A CampusOne user already exists for this UID. No changes were made.',
    )
  }

  const user = await User.create({
    firebaseUid: firebaseUser.uid,
    email: firebaseUser.email,
    role: 'SUPER_ADMIN',
    collegeId: null,
    status: 'ACTIVE',
  })

  console.log('Super Admin provisioned successfully.')
  console.log(`Role: ${user.role}`)
  console.log(`Email: ${user.email}`)
}

try {
  await createSuperAdmin()
} catch (error) {
  console.error('Super Admin provisioning failed:', error.message)
  process.exitCode = 1
} finally {
  if (mongoose.connection.readyState !== 0) {
    await disconnectDatabase().catch((error) => {
      console.error('Database disconnect failed:', error.message)
      process.exitCode = 1
    })
  }
}
