const { verifyToken } = require("../utils");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authenticatUser = (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `token is not provided!` })
    }


    try {
        const { UserId, Username, UserRole } = verifyToken({ token });
        req.user = { UserId, Username, UserRole };
        next();
    }
    catch (err) {
        console.log(err)
    }
}

const authorizeUsers = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.UserRole)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Unauthorized access to Route!` })
        }
        next();
    }


}


module.exports = { authenticatUser, authorizeUsers }