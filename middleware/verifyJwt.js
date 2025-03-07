const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Unauthorized - Token has expired' });
                }
                return res.status(403).json({ message: 'Forbidden - Invalid token' });
            }
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles
            req.token = token
            next()
        }
    )
}


module.exports = verifyJWT 