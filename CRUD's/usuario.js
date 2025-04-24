import {Router} from "express";
import {Usuario} from "../db/tabelaDB.js";
import bcrypt from "bcrypt";

const rota_usuarios = Router();

rota_usuarios
.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
})
.post('/login', async (req, res) => {
    const {email, senha} = req.body;
    const usuario = await Usuario.findOne({where: {email: email}});
    if(!usuario){
        return res.status(401).json({mensagem:"Usuário ou senha incorretos."});
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if(!senhaValida && usuario.email != email){
        return res.status(401).json({mensagem:"Usuário ou senha incorretos."});
    } else {
        console.log("Usuário logado com sucesso: " + usuario.nome + "id: " + usuario.id_usuario)
        res.json(usuario.id_usuario);
    }
})
.post('/signup', async (req, res) => {
    const { nome, dataNascimento, email, cpf, senha } = req.body;
    const usuario_email = await Usuario.findOne({ where: { email: email } });
    const usuario_cpf = await Usuario.findOne({ where: { cpf: cpf } });

    if (usuario_email) {
        return res.status(400).json({mensagem:"Email ja cadastrado."});
    }

    if (usuario_cpf) {
        return res.status(400).json({mensagem:"CPF ja cadastrado."});
    }
    console.log("Dados recebidos:", req.body); // Adicione isso para debug

    try {
        const hashedSenha = await bcrypt.hash(senha, 10);

        await Usuario.create({
            Nome: nome,
            DataNasc: dataNascimento,
            Email: email,
            CPF: cpf,
            Senha: hashedSenha,
            Role: null
        });

        console.log(res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" }));
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar usuário: ${error}` }); // Retorne JSON
    }
})
.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params.id;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(usuario) : res.status(404).end();
})
.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params.id;
    const { nome, dataNascimento, email, cpf, senha } = req.body;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(await usuario.update({ Nome: nome, DataNasc: dataNascimento, Email: email, CPF: cpf, Senha: senha })) : res.status(404).end();
})
.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params.id;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(await usuario.destroy()) : res.status(404).end();
});

export default rota_usuarios;