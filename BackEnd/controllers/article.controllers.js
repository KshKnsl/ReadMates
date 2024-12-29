const User = require("../models/User.model");
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
    // console.log("Article Updated successfully");
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

    const user = await User.findById(data.author);
    if (user) {
      try {
        user.articles.push(newArticle._id);
        user.points += 30;
        const newBadges = [];
        await user.save();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
    
    for (let i = 0; i < data.contributors.length; i++) {
      const contributorId = data.contributors[i];
      const contributor = await User.findById(contributorId);
      if (contributor) {
      contributor.contributions.push({ articleId: newArticle._id, points: 10 });
      contributor.points += 10;
      await contributor.save();
      }
    }
  
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
    const articles = await Article.find({ author }).populate(
      "contributors author"
    );
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
    if (!article) {
      return { success: false, message: "Article not found" };
    }
    return { success: true, article };
  } catch (error) {
    return error;
  }
}

async function generateAiArticles(search, tags) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.Gemini_API_KEY}`;
  const refinedPrompt = `Generate an article about "${search}" using information from reliable sources. 


  Instructions:
  1. Use reliable sources and factual information
  2. Include proper HTML formatting using only these tags: <p>, <a>, <strong>, <em>, <s>, <mark>, <sub>, <u>, <code>, <h1>-<h6>, <blockquote>, <ol>, <ul>, <li>, <span>, <hr>, <table>, <tr>, <th>, <td>
  3. Structure the content with clear sections and proper spacing
  4. Add relevant media (YouTube videos, images) if applicable
  5. Ensure all content is educational and informative
  
  Return the data in this exact format (without any code formatting or language specification):
  {
    "title": "Title here",
    "desc": "Description here",
      "content": "The main content of the article (at least 3-4 short paragraphs)(or properly structured blog) since I am using TipTap editor document format, so the content can be in HTML format. Use <br/> after each paragraph.",
  "tags": ${JSON.stringify(tags)},
  "status": "published",
  "publishedAt": "${new Date().toISOString()}",
  "source": "The source of information (e.g., 'GFG', 'Blogs', 'Scientific Journals', 'Wikipedia', or any other website. Mention only 1 source.)"
}
You must use a reliable source to generate the content. the comnent should not be completely Ai generated. you can provide reference you tube videos or se i frames, img if neededed. Ensure the content is factual, informative, and suitable for an educational platform.
Make sure the JSON output does not include any unescaped special characters like backslashes (\), double quotes ("), or other problematic symbols. Escape such characters properly if needed to ensure the response is valid JSON. Provide the JSON response as plain text without formatting. response should not contain backticks in start or end as i am using JSON.parse() to parse the response. your generated text must now have language specified or formated as code,.
response must be completely in plain text without any code formatting or language specification. response should not contain backticks in start or end`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: refinedPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response}`);
    // }

    const jsonResponse = await response.json();
    // console.log(jsonResponse);
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
  const refinedPrompt = `Generate a description for the following article to help with SEO: ${body.title} - ${body.content}. The description should be concise and include relevant keywords. PLease return an empty string if you are unable to generate a description. Since i have to parse your response to json, please make sure that the response does not contain any special characters like backslashes (\), double quotes ("), or backtick or json format. Escape such characters properly if needed to ensure the response is valid JSON. Provide the response as plain text without formatting. response should not contain backticks in start or end`;
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
