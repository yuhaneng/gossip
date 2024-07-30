const jwt = require('jsonwebtoken')

// Validity of access and refresh tokens in seconds.
const ACCESS_VALIDITY = 1800
const REFRESH_VALIDITY = 2592000

// auth returns auth middleware for authentication and authorization
function auth(cfg) {
    return function(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
      
        if (token == null) {
            if (cfg.strict) return res.status(401).json({error: "Not authorized to perform this action."})
            else return next()
        }
      
        jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
            if (err) return res.status(403).json({error: "Not authorized to perform this action."})

            req.user = {
                id: data.sub,
                role: data.role
            }

            if (!cfg.authorize) {
                return next()
            }

            if (data.role === "admin") {
                return next()
            }

            documentId = req.params.id
            cfg.Model.findById(documentId)
                .then((document) => !document 
                    ? res.status(400).json({error: cfg.Model.collection.collectionName + " not found."}) 
                    : ( document.userId.toString() === data.sub ? next() : res.status(403).json({error: "Not authorized to perform this action."}) ))
        })
    }
}

module.exports = {
    ACCESS_VALIDITY,
    REFRESH_VALIDITY,
    auth,
}