const jwt = require("jsonwebtoken");


const createToken = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_LIFETIME });
    return token;
}


const verifyToken = ({ token }) => jwt.verify(token, process.env.JWT_SECRET_KEY);


const cookieAge = 1000 * 24 * 60 * 60;
const storeTokenInCookies = ({ res, payload }) => {
    const token = createToken({ payload });
    res.cookie('token', token,
        {
            maxAge: new Date(Date.now() + cookieAge),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
        });

}

module.exports = { createToken, verifyToken, storeTokenInCookies }