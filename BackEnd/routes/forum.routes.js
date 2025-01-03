const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread.model');
const Comment = require('../models/Comment.model');

router.get('/threads', async (req, res) => {
  try {
    const posts = await Thread.find().populate('author','name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/threads', async (req, res) => {
  const thread = new Thread({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
  });

  try 
  {
    const newPost = await thread.save();
    res.status(201).json(newPost);
  } 
  catch (err) 
  {
    res.status(400).json({ message: err.message });
  }
});

router.get('/threads/:id', async (req, res) => {
  try 
  {
    const thread = await Thread.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.author', 'name');
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread);
  } 
  catch (err) 
  {
    res.status(500).json({ message: err.message });
  }
});

router.post('/threads/:id/comments', async (req, res) => {
  try 
  {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const comment = new Comment({
      content: req.body.content,
      author: req.user.id,
      thread: thread._id,
    });

    const newComment = await comment.save();
    thread.comments.push(newComment._id);
    await thread.save();

    res.status(201).json(newComment);
  } 
  catch (err) 
  {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;