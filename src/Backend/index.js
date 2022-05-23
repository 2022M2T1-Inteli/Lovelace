const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use(express.static(path.join(__dirname + '/../Frontend')));

app.get('/', (req, res) => {
    res.redirect('/views/landingPage/landingPage.html')
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
