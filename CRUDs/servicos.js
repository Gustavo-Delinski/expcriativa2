import {Router} from "express";
import { Servico } from "../db/tabelaDB.js";
import { Oferta } from "../db/tabelaDB.js";

const rota_servicos = Router();

rota_servicos
.get('/api/servicos', async (req, res) => {
    const Servicos = await Servico.findAll();
    res.json(Servicos);
})
.get('/api/servicoOferta/:id', async (req, res) => {
    const { id } = req.params;
    const oferta = await Oferta.findByPk(id);
    const servico = await Servico.findOne({where: {ID_servico: oferta.ID_servico}});
    servico ? res.status(200).json(servico) : res.status(404).end();
})

export default rota_servicos;