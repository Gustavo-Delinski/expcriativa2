import {Router} from "express";
import {Estabelecimento} from "../db/tabelaDB.js";
import { Servico } from "../db/tabelaDB.js";
import { Avaliacao } from "../db/tabelaDB.js";
import { Oferta } from "../db/tabelaDB.js";
import { FotosEstabelecimento } from "../db/tabelaDB.js";
import bcrypt from "bcryptjs";
import { Sequelize } from "sequelize";


const rota_lojas = Router();

rota_lojas
.get('/api/estabelecimentos-completos', async (req, res) => {
  try {
    // const estabelecimentos = await Estabelecimento.findAll();
    const estabelecimentos = await Estabelecimento.findAll({
      include: [
        // {
        //   model: FotosEstabelecimento,
        //   as: 'FotosEstabelecimentos',
        //   attributes: ['Foto', 'TipoFoto'],
        //   limit: 1
        // },
        {
          model: Oferta,
          as: 'Ofertas',
          include: [
            { model: Servico,as:'Servico', attributes: ['Nome'] },
            { 
              model: Avaliacao,
              as: 'Avaliacaos',
              attributes: ['Nota']
            }
          ]
        }
      ]
    })
    estabelecimentos ? res.json(estabelecimentos) : res.status(400).json({erro: "não há nenhum estabelecimento registrado"});
    // ... resto da transformação em result e res.json(result)
  } catch (err) {
    console.error("Erro no /api/estabelecimentos-completos:", err);
    res.status(500).json({ erro: "Não foi possível carregar os estabelecimentos" });
  }
})
.post('/api/lojas', async (req, res) => {
    const { nome, endereco, numero, complemento, cnpj, cep } = req.body;
    const lojas_cnpj = await Estabelecimento.findOne({ where: { cnpj: cnpj } });
    const id_usuario = req.session?.usuarioId;

    if (lojas_cnpj) {
        return res.status(400).json({mensagem:"CNPJ ja cadastrado."});
    }

    if (!id_usuario) {
        return res.status(401).json({ mensagem: "Usuário não autenticado." });
    }

    console.log("Dados recebidos:", req.body); // Adicione isso para debug
    
    try {
        await Estabelecimento.create({
            Nome: nome,
            endereco: endereco,
            Numero: numero,
            Complemento: complemento || '',
            Cnpj: cnpj,
            CEP: cep,
            ID_usuario: id_usuario
        });        

        res.status(200).json({ mensagem: "Estabelecimento cadastrado com sucesso." });
    } catch (error) {
        console.error("Erro ao cadastrar estabelecimento:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar estabelecimento: ${error}` }); // Retorne JSON
    }
})
.get('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const loja = await Estabelecimento.findByPk(id);
    return loja ? res.json(loja) : res.status(404).end();
})
.put('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, endereco, numero, cnpj, complemento, cep } = req.body;
    const loja = await Estabelecimento.findByPk(id);

    console.log("Dados recebidos:", req.body);

    if (!loja) {
        return res.status(404).json({ mensagem: 'Loja não encontrada.' });
    }
    
    const updated = await loja.update({ 
        Nome: nome,
        endereco: endereco,
        Numero: numero,
        Complemento: complemento,
        Cnpj: cnpj,
        CEP: cep
    });

    console.log(updated);

    return res.status(200).json({ mensagem: 'Loja atualizada com sucesso.' });
})
.delete('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const loja = await Estabelecimento.findByPk(id);
    return loja ? res.json(await loja.destroy()) : res.status(404).end();
});

const rota_servico = Router();
rota_servico

.get('/api/servico', async (req, res) => {
    const servicos = await Servico.findAll();
    res.json(servicos)
});

const rota_oferta = Router();
rota_oferta

.get('/api/oferta', async (req, res) => {
    const ofertas = await Oferta.findAll();
    res.json(ofertas)
});

const rota_avaliacao = Router();
rota_avaliacao

.get('/api/avaliacao', async (req, res) => {
    const avaliacaos = await Avaliacao.findAll();
    res.json(avaliacaos)
});

const rota_foto = Router();
rota_foto

.get('/api/foto', async (req, res) => {
    const fotos = await FotosEstabelecimento.findAll();
    res.json(fotos)
});

export default rota_lojas;

//export default {rota_lojas, rota_avaliacao,rota_foto,rota_oferta,rota_servico};


