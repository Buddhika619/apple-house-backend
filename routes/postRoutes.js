import express from 'express'
import PostController from '../controllers/postController.js'
import asyncHandler from 'express-async-handler'
import { protect, admin } from '../middleware/authMiddleware.js'

// Create a new Express router
const router = express.Router()

// Create a new instance of the PostController
const postController = new PostController()

// get all approved posts
router.get('/', protect, asyncHandler(postController.getApprovedposts))
// get all posts created by the logged in user
router.get('/userpost', protect, asyncHandler(postController.userPosts))
// get all posts sorted by a specific field
router.get('/filter', protect,admin , asyncHandler(postController.getsortedposts))
// get a specific post by its ID
router.get('/:id', protect, asyncHandler(postController.getpostById))

// create a new post
router.post('/', protect, asyncHandler(postController.createpost))
// create a feedback comment on a post
router.post('/:id/feedback', protect,admin, asyncHandler(postController.adminFeedback))
// create a new comment on a post
router.post('/:id/comment', protect, asyncHandler(postController.createpostcomment))
// delete a post
router.delete('/:id', protect, asyncHandler(postController.deletepost))
//update a post
router.put('/:id', protect,admin, asyncHandler(postController.updatepost))

export default router

//async handler catch errors and past it to the customer error handler