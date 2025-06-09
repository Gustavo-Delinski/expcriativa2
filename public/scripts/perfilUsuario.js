

function trocarmodal(Modal) {
    const modal = document.getElementById('informacao');
    const modais = [`<h1>Meu Perfil</h1>
<p>Gerenciar a sua conta</p>
<hr>
<form id="form">
    <div class="NomeEmailFoto">
        <div class="NomeEmail">
            <div class="nome">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" name="nome" oninput="this.style.border = '1px solid rgba(62, 62, 62, 1)'" readonly>
            </div>
            <div class="email">
                <label for="email">Email</label>
                <input type="text" id="email" name="email" oninput="this.style.border = '1px solid rgba(62, 62, 62, 1)'" readonly >
            </div>
        </div>
        <div class="InputFoto">
            <label for="file">
                <div id="Perfilimg" class="Perfilimg"></div>
                <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none" id="svgFoto">
                <path d="M21 11V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V9C3 7.89543 3.89543 7 5 7H6.5C7.12951 7 7.72229 6.70361 8.1 6.2L9.15 4.8C9.52771 4.29639 10.1205 4 10.75 4H13.25" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="70%"/>
                <path d="M18.5 4V6.5M18.5 9V6.5M18.5 6.5H16M18.5 6.5H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="70%"/>
                <circle cx="12" cy="13" r="4" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="70%"/>
                </svg>
            </label>
            <input type="file" id="file" name="file" accept="image/*" onchange="mostrarFoto()" style="display: none;" disabled>
        </div>
    </div>
    <div class="DtnascCpf">
        <div class="datanasc">
            <label for="datanasc">Data de nascimento</label>
            <input type="date" id="datanasc" name="datanasc" oninput="this.style.border = '1px solid rgba(62, 62, 62, 1)'"readonly>
        </div>
        <div class="cpf">
            <label for="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" maxlength="14" oninput="mascaraCPF(this)" onchange="" readonly>
        </div>
    </div>
    <div id="btns">
        <button type="button" class="mudarcampos" onclick="mudarCampos()">Mudar informações</button>
    </div>
</form>`,
        `<h1>Trocar Senha</h1>
<hr/>
<form>
    <div class="SenhaAtual">
        <label for="senhaAtual">Senha Atual</label>
        <input type="password" id="senhaAtual" name="senhaAtual"/>
        <div class="DivOlho" onclick="MostrarSenha()">
            <img src="../imagens/SVGs/olho-aberto.svg" alt="Olho fechado" id="olho" class="imgOlho">
        </div>
    </div>
    <div class="NovaSenha">
        <label for="novaSenha">Nova Senha</label>
        <input type="password" id="novaSenha" name="novaSenha"/>
        <div class="DivOlho" onclick="MostrarSenha()">
            <img src="../imagens/SVGs/olho-aberto.svg" alt="Olho fechado" id="olho" class="imgOlho">
        </div>
    </div>
    <div class="CheckNovaSenha">
        <label for="confirmarNovaSenha">Corfirmar Nova Senha</label>
        <input type="password" id="confirmarNovaSenha"/>
        <div class="DivOlho" onclick="MostrarSenha()">
            <img src="../imagens/SVGs/olho-aberto.svg" alt="Olho fechado" id="olho" class="imgOlho">
        </div>
    </div>
    <div id="btns">
        <button type="button" class="BtnSalvar" onclick="UpdateSenha()">Salvar</button>
    </div>
</form>`,
        `<h1>Adicionar LocalTop</h1>
            <p>Crie um perfil para o seu negócio</p>
            <hr>
            <form>
                <div class="NomeEmailFotoEstabe">
                    <div class="NomeEmailEstabele">
                        <div class="nomeEstabele">
                            <label for="nomeEstabele">Nome do Estabelecimento</label>
                            <input type="text" id="nomeEstabele" name="nome">
                        </div>
                        <div class="emailEstabele">
                            <label for="email">Email</label>
                            <input type="text" id="email" name="email">
                        </div>
                        <div class="TelefoneCnpj">
                            <div class="telefone">
                                <label for="telefone">Número de Telefone</label>
                                <input type="text" id="telefone" name="telefone" maxlength="15" oninput="mascaraTelefone(this)">
                            </div>
                            <div class="cnpj">
                                <label for="cnpj">CNPJ</label>
                                <input type="text" id="cnpj" name="cnpj" maxlength="18" oninput="mascaraCNPJ(this)">
                            </div>
                            <div class="cep">
                                <label for="cep">CEP</label>
                                <div style="display: flex; flex-direction: row;justify-content: end;align-items: center">
                                    <input type="text" id="cep" name="cep" maxlength="9" oninput="mascaraCEP(this)">
                                    <button type="button" style="position: absolute;border: none;background-color: transparent;width: 2rem;height: 2rem" onclick="buscarCEP(document.getElementById('cep').value)"><img src="../imagens/SVGs/pesquisar.svg" style="height: 100%; width: 100%"/></button>
                                </div>
                            </div>
                        </div>
                        <div class="Endereco">
                            <div class="BairroCidadeEstado">
                                <div class="estado">
                                    <label for="estado">Estado</label>
                                    <input type="text" id="estado" name="estado" disabled>
                                </div>
                                <div class="cidade">
                                    <label for="cidade">Cidade</label>
                                    <input type="text" id="cidade" name="cidade" disabled>
                                </div>
                                <div class="bairro">
                                    <label for="bairro">Bairro</label>
                                    <input type="text" id="bairro" name="bairro" disabled>
                                </div>
                            </div>
                            <div class="RuaNumero">
                                <div class="rua">
                                    <label for="endereco">Endereco</label>
                                    <input type="text" id="endereco" name="rua" disabled>
                                </div>
                                <div class="numero">
                                    <label for="numero">Número</label>
                                    <input type="text" id="numero" name="numero">
                                </div>
                            </div>
                            <div class="complemento">
                                <label for="complemento">Complemento</label>
                                <input type="text" id="complemento" name="complemento" >
                            </div>
                        </div>
                       <!--                        <div class="SelectServicos">-->
<!--                            <label for="tipoServico">Tipo de serviço</label>-->
<!--                            <div style="display: flex; flex-direction: row;justify-content: center;align-items: center;gap: 1dvi;">-->
<!--                                <select id="tipoServico" name="tipoServico">-->
<!--                                    <option value="">Selecione uma opção</option>-->
<!--                                    <option value="Outro">Outro</option>-->
<!--                                </select>-->
<!--                                <input type="text" id="OutroServico" name="OutroServico" placeholder="Digite outro serviço">-->
<!--                            </div>-->
<!--                        </div>-->
                    </div>
                    <div class="InputFotoEstabele" >
                        <div id="Estabelecimentoimg" class="Estabelecimentoimg"><button class="prevImg" id="prevImg" type="button"  onclick="AnteriorFoto()"><img src="../imagens/SVGs/AnteriorSeta.svg" alt="imagem anterior"/></button><button class="nextImg" id="nextImg" type="button"  onclick="ProximaFoto()"><img src="../imagens/SVGs/ProximaSeta.svg" alt="proxima imagem"/></button></div>
                        <div class="IdentifierDelete">
                            <label for="fileEstabele">
                                <svg width="30px" height="30px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path fill="#3E996F" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"/>
                                </svg>
                            </label>
                            <div class="spans" id="spans">
                                <p>Nenhuma imagem Adicionada</p>
                            </div>
                            <button type="button" class="deleteImg" id="deleteImg" onclick="DeletarFoto()"><img src="../imagens/SVGs/delete.svg" alt="excluir imagem"/></button>
                        </div>
                        <input type="file" id="fileEstabele" name="file" accept="image/*" onchange="adicionarFoto()" style="display: none" multiple>
                    </div>
                </div>
                <div id="btns" class="btnEstabelecimento">
                    <button type="button" class="criarEstabelecimento" onclick="adicionarLocalTop()">Criar</button>
                </div>
            </form>`,
        ]
    modal.innerHTML = modais[Modal]
    //pegarDados()
}

