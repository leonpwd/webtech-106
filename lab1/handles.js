// ./handles.js
// Necessary imports
// Add missing imports
const url = require('url');
const qs = require('querystring');
const { isAbsolute } = require('path');

module.exports = {
  serverHandle: function (req, res) {
    const route = url.parse(req.url);
    const path = route.pathname;
    const params = qs.parse(route.query);

    // Dynamic JSON file serving
    if (path.startsWith('/')) {
      const fs = require('fs');
      const jsonFile = path.replace(/^\//, '') + '.json'; // take the path and add .json
      const filePath = __dirname + '/content/' + jsonFile; // all files are in content folder
      if (fs.existsSync(filePath)) { 
        res.writeHead(200, {'Content-Type': 'application/json'});
        const data = fs.readFileSync(filePath);
        res.end(data);
        return;
      }
    }

    // /hello route
    if (path === '/hello' && 'name' in params) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('Hello ' + params['name']);
      res.end();
      return;
    }else if (path === '/hello') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Hello Anon');
        res.end();
        return;
    }


    // Default 404
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('La page /hello vous dit bonjour, et vous pouvez personnaliser la réponse avec /hello?name=VotreNom. ');
    res.end();
  }
};