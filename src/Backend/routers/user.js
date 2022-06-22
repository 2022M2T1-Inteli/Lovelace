// IMPORTAR BIBLIOTECAS
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// IMPORTAR MIDDLEWARE DE USUÁRIA
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
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // GET DE TODAS AS SKILLS DA USUÁRIA LOGADA
        const mySkills = await db.all(
            `SELECT * FROM skill INNER JOIN userSkill ON userSkill.skillId=skill.id WHERE userSkill.userId='${req.user.id}'`
        )

        // GET DO ENDEREÇO DA USUÁRIA LOGADA
        const myAddress = await db.get(
            `SELECT address.* FROM address INNER JOIN user ON address.id=user.userAddressId WHERE user.id='${req.user.id}'`
        )

        // PREENCHER OS CAMPOS SKILLS E ADDRESS COM OS REGISTROS ENCONTRADOS
        req.user.skills = mySkills
        req.user.address = myAddress

        // FEHCAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER O USUÁRIO
        res.send(req.user)
    } catch (err) {
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

// ROTA DE CRIAR CONTA
router.post('/user/signUp', async (req, res) => {
    try {
        // DESESTRUTURAR O REQ.BODY PARA FORMAR VARIÁVEIS
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
            skills,
        } = req.body

        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
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

        // INSERIR COMPETÊNCIAS DO USUÁRIO
        for (let i = 0; i < skills.length; i++) {
            await db.run(`INSERT INTO userSkill (skillId, userId) VALUES ('${skills[i]}', '${user.lastID}')`)
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
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

// ROTA DE FAZER LOGIN
router.post('/user/login', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // ENCONTRAR USUÁRIO
        const user = await db.get(`SELECT * FROM user WHERE email='${req.body.email}'`)

        if (!user) {
            throw new Error('Não foi possível entrar')
        }

        // CHECAR SENHA
        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isMatch) {
            throw new Error('Não foi possível entrar')
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
        // res.send()
    } catch (err) {
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

router.get('/user/getCompanies', userAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // PEGAR AS SKILLS DA USUÁRIA SELECIONADA
        const userSkills = await db.all(
            `SELECT userSkill.* FROM userSkill INNER JOIN user ON userSkill.userId=user.id WHERE user.id='${req.user.id}'`
        )

        // PEGAR TODOS AS VAGAS
        const jobs = await db.all(`SELECT id, companyId FROM job`)
        let companiesIdMatch = []

        // FAZER UM LOOP NAS VAGAS
        for (job of jobs) {
            let equalSkills = []

            // PEGAR SKILLS DA VAGA
            const jobSkills = await db.all(
                `SELECT jobSkill.* FROM jobSkill INNER JOIN job ON jobSkill.jobId=job.id WHERE job.id = '${job.id}' `
            )

            if (jobSkills.length > 0) {
                // FAZER UM LOOP EM CADA COMPETÊNCIA DA VAGA
                for (jobSkill of jobSkills) {
                    // FAZER UM LOOP EM CADA COMPETÊNCIA DA USUÁRIA
                    for (userSkill of userSkills) {
                        // COMPARAR A COMPETÊNCIA DA USUÁRIA COM A COMPETÊNCIA DA VAGA
                        if (jobSkill.skillId == userSkill.skillId) {
                            // ADICIONAR O ID DA COMPETÊNCIA NO ARRAY EQUALSKILLS
                            equalSkills.push(jobSkill.id)
                        }
                    }
                }
            }

            // ARMAZENAR NESSA VARIÁVEL A PORCENTAGEM DE MATCH
            let matchPercentage = equalSkills.length / jobSkills.length

            // CHECAR SE ESSE MATCH ULTRAPASSA 50%
            if (matchPercentage >= 0.5) {
                // ADICIONAR O ID DA EMPRESA QUE CRIOU A VAGA EM UM ARRAY
                if (!companiesIdMatch.includes(job.companyId)) {
                    companiesIdMatch.push(job.companyId)
                }
            }
        }

        // CRIAR ARRAY VAZIO DE EMPRESAS
        let companies = []

        // PEGAR AS INFORMAÇÕES DE TODAS AS EMPRESAS
        for (id of companiesIdMatch) {
            const fetchedCompany = await db.get(
                `SELECT company.id, company.name, company.marketNiche, company.companyAddressId, company.companyPhilosophy, address.state, address.city FROM company INNER JOIN address ON company.companyAddressId=address.id WHERE company.id='${id}'`
            )
            // PREENCHER ARRAY COM TODAS AS INFORMAÇÕES DE CADA EMPRESA
            companies.push(fetchedCompany)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // RETORNAR AS EMPRESAS PARA O FRONT
        res.send(companies)
    } catch (err) {
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

router.get('/user/getCompanies/:id', userAuth, async (req, res) => {
    try {
        //Abrir banco de dados
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR SE EMPRESA JÁ RECEBEU LIKE
        const isLiked = await db.get(
            `SELECT * FROM userCompany WHERE userCompany.companyId='${req.params.id}' AND userCompany.userId= '${req.user.id}'`
        )

        // GET DA EMPRESA
        const company = await db.get(`SELECT * FROM company WHERE id = ${req.params.id}`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER RESPOSTA COM A EMPRESA E SE ELA JÁ FOI GOSTADA PELA USUÁRIA
        res.send({ company, isLiked: isLiked ? true : false })
    } catch (err) {
        // DEVOLVER MENSAGEM DE ERRO
        res.status(400).send(err.message)
    }
})

router.get('/user/likeCompany/:id', userAuth, async (req, res) => {
    try {
        //Abrir banco de dados
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // VER SE EMPRESA JÁ FOI GOSTADA
        const ifLiked = await db.get(`SELECT * FROM userCompany WHERE userId='${req.user.id}'`)

        // DAR ERRO SE EMPRESA JÁ FOI GOSTADA
        if (ifLiked) {
            throw new Error('Like já realizado!')
        }

        // DAR LIKE NA EMPRESA
        await db.run(`INSERT INTO userCompany (userId, companyId) VALUES ('${req.user.id}', '${req.params.id}')`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER RESPOSTA
        res.send()
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

router.delete('/user/likeCompany/:id', userAuth, async (req, res) => {
    try {
        // ABRIR BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // DELETAR LIKE NA EMPRESA
        await db.run(`DELETE FROM userCompany WHERE userId='${req.user.id}' AND companyId='${req.params.id}'`)

        // FECHAR BANCO DE DADOS
        await db.close()

        // DEVOLVER RESPOSTA
        res.send()
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

router.patch('/user/edit', userAuth, async (req, res) => {
    try {
        // DESESTRUTURAR REQ.BODY E FORMAR VARIÁVEIS
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
        } = req.body

        // ABRIR O BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // ATUALIZAR INFORMAÇÕES DA USUÁRIA
        await db.run(
            `UPDATE user SET email = '${email}', firstName = '${firstName}', lastName = '${lastName}', country = '${country}', phone = '${phone}', civilState = '${civilState}', birthDate = '${birthDate}', cpf = '${cpf}', rg = '${rg}', aboutYou = '${aboutYou}', userAddressId = '${userAddress.lastID} WHERE id = ${req.user.id}'`
        )

        // ATUALIZAR ENDEREÇO DA USUÁRIA
        await db.run(
            `UPDATE address SET street ='${street}', cep= '${cep}', neighborhood= '${neighborhood}', city= '${city}', state= '${state}', complement= '${complement}' WHERE id= '${req.user.userAddressId}'`
        )

        // FECHAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER RESPOSTA
        res.send()
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

router.post('/user/editSkills', userAuth, async (req, res) => {
    try {
        // DESESTRUTURAR REQ.BODY E FORMAR VARIÁVEIS
        const { skills } = req.body

        // ABRIR BANCO DE DADOS
        const db = await open({
            filename: './src/Backend/database/bit.db',
            driver: sqlite3.Database,
        })

        // DELETAR TODAS AS SKILLS DA USUÁRIA QUE JÁ EXISTEM
        await db.run(`DELETE FROM userSkill WHERE userId='${req.user.id}'`)

        // ADICIONAR CADA SKILL DO USUÁRIO COM BASE NAS SKILLS DO REQ.BODY
        for (skill of skills) {
            await db.run(`INSERT INTO userSkill (skillId, userId) VALUES ('${skill}', '${req.user.id}')`)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // DEVOLVER RESPOSTA
        res.send()
    } catch (err) {
        // DEVOLVER STATUS DE ERRO
        res.status(400).send()
    }
})

// EXPORTAR ROUTER
module.exports = router