document.getElementById('conta').addEventListener('click', function () {trocarmodal(this.value);});
document.getElementById('trocarsenha').addEventListener('click', function () {trocarmodal(this.value);});
document.getElementById('AddEstabelecimento').addEventListener('click', async function () {
    await trocarmodal(this.value);
    //pegarServicos()
});


let podeVerificar = true;

// Verifica o estado de login e, se estiver logado, ativa o monitoramento de sessão
const inicializarVerificacaoDeSessao = async () => {
    try {
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        if (dados.logado) {
            ativarMonitoramento();
        }
    } catch (err) {
        console.error("Erro ao verificar login inicial:", err);
    }
};
const verificarSessao = async () => {
    if (!podeVerificar) return;
    podeVerificar = false;
    try {
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        if (!dados.logado) {
            Swal.fire({
                icon: 'error',
                title: 'Sua sessão expirou',
                text: 'Aperte OK para ser redirecionado para a tela de login ou espere para ser redirecionado.',
                timer:5000,
                timerProgressBar: true
            }).then((result) => {
                sessionStorage.clear();
                if (result.isConfirmed) {
                    window.location.href = "/login";
                }
                if (result.dismiss === Swal.DismissReason.timer) {
                    window.location.href = "/login";
                }
            })
        }
    } catch (err) {
        console.error("Erro ao verificar sessão:", err);
    }
    setTimeout(() => {
        podeVerificar = true;
    }, 10000); // 10 segundos entre verificações
};
const ativarMonitoramento = () => {
    ['click', 'keydown', 'mousemove', 'scroll'].forEach(evento => {
        document.addEventListener(evento, verificarSessao);
    });
};
// Inicia tudo ao carregar a página
inicializarVerificacaoDeSessao();
async function logout() {
    try {
        const resposta = await fetch("/logout", {
            method: "GET",
        });
        if (resposta.ok) {
            // Quando o logout for bem-sucedido, redireciona para o login ou página inicial
            window.location.href = "/login";
        } else {
            alert("Erro ao fazer logout.");
        }
    } catch (err) {
        console.error("Erro ao fazer logout:", err);
    }
}
document.getElementById("logoutBtn").addEventListener("click", logout);
