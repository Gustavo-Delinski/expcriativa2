let fotosEstabelecimento = []
let fotoShowedEstabelecimento = 0;
let idEstabelecimento = 0;
function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

async function abrirAbaEstabelecimento(id) {
    idEstabelecimento = id;
    const card = document.getElementById('informacao');
    card.innerHTML = '';
    card.innerHTML = `<h1 id="nomeEstabelecimento">Nome do Estabelecimento</h1>
    <p id="cnpjEstabelecimento">CNPJ do estabelecimento</p>
    <hr class="horizontalRule">
        <form>
            <div class="UpperUpdtForm">
                <div class="LeftUpdtForm">
                    <h5>Dados Cadastrais</h5>
                    <div class="UPDEmail">
                        <label for="email">Email</label>
                        <input type="text" id="email" name="email" readonly>
                    </div>
                    <div class="TelCep">
                        <div class="UPDTelefone">
                            <label for="telefone">Número de Telefone</label>
                            <input type="text" id="telefone" name="telefone" maxlength="15" oninput="mascaraTelefone(this)" onchange="mascaraTelefone(this)" readonly>
                        </div>
                        <div class="UpdtCNPJ">
                            <label for="cnpj">CNPJ</label>
                            <input type="text" id="cnpj" name="cnpj" maxlength="17" oninput="mascaraCNPJ(this)" onchange="mascaraCNPJ(this)" readonly>
                        </div>
                        <div class="UPDCep">
                            <label for="cep">CEP</label>
                            <input type="text" id="cep" name="cep" oninput="mascaraCEP(this)" onchange="mascaraCEP(this)" readonly>
                                <button type="button" style="display:none; position: absolute;border: none;background-color: transparent;width: 1.6dvi;height: 1.6dvi;padding:0; margin: 0 0.2dvi 0.2dvi 0" onclick="buscarCEP(document.getElementById('cep').value)" id="searchCEP">
                                    <img src="../imagens/SVGs/pesquisar.svg" alt='Procurar CEP' style="height: 100%; width: 100%"/>
                                </button>
                        </div>
                    </div>
                    <div class="EstadoCidadeBairro">
                        <div class="UpdtEstado">
                            <label for="estado">Estado</label>
                            <input type="text" id="estado" name="estado" readonly>
                        </div>
                        <div class="UpdtCidade">
                            <label for="cidade">Cidade</label>
                            <input type="text" id="cidade" name="cidade" readonly>
                        </div>
                        <div class="UpdtBairro">
                            <label for="bairro">Bairro</label>
                            <input type="text" id="bairro" name="bairro" readonly>
                        </div>
                    </div>
                    <div class="EnderecoNumero">
                        <div class="UpdtEndereco">
                            <label for="endereco">Endereço</label>
                            <input type="text" id="endereco" name="endereco" readonly>
                        </div>
                        <div class="UpdtNumero">
                            <label for="numero">Número</label>
                            <input type="text" id="numero" name="numero" readonly>
                        </div>
                    </div>
                    <div class="UpdtComplemento">
                        <label for="complemento">Complemento</label>
                        <input type="text" id="complemento" name="complemento" readonly>
                    </div>
                </div>
                <div class="RightUpdtForm">
                    <div class="InputFotoEstabele" >
                        <div id="EstabelecimentoimgUpdt" class="EstabelecimentoUpdtImg">
                            <button class="UpdtprevImg" id="prevImg" type="button"  onclick="AnteriorFotoUpdt()">
                                <img src="../imagens/SVGs/AnteriorSeta.svg" alt="imagem anterior"/>
                            </button>
<!--                            <img id="imgEstabele" src="https://placehold.co/300x400?text=Adicione+sua+foto" alt="Imagens do Estabelecimento">-->
                                <button class="UpdtnextImg" id="nextImg" type="button"  onclick="ProximaFotoUpdt()">
                                    <img src="../imagens/SVGs/ProximaSeta.svg" alt="proxima imagem"/>
                                </button>
                        </div>
                        <div class="IdentifierDelete">
                            <label for="fileEstabeleUpdt" id="addImg" style="display: none">
                                <svg width="30px" height="30px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                                    <path fill="#3E996F" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"/>
                                </svg>
                            </label>
                            <div class="spans" id="spansUpdt">
                                <p>Nenhuma imagem Adicionada</p>
                            </div>
                            <button type="button" class="deleteImgUpdt" id="deleteImgUpdt" onclick="excluirFoto()" style="display: none"><img src="../imagens/SVGs/delete.svg" alt="excluir imagem"/></button>
                        </div>
                        <input type="file" id="fileEstabeleUpdt" name="file" accept="image/*" onchange="adicionarUpdtFoto()" style="display: none" multiple>
                    </div>
                </div>
            </div>
            <br/>
            <div class="LowerUpdtForm">
                <div class="lowerside-btns">
                    <button type="button" class="DeleteEstabelecimentoUpdt" id="DeleteEstabelecimentoUpdt" onclick="">Excluir Estabelecimento</button>
                    <div class="UpdtEstabeleBtn">
                        <button type="button" class="cancelUpdt" id="cancelUpdt" onclick="ChangeCampos();pegarDataEstabelecimento(idEstabelecimento);">Cancelar</button>
                        <button type="button" class="SaveUpdt" id="SaveUpdt" onclick="Saveestabelecimento()">Salvar</button>
                        <button type="button" class="ChangeCampos" id='changecampos' onclick="ChangeCampos()">Editar informações</button>
                    </div>
                </div>
            </div>
        </form>
        <hr>
            <div class="LowerSide">
                <h4>Serviços</h4>
                <div class="middleLowerSide">
                    <div class="searchBar">
                        <label for="pesquisaServico">
                            <svg id="Camada_2" data-name="Camada 2" width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39.94 40" >
                                <g id="Camada_1-2">
                                    <path class="cls-1" d="M39.37,36.68l-8.29-8.3c2.4-2.99,3.83-6.79,3.83-10.92C34.91,7.81,27.09,0,17.45,0S0,7.81,0,17.45s7.81,17.45,17.45,17.45c4.11,0,7.88-1.42,10.86-3.79l8.3,8.31c.38.38.88.57,1.38.57s1-.19,1.38-.57c.76-.76.76-1.99,0-2.75ZM17.45,31.16c-7.57,0-13.71-6.14-13.71-13.71S9.88,3.75,17.45,3.75s13.71,6.14,13.71,13.71-6.14,13.71-13.71,13.71Z" fill="#00000";/>
                                </g>
                            </svg>
                        </label>
                        <input type="search" id="pesquisaServico" placeholder="Digite o Nome do serviço"/>
                    </div>
                    <div class="ControllerBtns">
                        <button type="button" class="addServico" id="addServico" onclick="AbrirModal()">
                            <svg width="25px" height="25px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                                <path fill="#3E996F" fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm14 .069a1 1 0 01-1 1h-2.931V14a1 1 0 11-2 0v-2.931H6a1 1 0 110-2h3.069V6a1 1 0 112 0v3.069H14a1 1 0 011 1z"/>
                            </svg>
                        </button>
                        <button type="button" class="editServico" id="ToggleEditServico" onclick="ShowEditBtn()">
                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z" stroke="#3E996F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button type="button" class="deleteServico" id="toggleDeleteServico" onclick="ShowDeleteBtn()">
                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 11V17" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 11V17" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4 7H20" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="servicosEstabelecimento" id="servicosEstabelecimento">
                </div>
            </div>`
    await pegarDataEstabelecimento(idEstabelecimento);
    await pegarOfertas(idEstabelecimento);
}

