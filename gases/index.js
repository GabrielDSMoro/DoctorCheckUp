const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const gases = []

let id = -1

//Cadastra um gás novo
app.post('/gases/cadastrar', async(req,res) => {
    id++
    const dados = req.body
    gases[id] = {
        id: id ,
        tipo: dados.tipo,
        capacidade: dados.capacidade, 
        temperatura: dados.temperatura,
        statusProducao: dados.statusProducao
    }
    //Execução de envio das informações ao barramento
    try{
        await axios.post('http://localhost:10000/eventos' , {
        tipo: `Gás - ${dados.tipo}`,
            dados: {
                id,
                capacidade: dados.capacidade,
                temperatura: dados.temperatura,
                statusProducao: dados.statusProducao
            },
        });
    } catch (err) {
        //Caso ocorra um erro, uma resposta de que o barramento está indisponível é enviada
        res.status(500).send("Barramento de Eventos indisponível. Tente novamente mais tarde.")
    }
    //Informa ao usuário que oo recurso foi criado
    res.status(201).send(gases[id])
})

//Lista todos os gases cadastrados
app.get('/gases', (req,res) =>{
    //Caso exista gases previamente cadastrados, ele os lista
    if(gases.length > 0) {
        res.status(200).send(gases);
    } else {
        //Caso contrário informa erro.
        res.status(404).send("Não há nenhum gás cadastrado no sistema!")
    }
})

//Inativa a produção de um gás
app.put('/gases/statusProd/:filter/:id', async(req,res) => {
    const gas = gases[req.params.id]
    const filtro = req.params.filter
    filtroCaps = filtro.toUpperCase();
    let statusProducao;

    if(gases[req.params.id] == null) {
        res.status(400).send("O gás solicitado não foi encontrado!")
    }

    if(filtroCaps != "ATIVO" && filtroCaps != "INATIVO") {
        res.status(400).send("Filtro passado incorretamente. Por favor, revise o filtro enviado!")
    } else if (filtroCaps == "ATIVO" && gas.statusProducao == "Inativo") {
        gas.statusProducao = "Ativo"
    } else if (filtroCaps == "INATIVO" && gas.statusProducao == "Ativo") {
        gas.statusProducao = "Inativo"
    } else {
        res.status(406).send("O gás já se encontra no status informado")
    }
    
    try{
        await axios.post('http://localhost:10000/eventos' , {
        tipo: `Gás - ${gas.tipo}`,
            dados: {
                id: gas.id,
                capacidade: gas.capacidade,
                temperatura: gas.temperatura,
                statusProducao: statusProducao
            },
        });
    } catch (err) {
        //Caso ocorra um erro, uma resposta de que o barramento está indisponível é enviada
        res.status(500).send("Barramento de Eventos indisponível. Tente novamente mais tarde.")
    }

    res.status(200).send(gas);
})

//Atualiza as características de um gás
app.put('/gases/atualizar/:id', async(req,res) => {
    const dados = req.body;
    const dadosProducaoAtualizacao = "Inativo"

    if(gases[req.params.id] != null) {
        gases[req.params.id] = {
            id: req.params.id,
            tipo: dados.tipo,
            capacidade: dados.capacidade, 
            temperatura: dados.temperatura,
            statusProducao: gases[req.params.id].statusProducao
        } 
    } else {
        id++
        gases[req.params.id] = {
            id: req.params.id,
            tipo: dados.tipo,
            capacidade: dados.capacidade, 
            temperatura: dados.temperatura,
            statusProducao: "Inativo"
        }
    }

    try{
        await axios.post('http://localhost:10000/eventos' , {
        tipo: `Gás - ${dados.tipo}`,
            dados: {
                id: dados.id,
                capacidade: dados.capacidade,
                temperatura: dados.temperatura,
                statusProducao: dados.statusProducao
            },
        });
    } catch (err) {
        //Caso ocorra um erro, uma resposta de que o barramento está indisponível é enviada
        res.status(500).send("Barramento de Eventos indisponível. Tente novamente mais tarde.")
    }
    res.status(200).send(gases[req.params.id])
})

app.listen(2000, () => {
    console.log('Gases. Porta 2000')
});