
import 'dotenv/config'
import app from './app.js'
import {
  connectDatabase,
  disconnectDatabase,
} from './config/database.js'
import cron from 'node-cron'
import { processExpiredSubscriptions } from './services/subscriptionExpiry.service.js'
const PORT = Number(process.env.PORT) || 5000

let server

async function startServer() {
  try {
    await connectDatabase()
    const results = await processExpiredSubscriptions()
console.log('Startup subscription expiry check completed:', results)
    cron.schedule(
  '5 0 * * *',
  async () => {
    try {
      const results = await processExpiredSubscriptions()
      console.log('Subscription expiry check completed:', results)
    } catch (error) {
      console.error('Subscription expiry check failed:', error)
    }
  },
  {
    timezone: 'Asia/Kolkata',
  },
)

    server = app.listen(PORT, () => {
      console.log(`CampusOne API running at http://localhost:${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('Failed to start CampusOne:', error.message)
    process.exitCode = 1
  }
}

async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down CampusOne...`)

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error)
          else resolve()
        })
      })
    }

    await disconnectDatabase()
    process.exitCode = 0
  } catch (error) {
    console.error('Shutdown error:', error.message)
    process.exitCode = 1
  }
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))

await startServer()
