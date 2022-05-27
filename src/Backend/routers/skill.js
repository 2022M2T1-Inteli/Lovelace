const express = require('express')
const router = express.Router()

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

router.get('/softSkills', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // GET SOFT SKILLS
        const softSkills = await db.all(`SELECT * FROM softSkills`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        res.send(softSkills)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/softSkills/create', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR SE SKILL JÁ EXISTE
        const existingSkill = await db.get(`SELECT * FROM softSkills WHERE name='${req.body.name}'`)
        if (existingSkill) {
            throw new Error('Competência já existe')
        }

        // GET SOFT SKILLS
        await db.run(`INSERT INTO softSkills (name) VALUES ('${req.body.name}')`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get('/hardSkills', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // GET SOFT SKILLS
        const hardSkills = await db.all(`SELECT * FROM hardSkills`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        res.send(hardSkills)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/hardSkills/create', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR SE SKILL JÁ EXISTE
        const existingSkill = await db.get(`SELECT * FROM hardSkills WHERE name='${req.body.name}'`)
        if (existingSkill) {
            throw new Error('Competência já existe')
        }

        // GET SOFT SKILLS
        await db.run(`INSERT INTO hardSkills (name) VALUES ('${req.body.name}')`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
