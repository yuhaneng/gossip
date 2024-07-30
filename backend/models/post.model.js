const mongoose = require("mongoose")

const Schema = mongoose.Schema

// Post is a forum post.
const PostSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', index: true}, // post author

    // post data
    title: {type: String, maxLength: 255, required: true},
    content: {type: String, maxLength: 50000, required: true},
    tags: {type: [String], index: true, validate: {validator: validateTags}},

    // voting statistics
    numUpvotes: {type: Number, default: 0},
    numDownvotes: {type: Number, default: 0}
}, {
    timestamps: true
})

// Validator function for tags, checks uniqueness and regex.
function validateTags(tags) {
    return isUnique(tags) && !tags.reduce((x, y) => x && y.match('/^[0-9a-z]{1,10}$/'))
}

// Returns whether an array of strings are all unique.
function isUnique(tags) {
    var set = Object.create(null)
    for (var tag of tags) {
        if (tag in set) {
            return false
        }
        set[tag] = true
    }

    return true
}

const Post = mongoose.model('Post', PostSchema)

module.exports = Post