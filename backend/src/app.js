
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
import superAdminRoutes from './routes/superAdmin.routes.js'
import subscriptionRoutes from './routes/subscription.routes.js'
import cookieConsentRoutes from './routes/cookieConsent.routes.js'
const app = express()

app.use(helmet())

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  }),
)

app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusOne API is running',
    timestamp: new Date().toISOString(),
  })
})
app.use('/api/auth', authRoutes)
app.use('/api/cookie-consent', cookieConsentRoutes)
app.use('/api/super-admin', superAdminRoutes)
app.use('/api/super-admin/subscriptions', subscriptionRoutes)
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  })
})

export default app
