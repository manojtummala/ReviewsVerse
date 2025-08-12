const express = require("express");
const router = express.Router();
const subTopicController = require("../controllers/subTopicController");

// Route to search subtopics
router.get("/search", subTopicController.searchSubTopics);

module.exports = router;
