const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");

router.get("/search", topicController.getTopics);
router.post("/verified", topicController.updateVerifiedStatus);
router.post("/rating", topicController.updateTopicRating);
router.post("/create", topicController.createOrUpdateTopic);

module.exports = router;
