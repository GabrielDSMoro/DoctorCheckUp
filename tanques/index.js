
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2');
const { application } = require('express');

const app = express();
app.use(bodyParser.json());

const tanques = []

let id = -1

//CONTROLA ACESSO AO BANCO DE DADOS
//require('dotenv').config()
//const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env


// //Cadastra um tanque novo
// app.post('/tanques/cadastrar', async(req,res) => {
//     id++
//     const dados = req.body
//     tanques[id] = {
//         id: id ,
//         tipo: dados.tipo,
//         capacidade: dados.capacidade, 
//         temperatura: dados.temperatura,
//         statusProducao: dados.statusProducao
//     }
//     //Execução de envio das informações ao barramento
//     try{
//         await axios.post('http://localhost:10000/eventos' , {
//         tipo: `Tanque - ${dados.tipo}`,
//             dados: {
//                 id,
//                 capacidade: dados.capacidade,
//                 temperatura: dados.temperatura,
//                 statusProducao: dados.statusProducao
//             },
//         });
//     } catch (err) {
//         //Caso ocorra um erro, uma resposta de que o barramento está indisponível é enviada
//         res.status(500).send("Barramento de Eventos indisponível. Tente novamente mais tarde.")
//     }
//     //Informa ao usuário que oo recurso foi criado
//     res.status(201).send(tanques[id])
// })

//Lista todos os tanques cadastrados
// app.get('/tanques', (req,res) =>{
//     //Caso exista tanques previamente cadastrados, ele os lista
//     if(tanques.length > 0) {
//         res.status(200).send(tanques);
//     } else {
//         //Caso contrário informa erro.
//         res.status(404).send("Não há nenhum tanque cadastrado no sistema!")
//     }
// })

//LUCAS CRIOU AQUI
//LISTAR TODOS OS TANQUES NO BNCO DE DADOS
app.get('/tanques',(req, res) =>{

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
    connection.query('SELECT * FROM tb_tanques', (err, results, fields) => {

        console.log(err)
        console.log(results)
        
        res.send(results)
    })
})


// //Inativa a produção de um tanque
// app.put('/tanques/statusProd/:filter/:id', async(req,res) => {
//     const tanque = tanques[req.params.id]
//     const filtro = req.params.filter
//     filtroCaps = filtro.toUpperCase();
//     let statusProducao;

//     if(tanques[req.params.id] == null) {
//         res.status(400).send("O tanque solicitado não foi encontrado!")
//     }

//     if(filtroCaps != "ATIVO" && filtroCaps != "INATIVO") {
//         res.status(400).send("Filtro passado incorretamente. Por favor, revise o filtro enviado!")
//     } else if (filtroCaps == "ATIVO" && tanque.statusProducao == "Inativo") {
//         tanque.statusProducao = "Ativo"
//     } else if (filtroCaps == "INATIVO" && tanque.statusProducao == "Ativo") {
//         tanque.statusProducao = "Inativo"
//     } else {
//         res.status(406).send("O tanque já se encontra no status informado")
//     }
    
//     try{
//         await axios.post('http://localhost:10000/eventos' , {
//         tipo: `Tanque - ${tanque.tipo}`,
//             dados: {
//                 id: tanque.id,
//                 capacidade: tanque.capacidade,
//                 temperatura: tanque.temperatura,
//                 statusProducao: statusProducao
//             },
//         });
//     } catch (err) {
//         //Caso ocorra um erro, uma resposta de que o barramento está indisponível é enviada
//         res.status(500).send("Barramento de Eventos indisponível. Tente novamente mais tarde.")
//     }

//     res.status(200).send(tanque);
// })

// //Atualiza as características de um tanque
// app.put('/tanques/atualizar/:id', async(req,res) => {
//     const dados = req.body;
//     const dadosProducaoAtualizacao = "Inativo"

//     if(tanques[req.params.id] != null) {
//         tanques[req.params.id] = {
//             id: req.params.id,
//             tipo: dados.tipo,
//             capacidade: dados.capacidade, 
//             temperatura: dados.temperatura,
//             statusProducao: tanques[req.params.id].statusProducao
//         } 
//     } else {
//         id++
//         tanques[req.params.id] = {
//             id: req.params.id,
//             tipo: dados.tipo,
//             capacidade: dados.capacidade, 
//             temperatura: dados.temperatura,
//             statusProducao: "Inativo"
//         }
//     }

//     try{
//         await axios.post('http://localhost:10000/eventos' , {
//         tipo: `Tanque - ${dados.tipo}`,
//             dados: {
//                 id: dados.id,
//                 capacidade: dados.capacidade,
//                 temperatura: dados.temperatura,
//                 statusProducao: dados.statusProducao
//             },
//         });
//     } catch (err) {
//         //Caso ocorra um erro, uma resposta de que o barramento está indisponível é enviada
//         res.status(500).send("Barramento de Eventos indisponível. Tente novamente mais tarde.")
//     }
//     res.status(200).send(tanques[req.params.id])
// })

//CADASTRAR TANQUES NO BANCO DE DADOS
app.post('/tanques',(req, res) =>{

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

    const tipo = req.body.tipo
    const capacidade = req.body.capacidade
    const temperatura = req.body.temperatura
    const status = req.body.status

    const sql = "INSERT INTO tb_tanques (tipo, capacidade, temperatura, status) VALUES (?, ?, ?, ?)"

    connection.query(sql,[tipo, capacidade, temperatura, status], (err, results, fields) => {

        console.log(err)
        console.log(results)
        res.send('Inseriu 1 tanque Novo')
    }) 
})


//ATUALIZAR TANQUE NO BANCO DE DADOS
app.put('/tanques', (req, res) => {

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
    //UPDATE NO BANCO DE DADOS
    const idtanquealt = req.body.idtanquealt
    const tipoalt = req.body.tipoalt
    const capacidadealt = req.body.capacidadealt
    const temperaturaalt = req.body.temperaturaalt
    const statusalt = req.body.statusalt

    const sql = `UPDATE tb_tanques SET tipo=(?), capacidade=(?),
                temperatura=(?), status=(?) WHERE id_tanque=(?)`

    connection.query(sql,[tipoalt, capacidadealt, temperaturaalt, 
                        statusalt, idtanquealt], (err, results, fields) => {

        console.log(results)
        //console.log(fields)
        res.send('PUT alterou o Status do Tanque')
    })

})



app.listen(2000, () => {
    console.log('Tanques. Porta 2000')
});