const mongoose = require("mongoose");
const { ACCESS_VALIDITY, REFRESH_VALIDITY } = require("../middleware/auth")
const jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

const Schema = mongoose.Schema;

// User is a forum user.
const UserSchema = new Schema({
    // profile data
    username: {type: String, minLength: 1, maxLength: 20, required: true, index: { unique: true }},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String},
    about: {type: String, maxLength: 1000, default: ""},

    role: {type: String, enum: ["user", "admin"], default: "user"}, // role for RBAC
    uiStyle: {type: String, enum: ["light", "dark"], default: "light"}, // ui theme
    isPrivate: {type: Boolean, default: false}, // whether the profile is private (email, about and post history invisible)
    
    // vote history
    postUpvotes: {type: [Schema.Types.ObjectId], index: true, ref: 'Post'},
    postDownvotes: {type: [Schema.Types.ObjectId], index: true, ref: 'Post'},
    commentUpvotes: {type: [Schema.Types.ObjectId], index: true, ref: 'Comment'},
    commentDownvotes: {type: [Schema.Types.ObjectId], index: true, ref: 'Comment'},
    replyUpvotes: {type: [Schema.Types.ObjectId], index: true, ref: 'Reply'},
    replyDownvotes: {type: [Schema.Types.ObjectId], index: true, ref: 'Reply'},
}, {
    timestamps: true
})

// Add pre hook to encrypt password before saving to db.
UserSchema.pre(['save'], function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.pre(['findOneAndUpdate'], function(next) {
    var user = this

    if (!user._update.password) return next()

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user._update.password, salt, function(err, hash) {
            if (err) return next(err)

            user._update.password = hash
            next()
        })
    })
})

// Add method for comparing password.
UserSchema.methods.validatePassword = function(candidatePassword) {
    return new Promise((res, rej) => {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { 
            rej(err) 
            return
        }
        res(isMatch)
        })
    })
}

// Add method for generating access token.
UserSchema.methods.accessToken = function() {
    return jwt.sign({role: this.role}, process.env.TOKEN_SECRET, {subject: this._id.toString(), expiresIn: ACCESS_VALIDITY})
}

// Add method for generating refresh token.
UserSchema.methods.refreshToken = function() {
    return jwt.sign({role: this.role}, process.env.TOKEN_SECRET, {subject: this._id.toString(), expiresIn: REFRESH_VALIDITY})
}

const User = mongoose.model('User', UserSchema);

module.exports = User;