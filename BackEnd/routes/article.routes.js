const {
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/article.controllers.js");

const express = require("express");
const router = express.Router();

router.post("/createArticle", async (req, res) => {
  let desc = await generateAiDesc(req.body);
  req.body.desc = desc;
  let result = await createArticle(req.body);
  console.log(req.body);
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
async function generateAiDesc(body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.Gemini_API_KEY}`;
  const refinedPrompt = `Generate a description for the following article to help with SEO: ${body.title} - ${body.content}. The description should be concise and include relevant keywords. PLease return an empty string if you are unable to generate a description.`;
  try 
  {
    const response = await fetch(url, { method: "POST",
      headers: {"Content-Type": "application/json", },
      body: JSON.stringify({ contents: [{parts: [{text: refinedPrompt, },],},],}), });
    const jsonResponse = await response.json();
    return jsonResponse.candidates[0].content.parts[0].text;
  } 
  catch (error) 
  {
    console.log("Error:", error);
    return null;
  }
}

module.exports = router;