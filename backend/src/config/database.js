
import mongoose from 'mongoose'
import dotenv from 'dotenv/config'
export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing from the backend environment.')
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })

  console.log('CampusOne database connected successfully.')
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
  console.log('CampusOne database disconnected.')
}
