const SubTopic = require("../models/SubTopic");

// Search for subtopics by name
exports.searchSubTopics = async (req, res) => {
  try {
    const query = req.query.query || "";
    const topics = await SubTopic.find({
      topicName: { $regex: query, $options: "i" },
    });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subtopics" });
  }
};
