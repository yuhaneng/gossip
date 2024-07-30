const router = require("express").Router();
const { auth } = require("../middleware/auth");
let User = require("../models/user.model");

router.get('/', auth({strict: true}),(req, res) => {
    const id = req.user.id
    User.findById(id)
        .then((profile) => res.json(publicData(profile)))
        .catch(() => res.sendStatus(400))
})

router.get('/:id', auth({strict: false}), (req, res) => {
    const userId = req.user?.id
    const userRole = req.user?.role

    const profileId = req.params.id
    User.findById(profileId)
        .then((profile) => {
            if (userRole === "admin" || userId === profileId || !profile.isPrivate) {
                res.json(publicData(profile))
            } else {
                res.json(privateData(profile))
            }
    }).catch(() => res.sendStatus(400))
        
})

router.put('/:id', auth({strict: true}), (req, res) => {
    const userId = req.user.id
    const userRole = req.user.role

    console.log({
        username: req.body.username,
        email: req.body.email,
        about: req.body.about,
        uiStyle: req.body.ui_style,
        isPrivate: req.body.is_private
    })

    const profileId = req.params.id
    if (userRole !== "admin" && userId !== profileId) {
        return res.sendStatus(403)
    }
    User.findByIdAndUpdate(profileId, {
        username: req.body.username,
        email: req.body.email,
        about: req.body.about,
        uiStyle: req.body.ui_style,
        isPrivate: req.body.is_private
    }, {
        new: true,
        runValidators: true
    }).then((profile) => res.json(publicData(profile)))
        .catch(() => res.sendStatus(400))
})

router.delete('/:id', auth({strict: true}), (req, res) => {
    const userId = req.user.id
    const userRole = req.user.role

    const profileId = req.params.id
    if (userRole !== "admin" && userId !== profileId) {
        return res.sendStatus(403)
    }
    User.findByIdAndDelete(profileId)
        .then((profile) => res.json(publicData(profile)))
        .catch(() => res.sendStatus(400))
})

router.put('/:id/password', auth({strict: true}), async (req, res) => {
    const userId = req.user.id
    const userRole = req.user.role

    const profileId = req.params.id
    const oldPassword = req.body.old_password
    const newPassword = req.body.password
    if (userRole !== "admin" && userId !== profileId) {
        return res.sendStatus(403)
    }

    const isMatch = await User.findById(profileId)
        .then((profile) => profile.validatePassword(oldPassword))

    if (!isMatch) {
        return res.sendStatus(403)
    }

    User.findByIdAndUpdate(profileId, {
        password: newPassword
    }).then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(400))
})

function publicData(user) {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        about: user.about,
        created_at: user.createdAt,
        
        ui_style: user.uiStyle,
        is_private: user.isPrivate
    }
}

function privateData(user) {
    return {
        id: user._id.toString(),
        username: user.username,
        is_private: user.isPrivate
    }
}

module.exports = router