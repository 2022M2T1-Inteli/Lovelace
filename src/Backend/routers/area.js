const express = require('express')

const { adminAuth } = require('../middlewares/auth')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// EXPRESS ROUTER
const router = express.Router()

router.get('/area', async (req, res) => {
    try {
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        const areas = await db.all(`SELECT * FROM area`)

        await db.close()

        res.send(areas)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/area/create', adminAuth, async (req, res) => {
    try {
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        await db.run(`INSERT INTO area (name) VALUES ('${req.body.name}')`)

        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete('/area/:id', adminAuth, async (req, res) => {
    try {
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        const job = await db.get(`SELECT * FROM job WHERE areaId='${req.params.id}'`)
        if (job) {
            throw new Error('Área atrelada a uma vaga!')
        }

        await db.run(`DELETE FROM area WHERE id='${req.params.id}'`)

        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
