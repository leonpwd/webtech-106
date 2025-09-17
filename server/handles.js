const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();


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

// /hello route
router.get('/hello', (req, res) => {
  const name = req.query.name || 'Anon';
  res.type('text').send('Hello ' + name);
});

// Default 404 handler for unmatched routes
router.use((req, res) => {
  res.status(404).type('text').send(
    'La page /hello vous dit bonjour, et vous pouvez personnaliser la réponse avec /hello?name=VotreNom. '
  );
});

module.exports = router;