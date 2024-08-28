const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Middleware to ensure user is available for views
router.use((req, res, next) => {
  res.locals.user = req.user; // Make user available in all views
  next();
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author').exec();
    res.render('index', { posts });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/new', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('post');
});

router.post('/new', async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const { title, body } = req.body;
  const post = new Post({ title, body, author: req.user._id });
  await post.save();
  res.redirect('/posts');
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author').exec();
    res.render('post', { post });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
