const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { userAuth } = require('../middlewares/auth')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// EXPRESS ROUTER
const router = express.Router()

// FUNÇÃO PARA GERAR TOKEN
const generateAuthToken = async (id) => {
    const token = await jwt.sign({ id }, process.env.JWT_USER_SECRET, {
        expiresIn: 2 * 60 * 60, // TEMPO DE EXPIRAÇÃO
    })
    return token
}

// ROTA DE PEGAR MEU USUÁRIO
router.get('/user/me', userAuth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// ROTA DE CRIAR CONTA
router.post('/user/signUp', async (req, res) => {
    try {
        const {
            street,
            cep,
            neighborhood,
            city,
            state,
            complement,
            email,
            firstName,
            lastName,
            country,
            phone,
            civilState,
            birthDate,
            cpf,
            rg,
            aboutYou,
            hardSkills,
            softSkills
        } = req.body

        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR SE USUÁRIO EXISTE
        const existingUser = await db.get(`SELECT * FROM user WHERE email='${email}'`)
        if (existingUser) {
            throw new Error('Uma conta com esse Email já existe')
        }

        // INSERIR ENDEREÇO DO USUÁRIO
        const userAddress = await db.run(
            `INSERT INTO address (street, cep, neighborhood, city, state, complement) VALUES ('${street}', '${cep}', '${neighborhood}', '${city}', '${state}', '${complement}')`
        )

        // ENCRYPT PASSWORD
        const password = await bcrypt.hash(req.body.password, 8)

        // INSERIR USUÁRIO
        const user = await db.run(
            `INSERT INTO user (email, password, firstName, lastName, country, phone, civilState, birthDate, cpf, rg, aboutYou, userAddressId) VALUES ('${email}', '${password}', '${firstName}', '${lastName}', '${country}', '${phone}', '${civilState}', '${birthDate}', '${cpf}', '${rg}', '${aboutYou}', '${userAddress.lastID}')`
        )

        // INSERIR COMPETÊNCIAS TÉCNICAS DO USUÁRIO
        for (let i = 0; i < hardSkills.length; i++) {
            await db.run(`INSERT INTO userHardSkill (hardSkillId, userId) VALUES ('${hardSkills[i]}', '${user.lastID}')`)
        }

        // INSERIR COMPETÊNCIAS INTERPESSOAIS DO USUÁRIO
        for (let i = 0; i < softSkills.length; i++) {
            await db.run(`INSERT INTO userSoftSkill (softSkillId, userId) VALUES ('${softSkills[i]}', '${user.lastID}')`)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // GERAR TOKEN JWT
        const token = await generateAuthToken(user.lastID)

        // SETAR TOKEN NOS COOKIES
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 2 * 60 * 60 * 1000, // 2 HORAS
            path: '/',
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        })

        // RESPOSTA
        res.redirect('/views/companyMatch/companyMatch.html')
    } catch (err) {
        console.log(err)
        res.status(400).send(err.message)
    }
})

// ROTA DE FAZER LOGIN
router.post('/user/login', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // ENCONTRAR USUÁRIO
        const user = await db.get(`SELECT * FROM user WHERE email='${req.body.email}'`)

        if (!user) {
            throw new Error('Não foi possivel entrar')
        }

        // CHECAR SENHA
        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isMatch) {
            throw new Error('Não foi possivel entrar')
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // GERAR TOKEN JWT
        const token = await generateAuthToken(user.id)

        // SETAR TOKEN NOS COOKIES
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 2 * 60 * 60 * 1000, // 2 HORAS
            path: '/',
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        })

        // RESPOSTA
        res.redirect('/views/companyMatch/companyMatch.html')
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/user/logout', userAuth, async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 2 * 60 * 60 * 1000,
            path: '/',
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        })
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/user/getCompanies', userAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // const companies = db.all(`SELECT * FROM company WHERE `)

        // FECHAR O BANCO DE DADOS
        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
