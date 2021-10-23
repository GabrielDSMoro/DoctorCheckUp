const express = require ("express")
const bodyParser = require ('body-parser')
const axios = require ('axios')

const app = express()
app.use(bodyParser.json())

app.post('/eventos', (req, res) => {
    const evento = req.body
    console.log(evento)
    // envia o evento para o microsserviço de maquinas
    axios.post('http://localhost:4000/eventos', evento)
    // envia o evento para o microsserviço de gases
    axios.post('http://localhost:2000/eventos', evento)
    //envia o evento para o microsserviço de consulta
    axios.post('http://localhost:6000/eventos', evento)
    // envia o evento para o microsserviço de classificação
    axios.post('http://localhost:7000/eventos', evento)
    res.status(204).end()
})

app.listen(10000, () => console.log("Barramento de eventos. Porta 10000."));