const router = require("express").Router();
const { ACCESS_VALIDITY, REFRESH_VALIDITY, auth } = require("../middleware/auth");
let User = require("../models/user.model");

router.post('/signup', (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
    
    user.save()
        .then((user) => res.json(authData(user)))
        .catch(() => res.status(400).json({error: "Could not sign up."}))
})

router.post('/signin', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({"username": username})
        .then((user) => user.validatePassword(password)
            .then((isValid) => isValid ? res.json(authData(user)) : res.status(403).json({error: "Wrong username or password."}))
        )
        .catch(() => res.status(403).json({error: "Wrong username or password."}))
})

router.post('/refresh', auth({strict: true}), (req, res) => {
    const id = req.user.id

    User.findById(id)
        .then((user) => res.json(authData(user)))
        .catch(() => res.status(400).json({error: "Could not refresh."}))
})

function authData(user) {
    return ({
        id: user._id.toString(),
        username: user.username,
        role: user.role,
        access_token: user.accessToken(),
        access_expiry: Date.now() / 1000 + ACCESS_VALIDITY,
        refresh_token: user.refreshToken(),
        refresh_validity: Date.now() / 1000 + REFRESH_VALIDITY
    })
}

module.exports = router;