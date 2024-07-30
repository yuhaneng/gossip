const mongoose = require("mongoose")

const Schema = mongoose.Schema

// Comment is a comment under a forum post.
const CommentSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', index: true}, // comment author
    postId: {type: Schema.Types.ObjectId, ref: 'Post', index: true}, // post that the comment is under

    content: {type: String, maxLength: 255, required: true}, // comment content

    // voting statistics
    numUpvotes: {type: Number, default: 0},
    numDownvotes: {type: Number, default: 0}
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment