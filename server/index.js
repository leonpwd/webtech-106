const express = require('express');
const handles = require('./handles');

const app = express();
const PORT = process.env.PORT || 8081;

app.use('/', handles);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});