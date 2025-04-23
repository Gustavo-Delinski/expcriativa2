//Importação do framework Express
import express from "express";
//importação do path e dirname para manipular caminhos
import path, { dirname } from "path";
//Importação do fileURLToPath para converter URL para caminho
import { fileURLToPath } from "url";
import sequelize from "./db/declaracaoBD.js"
import { Usuario } from "./db/tabeladb.js";
import bodyParser from "body-parser";
//Inicialização do servidor Express
const app = express();
app.use(express.json());
//Porta em que o servidor rodará
const port = 3000;
//diretório atual onde o servidor está rodando
const __dirname = dirname(fileURLToPath(import.meta.url));

//Configura o servidor para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//Quando acessar http://localhost:3000/ retorna o arquivo index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "index.html"));
});

app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "signin.html"));
});

app.get("/pesquisa", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "pesquisa.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "login.html"));
});

app.get("/lojas", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "lojas.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "paginas", "signupTest.html"));
});

sequelize.authenticate()
    .then(() => {
        console.log("conexao com o banco estabelecida")
    })
    .catch(err => {
        console.log(err)
    })

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando http://localhost:${port}`);
    });
})
//inicia o servidor na porta 3000

// Para rodar o servidor, execute o comando:
// node server.js ou nodemon server.js

app.post("/signin", async (req, res) => {
    const { nome, dataNascimento, email, cpf, senha } = req.body;

    console.log("Dados recebidos:", req.body); // Adicione isso para debug

    try {
        await Usuario.create({
            Nome: nome,
            DataNasc: dataNascimento,
            Email: email,
            CPF: cpf,
            Senha: senha,
            Role: 'usuario'
        });

        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ erro: "Erro ao cadastrar usuário." }); // Retorne JSON
    }
});