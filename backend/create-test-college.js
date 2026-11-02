
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDatabase } from './src/config/database.js'
import College from './src/models/college.js'

async function main() {
  await connectDatabase()

  const existing = await College.findOne({
    code: 'TEST-CAMPUS-001',
  })

  if (existing) {
    console.log('Test college already exists:', existing.name)
    console.log('Status:', existing.status)
    return
  }

  const college = await College.create({
    name: 'CampusOne Test College',
    code: 'TEST-CAMPUS-001',
    email: 'campusone-test@example.com',
    status: 'PENDING',
  })

  console.log('Test college created:', college.name)
  console.log('Status:', college.status)
}

try {
  await main()
} catch (error) {
  console.error('Failed to create test college:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
