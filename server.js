//Importação do framework Express
import express from "express";
//importação do path e dirname para manipular caminhos
import path, { dirname } from "path";
//Importação do fileURLToPath para converter URL para caminho
import { fileURLToPath } from "url";

//Inicialização do servidor Express
const app = express();
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

//inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando http://localhost:${port}`);
});

// Para rodar o servidor, execute o comando:
// node server.js ou npx nodemon server.js