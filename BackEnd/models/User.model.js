// Import Mongoose
const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date },
    avatar: { type: String }, // For profile picture
    bio: { type: String },
    socialLinks: { type: [String], default: [] },
    points: { type: Number, default: 100 },
    badges: { type: [String], default: [] },
    interests: { type: [String], default: ["Reading"] },
    savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    contributions: [
      {
        articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
        points: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);