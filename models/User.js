const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide name"]
    },
    email: {
        type: String,
        required: [true, "Please Provide email"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please Provide valid email'
        }

    },
    password: {
        type: String,
        required: [true, "Please Provide password"]
    },
    role: {
        type: String,
        enum:
        {
            values: ["user", "admin"],
            message: `{VALUES} is not supported`
        },
        default: 'user'
    }
});

// hash password
UserSchema.pre("save", async function () {
    if (this.isModified('password')) {
        const gensalt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, gensalt);
    }
    else { }

});

// compare password
UserSchema.methods.comparePassword = async function (userpassword) {
    const isMatch = await bcrypt.compare(userpassword, this.password);
    return isMatch;
}


module.exports = mongoose.model("user", UserSchema);