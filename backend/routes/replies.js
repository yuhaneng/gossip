const router = require("express").Router()
const { auth } = require("../middleware/auth")
const { vote, getVote } = require("./utils")
let Reply = require("../models/reply.model")
let Comment = require("../models/comment.model")
const User = require("../models/user.model")

router.get('/', auth({strict: false}), (req, res) => {
    const userId = req.user?.id
    const sort = req.query.sort
    const page = req.query.page
    const perPage = 20

    const commentId = req.query.comment
    const profileId = req.query.user

    let where = {}
    if (profileId) {
        where.userId =  profileId
    } else if (commentId) {
        where.commentId = commentId
    }

    Reply.find(where)
        .sort(sort === "rating" ? {num_upvotes: 1} : {createdAt: -1})
        .limit(page * perPage)
        .then((replies) => Promise.all(replies.map((reply) => replyData(reply, userId))))
        .then((datas) => res.json(datas))
        .catch(() => res.status(400).json({error: "Could not get replies."}))
})

router.get('/:id', auth({strict: false}), (req, res) => {
    const userId = req.user?.id
    const replyId = req.params.id

    Reply.findById(replyId)
        .then((reply) => replyData(reply, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not get reply."}))
})

router.post('/', auth({strict: true}), (req, res) => {
    const userId = req.user.id

    const reply = new Reply({
        userId: userId,
        commentId: req.body.comment,
        content: req.body.content,
    })

    reply.save()
        .then((reply) => replyData(reply, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not create reply."}))
})

router.post('/:id/vote', auth({strict: true}), async (req, res) => {
    vote(res, req, "reply")
})

router.put("/:id", auth({strict: true, authorize: true, Model: Reply}), async (req, res) => {
    const userId = req.user.id
    const replyId = req.params.id

    Reply.findByIdAndUpdate(replyId, {
        content: req.body.content,
    }, {
        new: true,
        runValidators: true
    }).then((reply) => replyData(reply, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not update reply."}))
})

router.delete("/:id", auth({strict: true, authorize: true, Model: Reply}), async (req, res) => {
    const replyId = req.params.id

    Reply.findByIdAndDelete(replyId)
        .then(() => res.status(200).json({}))
        .catch(() => res.status(400).json({error: "Could not delete reply."}))
})

async function replyData(reply, userId) {
    let author = ""
    if (reply.userId) {
        author = await User.findById(reply.userId).then((user) => user.username)
    }

    let postId = ""
    if (reply.commentId) {
        postId = await Comment.findById(reply.commentId).then((comment) => comment.postId)
    }

    const userVote = await getVote(userId, reply._id.toString(), "reply")

    return {
        id: reply._id.toString(),
        author_id: reply.userId.toString() || "",
        author: author,
        comment_id: reply.commentId.toString(),
        post_id: postId,
        content: reply.content,
        upvotes: reply.numUpvotes,
        downvotes: reply.numDownvotes,
        user_vote: userVote,
        created_at: reply.createdAt,
        updated_at: reply.updatedAt
    }
}

module.exports = router