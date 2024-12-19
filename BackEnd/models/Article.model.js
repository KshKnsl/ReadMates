const mongoose = require("mongoose");
// Article Schema
const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // JSON or raw HTML content
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    revisions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        changes: { type: String },
      },
    ],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    peerReviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        feedback: { type: String },
        rating: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

exports.Article = mongoose.model("Article", articleSchema);
