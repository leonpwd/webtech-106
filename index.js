const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const labs = fs.readdirSync(__dirname)
  .filter(f => fs.statSync(path.join(__dirname, f)).isDirectory() && f.startsWith('lab'));

const labPorts = { lab1: 8081, lab2: 8082 };
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
      const port = labPorts[lab] || 3000;
      return `<li><a href="http://localhost:${port}/" target="_blank">${lab} (port ${port})</a></li>`;
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
