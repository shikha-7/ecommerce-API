const mongoose = require("mongoose");
const ReviewSchema = mongoose.Schema({

    rating: {
        type: Number,
        required: [true, "Please provide rating"],
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        required: [true, "Please provide title"],
        trim: true,
        max: 100,
        min: 3
    },
    comment: {
        type: String,
        required: [true, "Please provide comment"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
    },

}, { timestamps: true });


ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
module.exports = mongoose.model('review', ReviewSchema);