// Import Mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    dob: { type: Date },
    avatar: { type: String }, // For profile picture
    bio: { type: String },
    socialLinks: { type: [String], default: [] },
    points: { type: Number, default: 100 },
    badges: { type: [String], default: ["First Steps"] },
    interests: { type: [String], default: ["Reading"] },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    contributions: [
      {
        articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
        points: { type: Number },
      },
    ],
    readArticles: { type: [mongoose.Schema.Types.ObjectId], ref: "Article", default: [] },
    lastRead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) 
{
  if(this.password === undefined || this.password.length==0) this.password= "GooGleAuthAccount";
  if (!this.isModified("password"))
    next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  
  const user = this;
  const newBadges = [];

  if (user.articles.length == 1 && !user.badges.includes("Rising Blogger"))
    newBadges.push("Rising Blogger");
  if (user.articles.length >= 10 && !user.badges.includes("Pro Contributor"))
    newBadges.push("Pro Contributor");
  if (user.articles.length >= 25 && !user.badges.includes("Tech Guru"))
    newBadges.push("Tech Guru");
  if (user.readArticles.length >= 5 && !user.badges.includes("Avid Reader"))
    newBadges.push("Avid Reader");
  if (user.readArticles.length >= 10 && !user.badges.includes("Deep Diver")) 
    newBadges.push("Deep Diver");
  if (user.contributions.length >= 10 && !user.badges.includes("Top Critic"))
    newBadges.push("Top Critic");
  if (user.contributions.length >= 5 && !user.badges.includes("Community Builder"))
    newBadges.push("Community Builder");
  user.badges = [...user.badges, ...newBadges];

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
