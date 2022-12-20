import Post from '../models/postModel.js'

class PostController {
  // @des  Fetch all approved posts
  // @route GET /api/posts
  // @access private
  async getApprovedposts(req, res) {
    let posts
    // Check if a keyword was provided in the query string
    if (req.query.keyword) {
      // If a keyword was provided, search for posts that match it in the userName, title, or text fields
      posts = await Post.find({
        $or: [
          { userName: { $regex: req.query.keyword, $options: 'i' } },
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { text: { $regex: req.query.keyword, $options: 'i' } },
        ],
        status: 'approved',
      })
    } else {
      // If no keyword was provided, retrieve all approved posts sorted by creation date
      posts = await Post.find({ status: 'approved' }).sort({ createdAt: -1 })
    }

    res.status(200).json(posts)
  }

  // @des  Fetch  single post
  // @route GET /api/posts/:id
  // @access private/admin
  async getpostById(req, res) {
    const post = await Post.findById(req.params.id)

    // If the post is not found, return a 404 error
    if (!post) {
      res.status(404)
      throw new Error('post not found!')
    }

    // Check if the post is approved or if the requesting user is the owner or an admin
    if (
      post.status !== 'approved' &&
      post.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(401)
      throw new Error('Not authorized!')
    }

    res.status(200).json(post)
  }

  // @des user's posts
  // @route DELETE /api/posts/user
  // @access private
  async userPosts(req, res) {
    const posts = await Post.find({ user: req.user._id })
    res.status(200).json(posts)
  }

  // @des  Delete a post user
  // @route DELETE /api/posts/:id
  // @access private/admin
  async deletepost(req, res) {
    const post = await Post.findById(req.params.id)

    // If the post is not found, return a 404 error
    if (!post) {
      res.status(404)
      throw new Error('post not found!')
    }

    // Check if the requesting user is the owner or an admin
    if (post.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401)
      throw new Error('Not authorized!')
    }

    // If the user is the owner or an admin, delete the post
    await post.remove()
    res.status(200).json('post removed')
  }

  // @des  create a post
  // @route POST /api/posts/
  // @access Private
  async createpost(req, res) {
    // Create a new Post object with the data from the request body
    let post = new Post({
      title: req.body.title,
      text: req.body.text,
      user: req.user._id,
      userName: req.user.name,
    })
    // If the user is an admin, set the status to "approved"
    if (req.user.isAdmin) {
      post.status = 'approved'
    }

    // Save the Post object to the database
    const createpost = await post.save()
    res.status(201).json(createpost)
  }

  // @des  Update post status
  // @route PUT /api/posts/:id
  // @access Private/admin
  async updatepost(req, res) {
    const post = await Post.findById(req.params.id)
    //create a object to check status
    const statusObj = {
      approved: 'approved',
      rejected: 'rejected',
    }

    if (post) {
      //if param status is in statusObj then update the post
      if (statusObj[req.query.status]) {
        post.status = req.query.status
        const updatedpost = await post.save()
        res.status(201).json(updatedpost)
      } else {
        res.status(404)
        throw new Error('Invalid status')
      }
    } else {
      res.status(404)
      throw new Error('post not found')
    }
  }

  // @des  admin feedback
  // @route POST /api/posts/:id/feedback
  // @access Private/admin
  async adminFeedback(req, res) {
    const post = await Post.findById(req.params.id)
    // if is there is a post create a comment object
    if (post) {
      const comment = {
        name: req.user.name,
        comment: req.body.feedback,
        user: req.user._id,
      }

      // Add the new comment to the post's comments array
      post.comments.push(comment)
      //increase the comment count
      post.numcomments = post.comments.length

      // Save the updated post
      await post.save()

      res.status(201).json('comment added')
    } else {
      res.status(404)
      throw new Error('post not found')
    }
  }

  // @des  Create new comment
  // @route POST /api/posts/:id/comments
  // @access Private
  async createpostcomment(req, res) {
    const post = await Post.findById(req.params.id)

    // Check if the user is the owner of the post or an admin or a appoved post
    if (
      post.status !== 'approved' &&
      post.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(401)
      throw new Error('Not authorized!')
    }

    if (post) {
      // Create a new comment object
      const comment = {
        name: req.user.name,
        comment: req.body.comment,
        user: req.user._id,
      }

      // Add the new comment to the post's comments array
      post.comments.push(comment)
      //increase the comment count
      post.numcomments = post.comments.length

      // Save the updated post
      await post.save()

      res.status(201).json('comment added')
    } else {
      res.status(404)
      throw new Error('post not found')
    }
  }

  // @des  Get all post and filter
  // @route POST /api/posts/filter
  // @access Private/admin
  async getsortedposts(req, res) {
    // Retrieve the filter query parameter
    const filter = req.query.filter
    let posts

    switch (filter) {
      // If the filter is 'user', sort the posts by user name in descending order
      case 'user':
        posts = await Post.find({}).sort({ userName: -1 })
        break
      default:
        // If no filter is specified updatedAt in descending order
        posts = await Post.find({}).sort({ updatedAt: -1 })
        break
    }

    res.status(200).json(posts)
  }
}

export default PostController
