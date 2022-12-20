import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
// Create a new Mongoose schema for a user
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

//create method on the User schema to check if an entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//function to hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  // If the password field hasn't been modified, go to the next middleware
  if (!this.isModified('password')) {
    next()
  }
  // Generate a salt for the password
  const salt = await bcrypt.genSalt(10)
  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt)
})

// This creates users doucment in mongodb
const User = mongoose.model('User', userSchema)

export default User
