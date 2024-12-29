const {
  createArticle,
  updateArticle,
  deleteArticle,
  generateAiArticles,
  generateAiDesc,
} = require("../controllers/article.controllers.js");

const express = require("express");
const router = express.Router();

router.post("/createArticle", async (req, res) => {
  let desc = await generateAiDesc(req.body);
  req.body.desc = desc;
  let result = await createArticle(req.body);
  // console.log(req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
});

router.post("/updateArticle", async (req, res) => {
  let result = await updateArticle(req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.post("/deleteArticle", async (req, res) => {
  let result = await deleteArticle(req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.post("/generateAiArticle", async (req, res) => {
  const resu = await generateAiArticles(req.body.search, req.body.tags);
  console.log(resu);
  if (resu.success) {
    res.status(200).json(resu);
  } else {
    res.status(400).json(resu);
  }
});



module.exports = router;