const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, decodedToken) => {
            if (err) {
                var code = 401
                var errorInfo = "Unauthorized Access"
                res.status(code).send({
                    status: code,
                    info: errorInfo,
                    error_code: code,
                    message: errorInfo,
                });
            }
            else {
                res.locals.decodedToken = decodedToken;
                console.log(decodedToken)
                next()
            }
        })
    } else {
        var code = 401
        var errorInfo = "Unauthorized Access"
        res.status(code).send({
            status: code,
            info: errorInfo,
            error_code: code,
            message: errorInfo,
        });
    }
}

module.exports = { requireAuth }