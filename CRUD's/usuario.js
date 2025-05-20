import {Router} from "express";
import {Usuario} from "../db/tabelaDB.js";
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
        return res.status(202).send(null);
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
        const { senhaAtual,novaSenha } = req.body;
        const usuario = await Usuario.findByPk(id);
        if (usuario) {
            const checkSenha = await bcrypt.compare(senhaAtual, usuario.Senha);
            if (!checkSenha) {
                return res.status(400).json({mensagem:"Senha atual incorreta."});
            } else {
                const checkNovaSenha = await bcrypt.compare(novaSenha, usuario.Senha);
                if (checkNovaSenha) {
                    return res.status(400).json({mensagem:"Nova senha deve ser diferente da atual."})
                } else {
                    return res.json(await usuario.update({Senha: await bcrypt.hash(novaSenha, 10) }))
                }
            }
        } else {
            console.log("Usuário não encontrado");
            res.status(404).json({mensagem:"Usuário não encontrado"}).end();
        }
    })
.delete('/api/usuario/:id', async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    return usuario ? res.json(await usuario.destroy()) : res.status(404).end();
});
export default rota_usuarios;
