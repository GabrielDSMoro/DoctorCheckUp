//npm install axios express cors
//npm install nodemon --save-der
//npm start

//respondavel pelo STATUS e acompanhamento do funionamento das maquinas

const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const mysql = require('mysql2')
const app = express()
app.use(bodyParser.json())

const testesPorMaquinaId = {}
const testesRealizados = []

const funcoes = {
    TesteRealizado: (teste) => {
        testesRealizados.push(teste.body.dados)
        console.log("Teste recebido: " + teste)
    }
}
//const palavrachave = /(URGENTE)/g
//READ por IDmaquina


/*app.get('/testes', (req,res) => {
    if(testesRealizados.length > 0) {
        res.status(200).send(testesRealizados) 
    } else {
        res.status(404).send("Nenhum teste foi realizado") 
    }
})*/

//CONSULTA TESTES NO BANCO DE DADOS
app.get('/testes', (req,res) => {
    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        // host: DB_HOST,
        // user: DB_USER,
        // database: DB_DATABASE,
        // password: DB_PASSWORD
        host: 'localhost',
        user: 'root',
        database: 'doctor_checkup',
        password: 'Lof16122001!'
    })
    //CONSULTAR NO BANCO DE DADOS
    connection.query('SELECT * FROM tb_testes', (err, results, fields) => {

        console.log(err)
        console.log(results)
        
        res.send(results)
    })
})


/*app.get('/maquinas/:contador/testes', (req, res) => {
    res.send(testesPorMaquinaId[req.params.contador] || [])
})*/

// //numeros randomicos para simular status de possiveis erros na maquina
// const numRandom = `${Math.floor(Math.random() * 20)}`;
// //

// app.post('/maquinas/:contador/testes', async (req, res) => {

//     const status = numRandom
//     const idMaquina = req.params.contador
//     const testesDaMaquina = testesPorMaquinaId[idMaquina] || []
//     testesDaMaquina.push({
//         maquinaId: req.params.contador,
//         status: status,
//         descricao: "Aguardando"
//     })
//     testesPorMaquinaId[idMaquina] = testesDaMaquina
//     await axios.post('http://localhost:10000/eventos', {
//         tipo: "ObservacaoCriada",
        
//         dados: {
//             maquinaId: req.params.contador,
//             status: status,
//             descricao: "Aguardando",

//         }
//     })
//     res.status(201).send(testesDaMaquina)
   
// })

// app.put('/maquinas/:contador/testes', async (req, res) => {
//     const status = 0
//     const idMaquina = req.params.contador
//     const testesDaMaquina = testesPorMaquinaId[idMaquina] || []
//     testesDaMaquina.push({
//         maquinaId: req.params.contador,
//         status: status,
//         descricao: "Aguardando"
//     })
//     testesPorMaquinaId[idMaquina] = testesDaMaquina
//     await axios.post('http://localhost:10000/eventos', {
//         tipo: "ObservacaoCriada",
//         dados: {

//             maquinaId: req.params.contador,
//             status: status,
//             descricao: "Maquina Funcionando Normalmente",

//         }
//     })
//     res.status(201).send(testesDaMaquina)
    
// })

// app.post('/eventos', (req, res) => {
//     try {
//         console.log(req.body)
//         funcoes[req.body.tipo](req)
//     } catch (e) {}
//     res.status(204).end()
// })

//LUCAS CRIOU AQUI
//CADASTRANDO TESTES NO BANCO DE DADOS
app.post('/testes', (req, res) => {
    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        // host: DB_HOST,
        // user: DB_USER,
        // database: DB_DATABASE,
        // password: DB_PASSWORD
        host: 'localhost',
        user: 'root',
        database: 'doctor_checkup',
        password: 'Lof16122001!'
    })

    const idMaqTeste = req.body.idMaqTeste
    const dataTeste = req.body.dataTeste
    const idSensorTeste = req.body.idSensorTeste
    const resultado = req.body.resultado

    const sql = 'INSERT INTO tb_testes (id_maquina_tes, data_teste, id_sensor_tes, resultado) VALUES (?, ?, ?, ?)'

    connection.query(sql, [idMaqTeste, dataTeste, idSensorTeste, resultado], (err, results, fields) => {

        console.log(err)
        console.log(results)
        res.send('Inseriu 1 novo Teste')

    })


})

app.listen(5000, () => console.log("Status da maquina. Porta 5000."))