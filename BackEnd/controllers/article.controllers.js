const Article = require("../models/Article.model");

// Create a new article
async function createArticle(data) {
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
    return { success: true, message: "Article created successfully", article: newArticle };
  } catch (error) {
    return { success: false, message: `Error while creating article: ${error.message}` };
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
    return { success: false, message: `Error fetching article: ${error.message}` };
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
    return { success: false, message: `Error while updating/creating article: ${error.message}` };
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
    return { success: false, message: `Error while deleting article: ${error.message}` };
  }
}

// Get articles by tags
async function getArticlesByTags(tags) {
  try {
    const articles = await Article.find({ tags: { $in: tags } });
    return { success: true, articles };
  } catch (error) {
    return { success: false, message: `Error fetching articles by tags: ${error.message}` };
  }
}

// Get articles by author
async function getArticlesByAuthor(author) {
  try {
    const articles = await Article.find({ author }).populate("contributors");
    return { success: true, articles };
  } catch (error) {
    return { success: false, message: `Error fetching articles by author: ${error.message}` };
  }
}

// Get all articles
async function getArticlesAll() {
  try {
    const articles = await Article.find().populate("author contributors");
    return { success: true, articles };
  } catch (error) {
    return { success: false, message: `Error fetching all articles: ${error.message}` };
  }
}

async function getArticlesByTitle(title) {
  try {
    const articles = await Article.find({
      title: { $regex: title, $options: "i" },
    });
    return { success: true, articles };
  } catch (error) {
    return { success: false, message: `Error fetching articles by title: ${error.message}` };
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
};
