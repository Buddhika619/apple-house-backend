import jwt from 'jsonwebtoken'

// Function to generate a JSON web token
const generateToken = (id) => {
    // Create the token using the user's id and the JWT_SECRET as the secret
    // Set the token to expire in 30 days
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }

export default generateToken

