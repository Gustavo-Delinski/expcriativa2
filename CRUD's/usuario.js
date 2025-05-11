import {Router} from "express";
import {Usuario} from "../db/tabelaDB.js";
import bcrypt from "bcryptjs";

const rota_usuarios = Router();

rota_usuarios
.get('/api/usuarios', async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
})
.post('/api/login', async (req, res) => {
    console.log("Dados recebidos:", req.body);
    const { email, senha } = req.body;
    try {
        if (!email || !senha) {
            return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
        }
        
        const usuario = await Usuario.findOne({ where: { email } });
        // console.log(usuario)
        // return res.status(200).json({usuario: usuario});
        if (!usuario) {
            return res.status(401).json({ mensagem: "Usuário ou senha incorretos." });
        }
        
        const senhaCorreta = await bcrypt.compare(senha, usuario.Senha);
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Usuário ou senha incorretos." });
        }
        console.log(`Usuário logado com sucesso: ${usuario.Nome}, id: ${usuario.ID_usuario}`);
        req.session.usuarioId = usuario.ID_usuario;
        req.session.nome = usuario.Nome;
        req.session.adm = usuario.ADM;
        res.json({id:usuario.ID_usuario,adm:usuario.ADM,nome:usuario.Nome});
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ mensagem: `Erro interno no servidor.${err}` });
    }
})
.post('/api/signup', async (req, res) => {
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

        res.status(200).json({ mensagem: "Usuário cadastrado com sucesso." });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar usuário: ${error}` }); // Retorne JSON
    }
})
.get('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(usuario) : res.status(404).end();
})
.put('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, dataNascimento, email, cpf, senha } = req.body;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(await usuario.update({ 
        Nome: nome,
        DataNasc: dataNascimento,
        Email: email,
        CPF: cpf,
        Senha: senha ? await bcrypt.hash(senha, 10) : usuario.Senha
    })) : res.status(404).end();
})
.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(await usuario.destroy()) : res.status(404).end();
});

export default rota_usuarios;