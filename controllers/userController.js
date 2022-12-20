import User from '../models/userModel.js'
import generateToken from '../Utils/generateToken.js'

class UserController {
 
  // @desc  Auth user & get token
  // @route POST /api/users/login
  // @access Public
  async auth(req, res) {
   
    const { email, password } = req.body
    const user = await User.findOne({ email })

     // If the user is found and the password matches, send a JSON response with the user's information and a JWT token
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  }

  // @desc  Register a new User
  // @route POST /api/users/
  // @access Public
  async register(req, res) {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

     // If a user with the provided email already exists, send a 400 response and throw an error
    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    // Create a new user with the provided name, email, and password
    const user = await User.create({
      name,
      email,
      password,
    })

     // If the user was created successfully, send a response with the user's information and a JWT token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  }

  // @desc  Get user profile
  // @route GET /api/users/profile
  // @access Private
  async getProfile(req, res) {
    const user = await User.findById(req.user._id)

     // If the user is found, send a response with the user's information
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  }


}

export default UserController
