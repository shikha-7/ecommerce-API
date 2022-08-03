const { StatusCodes } = require("http-status-codes")
const UserSchema = require("../models/user");
const { createToken, storeTokenInCookies } = require("../utils");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please provide name , email and password` })
    }

    const users = await UserSchema.findOne({ email: email });
    if (users) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `user already exist!` });
    }

    const countdoc = (await UserSchema.countDocuments({})) === 0;
    const role = countdoc ? 'admin' : 'user'
    const user = await UserSchema.create({ name, email, password, role });


    const Tokenuser = { UserId: user._id, Username: user.name, UserRole: user.role }
    createToken({ payload: Tokenuser });
    storeTokenInCookies({ res, payload: Tokenuser });
    return res.status(StatusCodes.CREATED).json({ Tokenuser });
}

const login = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `please provide username and password` })
    }
    const user = await UserSchema.findOne({ email: email });
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: `user not exist!` })
    }
    const matchPassword = await user.comparePassword(password);
    if (!matchPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Invalid credentials` })
    }
    const Tokenuser = { UserId: user._id, Username: user.name, UserRole: user.role }
    createToken({ payload: Tokenuser });
    storeTokenInCookies({ res, payload: Tokenuser });
    res.status(StatusCodes.OK).json({ msg: `Hey , ${user.name} You are logged in!` })
}

const logout = async (req, res) => {
    const cookieAge = new Date(Date.now() + 1000);
    res.cookie("logout", 'token', {
        maxAge: cookieAge,
        httpOnly: true,

    });
    res.status(StatusCodes.OK).json({ msg: `Hey, You are logged out!` })
}


module.exports = { register, login, logout }