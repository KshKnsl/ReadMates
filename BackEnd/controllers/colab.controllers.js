const Colab = require("../models/Colab.model.js");

async function createColab(data) 
{
  const existingColab = await Colab.findOne({ sessionId: data.sessionId });
  if (existingColab) 
  {
    // console.log("Colab already exists");
    return existingColab;
  }
  try 
  {
    const newColab = new Colab({
      sessionId: data.sessionId,
      Contributor: [],
      author: data.author,
    });
    const colab = await newColab.save();
    return colab;
  } 
  catch (err) 
  {
    return err;
  }
}

// Add a contributor to a colab
async function addContributor(data) 
{
  const colab = await Colab.findOne({ sessionId: data.sessionId });
  if (!colab) 
  {
    return {message : "Colab not found"};
  }
  // console.log("Curent Collabs", colab.Contributor);
  let contributorExists = false;
  for (let i = 0; i < colab.Contributor.length; i++) 
    {
    if (colab.Contributor[i] === data.contributor) 
      {
      contributorExists = true;
      break;
    }
  }
  if (contributorExists)
  {
    return {message: "Contributor already exists"};
  }
  try 
  {
    colab.Contributor.push(data.contributor);
    // console.log("Adding colab");
    await colab.save();
    return colab;
  } 
  catch (err) 
  {
    return err;
  }
}
// Get a colab by sessionId
async function getColab(sessionId) {
  try {
    const colab = await Colab.findOne({ sessionId: sessionId });
    if (!colab) {
      return { message: "Colab not found" };
    }
    return colab;
  } catch (err) {
    return err;
  }
}

module.exports = { createColab, addContributor, getColab };
