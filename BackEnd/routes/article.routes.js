const {
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/article.controllers.js");

const express = require("express");
const router = express.Router();

router.post('/createArticle', async (req, res) => {
  let result = await createArticle(req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.post('/updateArticle', async (req, res) => {
  let result = await updateArticle(req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.post('/deleteArticle', async (req, res) => {
  let result = await deleteArticle(req.body);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});


module.exports = router;