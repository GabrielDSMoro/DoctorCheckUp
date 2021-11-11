//npm install axios express cors
//npm install nodemon --save-der
//npm start
//npm install dotenv



const express = require ('express')
// const bodyParser = require ('body-parser')
const app = express()
app.use(express.json())

//middleware, permite acessar o corpo (req.body) e tratá-lo como um objeto JSON
const axios = require('axios')
const mysql = require('mysql2')

//LUCAS - COMENTOU AQUI POIS HÁ OUTRAS CONST COM O MESMO NOME
//const maquinas = {}
//contador = 0


//CONTROLA ACESSO AO BANCO DE DADOS
require('dotenv').config()
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
    connection.query('SELECT * FROM tb_maquinas', (err, results, fields) => {

        //console.log(results)
        res.send(results)
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
    
    const sql = "INSERT INTO tb_maquinas (status, id_filial) VALUES (?, ?)"

    connection.query(sql,[status, idfilial], (err, results, fields) => {

        console.log(results)
        res.send('Inseriu nova Máquina')
    })

})

//ATUALIZAR MAQUINAS DADOS NO BANCO
app.put('/maquinas', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })
    //UPDATE NO BANCO DE DADOS
    const statusAlterado = req.body.statusAlterado
    const idmaquina = req.body.idmaquina

    const sql = `UPDATE tb_maquinas SET status=( ? ) WHERE id_maquina=( ? )`

    connection.query(sql,[statusAlterado, idmaquina], (err, results, fields) => {

        console.log(results)
        //console.log(fields)
        res.send('Post alterou o Status da Máquina')
    })

})





const maquinas = []
contador = 0

const funcoes = {
    TesteRealizado: (teste) => {
        let descricao = teste.body.dados.descricao

        if(descricao[0].includes("URGENTE!")) {
            maquinas[teste.body.dados.maquinaId].statusFuncionamento = "Inativo"
        } else if(descricao[0].includes("Máquina funcionando") && maquinas[teste.body.dados.maquinaId].statusFuncionamento == "Inativo") {
            maquinas[teste.body.dados.maquinaId].statusFuncionamento = "Ativo"
        }
    }
}

//Read de todas as maquinas 
//app.get('/maquinas', (req, res) => {
//    res.status(200).send(maquinas)
//s})
//Criação das maquinas dentro do sistema
//por motivos de segurança do funcionamento dos sistemas APENAS dado idFilial pode ser adicionado e alterado
// NENHUMA maquina pode ser excluida


//app.post ('/maquinas', async (req, res) => {
//    contador++
//    const {idFilial} = req.body
 //   maquinas[contador] = {contador: contador, idFilial: idFilial}
  ///  await axios.post('http://localhost:10000/eventos', {
    //    tipo: "MaquinaAdicionada",
     //   dados: {
       //     contador, idFilial
       // }
    ////})
   /// res.status(201).send(maquinas[contador])
///})







///app.post('/eventos', (req, res) => {
///    try{
//        console.log(req.body)
///   }
 ///   catch (e){}
 ///   res.status(204).end()
///})

app.listen (4000, () => console.log ("Máquinas. Porta 4000"))