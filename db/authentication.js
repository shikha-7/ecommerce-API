const { verifyToken } = require("../utils");
const jwt = require("jsonwebtoken");

const authenticatUser = (req, res, next) => {
    const token = req.signedCookies;
    try {
        verifyToken({ token });
        // const { UserId, Usename, UserRole } = req.user;
        // console.log(req.user)
        next();
    }
    catch (err) {
        console.log(err)
    }



}


module.exports = { authenticatUser }