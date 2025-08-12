const mongoose = require("mongoose");

const subTopicSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      required: true,
    },
    subTopics: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "Sub Topics",
  }
);

module.exports = mongoose.model("SubTopic", subTopicSchema);
