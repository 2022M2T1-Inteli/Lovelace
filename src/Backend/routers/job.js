const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { companyAuth } = require('../middlewares/auth')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// EXPRESS ROUTER
const router = express.Router()

// ROTA DE VER VAGAS
router.get('/job', companyAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // GET VAGAS
        const jobs = await db.all(`SELECT * FROM job WHERE companyId='${req.company.id}'`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        // RESPOSTA
        res.send(jobs)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// ROTA DE CRIAR VAGA
router.post('/job/create', companyAuth, async (req, res) => {
    try {
        const { type, workModel, area, hardSkills, softSkills } = req.body

        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // INSERIR VAGA
        const job = await db.run(
            `INSERT INTO job (companyId, workModel, type, area) VALUES ('${req.company.id}', '${workModel}', '${type}', '${area}')`
        )

        // INSERIR COMPETÊNCIAS TÉCNICAS
        for (let i = 0; i < hardSkills.length; i++) {
            await db.run(`INSERT INTO jobHardSkill (hardSkillId, jobId) VALUES ('${hardSkills[i]}', '${job.lastID}')`)
        }

        // INSERIR COMPETÊNCIAS INTERPESSOAIS
        for (let i = 0; i < softSkills.length; i++) {
            await db.run(`INSERT INTO jobSoftSkill (softSkillId, jobId) VALUES ('${softSkills[i]}', '${job.lastID}')`)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // RESPOSTA
        res.redirect('/views/jobs/jobs.html')
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