function ShowDeleteBtn() {
    document.querySelectorAll('.servico .deleteServico').forEach(btn => {
        document.querySelectorAll('.servico .editServico').forEach(editbtn => {
            if (btn.style.display === 'none' || !btn.style.display) {
                btn.style.display = 'block';
                editbtn.style.display = 'none';
            } else {
                btn.style.display = 'none';
            }
        })
    });
}

function ShowEditBtn() {
    document.querySelectorAll('.servico .editServico').forEach(btn => {
        document.querySelectorAll('.servico .deleteServico').forEach(deletetbtn => {
            if (btn.style.display === 'none' || !btn.style.display) {
                btn.style.display = 'block';
                deletebtn.style.display = 'none';
            } else {
                btn.style.display = 'none';
            }
        })
    });
}

function ChangeCampos() {
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const cnpj = document.getElementById('cnpj');
    const cep = document.getElementById('cep');
    const numero = document.getElementById('numero');
    const complemento = document.getElementById('complemento');
    const btncep = document.getElementById('searchCEP');
    const deleteImgBtn = document.getElementById('deleteImgUpdt');
    const addImgBtn = document.getElementById('addImg');
    const cancelBtn = document.getElementById('cancelUpdt');
    const saveBtn = document.getElementById('SaveUpdt');
    const ChangeBtn = document.getElementById('changecampos');

    email.readOnly = !email.readOnly;
    telefone.readOnly = !telefone.readOnly;
    cnpj.readOnly = !cnpj.readOnly;
    cep.readOnly = !cep.readOnly;
    numero.readOnly = !numero.readOnly;
    complemento.readOnly = !complemento.readOnly;
    if (!cnpj.readOnly) {
        email.style.border = '1px solid rgb(62, 62, 62)'
        telefone.style.border = '1px solid rgb(62, 62, 62)'
        cnpj.style.border = '1px solid rgb(62, 62, 62)'
        cep.style.border = '1px solid rgb(62, 62, 62)'
        numero.style.border = '1px solid rgb(62, 62, 62)'
        complemento.style.border = '1px solid rgb(62, 62, 62)'
        btncep.style.display = 'block';
        deleteImgBtn.style.display = 'block';
        addImgBtn.style.display = 'block';
        cancelBtn.style.display = 'block';
        saveBtn.style.display = 'block';
        ChangeBtn.style.display = 'none';
    } else {
        email.style.border = '1px solid rgba(62, 62, 62, 0.3)'
        telefone.style.border = '1px solid rgba(62, 62, 62, 0.3)'
        cnpj.style.border = '1px solid rgba(62, 62, 62, 0.3)'
        cep.style.border = '1px solid rgba(62, 62, 62, 0.3)'
        numero.style.border = '1px solid rgba(62, 62, 62, 0.3)'
        complemento.style.border = '1px solid rgba(62, 62, 62, 0.3)'
        btncep.style.display = 'none';
        deleteImgBtn.style.display = 'none';
        addImgBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';
        ChangeBtn.style.display = 'block';
    }
}

