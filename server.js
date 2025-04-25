//Importação do framework Express
import express from "express";
//importação do path e dirname para manipular caminhos
import path, { dirname } from "path";
//Importação do fileURLToPath para converter URL para caminho
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import sequelize from "./db/declaracaoBD.js"
// import { Usuario } from "./db/tabeladb.js";
import rota_usuarios from "./CRUD's/usuario.js";
//Inicialização do servidor Express

function verificarAutenticacao(req, res, next) {
    if (req.session.usuarioId) {
        next(); // usuário está logado
    } else {
        res.status(401).json({ mensagem: 'Você precisa estar logado para acessar esta rota.' });
    }
}
const app = express();
app.use(express.json());
//Porta em que o servidor rodará
const port = 3000;
//diretório atual onde o servidor está rodando
const __dirname = dirname(fileURLToPath(import.meta.url));

sequelize.authenticate()
.then(() => {
    console.log("conexao com o banco estabelecida")
})
.catch(err => {
    console.log(err)
})
// const sessionMaxAge = 10 * 60 * 1000;
const sessionMaxAge = 30 * 1000;

app.use(session({
    secret: 'localtop',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: sessionMaxAge,
        httpOnly: true,
        secure: false
    }
}));

app.use((req, res, next) => {
    res.locals.user_logged_in = req.session.user_logged_in || false;
    next();
});

//Configura o servidor para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(rota_usuarios)

app.get("/auth/estado", (req, res) => {
    if (req.session && req.session.usuarioId) {
        res.json({ logado: true, usuarioId: req.session.usuarioId, nome: req.session.nome });
    } else {
        res.json({ logado: false });
    }
});

//Quando acessar http://localhost:3000/ retorna o arquivo index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "index.html"));
});

app.get("/pesquisa", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "pesquisa.html"));
});

app.get("/lojas", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "lojas.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "signupTest.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "loginTest.html"));
});

// app.get("/lista",(req, res) => {
//     res.sendFile(path.join(__dirname, "public", "paginas", "usuariocrud.html"));
// });
app.get("/lista",verificarAutenticacao, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "usuariocrud.html"));
});

app.get("/sessao", (req, res) => {
    res.json({ usuarioId: req.session.usuarioId || null, nome: req.session.nome || null });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ mensagem: "Erro ao tentar fazer logout." });
        }
        // Redireciona para a página de login ou página inicial após o logout
        res.redirect("/");
    });
});

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando http://localhost:${port}`);
    });
})


//inicia o servidor na porta 3000

// Para rodar o servidor, execute o comando:
// node server.js ou nodemon server.js