import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// Middleware function to handle JWT authentication and authorization
const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check if the authorization header starts with 'Bearer' and extract the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      // Verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find the user by their ID and exclude the password field
      req.user = await User.findById(decoded.id).select('-password')

      // Call the next middleware or route
      next()
    } catch (error) {
      // If the token is invalid or has expired, throw an error
      console.error(error)
      res.status(401)
      throw new Error('Not Authorized, token failed')
    }
  }

  // If no token is provided,  throw an error
  if (!token) {
    res.status(401)
    throw new Error('Not Authorized, no token')
  }
})

// Middleware function to handle admin authorization
const admin = (req, res, next) => {
  // Check if the user is an admin
  if (req.user && req.user.isAdmin) {
    // If the user is an admin, call the next middleware or route
    next()
  } else {
    res.status(401)
    throw new Error('Not Authorized as an admin')
  }
}

export { protect, admin }
