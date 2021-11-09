//npm install axios express cors
//npm install nodemon --save-der
//npm start

const express = require ('express')
// const bodyParser = require ('body-parser')
const app = express()
app.use(express.json())

//middleware, permite acessar o corpo (req.body) e tratá-lo como um objeto JSON

const axios = require('axios')
const mysql = require('mysql2')
const maquinas = {}
contador = 0


//LUCAS CRIOU AQUI
//CONSULTA
app.get('/maquinas', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: '',
        user: '',
        database: '',
        password: ''
    })

    //CONSULTAR NO BANCO DE DADOS
    connection.query('SELECT * FROM tb_maquinas', (err, results, fields) => {

        console.log(results)
        console.log(fields)
        res.send(results)
    })
})

//INSERT
app.post('/maquinas', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: '',
        user: '',
        database: '',
        password: ''
    })
    //INSERIR NO BANCO DE DADOS
    const status = req.body.status
    
    const sql = "INSERT INTO tb_maquinas (status) VALUES (?)"

    connection.query(sql,[status], (err, results, fields) => {

        console.log(results)
        console.log(fields)
        res.send('post ok')
    })

})

//UPDATE
app.put('/maquinas', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: '',
        user: '',
        database: '',
        password: ''
    })
    //UPDATE NO BANCO DE DADOS
    const statusAlterado = req.body.statusAlterado
    const idmaquina = req.body.idmaquina

    const sql = `UPDATE tb_maquinas SET status=( ? ) WHERE id_maquina=( ? )`

    connection.query(sql,[statusAlterado, idmaquina], (err, results, fields) => {

        console.log(results)
        //console.log(fields)
        res.send('post ok')
    })

})






//Read de todas as maquinas 
app.get('/maquinas', (req, res) => {
    res.status(200).send(maquinas)
})
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

app.listen (4000, () => console.log ("Maquinas. Porta 4000"))