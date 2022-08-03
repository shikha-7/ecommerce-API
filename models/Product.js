const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"]
    },
    price: {
        type: String,
        required: [true, "Please provide price "]
    },
    description: {
        type: String,
        required: [true, "Please provide description"]
    },
    category: {
        type: String,
        enum: {
            values: ["kitchen", "office", "furniture"],
            message: '{VALUE} is not supported'
        },
    },
    colors: {
        type: [String],
        required: [true, "Please provide colors"],
        default: ["#0222"]
    },

    company: {
        type: String,
        required: [true, "Please provide company"],
        enum: {
            values: ["ikea", "liddy", "marcos"],
            message: '{VALUE} is not supported'
        }
    },
    image: {
        type: String,
        required: [true, "Please provide image"],
        default: "example.jpg"
    },
    featured: {
        type: Boolean,
        required: true,
        default: false,
    },
    freeshipping: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: true
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });



//The ref option, which tells Mongoose which model to populate documents from.
// The localField and foreignField options. Mongoose will populate documents from the model in ref whose foreignField matches this document's localField.

ProductSchema.virtual("reviews", {
    ref: "review",
    localField: '_id',
    foreignField: 'product',
    justOne: false

});

ProductSchema.pre('remove', async function (next) {
    await this.model('review').deleteMany({ product: this._id })
})



module.exports = mongoose.model('product', ProductSchema);