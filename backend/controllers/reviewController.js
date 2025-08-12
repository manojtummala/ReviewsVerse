const Review = require("../models/Review");
const SubTopic = require("../models/SubTopic");
// const { ObjectId } = require("mongoose");

// Search for reviews by topic name or other criteria
exports.searchReviews = async (req, res) => {
  try {
    const query = req.query.query || "";
    const reviews = await Review.find({
      topicName: { $regex: query, $options: "i" },
    });

    const response = reviews.map((review) => ({
      id: review._id,
      userId: review.userId,
      userName: review.userName,
      topicName: review.topicName,
      subTopics: review.subTopics,
      reviewText: review.reviewText,
      rating: review.rating,
      timestamp: review.timestamp,
      upVotes: review.upVotes,
      downVotes: review.downVotes,
      comments: review.comments,
      shares: review.shares,
      report: review.report,
      reportCount: review.reportCount,
      status: review.status,
    }));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Create or update a review
exports.createOrUpdateReview = async (req, res) => {
  try {
    const reviewData = req.body;

    const existingReview = await Review.findOne({
      userId: reviewData.userId,
      topicName: reviewData.topicName,
      subTopics: reviewData.subTopics,
      reviewText: reviewData.reviewText,
    });

    if (existingReview) {
      const updatedReview = await Review.findByIdAndUpdate(
        existingReview._id,
        reviewData,
        { new: true }
      );
      await updateSubTopics(reviewData);
      return res.status(200).json(updatedReview);
    } else {
      const newReview = new Review(reviewData);
      await newReview.save();
      await updateSubTopics(reviewData);
      return res.status(201).json(newReview);
    }
  } catch (error) {
    console.error("Error posting or updating review:", error);
    res.status(400).json({ error: "Failed to post or update the review" });
  }
};

// Helper function to update subtopics related to the review
async function updateSubTopics(reviewData) {
  try {
    const existingSubTopic = await SubTopic.findOne({
      topicName: reviewData.topicName,
    });

    if (existingSubTopic) {
      const mergedSubTopics = Array.from(
        new Set([...existingSubTopic.subTopics, ...reviewData.subTopics])
      );
      await SubTopic.findByIdAndUpdate(existingSubTopic._id, {
        subTopics: mergedSubTopics,
      });
    } else {
      const newSubTopic = new SubTopic({
        topicName: reviewData.topicName,
        subTopics: reviewData.subTopics,
      });
      await newSubTopic.save();
    }
  } catch (error) {
    console.error("Error updating subtopics:", error);
  }
}

exports.reviewButtons = async (req, res) => {
  const { reviewId, type } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    switch (type) {
      case "upvote":
        review.upVotes += 1;
        break;
      case "downvote":
        review.downVotes += 1;
        break;
      case "share":
        review.shares += 1;
        break;
      case "report":
        if (!review.report) {
          review.report = true;
          // review.reportCount += 1;
        } else {
          review.report = false;
        }
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid action type" });
    }

    await review.save();
    res.json({ success: true, message: `${type} successful` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
