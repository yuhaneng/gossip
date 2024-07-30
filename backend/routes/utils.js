const User = require("../models/user.model")
const Post = require("../models/post.model")
const Comment = require("../models/comment.model")
const Reply = require("../models/reply.model")

async function vote(res, req, document) {
    const userId = req.user.id
    const documentId = req.params.id
    const vote = req.body.vote
    const prevVote = await getVote(userId, documentId, document)

    if (vote !== prevVote) {
        updateVotes(vote, prevVote, userId, documentId, document)
            .then(() => res.status(200).json({}))
            .catch(() => res.status(400).json({error: "Could not vote."}))
    } else {
        res.status(200).json({})
    }
}

function getDocument(document) {
    switch (document) {
        case "post":
            return {upvoteField: "postUpvotes", downvoteField: "postDownvotes", Model: Post}
        case "comment":
            return {upvoteField: "commentUpvotes", downvoteField: "commentDownvotes", Model: Comment}
        case "reply":
            return {upvoteField: "replyUpvotes", downvoteField: "replyDownvotes", Model: Reply}
        default:
            return {}
    }
}

function getVote(userId, documentId, document) {
    return new Promise(async (res, rej) => {
        const {upvoteField, downvoteField} = getDocument(document)

        let upvoteWhere = {
            _id: userId,
            [upvoteField]: documentId
        }
        let downvoteWhere = {
            _id: userId,
            [downvoteField]: documentId
        }
    
        let prevVote = "none"
        try {
            if (await User.find(upvoteWhere).then((users) => users.length !== 0)) {
                prevVote = "up"
            } else if (await User.find(downvoteWhere).then((users) => users.length !== 0)) {
                prevVote = "down"
            }
        } catch (err) {
            rej(err)
            return
        }

        res(prevVote)
    })
}

function updateVotes(vote, prevVote, userId, documentId, document) {
    return new Promise((res, rej) => {
        const {upvoteField, downvoteField, Model} = getDocument(document)

        let upIncr = 0
        let downIncr = 0
        let push = {}
        let pull = {}
        if (vote === "up") {
            upIncr++
            push[upvoteField] = documentId
        } else if (vote === "down") {
            downIncr++
            push[downvoteField] = documentId
        }
        if (prevVote === "up") {
            upIncr--
            pull[upvoteField] = documentId
        } else if (prevVote === "down") {
            downIncr--
            pull[downvoteField] = documentId
        }
    
        Model.findByIdAndUpdate(documentId, {
            $inc: {
                numUpvotes: upIncr,
                numDownvotes: downIncr,
            }
        }).then(() => User.findByIdAndUpdate(userId, {
            $pull: pull,
            $push: push
        })).then(() => res())
            .catch((err) => rej(err))
    })
}

async function isAuthorized(userRole, userId, documentId, document) {
    const {Model} = getDocument(document)

    return userRole === "admin" || (
        await Model.findById(documentId)
            .then(
                (document) => document.userId.toString() === userId,
                
            )
            .catch(() => false)
        )
}

module.exports = {vote, getVote, isAuthorized}