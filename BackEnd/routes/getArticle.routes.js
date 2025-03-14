const {
  getArticlesByTags,
  getArticlesByAuthor,
  getArticlesAll,
  getArticleById,
  getArticlesByTitle,
  getArticleBySessionDoc,
} = require("../controllers/article.controllers");

const express = require("express");
const router = express.Router();
router.get("/tags/:tag", async (req, res) => {
  let result = await getArticlesByTags(req, res);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.get("/author/:author", async (req, res) => {
  const authorID = req.params.author;
  let result = await getArticlesByAuthor(authorID);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.get("/all", async (req, res) => {
  let result = await getArticlesAll(req, res);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.get("/:id", async (req, res) => {
  let result = await getArticleById(req.params.id);
  res.status(200).json(result);
});

router.get("/title/:title", async (req, res) => {
  let result = await getArticlesByTitle(req, res);
    res.status(200).json(result);
});

router.get("/session/:sessionDoc", async (req, res) => {
  let result = await getArticleBySessionDoc(req.params.sessionDoc);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.json(result);
  }
});

module.exports = router;
