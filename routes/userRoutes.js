import express from 'express'
import UserController from '../controllers/userController.js'
import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/authMiddleware.js'

// Create a new Express router
const router = express.Router()
// Create a new instance of the UserController
const userController = new UserController()

// register a new user
router.post('/', asyncHandler(userController.register))
// POST request to authenticate a user
router.post('/login', asyncHandler(userController.auth))
// GET request to get the logged in user's profile
router.get('/userinfo', protect, asyncHandler(userController.getProfile))

export default router

//async handler catch errors and past it to the customer error handler