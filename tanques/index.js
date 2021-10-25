const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const tanques = []

let id = -1

//Cadastra um tanque novo
app.post('/tanques/cadastrar', async(req,res) => {
    id++
    const dados = req.body
    tanques[id] = {
        id: id ,
        tipo: dados.tipo,
        capacidade: dados.capacidade, 
        temperatura: dados.temperatura,
        statusProducao: dados.statusProducao
    }
    //Execução de envio das informações ao barramento
    try{
        await axios.post('http://localhost:10000/eventos' , {
        tipo: `Tanque - ${dados.tipo}`,
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
    res.status(201).send(tanques[id])
})

//Lista todos os tanques cadastrados
app.get('/tanques', (req,res) =>{
    //Caso exista tanques previamente cadastrados, ele os lista
    if(tanques.length > 0) {
        res.status(200).send(tanques);
    } else {
        //Caso contrário informa erro.
        res.status(404).send("Não há nenhum tanque cadastrado no sistema!")
    }
})

//Inativa a produção de um tanque
app.put('/tanques/statusProd/:filter/:id', async(req,res) => {
    const tanque = tanques[req.params.id]
    const filtro = req.params.filter
    filtroCaps = filtro.toUpperCase();
    let statusProducao;

    if(tanques[req.params.id] == null) {
        res.status(400).send("O tanque solicitado não foi encontrado!")
    }

    if(filtroCaps != "ATIVO" && filtroCaps != "INATIVO") {
        res.status(400).send("Filtro passado incorretamente. Por favor, revise o filtro enviado!")
    } else if (filtroCaps == "ATIVO" && tanque.statusProducao == "Inativo") {
        tanque.statusProducao = "Ativo"
    } else if (filtroCaps == "INATIVO" && tanque.statusProducao == "Ativo") {
        tanque.statusProducao = "Inativo"
    } else {
        res.status(406).send("O tanque já se encontra no status informado")
    }
    
    try{
        await axios.post('http://localhost:10000/eventos' , {
        tipo: `Tanque - ${tanque.tipo}`,
            dados: {
                id: tanque.id,
                capacidade: tanque.capacidade,
                temperatura: tanque.temperatura,
                statusProducao: statusProducao
            },
        });
    } catch (err) {
        //Caso ocorra um erro, uma resposta de que o barramento está indisponível é enviada
        res.status(500).send("Barramento de Eventos indisponível. Tente novamente mais tarde.")
    }

    res.status(200).send(tanque);
})

//Atualiza as características de um tanque
app.put('/tanques/atualizar/:id', async(req,res) => {
    const dados = req.body;
    const dadosProducaoAtualizacao = "Inativo"

    if(tanques[req.params.id] != null) {
        tanques[req.params.id] = {
            id: req.params.id,
            tipo: dados.tipo,
            capacidade: dados.capacidade, 
            temperatura: dados.temperatura,
            statusProducao: tanques[req.params.id].statusProducao
        } 
    } else {
        id++
        tanques[req.params.id] = {
            id: req.params.id,
            tipo: dados.tipo,
            capacidade: dados.capacidade, 
            temperatura: dados.temperatura,
            statusProducao: "Inativo"
        }
    }

    try{
        await axios.post('http://localhost:10000/eventos' , {
        tipo: `Tanque - ${dados.tipo}`,
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
    res.status(200).send(tanques[req.params.id])
})

app.listen(2000, () => {
    console.log('Tanques. Porta 2000')
});