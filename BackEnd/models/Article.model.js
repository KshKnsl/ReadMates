const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, default: ""},
    content: { type: Object, required: true },
    author:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
    contributors: [
      { type: mongoose.Schema.Types.ObjectId,  ref: "User",
      },
    ],
    tags: [{ type: String }],
    status: {  type: String,  enum: ["draft", "published", "under_review"], default: "draft", },
    publishedAt: { type: Date },
    sessionDoc: { type: String },
    source: String,
  }, { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);