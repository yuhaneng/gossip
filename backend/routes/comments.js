const router = require("express").Router()
const { auth } = require("../middleware/auth")
const { vote, getVote } = require("./utils")
let Comment = require("../models/comment.model")
const User = require("../models/user.model")

router.get('/', auth({strict: false}), (req, res) => {
    const userId = req.user?.id
    const sort = req.query.sort
    const page = req.query.page
    const perPage = 20

    const postId = req.query.post
    const profileId = req.query.user

    let where = {}
    if (profileId) {
        where.userId =  profileId
    } else if (postId) {
        where.postId = postId
    }

    Comment.find(where)
        .sort(sort === "rating" ? {num_upvotes: 1} : {createdAt: -1})
        .limit(page * perPage)
        .then((comments) => Promise.all(comments.map((comment) => commentData(comment, userId))))
        .then((datas) => res.json(datas))
        .catch(() => res.status(400).json({error: "Could not get comments."}))
})

router.get('/:id', auth({strict: false}), (req, res) => {
    const userId = req.user?.id
    const commentId = req.params.id

    Comment.findById(commentId)
        .then((comment) => commentData(comment, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not get comment."}))
})

router.post('/', auth({strict: true}), (req, res) => {
    const userId = req.user.id

    const comment = new Comment({
        userId: userId,
        postId: req.body.post,
        content: req.body.content,
    })

    comment.save()
        .then((comment) => commentData(comment, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not create comment."}))
})

router.post('/:id/vote', auth({strict: true}), async (req, res) => {
    vote(res, req, "comment")
})

router.put("/:id", auth({strict: true, authorize: true, Model: Comment}), async (req, res) => {
    const userId = req.user.id
    const commentId = req.params.id

    Comment.findByIdAndUpdate(commentId, {
        content: req.body.content,
    }, {
        new: true,
        runValidators: true
    }).then((comment) => commentData(comment, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not update comment."}))
})

router.delete("/:id", auth({strict: true, authorize: true, Model: Comment}), async (req, res) => {
    const commentId = req.params.id

    Comment.findByIdAndDelete(commentId)
        .then(() => res.status(200).json({}))
        .catch(() => res.status(400).json({error: "Could not delete comment."}))
})

async function commentData(comment, userId) {
    let author = ""
    if (comment.userId) {
        author = await User.findById(comment.userId).then((user) => user.username)
    }

    const userVote = await getVote(userId, comment._id.toString(), "comment")
    
    return {
        id: comment._id.toString(),
        author_id: comment.userId.toString() || "",
        author: author,
        post_id: comment.postId.toString(),
        content: comment.content,
        upvotes: comment.numUpvotes,
        downvotes: comment.numDownvotes,
        user_vote: userVote,
        created_at: comment.createdAt,
        updated_at: comment.updatedAt
    }
}

module.exports = router