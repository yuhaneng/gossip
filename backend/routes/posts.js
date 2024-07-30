const router = require("express").Router()
const { auth } = require("../middleware/auth")
const { vote, getVote } = require("./utils")
const Post = require("../models/post.model")
const User = require("../models/user.model")

router.get('/', auth({strict: false}), (req, res) => {
    const userId = req.user?.id

    const sort = req.query.sort
    const page = req.query.page
    const perPage = 20

    let tags = []
    if (req.query.tags) {
        try {
            tags = JSON.parse(req.query.tags)
        } catch (err) {
            return res.status(400).json({error: "Could not get posts."})
        }
    }
    const profileId = req.query.user

    let where = {}
    if (profileId) {
        where.userId = profileId
    } else if (tags.length > 0) {
        where.tags = {
            $all: tags
        }
    }

    Post.find(where)
        .sort(sort === "rating" ? {numUpvotes: -1} : {createdAt: -1})
        .limit(page * perPage)
        .then((posts) => Promise.all(posts.map((post) => postData(post, userId))))
        .then((datas) => res.json(datas))
        .catch(() => res.status(400).json({error: "Could not get posts."}))
})

router.get('/:id', auth({strict: false}), (req, res) => {
    const userId = req.user?.id
    const postId = req.params.id
    

    Post.findById(postId)
        .then((post) => postData(post, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not get post."}))
})

router.post('/', auth({strict: true}), (req, res) => {
    const userId = req.user.id

    const post = new Post({
        userId: userId,
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags
    })

    post.save()
        .then((post) => postData(post, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not create post."}))
})

router.post('/:id/vote', auth({strict: true}), (req, res) => {
    vote(res, req, "post")
})

router.put("/:id", auth({strict: true, authorize: true, Model: Post}), async (req, res) => {
    const postId = req.params.id
    const userId = req.user.id

    Post.findByIdAndUpdate(postId, {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags
    }, {
        new: true,
        runValidators: true
    }).then((post) => postData(post, userId))
        .then((data) => res.json(data))
        .catch(() => res.status(400).json({error: "Could not update post."}))
})

router.delete("/:id", auth({strict: true, authorize: true, Model: Post}), async(req, res) => {
    const postId = req.params.id

    Post.findByIdAndDelete(postId)
        .then(() => res.status(200).json({}))
        .catch(() => res.status(400).json({error: "Could not delete post."}))
})

async function postData(post, userId) {
    let author = ""
    if (post.userId) {
        author = await User.findById(post.userId).then((user) => user.username)
    }

    const userVote = await getVote(userId, post._id.toString(), "post")

    return {
        id: post._id.toString(),
        author_id: post.userId.toString() || "",
        author: author,
        title: post.title,
        content: post.content,
        tags: post.tags,
        upvotes: post.numUpvotes,
        downvotes: post.numDownvotes,
        user_vote: userVote,
        created_at: post.createdAt,
        updated_at: post.updatedAt
    }
}

module.exports = router