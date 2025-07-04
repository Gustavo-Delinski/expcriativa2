import {Router} from "express";
import {Usuario} from "../db/tabelaDB.js";
import { Oferta } from "../db/tabelaDB.js";
import { Estabelecimento } from "../db/tabelaDB.js";
import { Servico } from "../db/tabelaDB.js";
import { Avaliacao } from "../db/tabelaDB.js";

import bcrypt from "bcryptjs";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas imagens são permitidas.'), false);
        }
        cb(null,true);
    }
})

const rota_lojas = Router();
rota_lojas

.get('api/estabelecimento'), async (req, res) => {
    const estabelecimento = await Estabelecimento.findAll();
    res.json(estabelecimento);
}


const rota_usuarios = Router();

rota_usuarios
.get('/api/usuarios', async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
})

rota_usuarios.get('/api/usuarios/admins', async (req, res) => {
    const admins = await Usuario.findAll({ where: { ADM: 1 } });
    res.json(admins);
  });

rota_usuarios

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
    console.log("Dados recebidos:", req.body);
    const { Nome, ADM, DataNasc, Email, CPF, Senha } = req.body;
    const usuario_email = await Usuario.findOne({ where: { email: Email } });
    const usuario_cpf = await Usuario.findOne({ where: { cpf: CPF } });

    if (usuario_email) {
        return res.status(400).json({mensagem:"Email ja cadastrado."});
    }

    if (usuario_cpf) {
        return res.status(400).json({mensagem:"CPF ja cadastrado."});
    }
    console.log("Dados recebidos:", req.body);

    try {
        const hashedSenha = await bcrypt.hash(Senha, 10);

        await Usuario.create({
            Nome: Nome,
            ADM: ADM,
            DataNasc: DataNasc,
            Email: Email,
            CPF: CPF,
            Senha: hashedSenha,
        });

        res.status(200).json({ mensagem: "Usuário cadastrado com sucesso." });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ mensagem: `Erro ao cadastrar usuário: ${error}` });
    }
})

.get('/api/usuario/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    return usuario ? res.json(usuario) : res.status(404).end();
})
.get('/api/usuario/:id/foto', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
        return res.status(404).send('Usuario não encontrada');
    }
    if (!usuario.Foto) {
        return res.status(204).send(null);
    }
    res.set('Content-Type', usuario.TipoFoto || 'image/png');
    res.send(usuario.Foto); // envia o blob diretamente
})
.put('/api/usuario/:id',upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { nome,ADM, dataNascimento, email, cpf, senha } = req.body;
    const usuario = await Usuario.findByPk(id);

    if (usuario.Email !== email) {
        const usuario_email = await Usuario.findOne({ where: { email: email } });
        if (usuario_email) {
        return res.status(400).json({mensagem:"Email ja cadastrado."});
        }
    }
    if ( usuario.CPF !== cpf) {
        const usuario_cpf = await Usuario.findOne({ where: { cpf: cpf } });
        if (usuario_cpf) {
        return res.status(400).json({mensagem:"CPF ja cadastrado."});
        }
    }
    return usuario ? res.json(await usuario.update({
        Nome: nome !== usuario.Nome ? nome : usuario.Nome,
        ADM: ADM,
        CPF: cpf !== usuario.CPF ? cpf : usuario.CPF,
        DataNasc: dataNascimento !== usuario.DataNasc ? dataNascimento : usuario.DataNasc,
        Senha: senha ? await bcrypt.hash(senha, 10) : usuario.Senha,
        Email: email !== usuario.Email ? email : usuario.Email,
        Foto: req.file ? req.file.buffer : usuario.Foto,
        TipoFoto:req.file ? req.file.mimetype : usuario.TipoFoto
    })) : res.status(404).end();
})
.put('/api/usuario/:id/Novasenha', async (req, res) => {
    const { id } = req.params;
    const { novaSenha } = req.body;
    const usuario = await Usuario.findByPk(id);

    return usuario ? res.json(await usuario.update({Senha: await bcrypt.hash(novaSenha, 10) })) : res.status(404).end();
})
.post('/api/usuario/:id/verificarSenha', async (req, res) => {
    const { id } = req.params;
    const { senhaAtual,novaSenha } = req.body;
    const usuario = await Usuario.findByPk(id);
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.Senha);
    const senhaNovaCorreta = await bcrypt.compare(novaSenha, usuario.Senha);
    if (!senhaCorreta) {
        return res.status(401).json({ mensagem: "Senha atual incorreta." });
    }
    if (senhaNovaCorreta) {
        return res.status(401).json({ mensagem: "Nova senha não pode ser igual a senha atual." });
    }
    return usuario ? res.status(200).json({mensagem:"Senha atualizada com sucesso."}) : res.status(404).end();

})
.delete('/api/usuario/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(await usuario.destroy()) : res.status(404).end();
});
export default rota_usuarios;
