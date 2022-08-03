const mongoose = require("mongoose");
const singleOrderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true
    }


});



const OrderSchema = mongoose.Schema({

    tax: {
        type: Number,
        requird: true
    },
    shippingFee: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
    orderItems: [singleOrderItemSchema],
    status: {
        type: String,
        enum: ["pending", "failed", "paid", "delivered", "canceled"],
        default: 'pending',
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    },
    paymentIntentId: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("order", OrderSchema)