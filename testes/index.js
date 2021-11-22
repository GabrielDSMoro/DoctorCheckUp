//npm install axios express cors
//npm install nodemon --save-der
//npm start

//responsável pelo STATUS e acompanhamento do funcionamento das maquinas

const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()
app.use(bodyParser.json())

const testesPorMaquinaId = {}
const testesRealizados = []

const { DB_USER, DB_PASSWORD, DB_DATABASE, PORT, DB_HOST } = process.env
//CRIANDO O POOL
const pool = mysql.createPool({

    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


const funcoes = {
    TesteRealizado: (teste) => {
        const Id_Sensor = teste.body.dados.sensorId
        const Id_Maquina = teste.body.dados.maquinaId
        const data = teste.body.dados.dataTeste
        const resultado = teste.body.dados.descricao

        //INSERIR TESTE NO BANCO DE DADOS
        const sql = "INSERT INTO tbtestes (dataTeste, Id_Sensor, Id_Maquina, resultado) VALUES (?, ?, ?, ?)"
        pool.query(sql, [data, Id_Sensor, Id_Maquina, resultado], (err, results, fields) => {
            if (!err) {
                console.log("Teste inserido com sucesso!")
            } else {
                console.log(err)
            }
        })
    }
}

//CONSULTA TESTES NO BANCO DE DADOS
app.get('/testes', (req, res) => {

    //CONSULTAR NO BANCO DE DADOS
    pool.query('SELECT * FROM tbtestes', (err, results, fields) => {
        if (results.length == 0) {
            res.status(404).send("Nenhum teste foi efetuado")
        } else {
            res.status(200).send(results)
        }
    })
})

app.get('/testes/maquina/:id', (req, res) => {
    const maquinaId = req.params.id


    //CONSULTAR NO BANCO DE DADOS
    pool.query(`SELECT * FROM tbtestes WHERE Id_Maquina=(${maquinaId})`, (err, results, fields) => {
        if (results.length == 0) {
            res.status(404).send("Nenhum teste foi efetuado")
        } else {
            res.status(200).send(results)
        }
    })
})

app.get('/testes/daily', (req, res) => {

    //CONSULTAR NO BANCO DE DADOS
    pool.query(`SELECT * FROM doctorcheckup.tbtestes WHERE dataTeste >= now() - INTERVAL 1 DAY`, (err, results, fields) => {
        if (err) {
            console.log(err)
        } else {
            if (results.length == 0) {
                res.status(404).send("Nenhum teste foi efetuado nas últimas 24h")
            } else {
                res.status(200).send(results)
            }
        }
    })
})

app.get('/testes/weekly', (req, res) => {

    //CONSULTAR NO BANCO DE DADOS
    pool.query(`SELECT * FROM doctorcheckup.tbtestes WHERE dataTeste >= now() - INTERVAL 7 DAY`, (err, results, fields) => {
        if (err) {
            console.log(err)
        } else {
            if (results.length == 0) {
                res.status(404).send("Nenhum teste foi efetuado nas últimas 24h")
            } else {
                res.status(200).send(results)
            }
        }
    })
})

app.post('/eventos', (req, res) => {
    try {
        funcoes[req.body.tipo](req)
    } catch (e) { }
    res.status(204).end()
})

app.listen(5000, () => console.log("Status da maquina. Porta 5000."))