async function pegarDataEstabelecimento(id) {
    const response = await fetch(`/api/estabelecimento/${id}`);
    if (response.ok) {
        const data = await response.json();
        document.getElementById('email').value = data.Email;
        document.getElementById('telefone').value = data.Telefone;
        document.getElementById('cnpj').value = data.Cnpj;
        document.getElementById('cep').value = data.CEP;
        document.getElementById('estado').value = data.UF;
        document.getElementById('cidade').value = data.Cidade;
        document.getElementById('bairro').value = data.Bairro;
        document.getElementById('endereco').value = data.Logradouro;
        document.getElementById('numero').value = data.Numero;
        document.getElementById('complemento').value = data.Complemento;
    }

    const responseImg = await fetch(`/api/estabelecimento/foto/${id}`);
    if (responseImg.ok) {
        if (responseImg.status !== 204) {
            const imagens = await responseImg.json();
            fotosEstabelecimento.length = 0;
            fotosEstabelecimento = imagens.map(img => {
                return `data:${img.tipo};base64,${img.imagemBase64}`;
            });

            const spans = document.getElementById('spansUpdt');
            spans.innerHTML = '';
            for (let i = 0; i < fotosEstabelecimento.length; i++) {
                const span = document.createElement("span");
                span.dataset.updtvalue = `${i}`;
                spans.appendChild(span);
            }

            ShowImage(0);
            atualizarEstiloSpans();
            return;
        }
        const foto = document.getElementById('EstabelecimentoimgUpdt').style.backgroundImage = 'url(https://placehold.co/300x400?text=Adicione+suas+fotos)'
    }
}

