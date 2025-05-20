const mostrarFoto = () => {
    const input = document.getElementById('file');
    const img = document.getElementById('Perfilimg');
    img.style.backgroundImage = `url(${URL.createObjectURL(input.files[0])})`;
}
function MostrarSenha() {
    const Atual = document.getElementById('senhaAtual');
    const campoSenha = document.getElementById('novaSenha');
    const campoSenha2 = document.getElementById('confirmarNovaSenha');
    const img = document.querySelectorAll('.imgOlho');
    if (campoSenha.type === 'password') {
        Atual.type = 'text';
        campoSenha.type = 'text';
        campoSenha2.type = 'text';
        for (let i = 0; i < img.length; i++) {
        img[i].src = '../imagens/SVGs/olho-fechado.svg';
        }
    } else {
        Atual.type = 'password';
        campoSenha.type = 'password';
        campoSenha2.type = 'password';
        for (let i = 0; i < img.length; i++) {
            img[i].src = '../imagens/SVGs/olho-aberto.svg';
        }
    }
}

function mascaraCPF(event) {
    let input = event.target;
    let cpf = input.value.replace(/\D/g, "").slice(0, 11); // apenas números, máximo de 11 dígitos

    // Aplica a máscara de acordo com tamanho do CPF
    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    input.value = cpf;
}
function validaCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcDig = (factor, max) => {
        let total = 0;
        for (let i = 0; i < max; i++) {
            total += parseInt(cpf[i]) * (factor--);
        }
        let resto = (total * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    const dig1 = calcDig(10, 9);
    const dig2 = calcDig(11, 10);

    return dig1 === parseInt(cpf[9]) && dig2 === parseInt(cpf[10]);
}
function msgValidaCPF() {
    const cpf = document.getElementById('cpf').value;

    if (!validaCPF(cpf)) {
        Swal.fire(
            'CPF Inválido',
            '',
            'error'
        );
        document.getElementById('cpf').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}
function formatarCPF(cpf) {
    cpf = cpf.toString().padStart(11, '0');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function ValidarNome(nome) {
    const regex = /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/;
    if (nome.length < 8 || !regex.test(nome)) {
        Swal.fire(
            'Nome Inválido',
            'Por favor, insira um nome completo.',
            'error'
        );
        document.getElementById('nome').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}
function validarEmail(email) {
    const regex = /^[A-Za-z0-9._!#$%&*+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!regex.test(email)) {
        Swal.fire(
            'Email Inválido',
            'Por favor, insira um email v&aacute;lido.',
            'error'
        )
        document.getElementById('email').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}
function validarSenhas(senha, senhaConfirmar) {
    let mascara = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/


    if (senha.length < 8) {
        Swal.fire(
            'Senha Fraca',
            'A senha deve ter pelo menos 8 caracteres.',
            'error'
        );
        document.getElementById('senha').style.outline = '1px solid rgb(202, 50, 121)';
        document.getElementById('confirmarsenha').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    if (!mascara.test(senha)) {
        Swal.fire(
            'Senha Fraca',
            'A senha deve ter pelo menos uma letra maiúscula, uma letra minúscula, um número e um símbolo especial.',
            'error'
        );
        document.getElementById('senha').style.outline = '1px solid rgb(202, 50, 121)';
        document.getElementById('confirmarsenha').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    if (senha !== senhaConfirmar) {
        Swal.fire(
            'Senhas Diferentes',
            'O campo de senha e confirmação de senha devem ser iguais.',
            'error'
        );
        document.getElementById('senha').style.outline = '1px solid rgb(202, 50, 121)';
        document.getElementById('confirmarsenha').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}
function ValidarData(data) {
    let today = new Date();
    let dataNasc = new Date(data);

    let idade = today.getFullYear() - dataNasc.getFullYear();
    let m = today.getMonth() - dataNasc.getMonth();
    let d = today.getDate() - dataNasc.getDate();
    if (isNaN(dataNasc.getTime())) {
        Swal.fire(
            'Data Inválida',
            'Por favor, insira uma data v&aacute;lida.',
            'error'
        );
        document.getElementById('datanasc').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    if (m < 0 || (m === 0 && d < 0)) {
        idade--;
    }
    if (idade < 18) {
        Swal.fire(
            'Menor de idade',
            'Apenas maiores de idade podem se cadastrar.',
            'error'
        );
        document.getElementById('datanasc').style.border = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}
function formatarData(dataString) {
    const data = new Date(dataString);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // meses começam do 0
    const ano = String(data.getFullYear());

    return `${ano}-${mes}-${dia}`;
}
async function pegarDados() {
    try {
        const displayNome = document.getElementById('NomeEmail');
        const nome = document.getElementById('nomeUsu');
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        const response = await fetch(`/api/usuario/${dados.usuarioId}`, {
            method: 'GET'
        })
        const usuario = await response.json();
        document.getElementById('nome').value = usuario.Nome;
        document.getElementById('email').value = usuario.Email;
        document.getElementById('cpf').value = formatarCPF(usuario.CPF);
        document.getElementById('datanasc').value = formatarData(usuario.DataNasc);
        displayNome.innerHTML = `<h4>${usuario.Nome}</h4><h5>${usuario.Email}</h5>`;
        nome.innerHTML = usuario.Nome.split(" ")[0].toUpperCase();
        const responseImg = await fetch(`/api/usuario/${dados.usuarioId}/foto`,{
            method: 'GET'
        })
        if (responseImg.status === 202) {
            return;
        }
        else if (responseImg.ok) {
            // Tem imagem, exibe
            const img = await responseImg.blob();
            const url = URL.createObjectURL(img);
            document.getElementById('imgPerfil').style.backgroundImage = `url(${url})`;
            document.getElementById('Perfilimg').style.backgroundImage = `url(${url})`;
            document.querySelector(".conta").src = url;
        } else {
            console.error(`Erro ao carregar imagem. Status: ${responseImg.status}`);
        }
    } catch (error) {
        console.log(`Erro ao requisitar os dados do banco.\n${error}`);
    }
}

document.addEventListener('DOMContentLoaded', pegarDados())

const Cancelar = () => {
    const btns = document.getElementById("btns");
    pegarDados().then(mudarCampos());
    btns.innerHTML =`<button type="button" class="mudarcampos" onclick="mudarCampos()">Mudar informações</button>`
}

const mudarCampos = () => {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const dataNasc = document.getElementById('datanasc');
    const cpf = document.getElementById('cpf');
    const file = document.getElementById('file');
    const svg =  document.getElementById('svgFoto');
    const btns = document.getElementById("btns");
    nome.readOnly = !nome.readOnly;
    email.readOnly = !email.readOnly;
    dataNasc.readOnly = !dataNasc.readOnly;
    cpf.readOnly = !cpf.readOnly;
    file.disabled = !file.disabled;
    svg.style.display === 'block' ? svg.style.display = 'none' : svg.style.display = 'block';
    !nome.readOnly ? nome.style.border = "1px solid rgba(62, 62, 62, 1)" : nome.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    !email.readOnly ? email.style.border = "1px solid rgba(62, 62, 62, 1)" : email.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    !dataNasc.readOnly ? dataNasc.style.border = "1px solid rgba(62, 62, 62, 1)" : dataNasc.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    !cpf.readOnly ? cpf.style.border = "1px solid rgba(62, 62, 62, 1)" : cpf.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    btns.innerHTML = `<button type="button"  class="BtnCancelar" onclick="Cancelar()">Cancelar</button> <button type="button" class="BtnSalvar" onclick="UpdateDados()">Salvar</button>`
}

async function UpdateDados() {
    try {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const dataNasc = document.getElementById('datanasc').value;
        const cpf = document.getElementById('cpf').value;
        const foto = document.getElementById('file')
        const btns = document.getElementById("btns");
        if (!ValidarNome(nome)) return;
        if (!validarEmail(email)) return;
        if (!ValidarData(dataNasc)) return;
        if (!msgValidaCPF(cpf)) return;
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('dataNascimento', dataNasc);
        formData.append('cpf', cpf);
        foto.files[0] ? formData.append('file', foto.files[0]) : null;
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        const response = await fetch(`/api/usuario/${dados.usuarioId}`, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const result = await response.json();
        pegarDados().then(mudarCampos());
        btns.innerHTML =`<button type="button" class="mudarcampos" onclick="mudarCampos()">Mudar informações</button>`
        console.log('Atualização realizada com sucesso:', result);
        Swal.fire({
            tittle: 'Dados atualizados com sucesso!',
            text: `${dados.nome}Seus dados foram atualizados com sucesso.`,
            icon: 'success',
            confirmButtonText: 'OK'
        })
    } catch (error) {
        console.log(`Erro ao atualizar os dados do banco.\n${error}`);
    }
}

async function UpdateSenha() {
    try {
        const senhaAtual = document.getElementById('senhaAtual').value;
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarNovaSenha = document.getElementById('confirmarNovaSenha').value;
        const btns = document.getElementById("btns");
        if (!validarSenhas(novaSenha, confirmarNovaSenha)) return;
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        const response = await fetch(`/api/usuario/${dados.usuarioId}/senha`, {
            method: 'PUT',
            body: JSON.stringify({ senhaAtual, novaSenha })
        });
        if (!response.ok) {
            let erro = await response.json();
            Swal.fire({
                tittle: 'Erro ao atualizar a senha!',
                text: `${erro.mensagem}`,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        Swal.fire({
            tittle: 'Senha atualizada com sucesso!',
            text: `${dados.nome}, Sua senha foi atualizada com sucesso.`,
            icon: 'success',
            confirmButtonText: 'OK'
        })
    } catch (error) {
        console.log(`Erro ao atualizar a senha do banco.\n${error}`);
    }
}

function trocarmodal(Modal) {
    const modal = document.getElementById('informacao');
    const modais = [`<h1>Meu Perfil</h1><p>Gerenciar a sua conta</p><hr><form id="form"><div class="NomeEmailFoto"><div class="NomeEmail"><div class="nome"><label for="nome">Nome Completo</label><input type="text" id="nome" name="nome" readonly></div><div class="email"><label for="email">Email</label><input type="text" id="email" name="email" readonly ></div></div><div class="InputFoto"><label for="file"><div id="Perfilimg" class="Perfilimg"></div><svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none" id="svgFoto"><path d="M21 11V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V9C3 7.89543 3.89543 7 5 7H6.5C7.12951 7 7.72229 6.70361 8.1 6.2L9.15 4.8C9.52771 4.29639 10.1205 4 10.75 4H13.25" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="70%"/><path d="M18.5 4V6.5M18.5 9V6.5M18.5 6.5H16M18.5 6.5H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="70%"/><circle cx="12" cy="13" r="4" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="70%"/></svg></label><input type="file" id="file" name="file" accept="image/*" onchange="mostrarFoto()" style="display: none;" disabled></div></div><div class="DtnascCpf"><div class="datanasc"><label for="datanasc">Data de nascimento</label><input type="date" id="datanasc" name="datanasc" readonly></div><div class="cpf"><label for="cpf">CPF</label><input type="text" id="cpf" name="cpf" maxlength="14" oninput="mascaraCPF(event)" onchange="" readonly></div></div><div id="btns"><button type="button" class="mudarcampos" onclick="mudarCampos()">Mudar informações</button></div></form>`,`<h1>Trocar Senha</h1><hr/><form><div class="SenhaAtual"><label for="senhaAtual">Senha Atual</label><input type="password" id="senhaAtual" name="senhaAtual"/><div class="DivOlho" onclick="MostrarSenha()"><img src="../imagens/SVGs/olho-aberto.svg" alt="Olho fechado" id="olho" class="imgOlho"></div></div><div class="NovaSenha"><label for="novaSenha">Nova Senha</label><input type="password" id="novaSenha" name="novaSenha"/><div class="DivOlho" onclick="MostrarSenha()"><img src="../imagens/SVGs/olho-aberto.svg" alt="Olho fechado" id="olho" class="imgOlho"></div></div><div class="CheckNovaSenha"><label for="confirmarNovaSenha">Corfirmar Nova Senha</label><input type="password" id="confirmarNovaSenha"/><div class="DivOlho" onclick="MostrarSenha()"><img src="../imagens/SVGs/olho-aberto.svg" alt="Olho fechado" id="olho" class="imgOlho"></div></div><div id="btns"><button type="button" class="BtnSalvar" onclick="UpdateSenha()">Salvar</button></div></form>`]
    modal.innerHTML = modais[Modal]
}

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
function dropdown() {
    const dropdown = document.querySelector(`.dropdown-content`);
    dropdown.style.display === "flex" ? dropdown.style.display = "none" : dropdown.style.display = "flex";
};
document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById('nome').addEventListener('input', function () {
    document.getElementById('nome').style.border = '1px solid rgba(62, 62, 62, 1)';
})
document.getElementById('email').addEventListener('input', function () {
    document.getElementById('email').style.border = '1px solid rgba(62, 62, 62, 1)';

})
document.getElementById('datanasc').addEventListener('input', function () {
    document.getElementById('datanasc').style.border = '1px solid rgba(62, 62, 62, 1)';
})
document.getElementById('cpf').addEventListener('input', function () {
    document.getElementById('cpf').style.border = '1px solid rgba(62, 62, 62, 1)';
})