const articleSchema = require("../models/Article.model");

async function createArticle(data) 
{
  try 
  {
    const newArticle = new articleSchema(
    {
      title: data.title,
      desc: data.desc,
      content: data.content,
      author: data.author,
      contributors: data.contributors,
      tags: data.tags,
      status: data.status,
      publishedAt: data.publishedAt,
    });

    await newArticle.save();
    return { success: true, message: "Article created successfully" };
  } 
  catch (error) 
  {
    return { success: false, message: `Error while creating article ${error}` };
  }
}

async function findArticle(id) 
{
  try 
  {
    const article = await articleSchema.findById(id);
    return article;
  } 
  catch (error) 
  {
    return null;
  }
}

async function updateArticle(data) 
{
  const update = {
    title: data.title,
    desc: data.desc,
    content: data.content,
    author: data.author,
    contributors: data.contributors,
    tags: data.tags,
    status: data.status,
    publishedAt: data.publishedAt,
  };
  try 
  {
    let result = await articleSchema.findByIdAndUpdate(data._id, update);
    return { success: true, message: "Article updated successfully" };
  } 
  catch (error) 
  {
    return { success: false, message: `Error while updating article ${error}` };
  }
}

async function deleteArticle(id) 
{
  try 
  {
    await article;
    Schema.findByIdAndDelete(id);
    return { success: true, message: "Article deleted successfully" };
  } 
  catch (error) 
  {
    return { success: false, message: `Error while deleting article ${error}` };
  }
}

module.exports = { createArticle, findArticle, updateArticle, deleteArticle };