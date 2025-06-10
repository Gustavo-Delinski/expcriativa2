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

function mascaraCPF(input) {
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
        console.log(dados)
        const response = await fetch(`/api/usuario/${dados.usuarioId}`, {
            method: 'GET'
        })
        const usuario = await response.json();
        document.getElementById('nome').value = usuario.Nome;
        document.getElementById('email').value = usuario.Email;
        document.getElementById('cpf').value = formatarCPF(usuario.CPF);
        document.getElementById('datanasc').value = formatarData(usuario.DataNasc);
        displayNome.innerHTML = `<h4>${usuario.Nome.split(" ")[0].charAt(0).toUpperCase() + usuario.Nome.split(" ")[0].slice(1)}</h4><h5>${usuario.Email}</h5>`;
        nome.innerHTML = usuario.Nome.split(" ")[0].charAt(0).toUpperCase() + usuario.Nome.split(" ")[0].slice(1);
        const responseImg = await fetch(`/api/usuario/${dados.usuarioId}/foto`,{
            method: 'GET'
        })
        console.log(responseImg)
        if (responseImg.status === 204 || responseImg.status === 404) {
            console.log("Sem imagem de perfil");
            return;
        } else if (responseImg.ok) {
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
            Swal.fire({
                title: 'Erro ao atualizar os dados!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        const result = await response.json();
        pegarDados().then(mudarCampos);
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
        const resposta = await fetch("/auth/estado");
        const dados = await resposta.json();
        const responseSenha = await fetch(`/api/usuario/${dados.usuarioId}/verificarsenha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senhaAtual, novaSenha })
        })
        const usuario = await responseSenha.json();
        if (!responseSenha.ok) {
            Swal.fire({
                title: 'Erro ao atualizar a senha!',
                text: `${usuario.mensagem}`,
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        }
        if (!validarSenhas(novaSenha, confirmarNovaSenha)) return;
        const response = await fetch(`/api/usuario/${dados.usuarioId}/Novasenha`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ novaSenha })
        });
        if (!response.ok) {
            let erro = await response.json();
            Swal.fire({
                title: 'Erro ao atualizar a senha!',
                text: `${erro.mensagem}`,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        Swal.fire({
            title: 'Senha atualizada com sucesso!',
            text: `${dados.nome}, Sua senha foi atualizada com sucesso.`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('senhaAtual').value = '';
                document.getElementById('novaSenha').value = '';
                document.getElementById('confirmarNovaSenha').value = '';
                trocarmodal(0)
            }
        })
    } catch (error) {
        console.log(`Erro ao atualizar a senha do banco.\n${error}`);
    }
}

if (document.getElementById('cpf')) document.getElementById('cpf').addEventListener('input', function () {
    document.getElementById('cpf').style.border = '1px solid rgba(62, 62, 62, 1)';
});