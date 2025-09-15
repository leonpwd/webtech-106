// Define a string constant concatenating strings
const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'       <h1>WEBTEEEECH</h1>' +
'       <p>Hello World!</p>' +
'    </body>' +
'</html>'


// ./index.js
const http = require('http')
const handles = require('./handles')

http
.createServer(handles.serverHandle)
.listen(8080)