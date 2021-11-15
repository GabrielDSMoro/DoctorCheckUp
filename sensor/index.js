//CONTROLA ACESSO AO BANCO DE DADOS
require ('dotenv').config()

const express = require ('express')
const bodyParser = require ('body-parser')
const mysql = require('mysql2')
const app = express()
app.use(express.json())
const cron = require('node-cron');
const axios = require ('axios')
const moment = require('moment');



let maquinasCadastradas = []

 const funcoes = {
     MaquinasConsultadas: (maquinas) => {
         maquinasCadastradas = maquinas
     }
 }

const {DB_USER,DB_PASSWORD,DB_DATABASE,PORT,DB_HOST} = process.env

cron.schedule("*/2 * * * * *", () => {
    axios.post('http://localhost:10000/eventos' , {
        tipo: "ConsultaMaquinas",
        dados: "Passa"
    });
})


cron.schedule("*/30 * * * * *", () => { 
    
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })

    //CONSULTAR NO BANCO DE DADOS
    connection.query('SELECT * FROM tbsensores', (err, results, fields) => {
        sensor = results
        
    })
    connection.end();
    console.log('Tentativa de execução de testes')

    if(sensor.length > 0) {
        for(j = 0; j < sensor.length; j++) {
            let data = moment().format("YYYY-MM-DD HH:mm:ss");
            console.log(data)
            let sensorId = sensor.map((row) => {return row.Id_Sensor})
            let maquinaId = sensor.map((row) => {return row.Id_Maquina})
            console.log(sensorId)
            console.log(`Iniciando Teste.\nData e hora: ${data}`)
            let descricaoTeste = [];
            for(m = 0; m < sensorId.length; m++) {
                let idSensor = sensorId[m]
                let idMaquina = maquinaId[m]

                for(i = 0; i < 5; i++) {
                    let numTeste =  parseInt(Math.random() * 100)
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
                console.log(descricaoTeste)
                console.log(data)
                console.log(idSensor)
                console.log(idMaquina)
                
            axios.post('http://localhost:10000/eventos', {
                tipo: 'TesteRealizado',
                dados: {
                    dataTeste: data,
                    descricao: descricaoTeste,
                    sensorId: idSensor,
                    maquinaId: idMaquina                
                }
            })
            descricaoTeste = []
        }
    }
    }
});




//CONSULTA DE TODOS OS SENSORES NO BANCO DE DADOS
app.get('/sensor', (req, res)=>{
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })

    //CONSULTAR NO BANCO DE DADOS
    connection.query('SELECT * FROM tbsensores', (err, results, fields) => {
        //console.log(results)

        if(results.length == 0) {
            res.status(404).send("Nenhuma sensor foi cadastrado!")
        } else {
            res.status(200).send(results)
        }
    })


})

//CADASTRAR SENSORES NO BANCO DE DADOS
app.post('/sensor',async(req, res) =>{

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })

    console.log(maquinasCadastradas)
    const idMaqSensor = req.body.idMaquina
    let isMaquinaCadastrada = false
    for(i = 0; i < maquinasCadastradas.length; i++) {
        if(maquinasCadastradas[i].Id_Maquina == idMaqSensor) {
            isMaquinaCadastrada = true
        }
    }

    if(!isMaquinaCadastrada) {
        res.status(400).send("Impossível cadastrar um sensor. A máquina informada ainda não foi cadastrada!")
    } else {

        const sql = "INSERT INTO tbsensores (Id_Maquina) VALUES (?)"

        connection.query(sql,[idMaqSensor], (err, results, fields) => {

            if(!err) {
                res.status(202).send(`Sensor criado com sucesso!
                Informações: 
                Máquina Associada: ${idMaqSensor}`)
            } else {
                res.status(500).send("Erro ao acessar o banco de dados")
            }
        }) 
    }
})

app.post('/eventos', (req, res) => {
    try{
        funcoes[req.body.tipo](req.body.dados)
    }
    catch (e){}
    res.status(204).end()
})

app.listen(6000, () => console.log("Sensor, porta 6000"))