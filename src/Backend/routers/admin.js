const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // ENCONTRAR USUÁRIO
        const admin = await db.get(`SELECT * FROM admin WHERE email='${req.body.email}'`)

        if (!admin) {
            throw new Error('Não foi possível entrar')
        }

        // CHECAR SENHA
        const isMatch = await bcrypt.compare(req.body.password, admin.password)

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
        res.status(400).send(err.message)
    }
})

router.patch('/admin/companyApproval/:id', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        await db.run(`UPDATE company SET isApproved='1' WHERE id='${req.params.id}'`)

        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send()
    }
})

module.exports = router
