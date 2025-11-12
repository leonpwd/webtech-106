const express = require('express')
const router = express.Router()
const crypto = require('crypto')

const db = {
  articles: [
    { id: '1', title: 'Welcome', body: 'Welcome to the API' }
  ],
  comments: []
}

router.get('/articles', (req, res) => {
  res.json(db.articles)
})

router.post('/articles', (req, res) => {
  const { title, body } = req.body
  const article = { id: crypto.randomUUID(), title, body }
  db.articles.push(article)
  res.status(201).json(article)
})

router.get('/articles/:articleId', (req, res) => {
  const a = db.articles.find(x => x.id === req.params.articleId)
  if(!a) return res.status(404).json({ error: 'not found' })
  res.json(a)
})

router.get('/articles/:articleId/comments', (req, res) => {
  const comments = db.comments.filter(c => c.articleId === req.params.articleId)
  res.json(comments)
})

router.post('/articles/:articleId/comments', (req, res) => {
  const { content } = req.body
  const comment = { id: crypto.randomUUID(), articleId: req.params.articleId, content, timestamp: Math.floor(Date.now()/1000) }
  db.comments.push(comment)
  res.status(201).json(comment)
})

router.get('/articles/:articleId/comments/:commentId', (req, res) => {
  const c = db.comments.find(x => x.id === req.params.commentId && x.articleId === req.params.articleId)
  if(!c) return res.status(404).json({ error: 'not found' })
  res.json(c)
})

module.exports = router
