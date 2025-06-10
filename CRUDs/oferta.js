import Router from "express";
import { Oferta } from '../db/tabelaDB.js';
import { Servico } from '../db/tabelaDB.js'

const rota_oferta = Router();

rota_oferta
.get('/api/EstabelecimentoOfertas/:id', async (req, res) => {
    const { id } = req.params;
    const ofertas = await Oferta.findAll({where: {ID_estabelecimento: id}});
    console.log(ofertas);
    ofertas ? res.status(200).json(ofertas) : res.status(404).end();
})
.get('/api/PrimeiraEstabelecimentoOfertas/:id', async (req, res) => {
    const { id } = req.params;
    const ofertas = await Oferta.findAll({where: {ID_estabelecimento: id}});
    console.log(ofertas);
    ofertas ? res.status(200).json(ofertas[0]) : res.status(404).end();
})
.get('/api/oferta/:id', async (req, res) => {
    const { id } = req.params;
    const oferta = await Oferta.findByPk(id);
    const servico = await Servico.findOne({where:{ID_servico: oferta.ID_servico}})
    oferta ? res.status(200).json({oferta:oferta,servico:servico}) : res.status(404).end();
})

.post('/api/criarOferta/:id', async (req,res) => {
    const {Nome,Descricao,Valor} = req.body;
    const {id} = req.params;
    const servico = await Servico.create({
        Nome:Nome
    })
    const oferta = await Oferta.create({
        ID_estabelecimento:id,
        ID_servico:servico.ID_servico,
        Descricao:Descricao,
        Valor:Valor
    })
    res.status(200).json(oferta);
})
.put('/api/editarOferta/:id', async (req,res) => {
    const {id} = req.params;
    const {Nome,Descricao,Valor} = req.body;
    const oferta = await Oferta.findByPk(id);

    if (!oferta) {
        return res.status(404).end();
    }
    const ofertaUpdt = await oferta.update({
        Descricao: Descricao,
        Valor: Valor
    })

    const servico = await Servico.findByPk(oferta.ID_servico);
    const servicoUpdt = await servico.update({
        Nome: Nome
    })
    res.status(200).json(ofertaUpdt);
})
.delete('/api/deleteOferta/:id', async (req, res) => {
    const { id } = req.params;
    const oferta = await Oferta.findByPk(id)
    oferta ? res.json(await oferta.destroy()) : res.status(404).end();
})

export default rota_oferta;
