const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const labs = fs.readdirSync(__dirname)
  .filter(f => fs.statSync(path.join(__dirname, f)).isDirectory() && f.startsWith('lab'));

const labPorts = { lab1: 8081, lab2: 8082, lab3: 8083 };

const labUrlsDocker = {
  lab1: 'https://webtechlab1.leobob.duckdns.org',
  lab2: 'https://webtechlab2.leobob.duckdns.org',
  lab3: 'https://webtechlab3.leobob.duckdns.org'
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
  <p>Select a lab to view or run:</p>
  <ul>
    ${labs.map(lab => {
      if (isDocker && labUrlsDocker[lab]) {
        return `<li><a href="${labUrlsDocker[lab]}" target="_blank">${lab} (${labUrlsDocker[lab]})</a></li>`;
      } else {
        const port = labPorts[lab] || 3000;
        return `<li><a href="http://localhost:${port}/" target="_blank">${lab} (port ${port})</a></li>`;
      }
    }).join('\n')}
  </ul>
  <p>Each lab runs its own server on a different port. Use <code>npm run labX</code> to start a specific lab.</p>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}).listen(PORT, () => {
  console.log(`Index page available at http://localhost:${PORT}/`);
});
