//CONTROLA ACESSO AO BANCO DE DADOS
//require ('dotenv').config()

const express = require ('express')
const bodyParser = require ('body-parser')
const mysql = require('mysql2')
const app = express()
app.use(express.json())
const cron = require('node-cron');
const axios = require ('axios')
const moment = require('moment');


// const erro = 10;
// const maquinasCadastradas = []

// const funcoes = {
//     MaquinaAdicionada: (maquinas) => {
//         maquinasCadastradas.push(maquinas)
//         console.log(maquinas.contador)
//     }
// }
// //middleware, permite acessar o corpo (req.body) e tratá-lo como um objeto JSON
// app.use(bodyParser.json())

// const sensor = []
// let idSensor = -1

/*
app.get('/sensor', (req,res) => {
    res.status(200).send(sensor)
})*/

//Cadastra sensor
/*
app.post('/sensor', async(req,res) => {
    idSensor++
    const dadosSensor = req.body
    let IdRecebido = req.body.idMaquina   
    let idMaquina = "Não existe máquina cadastrada com o Id informado!";

    for(i = 0; i < maquinasCadastradas.length; i++) {
        if(maquinasCadastradas[i].contador === IdRecebido) {
            idMaquina = IdRecebido;
        }
    }

    if(idMaquina == "Não existe máquina cadastrada com o Id informado!") {
        res.status(400).send(idMaquina)
    } else {
    sensor[idSensor] = {
        idSensor: idSensor,
        idMaquina: idMaquina
    }
    res.status(201).send(sensor[idSensor])
}
});*/


// let testeId = 0;
// cron.schedule("*/30 * * * * *", () => { 
    
    /*

    console.log('Tentativa de execução de testes')
    if(sensor.length > 0) {
        testeId++
        for(j = 0; j <= sensor.length; j++) {
            let day = moment().format('L')
            let hour = moment().format('LTS')
            let data = day + " " + hour
            console.log(`Iniciando Teste nº ${testeId}.\nData e hora: ${data}`)
            let descricaoTeste = [];
            for(i = 0; i < 5; i++) {
                let numTeste =  parseInt(Math.random() * 100)
                console.log(numTeste)
            if( numTeste >= 70  && numTeste  < 75 && numTeste % 2 == 0) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de compressão: Filtro de ar") 
                continue;
            } else if(numTeste >= 70  && numTeste  < 75 && numTeste % 2 == 1) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de compressão: Temperatura elevada")
                continue; 
            } else if(numTeste >= 75  && numTeste  < 80 && numTeste % 2 == 0) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de compressão: Umidade do ar elevada")
                continue
            } else if(numTeste >= 75  && numTeste  < 80 && numTeste % 2 == 1) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de purificação: Retenção de água e CO2")
                continue
            } else if(numTeste >= 80  && numTeste  < 85 && numTeste % 2 == 0) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de purificação: Temperatura elevada")
                continue
            } else if(numTeste >= 80  && numTeste  < 85 && numTeste % 2 == 1) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de troca de calor: Resfriamento insuficiente")
                continue
            } else if(numTeste >= 85  && numTeste  < 90 && numTeste % 2 == 0) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de destilação: Separação dos componentes")
                continue
            } else if(numTeste >= 85  && numTeste  < 90 && numTeste % 2 == 1) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de destilação: Coluna de baixa pressão")
                continue
            } else if(numTeste >= 90  && numTeste  < 95 && numTeste % 2 == 0) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de destilação: Coluna de alta pressão")
                continue
            } else if(numTeste >= 90  && numTeste  < 95 && numTeste % 2 == 1) {
                descricaoTeste.push("URGENTE! Problemas com a maquina de destilação: Tanque cheio") 
                continue
            } else if (numTeste >= 95  && numTeste  < 100) {        
                descricaoTeste.push("URGENTE! Problemas com a maquina de produção de frio: Temperaturas elevadas")
                continue
            } else if(i == 4 && descricaoTeste.length == 0) {
                descricaoTeste.push("Máquina funcionando normalmente")
                }
            }

            axios.post('http://localhost:10000/eventos', {
                tipo: 'TesteRealizado',
                dados: {
                    testeId: testeId,
                    dataTeste: data,
                    descricao: descricaoTeste,
                    sensorId: sensor[j].idSensor,
                    maquinaId: sensor[j].idMaquina                
                }
            })
        }
    }
});*/

/*
app.post('/eventos', (req, res) => {
    try{
        console.log(req.body)
        funcoes[req.body.tipo](req.body.dados)
    }
    catch (e){}
    res.status(204).end()
})*/

//CONSULTA DE TODOS OS SENSORES NO BANDO DE DADOS
app.get('/sensor', (req, res)=>{
    const connection = mysql.createConnection({
        // host: DB_HOST,
        // user: DB_USER,
        // database: DB_DATABASE,
        // password: DB_PASSWORD
        host: '',
        user: '',
        database: '',
        password: ''
    })

    //CONSULTAR NO BANCO DE DADOS
    connection.query('SELECT * FROM tb_sensor', (err, results, fields) => {
        console.log(err)
        console.log(results)
            
        res.send(results)
    })
})

//CADASTRAR SENSORES NO BANCO DE DADOS
app.post('/sensor',(req, res) =>{

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        // host: DB_HOST,
        // user: DB_USER,
        // database: DB_DATABASE,
        // password: DB_PASSWORD
        host: '',
        user: '',
        database: '',
        password: '' 
    })

    const idMaqSensor = req.body.idMaqSensor

    const sql = "INSERT INTO tb_sensor (id_maquina_sen) VALUES (?)"

    connection.query(sql,[idMaqSensor], (err, results, fields) => {

        console.log(results)
        res.send('Inseriu 1 Sensor Novo')
    }) 
})


app.listen(6000, () => console.log("Sensor, porta 6000"))