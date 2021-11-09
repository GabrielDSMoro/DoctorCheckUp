const express = require ('express')
const bodyParser = require ('body-parser')
const axios = require ('axios')
const mysql = require('mysql2')
const app = express()


//middleware, permite acessar o corpo (req.body) e tratá-lo como um objeto JSON
app.use(bodyParser.json())

const sensor = []
let idSensor = -1

app.get('/sensor', (req,res) => {
    res.status(200).send(sensor)
})

app.post('/sensor', async(req,res) => {
    idSensor++
    const dadosSensor = req.body
    sensor[idSensor] = {
        idSensor: idSensor,
        dataTeste: dadosSensor.dataTeste,
        codigoTeste: dadosSensor.codigoTeste,
        resultadoTeste: dadosSensor.resultadoTeste
    }
    res.status(201).send(sensor[idSensor])
    });

    

app.post('/eventos', (req,res) => {
    console.log(req.body)
    res.status(200).send({msg: "Em funcionamento!"})
});

app.listen(6000, () => console.log("sensor, porta 6000"))