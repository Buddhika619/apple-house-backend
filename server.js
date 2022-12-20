import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import postRoutes from './routes/postRoutes.js'
import userRoutes from './routes/userRoutes.js'
import path from 'path'

// Load environment variables from .env file
dotenv.config()

class Server {
  // Constructor function to initialize the server
  constructor() {
    this.app = express()
    this.config()
    this.routes()
    this.environment()
    this.errorHandlers()
  }

  // Function to configure the server
  config() {
    // Connect to the database
    connectDB()
    // Use Morgan for request logging
    this.app.use(morgan('dev'))
    // Use express.json to parse incoming request bodies as json
    this.app.use(express.json())
  }

  // Function to define routes for the server
  routes() {
    this.app.use('/api/posts', postRoutes)
    this.app.use('/api/users', userRoutes)
  }
  // Function to choose the environment
  environment() {
    // we cant access __dirname when working with ES modules, it only available for common js modules, so path.resolve is used to mimic the __driname
    const __dirname = path.resolve()

    // after building react application giviing the access to react build version
    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static(path.join(__dirname, '/frontend/build')))
      // Set up a route to serve the index.html file for all other routes
      this.app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
      )
    } else {
      // Set up a route to send a message when the root URL is accessed
      this.app.get('/', (req, res) => {
        res.send('api is running!')
      })
    }
  }


  // Function to define error handlers for the server
  errorHandlers() {
    // Use the notFound middleware for 404 errors
    this.app.use(notFound)
    // Use the errorHandler middleware for other errors
    this.app.use(errorHandler)
  }

  // Function to start the server
  start() {
    const PORT = process.env.PORT || 5000

    this.app.listen(
      PORT,
      console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`)
    )
  }
}

// Create a new instance of the Server class
const server = new Server()

// Start the server
server.start()
