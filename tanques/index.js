
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2');
const { application } = require('express');

const app = express();
app.use(bodyParser.json());

//CONTROLA ACESSO AO BANCO DE DADOS
require('dotenv').config()
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env

//CRIANDO O POOL
const pool = mysql.createPool({

    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

//LUCAS CRIOU AQUI
//LISTAR TODOS OS TANQUES NO BANCO DE DADOS
app.get('/tanques', (req, res) => {

    //CONSULTAR NO BANCO DE DADOS
    pool.query('SELECT * FROM tbtanques', (err, results, fields) => {
        if (results.length == 0) {
            res.status(404).send("Nenhum tanque foi cadastrado!")
        } else {
            res.status(200).send(results)
        }
    })
})

//CADASTRAR TANQUES NO BANCO DE DADOS
app.post('/tanques/cadastrar', (req, res) => {

    const tipo = req.body.tipo
    const capacidade = req.body.capacidade
    const temperatura = req.body.temperatura
    const statusProducao = req.body.statusProducao

    if (capacidade < 0) {
        res.status(400).send("Capacidade marcada incorretamente!")
    }

    const sql = "INSERT INTO tbtanques (tipo, capacidade, temperatura, status) VALUES (?, ?, ?, ?)"

    pool.query(sql, [tipo, capacidade, temperatura, statusProducao], (err, results, fields) => {

        if (err == null) {
            res.status(200).send(`Tanque cadastrado com sucesso!
            \nInformações: \nTipo: ${tipo}\nCapacidade: ${capacidade} L
            Temperatura: ${temperatura}ºC \nStatus: ${statusProducao}`)
        } else {
            res.status(500).send("Erro ao cadastrar tanque no banco de dados");
        }
    })
})


//ATUALIZAR TANQUE NO BANCO DE DADOS

app.put("/tanques/atualizar/:idTanque", (req, res) => {
    //CONEXÃO BANCO DE DADOS

    let tipo;
    let capacidade;
    let temperatura;
    let status;

    var tanque = {};
    const idtanque = req.params.idTanque;
    const sql =
        "SELECT tipo,capacidade,temperatura,status FROM tbtanques WHERE Id_Tanques=(?)";
    const sqlAtualiza = `UPDATE tbtanques SET tipo=(?), capacidade=(?), temperatura=(?), status=(?) WHERE Id_Tanques=(?)`;
    pool.query(sql, [idtanque], (err, results, fields) => {
        console.log("Results: ", results);
        tanque = results[0];
        tipo = tanque.tipo;
        capacidade = tanque.capacidade;
        temperatura = tanque.temperatura;
        status = tanque.status;

        if (req.body.tipo != null) tipo = req.body.tipo;

        if (req.body.capacidade != null) capacidade = req.body.capacidade;

        if (req.body.temperatura != null) temperatura = req.body.temperatura;

        if (req.body.status != null) status = req.body.status;

        pool.query(
            sqlAtualiza,
            [tipo, capacidade, temperatura, status, idtanque],
            (err, results, fields) => {
                if (err == null) {
                    res.status(200).send(`Tanque atualizado com sucesso!
            \nInformações: \nTipo: ${tipo}\nCapacidade: ${capacidade}
            \nTemperatura: ${temperatura}ºC \nStatus: ${status}`);
                } else {
                    res.status(500).send("Erro ao atualizar tanque no banco de dados");
                }
            }
        );
    });
});


app.put("/tanques/:id/status/:status", (req, res) => {

    //UPDATE NO BANCO DE DADOS
    const idtanque = req.params.id;
    let statusNovo = req.params.status;
    let temperatura;
    let tipo;
    let capacidade;
    let statusAntigo;
    const sql = `SELECT * FROM tbtanques WHERE Id_Tanques=(?)`;
    const sqlUpdate = `UPDATE tbtanques SET status=(?) WHERE Id_Tanques=(?)`;

    pool.query(sql, [idtanque], (err, results, fields) => {
        console.log(results);
        tanque = results[0];
        statusAntigo = tanque.status;
        tipo = tanque.tipo;
        capacidade = tanque.capacidade;
        temperatura = tanque.temperatura;
        if (
            statusNovo.toUpperCase() != "ATIVO" && statusNovo.toUpperCase() != "INATIVO"
        ) {
            res.status(400).send("Filtro passado incorretamente. Por favor, revise o filtro enviado!");
        } else if (
            statusNovo.toUpperCase() == "ATIVO" && statusAntigo == "Inativo"
        ) {
            statusNovo = "Ativo";
        } else if (statusNovo.toUpperCase() == "INATIVO" && statusAntigo == "Ativo") {
            statusNovo = "Inativo";
        } else if (statusNovo.toUpperCase() == "INATIVO" && statusAntigo == "Inativo") {
            res.status(400).send("O tanque já se encontra no estado desejado");
        } else if (statusNovo.toUpperCase() == "ATIVO" && statusAntigo == "Ativo") {
            res.status(400).send("O tanque já se encontra no estado desejado");
        }
        if (statusNovo === "Ativo" && statusAntigo == "Inativo" || statusNovo === "Inativo" && statusAntigo == "Ativo") {
            pool.query(
                sqlUpdate,
                [statusNovo, idtanque],
                (err, results, fields) => {
                    if (err == null) {
                        res.status(200).send(`Tanque atualizado com sucesso!
            \nInformações: \nTipo: ${tipo}\nCapacidade: ${capacidade}
            \nTemperatura: ${temperatura}ºC \nStatus: ${statusNovo}`);
                    } else {
                        res.status(500).send("Erro ao atualizar tanque no banco de dados");
                    }
                }
            );
        }
    });
});


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