// IMPORTANDO BIBLIOTECAS
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// IMPORTAR MIDDLEWARE DE ADMIN
const { adminAuth } = require('../middlewares/auth')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// EXPRESS ROUTER
const router = express.Router()

// FUNÇÃO PARA GERAR TOKEN
const generateAuthToken = async (id) => {
    const token = await jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: 2 * 60 * 60, // TEMPO DE EXPIRAÇÃO
    })
    return token
}

// ROTA DE FAZER LOGIN
router.post('/admin/login', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // ENCONTRAR USUÁRIO
        const admin = await db.get(`SELECT * FROM admin WHERE email='${req.body.email}'`)

        // DAR ERRO CASO O USUÁRIO NÃO SEJA ENCONTRADO
        if (!admin) {
            throw new Error('Não foi possível entrar')
        }

        // CHECAR SENHA
        const isMatch = await bcrypt.compare(req.body.password, admin.password)

        // DAR ERRO CASO A SENHA NÃO ESTEJA CERTA
        if (!isMatch) {
            throw new Error('Não foi possível entrar')
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // GERAR TOKEN JWT
        const token = await generateAuthToken(admin.id)

        // SETAR TOKEN NOS COOKIES
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 2 * 60 * 60 * 1000, // 2 HORAS
            path: '/',
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        })

        // RESPOSTA
        res.redirect('/views/companyApproval/companyApproval.html')
    } catch (err) {
        // DEVOLVER ERRO
        res.status(400).send(err.message)
    }
})

router.get('/admin/companyApproval', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // GET DE TODAS AS EMPRESAS QUE AINDA NÃO FORAM APROVADAS
        const companies = await db.all(`SELECT * FROM company WHERE isApproved=0`)

        // LOOP PARA PREENCHER O ENDEREÇO DE CADA EMPRESA
        for (i in companies) {
            const address = await db.get(`SELECT * FROM address WHERE id='${companies[i].companyAddressId}'`)
            companies[i].address = address
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER EMPRESAS ENCONTRADAS
        res.send(companies)
    } catch (err) {
        // DEVOLVER STATUS DE ERRO 
        res.status(400).send()
    }
})

router.get('/admin/companyApproval/:id', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // ENCONTRAR A EMPRESA
        const company = await db.get(`SELECT * FROM company WHERE isApproved=0 AND id='${req.params.id}'`)

        // PREENCHER O ENDEREÇO DA EMPRESA
        const address = await db.get(`SELECT * FROM address WHERE id='${company.companyAddressId}'`)
        company.address = address

        // PREENCHER O RECRUTADOR DA EMPRESA
        const recruter = await db.get(`SELECT * FROM recruter WHERE id='${company.recruterId}'`)
        company.recruter = recruter

        // FECHAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER A EMPRESA
        res.send(company)
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

router.patch('/admin/companyApproval/:id', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // APROVAR EMPRESA
        await db.run(`UPDATE company SET isApproved='1' WHERE id='${req.params.id}'`)

        // FECHAR BANCO DE DADOS
        await db.close()

        // DEVOLVER RESPOSTA
        res.send()
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

router.delete('/admin/company/:id', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // ENCONTRAR A EMPRESA
        const company = await db.get(`SELECT * FROM company WHERE id='${req.params.id}'`)

        // DELETAR TODOS OS REGISTROS LIGADOS A EMPRESA
        await db.run(`DELETE FROM address WHERE id='${company.companyAddressId}'`)
        await db.run(`DELETE FROM recruter WHERE id='${company.recruterId}'`)

        // DELETAR A EMPRESA
        await db.run(`DELETE FROM company WHERE id='${req.params.id}'`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER UMA RESPOTA
        res.send()
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

module.exports = router
