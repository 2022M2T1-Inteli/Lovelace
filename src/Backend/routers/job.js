// IMPORTAR BIBLIOTECAS
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// IMPORTAR MIDDLEWARE DE EMPRESA
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
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // GET VAGAS
        const jobs = await db.all(`SELECT * FROM job WHERE companyId='${req.company.id}'`)

        // CRIAR ARRAY VAZIO DE JOBS
        const jobArray = []

        // PREENCHER OS CAMPOS DE SKILLS E AREA DE CADA JOB
        for (job of jobs) {
            job.skills = await db.all(
                `SELECT * FROM skill INNER JOIN jobSkill ON skill.id=jobSkill.skillId WHERE jobSkill.jobId=${job.id}`
            )

            job.area = await db.get(`select * from area WHERE id='${job.areaId}'`)

            jobArray.push(job)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // RESPOSTA
        res.send(jobArray)
    } catch (err) {
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

// ROTA DE CRIAR VAGA
router.post('/job/create', companyAuth, async (req, res) => {
    try {
        // DESESTRUTURAR REQ.BODY E FORMAR VARIÁVEIS
        const { type, workModel, area, skills } = req.body

        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // INSERIR VAGA
        const job = await db.run(
            `INSERT INTO job (companyId, workModel, type, areaId) VALUES ('${req.company.id}', '${workModel}', '${type}', '${area}')`
        )

        // INSERIR COMPETÊNCIAS TÉCNICAS
        for (let i = 0; i < skills.length; i++) {
            await db.run(`INSERT INTO jobSkill (skillId, jobId) VALUES ('${skills[i]}', '${job.lastID}')`)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // RESPOSTA
        res.redirect('/views/jobs/jobs.html')
    } catch (err) {
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

router.get('/job/:id/getUsers', companyAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // PEGAR O JOB DA COMPANHIA SELECIONADA
        const job = await db.get(
            `SELECT * FROM job WHERE job.id='${req.params.id}' AND job.companyId='${req.company.id}'`
        )

        // DEVOLVER ERRO CASO NENHUMA VAGA TENHA SIDO ENCONTRADA
        if (!job) {
            throw new Error('Nenhuma vaga encontrada!')
        }

        // GET ALL SKILLS
        const jobSkills = await db.all(
            `SELECT * FROM jobSkill INNER JOIN job ON job.id = jobSkill.jobId WHERE jobId = '${job.id}'`
        )

        // GET TODAS AS CANDIDATAS QUE APLICARAM PARA A EMPRESA
        const appliedUsers = await db.all(
            `SELECT userCompany.* FROM userCompany INNER JOIN company ON company.id=userCompany.companyId WHERE company.id='${req.company.id}'`
        )

        // CRIAR ARRAY VAZIO DE IDS DE USUÁRIOS
        const matchUserIds = []

        // FAZER LOOP EM CADA USUÁRIA QUE DEU LIKE NA EMPRESA
        for (companyUser of appliedUsers) {
            // CRIAR ARRAY VAZIO DE SKILLS IGUAIS ENTRE A VAGA E A USUÁRIA
            let equalSkills = []

            // SKILLS DA USUÁRIA
            const userSkills = await db.all(
                `SELECT userSkill.* FROM userSkill INNER JOIN user ON userSkill.userId=user.id WHERE user.id='${companyUser.userId}'`
            )

            // LOOP EM CADA SKILL DA USUÁRIA
            for (userSkill of userSkills) {
                // LOOP EM CADA SKILL DA VAGA
                for (jobSkill of jobSkills) {
                    // CHECAR SE A SKILL DA USUÁRIA É IGUAL A SKILL DA VAGA
                    if (jobSkill.skillId == userSkill.skillId) {
                        // ADICIONAR SKILL AO ARRAY EQUALSKILLS
                        equalSkills.push(jobSkill.skillId)
                    }
                }
            }

            // VARIÁVEL DE MATCH -> NÚMERO DE SKILLS QUE BATEM ENTRE A USUÁRIA E A VAGA DIVIDIDO PELO NÚMERO TOTAL DE SKILLS QUE A VAGA REQUER
            let matchPercentage = equalSkills.length / jobSkills.length

            // CHECAR SE O MATCH FOI MAIOR QUE 50%
            if (matchPercentage >= 0.5) {
                // ADICIONAR A USUÁRIA AO ARRAY MATCHUSERIDS
                matchUserIds.push(companyUser.userId)
            }
        }

        // CRIAR ARRAY VAZIO DE USUÁRIAS
        let users = []

        // FAZER LOOP EM CADA USUÁRIA DO ARRAY MATCHUSERIDS E ADICIONAR TODAS AS INFORMAÇÕES DAQUELA USUÁRIA AO ARRAY USERS
        for (id of matchUserIds) {
            const fetchedUser = await db.get(`SELECT * FROM user WHERE id='${id}'`)
            users.push(fetchedUser)
        }

        // FECHAR BANCO DE DADOS
        await db.close()

        // DEVOLVER USUÁRIOS COM MATCH
        res.send(users)
    } catch (err) {
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

router.delete('/job/:id', companyAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // DELETAR VAGA
        await db.run(`DELETE FROM job WHERE id='${req.params.id}' AND companyId='${req.company.id}'`)

        // DELETAR SKILLS DA VAGA
        await db.run(`DELETE FROM jobSkill WHERE jobId='${req.params.id}'`)

        // FECHAR BANCO DE DADOS
        await db.close()

        // DEVOLVER RESPOSTA
        res.send()
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

router.get('/job/getUsers/:userId', companyAuth, async (req, res) => {
    try {
        // ABRIR BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // GET DE USUÁRIA
        const user = await db.get(
            `SELECT id, firstName, lastName, country, aboutYou, email, phone, birthDate, userAddressId FROM user WHERE id='${req.params.userId}'`
        )

        //  GET DO ENDEREÇO DA USUÁRIA
        const address = await db.get(`SELECT city, state FROM address WHERE id='${user.userAddressId}'`)

        // PREENCHER ENDEREÇO DA USUÁRIA NA VARIÁVEL USER
        user.address = address

        // PEGAR TODAS AS SKILLS DA USUÁRIA
        const userSkills = await db.all(
            `SELECT * FROM userSkill INNER JOIN skill ON userSkill.skillId = skill.id WHERE userSkill.userId = '${req.params.userId}'`
        )

        // PREENCHER SKILLS DA USUÁRIA NA VARIÁVEL USER
        user.skills = userSkills

        // FECHAR BANCO DE DADOS
        await db.close()

        // DEVOLVER USUÁRIA
        res.send(user)
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

module.exports = router
