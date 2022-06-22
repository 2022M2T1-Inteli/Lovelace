const express = require('express')

const { adminAuth } = require('../middlewares/auth')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// EXPRESS ROUTER
const router = express.Router()

// ACESSA O BANCO DE DADOS
router.get('/area', async (req, res) => {
    try {
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        const areas = await db.all(`SELECT * FROM area`)

        await db.close()

        res.send(areas)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// SELECIONA "ÁREA" DO BANCO DE DADOS
router.post('/area/create', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })
        // CHECAR SE A ÁREA JÁ EXISTE
        const area = await db.get(`SELECT * FROM area WHERE name='${req.body.name}'`)
        if (area) {
            throw new Error('Essa área já existe!')
        }
         // INSERIR ÁREA AO BANCO DE DADOS
        await db.run(`INSERT INTO area (name) VALUES ('${req.body.name}')`)
        // FECHAR BANCO DE DADOS
        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// DELETA ÁREA DO BANCO DE DADOS
router.delete('/area/:id', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })
        // CONFERIR SE A ÁREA ESTÁ ATRLADA À UMA VAGA EXISTENTE
        const job = await db.get(`SELECT * FROM job WHERE areaId='${req.params.id}'`)
        if (job) {
            throw new Error('Área atrelada a uma vaga!')
        }
        // DELETAR ÁREA
        await db.run(`DELETE FROM area WHERE id='${req.params.id}'`)
        // FECHAR ÁREA 
        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
