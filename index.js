const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const labs = fs.readdirSync(__dirname)
  .filter(f => fs.statSync(path.join(__dirname, f)).isDirectory() && f.startsWith('lab'));

const labPorts = { lab1: 8081, lab2: 8082, lab3: 8083 };

const labUrlsDocker = {
  lab1: 'https://webtechserver.leobob.duckdns.org',
};

const isDocker = process.env.DOCKER === 'true';

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
      <a href="${isDocker ? 'https://webtechserver.leobob.duckdns.org' : 'http://localhost:8081'}" target="_blank">
        Labs Server (${isDocker ? 'webtechserver.leobob.duckdns.org' : 'localhost:8081'})
      </a>
    </li>
  </ul>
  <p>All labs are available on this single server. Use <code>npm run lab2</code> to start the server locally.</p>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}).listen(PORT, () => {
  console.log(`Index page available at http://localhost:${PORT}/`);
});
