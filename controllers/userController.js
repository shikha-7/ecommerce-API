const { StatusCodes } = require("http-status-codes");
const UserSchema = require("../models/user");
const { checkpermission, createToken, storeTokenInCookies } = require("../utils");
// const {  } = require("../middleware/authentication");

const getAllusers = async (req, res) => {
    // console.log(req.user)
    const users = await UserSchema.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ count: users.length, users })

}


const getSingleusers = async (req, res) => {

    const users = await UserSchema.findOne({ _id: req.params.id }).select('-password');
    checkpermission(req.user, users._id);
    res.status(StatusCodes.OK).json({ users });

}


const showCurrentUser = async (req, res) => {
    const users = await UserSchema.findOne({ _id: req.user.UserId });
    res.status(StatusCodes.OK).json({ users: req.user });
}

const Updateusers = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please Provide name and email` });
    }

    const { UserId } = req.user;

    const users = await UserSchema.findOne({ _id: UserId });
    if (!users) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `user with id ${UserId} is not found` })
    }

    users.name = name;
    users.email = email;

    await users.save();
    const Tokenuser = { UserId: users._id, Username: users.name, UserRole: users.role }
    createToken({ payload: Tokenuser });
    storeTokenInCookies({ res, payload: Tokenuser });
    res.status(StatusCodes.OK).json({ users })

}


const updateUserPasswords = async (req, res) => {

    const { oldpassword, newpassword } = req.body;


    if (!oldpassword || !newpassword) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please Provide oldpassword and newpassword` });
    }

    const { UserId } = req.user;

    const users = await UserSchema.findOne({ _id: UserId });
    if (!users) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `user with id ${UserId} is not found` })
    }

    const matchPassword = await users.comparePassword(oldpassword);
    if (!matchPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Invalid credentials` })
    }

    users.password = newpassword;
    await users.save();
    res.status(StatusCodes.OK).json({ users })
}


module.exports = { getAllusers, getSingleusers, showCurrentUser, Updateusers, updateUserPasswords }