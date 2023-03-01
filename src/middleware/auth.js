const jwt=require('jsonwebtoken')
////////////////////////~Authentication~/////////////////////////
const Authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, msg: "token must be present in the request header" })
        jwt.verify(token, "xyz", (error, decodedToken) => {
            if (error) { return res.status(401).send({ status: false, message: error.message }) }

            req.decodedUserId = decodedToken.userId
            next()
        })

    }
    catch (error) {
        res.status(500).send({ msg: error })
    }
}



////////////////////////////////////~Module~/////////////////////////////////////////
module.exports.Authentication = Authentication