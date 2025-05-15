import {Router} from "express";
import {Estabelecimento} from "../db/tabelaDB.js";
import bcrypt from "bcryptjs";

const rota_lojas = Router();

rota_lojas
// .get('/api/usuarios', async (req, res) => {
//     const usuarios = await Usuario.findAll();
//     res.json(usuarios);
// })
.post('/api/lojas', async (req, res) => {
    const { nome, endereco, numero, complemento, cnpj, cep, email, senha } = req.body;
    const lojas_email = await Estabelecimento.findOne({ where: { email: email } });
    const lojas_cnpj = await Estabelecimento.findOne({ where: { cnpj: cnpj } });

    if (lojas_email) {
        return res.status(400).json({mensagem:"Email ja cadastrado."});
    }

    if (lojas_cnpj) {
        return res.status(400).json({mensagem:"CNPJ ja cadastrado."});
    }
    console.log("Dados recebidos:", req.body); // Adicione isso para debug

    try {
        const hashedSenha = await bcrypt.hash(senha, 10);

        await Estabelecimento.create({
            Nome: nome,
            Endereco: endereco,
            Numero: numero,
            Compl: complemento,
            Email: email,
            CNPJ: cnpj,
            CEP: cep,
            Senha: hashedSenha,
            Role: null
        });

        res.status(200).json({ mensagem: "Estabelecimento cadastrado com sucesso." });
    } catch (error) {
        console.error("Erro ao cadastrar estabelecimento:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar estabelecimento: ${error}` }); // Retorne JSON
    }
})
.get('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(usuario) : res.status(404).end();
})
.put('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, endereco, numero, email, cnpj, complemento, cep, senha } = req.body;
    const loja = await Estabelecimento.findByPk(id);
    return loja ? res.json(await loja.update({ 
        Nome: nome,
        Endereco: endereco,
        Numero: numero,
        Compl: complemento,
        Email: email,
        CNPJ: cnpj,
        CEP: cep,
        Senha: senha ? await bcrypt.hash(senha, 10) : loja.Senha
    })) : res.status(404).end();
})
.delete('/api/lojas/:id', async (req, res) => {
    const { id } = req.params;
    const loja = await Estabelecimento.findByPk(id);
    return loja ? res.json(await loja.destroy()) : res.status(404).end();
});
export default rota_lojas;
