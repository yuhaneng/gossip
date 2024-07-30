const mongoose = require("mongoose")

const Schema = mongoose.Schema

// Reply is a reply under a comment.
const ReplySchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', index: true}, // reply author
    commentId: {type: Schema.Types.ObjectId, ref: 'Comment', index: true}, // comment that the reply is under

    content: {type: String, maxLength: 255, required: true}, // comment content

    // voting statistics
    numUpvotes: {type: Number, default: 0},
    numDownvotes: {type: Number, default: 0}
}, {
    timestamps: true
})

const Reply = mongoose.model('Reply', ReplySchema)

module.exports = Reply