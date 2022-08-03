const express = require("express");
const router = express.Router();

const { authenticatUser, authorizeUsers } = require("../middleware/authentication");

const { createOrder, getsingleOrder, showAllMyOrders, getAllOrders, updateOrder } = require("../controllers/orderController");


router.route("/").post(authenticatUser, createOrder)
    .get(authenticatUser, authorizeUsers('admin'), getAllOrders);
router.route("/showCurrentUserOrder").get(authenticatUser, showAllMyOrders)
router.route("/:id").get(authenticatUser, getsingleOrder).patch(authenticatUser, updateOrder);

module.exports = router;