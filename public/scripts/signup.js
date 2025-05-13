function mascaraCPF(event) {
    let input = event.target;
    let cpf = input.value.replace(/\D/g, "").slice(0, 11); // apenas números, máximo de 11 dígitos

    // Aplica a máscara de acordo com o tamanho do CPF
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
        document.getElementById('cpf').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

function ValidarNome(nome) {
    var regex = /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)+$/;
    if (nome.length < 8 || !regex.test(nome)) {
        Swal.fire(
            'Nome Inválido',
            'Por favor, insira um nome completo.',
            'error'
        );
        document.getElementById('nome').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

function validarEmail(email) {
    var regex = /^[A-Za-z0-9._!#$%&*+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!regex.test(email)) {
        Swal.fire(
            'Email Inválido',
            'Por favor, insira um email v&aacute;lido.',
            'error'
        )
        document.getElementById('email').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    };
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
    if (senha != senhaConfirmar) {
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
};

function ValidarData(data) {
    var today = new Date();
    var dataNasc = new Date(data);

    let idade = today.getFullYear() - dataNasc.getFullYear();
    var m = today.getMonth() - dataNasc.getMonth();
    var d = today.getDate() - dataNasc.getDate();
    if (isNaN(dataNasc.getTime())) {
        swal.fire(
            'Data Inválida',
            'Por favor, insira uma data v&aacute;lida.',
            'error'
        );
        document.getElementById('datanasc').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    if (m < 0 || (m === 0 && d < 0)) {
        idade--;
    }
    if (idade < 18) {
        swal.fire(
            'Menor de idade',
            'Apenas maiores de idade podem se cadastrar.',
            'error'
        );
        document.getElementById('datanasc').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

function MostrarSenha() {
    var campoSenha = document.getElementById('senha');
    var campoSenha2 = document.getElementById('confirmarsenha');
    const img = document.getElementById('olho');
    if (campoSenha.type == 'password') {
        campoSenha.type = 'text';
        campoSenha2.type = 'text';
        img.src = '../imagens/olho-fechado.svg';
    } else {
        campoSenha.type = 'password';
        campoSenha2.type = 'password';
        img.src = '../imagens/olho-aberto.svg';
    }
}

const form = document.getElementById('FormCadastro');


async function ValidarCampos() {
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let datanasc = document.getElementById('datanasc').value;
    let cpf = document.getElementById('cpf').value;
    let senha = document.getElementById('senha').value;
    let checksenha = document.getElementById('confirmarsenha').value;

    if (!ValidarNome(nome)) return;
    if (!validarEmail(email)) return;
    if (!ValidarData(datanasc)) return;
    if (!msgValidaCPF(cpf)) return;
    if (!validarSenhas(senha, checksenha)) return;

    try {
        const resposta = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome.trim(),
                dataNascimento: datanasc,
                email: email.trim(),
                cpf: cpf.replace(/\D/g, ''),
                senha: senha
            }),
        });
        if (resposta.ok) {
            const resultado = await resposta.json();
            console.log("Funcionou")
            Swal.fire(
                'Cadastro realizado com sucesso',
                `${resultado.mesagem},você ser&aacute; redirecionado para a tela de login em breve`,
                'success'
            );
            setTimeout(() => {
                window.location.href = "/login";
            },3000)
        } else {
            const erro = await resposta.json();
            Swal.fire(
                'Erro ao cadastrar',
                `${erro.mensagem}`,
                'error'
            );
        }
    } catch (error) {
        Swal.fire(
            'Erro ao cadastrar',
            `${error.messagem}`,
            'error'
        )
    }
};
form.addEventListener('submit', function (e) {
    e.preventDefault();
    ValidarCampos();
});

    document.getElementById('senha').addEventListener('input', function () {
        document.getElementById('senha').style.outline = '1px solid #3E996F';
        document.getElementById('confirmarsenha').style.outline = '1px solid #3E996F';
    })
    document.getElementById('confirmarsenha').addEventListener('input', function () {
        document.getElementById('senha').style.outline = '1px solid #3E996F';
        document.getElementById('confirmarsenha').style.outline = '1px solid #3E996F';
    })
    document.getElementById('nome').addEventListener('input', function () {
        document.getElementById('nome').style.outline = '1px solid #3E996F';
    })
    document.getElementById('email').addEventListener('input', function () {
        document.getElementById('email').style.outline = '1px solid #3E996F';

    })
    document.getElementById('datanasc').addEventListener('input', function () {
        document.getElementById('datanasc').style.outline = '1px solid #3E996F';
    })
    document.getElementById('cpf').addEventListener('input', function () {
        document.getElementById('cpf').style.outline = '1px solid #3E996F';
    })