async function UpdateEstabelecimento() {
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cnpj = document.getElementById('cnpj').value;
    const cep = document.getElementById('cep').value;
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;

    try {
        const response = await fetch(`/api/Updtestabelecimento/${idEstabelecimento}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Email: email,
                Telefone: telefone,
                CNPJ: cnpj,
                CEP: cep,
                Estado: estado,
                Cidade: cidade,
                Bairro: bairro,
                Endereco: endereco,
                Numero: numero,
                Complemento: complemento,
            }),
        });

        if (!response.ok) {
            const erro = await response.json();
            Swal.fire({
                title: 'Erro',
                text: erro.mensagem,
                icon: 'error',
            });
            return false;
        }

        const data = await response.json();
        console.log(data);
        Swal.fire({
            title: 'Dados atualizados',
            text: data.mensagem,
            icon: 'success',
        });
        return true;
    } catch (error) {
        Swal.fire({
            title: 'Erro',
            text: error.message,
            icon: 'error',
        });
        return false;
    }
}

function Saveestabelecimento() {
    if(!UpdateEstabelecimento())return;
    ChangeCampos();
    pegarDataEstabelecimento(idEstabelecimento);
}

function ShowImage(index) {
    const foto = document.getElementById('EstabelecimentoimgUpdt');
    if (!foto || index === null || fotosEstabelecimento.length === 0) foto.style.backgroundImage = `url(https://placehold.co/300x400?text=Adicione+suas+fotos)`;
    console.log()
    fotoShowedEstabelecimento = index;
    foto.style.backgroundImage = `url(${fotosEstabelecimento[index]})`;
}

function adicionarUpdtFoto() {
    const input = document.getElementById('fileEstabeleUpdt');
    const NewFotos = Array.from(input.files);
    const spans = document.getElementById('spansUpdt');

    if (!input.files || input.files.length === 0) {
        Swal.fire({
            title: 'Nenhuma imagem selecionada',
            icon: 'warning'
        });
        return;
    }

    if (fotosEstabelecimento.length + NewFotos.length > 5) {
        Swal.fire({
            title: 'Limite máximo atingido',
            text: 'Máximo de 5 fotos',
            icon: 'warning'
        });
        return;
    }

    const indicePrimeiraNova = fotosEstabelecimento.length;

    fotosEstabelecimento.push(...NewFotos);

    spans.innerHTML = '';
    for (let i = 0; i < fotosEstabelecimento.length; i++) {
        const span = document.createElement("span");
        span.dataset.updtvalue = `${i}`;
        spans.appendChild(span);
    }

    ShowImage(indicePrimeiraNova);
    atualizarEstiloSpans();

    // Adicionar eventos de clique
    spans.querySelectorAll("span").forEach(span => {
        span.addEventListener("click", () => {
            const index = parseInt(span.dataset.updtvalue);
            ShowImage(index);
            atualizarEstiloSpans();
        });
    });

    // Atualiza visibilidade dos botões
    document.getElementById('addImg').style.display = fotosEstabelecimento.length < 5 ? 'inline-block' : 'none';
    document.getElementById('deleteImgUpdt').style.display = fotosEstabelecimento.length > 0 ? 'inline-block' : 'none';

    console.log(fotosEstabelecimento, fotoShowedEstabelecimento);
}

function ProximaFotoUpdt() {
    if (fotosEstabelecimento.length === 0) return;
    fotoShowedEstabelecimento = (fotoShowedEstabelecimento + 1) % fotosEstabelecimento.length;
    ShowImage(fotoShowedEstabelecimento);
    atualizarEstiloSpans();
}

function AnteriorFotoUpdt() {
    if (fotosEstabelecimento.length === 0) return;
    fotoShowedEstabelecimento = (fotoShowedEstabelecimento - 1 + fotosEstabelecimento.length) % fotosEstabelecimento.length;
    ShowImage(fotoShowedEstabelecimento);
    atualizarEstiloSpans();
}

function atualizarEstiloSpans() {
    const spansColor = document.querySelectorAll('[data-updtvalue]');
    spansColor.forEach(span => {
        span.style.backgroundColor = span.dataset.updtvalue === `${fotoShowedEstabelecimento}`
            ? '#3E996F'
            : 'transparent';
    });
}

function excluirFoto() {
    // Verifica se há fotos para excluir
    if (fotosEstabelecimento.length === 0) {
        Swal.fire({
            title: 'Nenhuma imagem para excluir',
            icon: 'info'
        });
        return;
    }

    // Remove a foto do array com base no índice da foto atualmente exibida
    fotosEstabelecimento.splice(fotoShowedEstabelecimento, 1);

    // Ajusta o índice da foto exibida após a exclusão
    // Se a foto excluída era a última e ainda há fotos, volta para a nova última foto
    if (fotoShowedEstabelecimento >= fotosEstabelecimento.length && fotosEstabelecimento.length > 0) {
        fotoShowedEstabelecimento = fotosEstabelecimento.length - 1;
    } else if (fotosEstabelecimento.length === 0) {
        // Se não houver mais fotos, reseta o índice
        fotoShowedEstabelecimento = 0;
    }
    // Se a foto excluída não era a última, o índice fotoShowedEstabelecimento já aponta para a próxima foto (que se moveu para a posição da excluída)

    // Re-renderiza os spans (indicadores de fotos)
    const spans = document.getElementById('spansUpdt');
    spans.innerHTML = ''; // Limpa os spans existentes
    for (let i = 0; i < fotosEstabelecimento.length; i++) {
        const span = document.createElement("span");
        span.dataset.updtvalue = `${i}`;
        spans.appendChild(span);
    }

    // Adicionar eventos de clique para os novos spans
    spans.querySelectorAll("span").forEach(span => {
        span.addEventListener("click", () => {
            const index = parseInt(span.dataset.updtvalue);
            ShowImage(index);
            atualizarEstiloSpans();
        });
    });

    // Exibe a foto correta (a próxima ou o placeholder se não houver mais fotos)
    ShowImage(fotoShowedEstabelecimento);

    // Atualiza o estilo dos spans para refletir a foto atualmente exibida
    atualizarEstiloSpans();

    // Atualiza a visibilidade dos botões de adicionar e excluir
    document.getElementById('addImg').style.display = fotosEstabelecimento.length < 5 ? 'inline-block' : 'none';
    document.getElementById('deleteImgUpdt').style.display = fotosEstabelecimento.length > 0 ? 'inline-block' : 'none';

    Swal.fire({
        title: 'Imagem excluída!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
    });

    console.log(fotosEstabelecimento, fotoShowedEstabelecimento);
}

async function criarOferta(id) {
    const Nome = document.getElementById('nomeModal').value;
    const Descricao = document.getElementById('descricaoModal').value;
    const Valor = document.getElementById('ValorMinModal').value;
    const response = await fetch(`/api/criarOferta/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Nome: Nome,
            Descricao: Descricao,
            Valor: Valor,
        }),
    })
    if (!response.ok) {
        const erro = await response.json();
        Swal.fire({
            title: 'Erro',
            text: erro.mensagem,
            icon: 'error',
        });
        return false;
    }
    const data = await response.json();
    Swal.fire({
        title: 'Oferta criada',
        text: data.mensagem,
        icon: 'success',
    });
    await pegarOfertas(id);
    fecharModal()
    return true;
}

async function editarOferta(id) {
    // Obter os valores dos campos do formulário
    const nome = document.getElementById('nomeModal').value;
    const descricao = document.getElementById('descricaoModal').value;
    const valor = document.getElementById('ValorMinModal').value;

    try {
        const response = await fetch(`/api/editarOferta/${id}`, {
            method: 'PUT', // Especifica o método HTTP como PUT
            headers: {
                'Content-Type': 'application/json' // Informa ao servidor que estamos enviando JSON
            },
            body: JSON.stringify({ // Converte o objeto JavaScript em uma string JSON
                Nome: nome,
                Descricao: descricao,
                Valor: valor
            })
        });

        if (!response.ok) {
            const erro = await response.json();
            Swal.fire({
                title: 'Erro',
                text: erro.mensagem || 'Ocorreu um erro ao editar a oferta.', // Adicionado fallback para mensagem de erro
                icon: 'error',
            });
            return false;
        }

        // Se a resposta for OK, você pode querer logar a resposta ou apenas prosseguir
        // console.log(await response.json()); // Removido o await response.json sem parênteses

        // Assumindo que pegarOfertas(id) atualiza a lista de ofertas após a edição
        Swal.fire({
            title: 'Sucesso',
            text: 'Oferta editada com sucesso!',
            icon: 'success',
        });
        pegarOfertas(idEstabelecimento);
        fecharModal();
        return true;

    } catch (error) {
        console.error('Erro na requisição:', error);
        Swal.fire({
            title: 'Erro',
            text: 'Não foi possível conectar ao servidor.',
            icon: 'error',
        });
        return false;
    }
}

async function pegarOfertas(id) {
    const Servicos = document.getElementById('servicosEstabelecimento')
    Servicos.innerHTML = '';
    const response = await fetch(`/api/EstabelecimentoOfertas/${id}`);
    const data = await response.json();
    for (const oferta of data) {
        const responseServico = await fetch(`/api/servicoOferta/${oferta.ID_oferta}`);
        const servico = await responseServico.json();
        Servicos.innerHTML = `<div class="servico">
                        <div style="display: flex; flex-direction: row; height: 100%; align-items: center; gap: 1rem;">
                            <div class="marker"></div>
                            <button type="button" class="deleteServico" onclick="deletarOferta(${oferta.ID_oferta})">
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 11V17" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 11V17" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M4 7H20" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#f12525" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button type="button" class="editServico" onclick="AbrirEditModal(${oferta.ID_oferta})">
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z" stroke="#3E996F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <p><strong>${servico.Nome.toUpperCase()}</strong></p>
                        </div>
                        <div class="center">
                            <h5>Descrição</h5>
                            <p class="descricao">${oferta.Descricao}</p>
                        </div>
                        <p>R$ ${oferta.Valor}</p>
                    </div>`
    }
}

async function deletarOferta(id) {
    Swal.fire({
        title: "Deletar Oferta",
        text: 'Deseja deletar essa oferta?',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Deletar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(`/api/deleteOferta/${id}`, {
                method: "DELETE"
            })
            if (response.ok) {
                Swal.fire({
                    title: "Deletado",
                    text: "Oferta deletada com sucesso!",
                    icon: "success",
                })
                await pegarOfertas(id);
                fecharModal();
            } else {
                Swal.fire({
                    title: "Erro",
                    text: "erro ao deletar oferta",
                    icon: "error"
                })
            }
        }
    })
}

function fecharModal() {
    const body = document.querySelector('body');
    const Popup = document.querySelector('.popUp');
    body.removeChild(Popup);
}

function AbrirModal() {
    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add('popUp');
    popup.innerHTML = `<div class="Modal"><h1><strong>Adicionar Serviço</strong></h1><form method="POST" action=""><div class="NomeModal"><label for="nomeModal">Nome do Serviço</label><input type="text" id="nomeModal" name="nome"></div><div class="DescricaoModal"><label for="descricaoModal">Descrição</label><textarea id="descricaoModal" name="descricao" rows="3" cols="50"></textarea></div><div class="ValorModal"><div class="ValorMinModal"><label for="ValorMinModal">Valor</label><input type="text" id="ValorMinModal" name="ValorMin"></div></div><div class="modalBtns"><button type="button" class="CancelBtn" data-bs-dismiss="modal" onclick="fecharModal()">Cancelar</button><button type="button" class="AddBtn" onclick="criarOferta(${idEstabelecimento})">Adicionar</button></div></form></div>`;
    body.appendChild(popup)
}

async function AbrirEditModal(id) {
    const body = document.querySelector('body');
    const response = await fetch(`/api/oferta/${id}`); // Alterado para /api/oferta/:id conforme seu backend

    if (!response.ok) {
        console.error('Erro ao buscar dados da API:', response.statusText);
        // Tratar o erro, talvez mostrar uma mensagem ao usuário
        return;
    }

    const data = await response.json(); // Renomeado para 'data' para evitar confusão com 'dada' anterior

    // Verificar se as propriedades esperadas existem no objeto retornado
    if (!data || !data.oferta || !data.servico) {
        console.error('Formato de dados inesperado da API: Propriedades oferta ou servico ausentes.', data);
        // Tratar o erro
        return;
    }

    const oferta = data.oferta; // Acessa a propriedade 'oferta' do objeto 'data'
    const servico = data.servico; // Acessa a propriedade 'serviço' do objeto 'data'

    const popup = document.createElement('div');
    popup.classList.add('popUp');

    popup.innerHTML = `
        <div class="Modal">
            <h1><strong>Editar Serviço</strong></h1>
            <form method="POST" action="">
                <div class="NomeModal">
                    <label for="nomeModal">Nome do Serviço</label>
                    <input type="text" id="nomeModal" name="nome">
                </div>
                <div class="DescricaoModal">
                    <label for="descricaoModal">Descrição</label>
                    <textarea id="descricaoModal" name="descricao" rows="3" cols="50"></textarea>
                </div>
                <div class="ValorModal">
                    <div class="ValorMinModal">
                        <label for="ValorMinModal">Valor</label>
                        <input type="text" id="ValorMinModal" name="ValorMin">
                    </div>
                </div>
                <div class="modalBtns">
                    <button type="button" class="CancelBtn" data-bs-dismiss="modal" onclick="fecharModal()">Cancelar</button>
                    <button type="button" class="AddBtn" onclick="editarOferta(${id})">Salvar</button>
                </div>
            </form>
        </div>
    `;

    body.appendChild(popup);

    document.getElementById('nomeModal').value = servico.Nome || '';
    document.getElementById('descricaoModal').value = oferta.Descricao || '';
    document.getElementById('ValorMinModal').value = oferta.Valor || '';
}

// document.getElementById('addServico').addEventListener('click', criarOferta);
// document.getElementById('changecampos').addEventListener('click',ChangeCampos)
// document.getElementById('cancelUpdt').addEventListener("click", () => {
//     ChangeCampos();
//     pegarDataEstabelecimento()
// })
// document.getElementById('SaveUpdt').addEventListener("click", () => {
//     if (!UpdateEstabelecimento()) {return}
//     ChangeCampos();
//     pegarDataEstabelecimento()
// })
