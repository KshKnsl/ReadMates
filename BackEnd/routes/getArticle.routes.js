const {
  getArticlesByTags,
  getArticlesByAuthor,
  getArticlesAll,
  getArticleById,
  getArticlesByTitle,
} = require("../controllers/article.controllers");

const express = require("express");
const router = express.Router();

module.exports = router;
