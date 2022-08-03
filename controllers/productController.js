const { StatusCodes } = require("http-status-codes");
const ProductSchema = require("../models/Product");
const ReviewSchema = require("../models/Review");
const path = require("path")


const createProduct = async (req, res) => {
    req.body.user = req.user.UserId;
    const product = await ProductSchema.create(req.body);
    return res.status(StatusCodes.CREATED).json({ product });

}

const getAllProducts = async (req, res) => {
    const product = await ProductSchema.find({});
    return res.status(StatusCodes.CREATED).json({ count: product.length, product });

}

const getSingleProduct = async (req, res) => {
    const productid = req.params.id;
    const product = await ProductSchema.findOne({ _id: productid }).populate({ path: 'reviews' });

    if (!product) {
        return res.status(StatusCodes.OK).json({ msg: `product with id ${productid} is not found` });
    }

    return res.status(StatusCodes.CREATED).json({ product });
}


const updateProduct = async (req, res) => {

    const { name, price, description, company, category } = req.body;

    if (!name || !price || !description || !company || !category) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `please provide name price description company and category` })
    }

    const productid = req.params.id;
    const product = await ProductSchema.findByIdAndUpdate({ _id: productid }, req.body, { new: true, runValidators: true });
    if (!product) {
        return res.status(StatusCodes.OK).json({ msg: `product with id ${productid} is not found` });
    }
    return res.status(StatusCodes.CREATED).json({ product });
}

const deleteProduct = async (req, res) => {
    const productid = req.params.id;
    const product = await ProductSchema.findOne({ _id: productid });
    if (!product) {
        return res.status(StatusCodes.OK).json({ msg: `product with id ${productid} is not found` });
    }
    // const deleteReviews = await ReviewSchema.findOne({ product: productid });
    // deleteReviews.remove();
    await product.remove();
    return res.status(StatusCodes.CREATED).json({ msg: `Product has been removed` });
}

const uploadImage = async (req, res) => {
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith("image")) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please upload in image format jpeg/png` })
    }
    const maxsize = 1024 * 1024;
    if (productImage.size > maxsize) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Please upload image within 1 MB` })
    }
    const imgPath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imgPath);

    res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } })
}

module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage } 