function MostrarSenha() {
    var campoSenha = document.getElementById('senha');
    const img = document.getElementById('olho');
    if (campoSenha.type == 'password') {
        campoSenha.type = 'text';
        img.src = '../imagens/olho-fechado.svg';
    } else {
        campoSenha.type = 'password';
        img.src = '../imagens/olho-aberto.svg';
    }
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
let form = document.getElementById('Form-login');

async function VerificarCampos() {
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    console.log(email, senha);
    if (email === "" || senha === "") {
        Swal.fire({
            icon: 'error',
            title: 'Campos vazios',
            text: 'Por favor, preencha todos os campos.'
        });
        return;
    }
    if (!validarEmail(email)) return;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });
        if (response.ok) {
            const id_usuario = await response.json();
            sessionStorage.setItem('id_usuario', id_usuario);
            sessionStorage.setItem('email', email);
            window.location.href = "/";
        } else {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: `${error.mensagem}`,
                text: 'Por favor, verifique seus dados e tente novamente.'
            });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível se conectar ao servidor.'
        });
    }
}


form.addEventListener('submit', function (e) {
    e.preventDefault();
    VerificarCampos();
})

document.getElementById('senha').addEventListener('input', function () {
    document.getElementById('senha').style.outline = '1px solid #3E996F';
})
document.getElementById('email').addEventListener('input', function () {
    document.getElementById('email').style.outline = '1px solid #3E996F';
})