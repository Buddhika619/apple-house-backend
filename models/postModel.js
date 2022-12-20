import mongoose from "mongoose";

// This is the schema for comments, which will be embedded in the 'Post' model.
const commentSchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
  
    comment: {
        type:String,
        required: true
    },
     // The user who made the comment (referenced by their ObjectId)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// Create a new Mongoose schema for post
const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true,

    },
    title: {
        type: String,
        required: true,
    },
    numcomments: {
        type: Number,
        required: true,
        default: 0
    },
    text: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    
    comments: [commentSchema],

},{
    timestamps:true
})

// This creates posts doucment in mongodb
const Post = mongoose.model('Post', postSchema)

export default Post