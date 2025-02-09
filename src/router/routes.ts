import express, { Router } from 'express'
import userRoutes from './userRoutes/userRoutes.ts'

const router: Router = express.Router()

userRoutes({ router })

export default router
