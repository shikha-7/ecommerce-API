const express = require("express");
const router = express.Router();

const { authenticatUser, authorizeUsers } = require("../middleware/authentication");

const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage } = require("../controllers/productController");


const { getSingleProductReview } = require("../controllers/reviewController");

router.route("/").post(authenticatUser, authorizeUsers('admin'), createProduct).get(authenticatUser, getAllProducts);
router.route("/:id").get(authenticatUser, getSingleProduct).patch(authenticatUser, authorizeUsers('admin'), updateProduct).delete(authenticatUser, authorizeUsers('admin'), deleteProduct);
router.route("/uploadImage").post(authenticatUser, authorizeUsers('admin'), uploadImage);
router.route("/:id/singleProductReview").get(getSingleProductReview);
module.exports = router;