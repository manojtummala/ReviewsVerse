const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/google", authController.googleOAuth);
router.post("/apple", authController.appleOAuth);
router.get("/user", authController.getUserDetails);

module.exports = router;
