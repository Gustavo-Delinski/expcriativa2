function VerificarCampos() {
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        Swal.fire({
            icon: 'error',
            title: 'Campos vazios',
            text: 'Por favor, preencha todos os campos.'
        })
        return;
    }
    if (!email.includes("@")) {
        Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            text: 'Por favor, insira um email válido.'
        })
        return;
    }
}

function mostrarSenha(event) {
    var campoSenha = document.getElementById('senha');
    if (campoSenha.type == 'password') {
        campoSenha.type = 'text';
    } else {
        campoSenha.type = 'password';
    }
}
