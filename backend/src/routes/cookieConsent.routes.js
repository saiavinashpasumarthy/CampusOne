import { Router } from 'express'
import {
  getCookieConsent,
  saveCookieConsent,
  withdrawCookieConsent,
} from '../controllers/cookieConsent.controller.js'
import { optionalAuthenticate } from '../middleware/optionalAuthenticate.js'

const router = Router()

router.use(optionalAuthenticate)

router.get('/', getCookieConsent)

router.post('/', saveCookieConsent)

router.post('/withdraw', withdrawCookieConsent)

export default router