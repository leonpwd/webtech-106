const express = require('express')
const handles = require('./handles')

const app = express()
app.use(express.json())

app.use('/', handles)

// default 404
app.use((req, res) => {
  res.status(404).send('Not Found')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
