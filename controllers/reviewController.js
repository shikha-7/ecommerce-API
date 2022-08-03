const ReviewSchema = require("../models/Review");
const ProductSchema = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
    req.body.user = req.user.UserId;
    const { product: ProductId } = req.body;

    const alreadysubmitted = await ReviewSchema.findOne({ _id: ProductId });
    if (alreadysubmitted) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `review already submitted!` })
    }

    const review = await ReviewSchema.create(req.body);
    return res.status(StatusCodes.CREATED).json({ review });

}

const getAllReviews = async (req, res) => {
    const review = await ReviewSchema.find({})
        .populate({ path: 'product', select: 'name price category' })
        .populate({ path: 'user', select: 'name' })
    return res.status(StatusCodes.OK).json({ count: `${review.length}`, review });

}


const getSingleReviews = async (req, res) => {
    const reviewId = req.params.id;
    const review = await ReviewSchema.findOne({ _id: reviewId });
    if (!review) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `no review found with id ${reviewId}` })
    }
    return res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    const review = await ReviewSchema.findOne({ _id: reviewId });
    if (!review) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `no review with id ${reviewId}` })
    }
    await review.remove();
    return res.status(StatusCodes.OK).json({ msg: `review sucessfully removed!` });
}

const updateReview = async (req, res) => {
    req.body.user = req.user.UserId;
    const { rating, title, comment, product: ProductId } = req.body;
    const reviewId = req.params.id;
    const review = await ReviewSchema.findOne({ _id: reviewId });
    if (!review) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `no review found wiht id ${reviewId}` })
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.product = ProductId;

    await review.save();
    return res.status(StatusCodes.OK).json({ review });
}


const getSingleProductReview = async (req, res) => {
    const productId = req.params.id;
    // console.log(productId)
    const Productreview = await ReviewSchema.find({ product: productId });
    if (!Productreview) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `no review found with id ${productId}` })
    }
    return res.status(StatusCodes.OK).json({ Productreview });
    // res.send("singlee product review")
}



module.exports = { createReview, getAllReviews, getSingleReviews, deleteReview, updateReview, getSingleProductReview }

