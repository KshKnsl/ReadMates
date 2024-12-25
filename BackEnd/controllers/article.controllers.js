const Article = require("../models/Article.model");

// Create a new article
async function createArticle(data) {
  const existingArticle = await Article.findOne({
    sessionDoc: data.sessionDoc,
  });
  if (existingArticle) {
    Object.assign(existingArticle, {
      title: data.title,
      desc: data.desc,
      content: data.content,
      contributors: data.contributors,
      tags: data.tags,
      status: data.status || "draft",
    });
    await existingArticle.save();
    console.log("Article Updated successfully");
    return {
      success: true,
      message: "Article Updated successfully",
      article: existingArticle,
    };
  }
  try {
    const newArticle = new Article({
      title: data.title,
      desc: data.desc,
      content: data.content,
      author: data.author,
      contributors: data.contributors,
      tags: data.tags,
      status: data.status || "draft",
      publishedAt: data.publishedAt || null,
      sessionDoc: data.sessionDoc,
    });

    await newArticle.save();
    return {
      success: true,
      message: "Article created successfully",
      article: newArticle,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while creating article: ${error.message}`,
    };
  }
}

// Get an article by ID
async function getArticleById(id) {
  try {
    const article = await Article.findById(id).populate("author contributors");
    if (!article) {
      return { success: false, message: "Article not found" };
    }
    return { success: true, article };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching article: ${error.message}`,
    };
  }
}

// Update an existing articlevs
async function updateArticle(data) {
  try {
    const update = {
      title: data.title,
      desc: data.desc,
      content: data.content,
      author: data.author,
      contributors: data.contributors,
      tags: data.tags,
      status: data.status || "draft",
      publishedAt: data.publishedAt || null,
    };

    // Use upsert: true to create a new article if it doesn't exist
    const updatedArticle = await Article.findByIdAndUpdate(
      data._id,
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true } // upsert creates if not found, setDefaultsOnInsert applies default schema values
    );

    return {
      success: true,
      message: updatedArticle.isNew
        ? "New article created successfully"
        : "Article updated successfully",
      article: updatedArticle,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error while updating/creating article: ${error.message}`,
    };
  }
}

// Delete an article by ID
async function deleteArticle(id) {
  try {
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return { success: false, message: "Article not found" };
    }
    return { success: true, message: "Article deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: `Error while deleting article: ${error.message}`,
    };
  }
}

// Get articles by tags
async function getArticlesByTags(tags) {
  try {
    const articles = await Article.find({ tags: { $in: tags } });
    return { success: true, articles };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching articles by tags: ${error.message}`,
    };
  }
}

// Get articles by author
async function getArticlesByAuthor(author) {
  try {
    const articles = await Article.find({ author }).populate("contributors");
    return { success: true, articles };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching articles by author: ${error.message}`,
    };
  }
}

// Get all articles
async function getArticlesAll() {
  try {
    const articles = await Article.find().populate("author contributors");
    return { success: true, articles };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching all articles: ${error.message}`,
    };
  }
}

async function getArticlesByTitle(title) {
  try {
    const articles = await Article.find({
      title: { $regex: title, $options: "i" },
    });
    return { success: true, articles };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching articles by title: ${error.message}`,
    };
  }
}

async function getArticleBySessionDoc(sessionDoc) {
  try {
    const article = await Article.findOne({ sessionDoc: sessionDoc });
    console.log(article);
    if (!article) {
      return { success: false, message: "Article not found" };
    }
    return { success: true, article };
  } catch (error) {
    return {
      success: false,
      message: `Error fetching article by sessionDoc: ${error.message}`,
    };
  }
}

async function generateAiArticles(search, tags) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.Gemini_API_KEY}`;
  const refinedPrompt = `Generate an article about "${search}" using information from reliable sources. 

The content of the article should adhere to the following allowed HTML tags: 
<p>, <a>, <strong>, <em>, <s>, <mark>, <sub>, <u>, <code>, <h1>-<h6>, <blockquote>, <ol>, <ul>, <li>, <span>, <hr>, <table>, <tr>, <th>, <td>. 

Provide the response in the following JSON format:
{
  "title": "A catchy title for the article",
  "desc": "A brief description of the article (2-3 sentences)",
  "content": "The main content of the article (3-4 paragraphs) since I am using TipTap editor document format, so the content can be in HTML format. Use <br/> after each paragraph.",
  "tags": ${JSON.stringify(tags)},
  "status": "published",
  "publishedAt": "${new Date().toISOString()}",
  "source": "The source of information (e.g., 'GFG', 'Blogs', 'Scientific Journals', 'Wikipedia', or any other website. Mention only 1 source.)"
}
You must use a reliable source to generate the content. the comnent should not be completely Ai generated. you can provide reference you tube videos or se i frames, img if neededed. Ensure the content is factual, informative, and suitable for an educational platform.
Make sure the JSON output does not include any unescaped special characters like backslashes (\), double quotes ("), or other problematic symbols. Escape such characters properly if needed to ensure the response is valid JSON. Provide the JSON response as plain text without formatting. response should not contain backticks in start or end`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: refinedPrompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    const generatedText = jsonResponse.candidates[0].content.parts[0].text;
    // console.log("Generated text:", generatedText);
    const articleData = JSON.parse(generatedText);
    const newArticle = new Article({
      ...articleData,
    });
    await newArticle.save();
    return {
      success: true,
      message: "Article created successfully",
      article: newArticle,
    };
  } catch (error) {
    console.error("Error generating AI article:", error);
    return {
      success: false,
      message: "Failed to generate AI article",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function generateAiDesc(body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.Gemini_API_KEY}`;
  const refinedPrompt = `Generate a description for the following article to help with SEO: ${body.title} - ${body.content}. The description should be concise and include relevant keywords. PLease return an empty string if you are unable to generate a description.`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: refinedPrompt }] }],
      }),
    });
    const jsonResponse = await response.json();
    return jsonResponse.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

module.exports = {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticlesByTags,
  getArticlesByAuthor,
  getArticlesAll,
  getArticlesByTitle,
  getArticleBySessionDoc,
  generateAiArticles,
  generateAiDesc,
};
