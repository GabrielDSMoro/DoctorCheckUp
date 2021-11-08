//npm install axios express cors
//npm install nodemon --save-der
//npm start

//respondavel pelo STATUS e acompanhamento do funionamento das maquinas

const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
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


app.get('/testes', (req,res) => {
    if(testesRealizados.length > 0) {
        res.status(200).send(testesRealizados) 
    } else {
        res.status(404).send("Nenhum teste foi realizado") 
    }
})

// app.get('/maquinas/:contador/testes', (req, res) => {
//     res.send(testesPorMaquinaId[req.params.contador] || [])
// })

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

app.post('/eventos', (req, res) => {
    try {
        console.log(req.body)
        funcoes[req.body.tipo](req)
    } catch (e) {}
    res.status(204).end()
})

app.listen(5000, () => console.log("Status da maquina. Porta 5000."))