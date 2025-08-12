const Topic = require("../models/Topic");
const Review = require("../models/Review"); // Assuming you have a Review model to fetch reviews for rating calculation

// Create or update a topic
exports.createOrUpdateTopic = async (req, res) => {
  try {
    const { name, verified, rating } = req.body;

    if (!name || verified === undefined || rating === undefined) {
      return res
        .status(400)
        .json({ message: "Name, verified status, and rating are required." });
    }

    const updatedTopic = await Topic.findOneAndUpdate(
      { name },
      { name, verified, rating },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: "Topic created or updated successfully!",
      topic: updatedTopic,
    });
  } catch (error) {
    console.error("Error creating or updating topic:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get topics for autocomplete suggestions
exports.getTopics = async (req, res) => {
  try {
    const { query } = req.query;

    const searchQuery = typeof query === "string" ? query : "";

    const topics = await Topic.find({
      name: { $regex: new RegExp(searchQuery, "i") },
    });

    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching topics",
      error,
    });
  }
};

// Update verified status of a topic
exports.updateVerifiedStatus = async (req, res) => {
  try {
    const { topicId, verified } = req.body;
    const topic = await Topic.findByIdAndUpdate(
      topicId,
      { verified },
      { new: true }
    );

    if (!topic) {
      return res
        .status(404)
        .json({ success: false, message: "Topic not found" });
    }

    res.status(200).json({ success: true, topic });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating verified status",
      error,
    });
  }
};

// Calculate and update average rating of a topic
exports.updateTopicRating = async (req, res) => {
  try {
    const { topicId } = req.body;

    // Find reviews related to the topic
    const reviews = await Review.find({ topicName: topicId });
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reviews found for this topic" });
    }

    // Calculate the average rating
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update the topic with the new rating
    const topic = await Topic.findByIdAndUpdate(
      topicId,
      { rating: averageRating },
      { new: true }
    );

    res.status(200).json({ success: true, topic });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating topic rating", error });
  }
};
