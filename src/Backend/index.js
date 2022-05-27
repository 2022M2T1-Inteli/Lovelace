const express = require('express')
const app = express()
const port = 3000
const path = require('path')

// SETUP DE VARIÁVEIS ENV
require('dotenv').config()

// PARSE REQUEST BODY
app.use(express.json())

// PARSE COOKIES
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// SETUP CROSS ORIGIN
const cors = require('cors')
app.use(
    cors({
        credentials: true,
    })
)

// PERMITE QUE A PASTA FRONTEND SEJA ACESSADA
app.use(express.static(path.join(__dirname + '/../Frontend')))

// REDIRECIONAMENTO PARA A LANDING PAGE
app.get('/', (req, res) => {
    res.redirect('/views/landingPage/landingPage.html')
})

// ROTAS DO USUÁRIO
const userRoutes = require('./routers/user')
app.use(userRoutes)

// ROTAS DA EMPRESA
const companyRoutes = require('./routers/company')
app.use(companyRoutes)

// ROTAS DE VAGAS
const jobRoutes = require('./routers/job')
app.use(jobRoutes)

// ROTAS DE SKILLS
const skillRoutes = require('./routers/skill')
app.use(skillRoutes)

// CRIAR SERVIDOR
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
