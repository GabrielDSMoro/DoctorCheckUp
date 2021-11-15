
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2');
const { application } = require('express');

const app = express();
app.use(bodyParser.json());

//CONTROLA ACESSO AO BANCO DE DADOS
require('dotenv').config()
const {DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env



//LUCAS CRIOU AQUI
//LISTAR TODOS OS TANQUES NO BANCO DE DADOS
app.get('/tanques',(req, res) =>{

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })

    //CONSULTAR NO BANCO DE DADOS
    connection.query('SELECT * FROM tbtanques', (err, results, fields) => {
        if(results.length == 0) {
            res.status(404).send("Nenhum tanque foi cadastrado!")
        } else {
            res.status(200).send(results)
        }
    })
})

//CADASTRAR TANQUES NO BANCO DE DADOS
app.post('/tanques/cadastrar',(req, res) =>{

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD 
    })

    const tipo = req.body.tipo
    const capacidade = req.body.capacidade
    const temperatura = req.body.temperatura
    const statusProducao = req.body.statusProducao

    if(capacidade < 0) {
        res.status(400).send("Capacidade marcada incorretamente!")
    }

    const sql = "INSERT INTO tbtanques (tipo, capacidade, temperatura, status) VALUES (?, ?, ?, ?)"

    connection.query(sql,[tipo, capacidade, temperatura, statusProducao], (err, results, fields) => {

        if(err == null) {
            res.status(200).send(`Tanque cadastrado com sucesso!
            \nInformações: \nTipo: ${tipo}\nCapacidade: ${capacidade} L
            Temperatura: ${temperatura}ºC \nStatus: ${statusProducao}`)
        } else {
            res.status(500).send("Erro ao cadastrar tanque no banco de dados");
        }
    }) 
})


//ATUALIZAR TANQUE NO BANCO DE DADOS
app.put('/tanques/atualizar/:id', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })
    //UPDATE NO BANCO DE DADOS
    const idtanque = req.params.id
    let tipo = req.body.tipo
    let capacidade = req.body.capacidade
    let temperatura = req.body.temperatura
    let status = req.body.status

    console.log(status)
    const sql = `SELECT * FROM tbtanques WHERE Id_Tanques=(?)`
    connection.query(sql,[idtanque], (err, results, fields) => {
    
        if(tipo == null) {
            results.map((row) => {tipo = row.tipo})
        }

        if(capacidade == null) {
            results.map((row) => {capacidade = row.capacidade})
        }

        if(temperatura == null) {
            results.map((row) => {temperatura = row.temperatura})
        }

        if(status == null) {
            results.map((row) => {status = row.status})
        }
    })

    console.log(status)


    const sqlAtualiza = `UPDATE tbtanques SET tipo=(?), capacidade=(?), temperatura=(?), status=(?) WHERE Id_Tanques=(?)`

    connection.query(sqlAtualiza,[tipo, capacidade, temperatura, 
                        status,idtanque], (err, results, fields) => {

        if(err == null) {
            res.status(200).send(`Tanque atualizado com sucesso!
            \nInformações: \nTipo: ${tipo}\nCapacidade: ${capacidade}
            \nTemperatura: ${temperatura}ºC \nStatus: ${status}`)
        } else {
            console.log(err)
            res.status(500).send("Erro ao atualizar tanque no banco de dados");
        }
    })

})

 app.put('/tanques/:id/status/:status', (req, res) => {

    //CONEXÃO BANCO DE DADOS
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD   
    })
    //UPDATE NO BANCO DE DADOS
    const idtanque = req.params.id
    let statusNovo = req.params.status
    let temperatura
    let tipo
    let capacidade
    let statusAntigo
    let sql = `SELECT * FROM tbtanques WHERE Id_Tanques=(?)`
    console.log(statusNovo)
    console.log(idtanque)
    connection.query(sql,[idtanque], (err, results, fields) => {
        console.log(results)
        if(statusAntigo == null) {
            statusAntigo = results.map((row) => {return row.status})
        }
        results.map((row) => {tipo = row.tipo})
        results.map((row) => {capacidade = row.capacidade})
        results.map((row) => {temperatura = row.temperatura})
    })

    console.log(statusAntigo)
    console.log(tipo)
    console.log(capacidade)
    console.log(temperatura)

    if(statusNovo.toUpperCase() != "ATIVO" && statusNovo.toUpperCase() != "INATIVO") {
        console.log('bateu aqui 1')
        res.status(400).send("Filtro passado incorretamente. Por favor, revise o filtro enviado!")
    } else if(statusNovo.toUpperCase() == "ATIVO" && statusAntigo == "Inativo") {
        console.log('bateu aqui 2')
        statusNovo = "Ativo"
    } else if(statusNovo.toUpperCase == "INATIVO" && statusAntigo == "Ativo") {
        console.log('bateu aqui 3')
        statusNovo = "Inativo"
    } else {
        console.log('bateu aqui 4')
        console.log(statusNovo) 
        console.log(statusAntigo)
        res.status(400).send("Filtro passado incorretamente. Por favor, revise o filtro enviado!") 
    } 
    sql = `UPDATE tbtanques status=(?) WHERE Id_Tanque=(?)`

    console.log('chega aqui')
    connection.query(sql,[statusNovo, idtanque], (err, results, fields) => {

        if(err == null) {
            res.status(200).send(`Tanque atualizado com sucesso!
            \nInformações: \nTipo: ${tipo}\nCapacidade: ${capacidade}
            \nTemperatura: ${temperatura}ºC \nStatus: ${statusNovo}`)
        } else {
            res.status(500).send("Erro ao atualizar tanque no banco de dados");
        }
    })

})



app.listen(2000, () => {
    console.log('Tanques. Porta 2000')
});


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