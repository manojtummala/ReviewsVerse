const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    topicName: {
      type: String,
      required: true,
    },
    subTopics: {
      type: [String],
      default: [],
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
    // comments: {
    //   type: [
    //     {
    //       userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //       commentText: String,
    //       timestamp: { type: Date, default: Date.now },
    //     },
    //   ],
    //   default: [],
    // },
    comments: {
      type: [String],
      default: [],
    },
    shares: {
      type: Number,
      default: 0,
    },
    report: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "Reviews",
  }
);

// // Middleware to convert userId string to ObjectId before save
// reviewSchema.pre("save", function (next) {
//   if (typeof this.userId === "string") {
//     try {
//       this.userId = ObjectId(this.userId);
//     } catch (error) {
//       return next(new Error("Invalid userId format"));
//     }
//   }
//   next();
// });

// // Middleware to convert userId string to ObjectId for findOne queries
// reviewSchema.pre("findOne", function (next) {
//   if (typeof this._conditions.userId === "string") {
//     try {
//       this._conditions.userId = ObjectId(this._conditions.userId);
//     } catch (error) {
//       return next(new Error("Invalid userId format"));
//     }
//   }
//   next();
// });

// // Middleware to convert userId string to ObjectId for find queries
// reviewSchema.pre("find", function (next) {
//   if (typeof this._conditions.userId === "string") {
//     try {
//       this._conditions.userId = ObjectId(this._conditions.userId);
//     } catch (error) {
//       return next(new Error("Invalid userId format"));
//     }
//   }
//   next();
// });

// // Middleware to convert userId string to ObjectId for findOneAndUpdate queries
// reviewSchema.pre("findOneAndUpdate", function (next) {
//   if (typeof this._conditions.userId === "string") {
//     try {
//       this._conditions.userId = ObjectId(this._conditions.userId);
//     } catch (error) {
//       return next(new Error("Invalid userId format"));
//     }
//   }
//   next();
// });

module.exports = mongoose.model("Review", reviewSchema);
