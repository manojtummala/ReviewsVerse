const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Route to post or update a review
router.post("/topic", reviewController.createOrUpdateReview);

router.post("/vote", reviewController.reviewButtons);

// Route to search for reviews
router.get("/topic", reviewController.searchReviews);

module.exports = router;
