const express = require('express');
const handles = require('./handles');

const app = express();
const PORT = process.env.PORT || 8082;

app.use('/', handles);

// Default 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).type('text').send(
    'La page /hello vous dit bonjour, et vous pouvez personnaliser la réponse avec /hello?name=VotreNom. '
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});