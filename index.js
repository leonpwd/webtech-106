const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Detect if running in Docker and set the base URL accordingly
const isDocker = process.env.DOCKER === 'true';
const baseUrl = isDocker ? 'https://webtechserver.leobob.duckdns.org' : 'http://localhost:8082';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Webtech Labs Index</title>
  <style>
    body { font-family: sans-serif; margin: 2em; }
    h1 { color: #2c3e50; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.5em 0; }
    a { color: #2980b9; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Web Technologies Labs</h1>
  <p>Access the labs server:</p>
  <ul>
    <li>
      <a href="${baseUrl}" target="_blank">
        Labs Server (${isDocker ? 'webtechserver.leobob.duckdns.org' : 'localhost:8082'})
      </a>
    </li>
  </ul>
  <p>All labs are available on this single server. Use <code>npm run lab2</code> to start the server locally.</p>
</body>
</html>`;
  
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Index page available at http://localhost:${PORT}/`);
});
