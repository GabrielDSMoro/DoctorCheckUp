//npm install axios express cors
//npm install nodemon --save-der
//npm start
//npm install dotenv
const express = require ('express')
const app = express()
app.use(express.json())

//middleware, permite acessar o corpo (req.body) e tratá-lo como um objeto JSON
const axios = require('axios')
const mysql = require('mysql2')
require ('dotenv').config()

//LUCAS - COMENTOU AQUI POIS HÁ OUTRAS CONST COM O MESMO NOME

//CONTROLA ACESSO AO BANCO DE DADOS
const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env


//LUCAS CRIOU AQUI
//CONSULTAR MAQUINAS NO BANCO 
app.get('/maquinas', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })

    //CONSULTAR NO BANCO DE DADOS
    connection.query('SELECT * FROM tbmaquinas', (err, results, fields) => {
        //console.log(results)

        if(results.length == 0) {
            res.status(404).send("Nenhuma máquina foi cadastrada!")
        } else {
            console.log(results.map((row) => {return row.status}))
            res.status(200).send(results)
        }
    })
})

//CADASTRAR MAQUINAS NO BANCO DE DADOS
app.post('/maquinas', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })
    //INSERIR NO BANCO DE DADOS
    const idfilial = req.body.idFilial
    const status = req.body.status
    
    const sql = "INSERT INTO tbmaquinas (status, Id_Filial) VALUES (?, ?)"

    connection.query(sql,[status, idfilial], (err, results, fields) => {

        if(err == null) {
            res.status(200).send(`Máquina cadastrada com sucesso!
            \nInformações: \nId da Filial: ${idfilial}\nStatus: ${status}`)
        } else {
            res.status(500).send("Erro ao cadastrar máquina no banco de dados");
        }
    })
})

//ATUALIZAR MAQUINAS DADOS NO BANCO
app.put('/maquinas/:id', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })
    //UPDATE NO BANCO DE DADOS
    const statusAlterado = req.body.status
    const idmaquina = parseInt(req.params.id)
    const idFilial = req.body.idFilial
    
    const sql = `UPDATE tbmaquinas SET status = (?), Id_Filial = (?) WHERE Id_Maquina =( ? )`

    connection.query(sql,[statusAlterado, idFilial, idmaquina], (err, results, fields) => {
        if(err == null) {
            res.status(200).send(`Máquina atualizada com sucesso!
            \nInformações: \nId da Filial: ${idFilial}\nStatus: ${statusAlterado}`)
        } else {
            console.log(err)
            res.status(500).send("Erro ao alterar informações de máquina no banco de dados");
        }
    })

})

const funcoes = {
    TesteRealizado: (teste) => {
        let descricao = teste.body.dados.descricao
        let maquinaId = teste.body.dados.maquinaId
        const connection = mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            database: DB_DATABASE,
            password: DB_PASSWORD
        })
        console.log(descricao)
        if(descricao[0].includes("URGENTE!")) {
            const sql = `UPDATE tbmaquinas SET status=( ? ) WHERE Id_Maquina=( ? )`
            let status = 'Inativo'
            connection.query(sql,[status, maquinaId], (err, results, fields) => {})
            console.log(`Máquina ${maquinaId} está com o status Inativo`)
        } else if(descricao[0].includes("Máquina funcionando")) {
            const sql = `UPDATE tbmaquinas SET status=( ? ) WHERE Id_Maquina=( ? )`
            let status = 'Ativo'
            connection.query(sql,[status, maquinaId], (err, results, fields) => {})
            console.log(`Máquina ${maquinaId} está com o status Ativo`)
        }
    },

    ConsultaMaquinas: (a) => {
        const connection = mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            database: DB_DATABASE,
            password: DB_PASSWORD
        })
        const sql = "SELECT * FROM tbmaquinas"
        connection.query(sql, (err, results, fields) => {
            axios.post('http://localhost:10000/eventos', {
                tipo: "MaquinasConsultadas",
                dados: results 
            })
        })
        connection.end()
    }}

app.post('/eventos', (req, res) => {
    try{
        funcoes[req.body.tipo](req)
    }
    catch (e){}
    res.status(204).end()
})

app.listen (4000, () => console.log ("Máquinas. Porta 4000"))