const express = require("express");
const router = express.Router();

const { authenticatUser } = require("../middleware/authentication");

const { createReview, getAllReviews, getSingleReviews, deleteReview, updateReview } = require("../controllers/reviewController")

router.route("/").post(authenticatUser, createReview).get(authenticatUser, getAllReviews);
router.route("/:id").get(authenticatUser, getSingleReviews).delete(authenticatUser, deleteReview).patch(authenticatUser, updateReview);



module.exports = router;