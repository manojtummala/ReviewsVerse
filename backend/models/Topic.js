const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    verrified: {
      type: Boolean,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
  {
    collection: "topics",
  }
);

module.exports = mongoose.model("Topic", TopicSchema);
