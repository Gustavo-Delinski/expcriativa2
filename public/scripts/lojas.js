function mascaraCNPJ(event){
    let input = event.target;
    let v = input.value.replace(/\D/g, "").slice(0, 14); // apenas números, máximo de 14 dígitos

    v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/,"$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
    v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
    v=v.replace(/\.(\d{3})(\d)/,".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    v=v.replace(/(\d{4})(\d)/,"$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
    input.value = v;
}

function validaCNPJ (cnpj) {
    var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
    var c = String(cnpj).replace(/[^\d]/g, '')
    
    if(c.length !== 14)
        return false

    if(/0{14}/.test(c))
        return false

    for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
    if(c[12] !== (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
    if(c[13] !== (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    return true
}

function msgValidaCNPJ() {
    const cnpj = document.getElementById('cnpj').value;

    if (!validaCNPJ(cnpj)) {
        Swal.fire(
            'CNPJ Inválido',
            '',
            'error'
        );
        document.getElementById('cnpj').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    }
    return true;
}

function mascaraCEP(event){
    let input = event.target;
    let v = input.value.replace(/\D/g, "").slice(0, 8); // apenas números, máximo de 8 dígitos

    if (!v) return ""
    v = v.replace(/\D/g,'')
    v = v.replace(/(\d{5})(\d)/,'$1-$2')
    
    input.value = v;
  }

function validarCEP(cep) {
    // Remover espaços em branco e hífens do CEP
    cep = cep.replace(/\s+|-/g, "");
    // Verificar se o CEP possui 8 caracteres
    if (cep.length !== 8) {
        return false;
    }
    // Verificar se o CEP é composto apenas por números
    return cep.split("").every((char) => !isNaN(char));
}

function msgValidaCEP() {
    const cep = document.getElementById('cep').value;

    if (!validarCEP(cep)) {
        Swal.fire(
            'CEP Inválido',
            '',
            'error'
        );
        document.getElementById('cep').style.outline = '1px solid rgb(202, 50, 121)';
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

function validarEndereco(endereco) {
    var regex = /^[A-Za-zÀ-ÿ0-9]+(?:\s+[A-Za-zÀ-ÿ0-9]+)+$/;
    if (endereco.length < 8 || !regex.test(endereco)) {
        Swal.fire(
            'Endereço Inválido',
            'Por favor, insira um endereço v&aacute;lido.',
            'error'
        )
        document.getElementById('endereco').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    };
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
};

function validarNum(numero) {
    if (!numero) {
        Swal.fire(
            'Campos faltando',
            'Por favor, insira um n&aacute;mero v&aacute;lido.',
            'error'
        )
        document.getElementById('numero').style.outline = '1px solid rgb(202, 50, 121)';
        return false;
    };
    return true;
};


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
    let endereco = document.getElementById('endereco').value;
    let numero = document.getElementById('numero').value;
    let compl = document.getElementById('compl').value;
    let cnpj = document.getElementById('cnpj').value;
    let cep = document.getElementById('cep').value;

    if (!ValidarNome(nome)) return;
    if (!validarEndereco(endereco)) return;
    if (!validarNum(numero)) return;
    if (!msgValidaCNPJ(cnpj)) return;
    if (!msgValidaCEP(cep)) return;
    try {
        const resposta = await fetch('/api/lojas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome.trim(),
                endereco: endereco.trim(),
                numero: numero,
                compl: compl.trim(),
                cnpj: cnpj.replace(/\D/g, ''),
                cep: cep.replace(/\D/g, '')
            }),
        });
        if (resposta.ok) {
            const resultado = await resposta.json();
            console.log("Funcionou")
            Swal.fire(
                'Cadastro realizado com sucesso',
                `${resultado.mensagem}`,
                'success'
            );
            setTimeout(() => {
                window.location.href = "/";
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
    })
    document.getElementById('cnpj').addEventListener('input', function () {
        document.getElementById('cnpj').style.outline = '1px solid #3E996F';
    })
    document.getElementById('nome').addEventListener('input', function () {
        document.getElementById('nome').style.outline = '1px solid #3E996F';
    })
    document.getElementById('email').addEventListener('input', function () {
        document.getElementById('email').style.outline = '1px solid #3E996F';

    })
    document.getElementById('cep').addEventListener('input', function () {
        document.getElementById('cep').style.outline = '1px solid #3E996F';
    })
    document.getElementById('endereco').addEventListener('input', function () {
        document.getElementById('endereco').style.outline = '1px solid #3E996F';
    })