const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Example hard-coded database
const db = {
  articles: [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      title: 'My article',
      content: 'Content of the article.',
      date: '04/10/2022',
      author: 'Liz Gringer'
    },
    // ... more articles
  ],
  comments: [
    {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      timestamp: 1664835049,
      content: 'Content of the comment.',
      articleId: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      author: 'Bob McLaren'
    },
    // ... more comments
  ]
};


// /about route serving content/about.json
router.get('/about', (req, res) => {
  const filePath = path.join(__dirname, 'content', 'about.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).type('text').send('About page not found.');
    } else {
      res.type('json').send(data);
    }
  });
});


// Article API routes
// GET /articles - list all articles
router.get('/articles', (req, res) => {
  res.json(db.articles);
});

// POST /articles - add a new article
router.post('/articles', express.json(), (req, res) => {
  const { title, content, date, author } = req.body;
  const id = require('crypto').randomUUID();
  const article = { id, title, content, date, author };
  db.articles.push(article);
  res.status(201).json(article);
});


// GET /articles/:articleId - get an article by ID
router.get('/articles/:articleId', (req, res) => {
  const article = db.articles.find(a => a.id === req.params.articleId);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
});

// Comment API routes for articles
// GET /articles/:articleId/comments - get all comments for an article
router.get('/articles/:articleId/comments', (req, res) => {
  const comments = db.comments.filter(c => c.articleId === req.params.articleId);
  res.json(comments);
});

// POST /articles/:articleId/comments - add a new comment to an article
router.post('/articles/:articleId/comments', express.json(), (req, res) => {
  const { content, author } = req.body;
  const id = require('crypto').randomUUID();
  const timestamp = Math.floor(Date.now() / 1000);
  const comment = { id, timestamp, content, articleId: req.params.articleId, author };
  db.comments.push(comment);
  res.status(201).json(comment);
});

// GET /articles/:articleId/comments/:commentId - get a specific comment for an article
router.get('/articles/:articleId/comments/:commentId', (req, res) => {
  const comment = db.comments.find(c => c.articleId === req.params.articleId && c.id === req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.json(comment);
});

// /hello route
router.get('/hello', (req, res) => {
  const name = req.query.name || 'Anon';
  res.type('text').send('Hello ' + name);
});


module.exports = router;