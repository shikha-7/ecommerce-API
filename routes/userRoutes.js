const express = require("express");
const router = express.Router();
const { authenticatUser, authorizeUsers } = require("../middleware/authentication");

const { getAllusers, getSingleusers, showCurrentUser, Updateusers, updateUserPasswords } = require("../controllers/userController");



router.route("/").get(authenticatUser, authorizeUsers("admin"), getAllusers);
router.route("/updateUsers").patch(authenticatUser, Updateusers);
router.route("/updatePasswords").patch(authenticatUser, updateUserPasswords);
router.route("/showcurrentuser").get(authenticatUser, showCurrentUser);
router.route("/:id").get(authenticatUser, getSingleusers);


module.exports = router;

