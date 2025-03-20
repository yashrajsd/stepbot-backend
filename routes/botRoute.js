import express from 'express'
import { GenerateResponse } from '../controllers/BotController.js'

export const BotRouter = express.Router()

BotRouter.post('/query',GenerateResponse)