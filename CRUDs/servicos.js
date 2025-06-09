import {Router} from "express";
import { Servico } from "../db/tabelaDB.js";

const rota_servicos = Router();

rota_servicos
.get('/api/servicos', async (req, res) => {
    const Servicos = await Servico.findAll();
    res.json(Servicos);
})

export default rota_servicos;