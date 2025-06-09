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

async function abrirModalEdicao(id) {
    const response = await fetch(`/api/usuario/${id}`);
    const usuario = await response.json();

    document.getElementById('editId').value = usuario.ID_usuario;
    document.getElementById('editNome').value = usuario.Nome;
    document.getElementById('editEmail').value = usuario.Email;
    document.getElementById('editCPF').value = usuario.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

    const data = new Date(usuario.DataNasc);
    if (!isNaN(data.getTime())) {
        document.getElementById('editDataNasc').value = data.toISOString().split('T')[0];
    } else {
        document.getElementById('editDataNasc').value = "";
    }

    document.getElementById('editSenha').value = usuario.Senha || "";

    const modal = new bootstrap.Modal(document.getElementById('modalEdicaoUsuario'));
    modal.show();
}

function listarUsuarios() {
    fetch('/api/usuarios', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById('TabelaCorpo');
            tabela.innerHTML = ''; // limpa antes de inserir
            data.forEach(usuario => {
                const dataFormatada = new Date(usuario.DataNasc).toLocaleDateString('pt-BR');
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${usuario.ID_usuario}</td>
                    <td>${usuario.Nome}</td>
                    <td>${usuario.Email}</td>
                    <td>${formatarCPF(usuario.CPF)}</td>
                    <td>${dataFormatada}</td>
                    <td>${usuario.Senha ? '••••••••' : '(sem senha)'}</td>
                    <td>
                        <button onclick="PopUpDelete(${usuario.ID_usuario})"
                            style="width:100%; padding: 6px; background-color: red; color: white; border: none;">X</button>
                    </td>
                    <td>
                        <button onclick="abrirModalEdicao(${usuario.ID_usuario})"
                            style="width:100%; padding: 6px; background-color: dodgerblue; color: white; border: none;">🔄</button>
                    </td>
                `;
                tabela.appendChild(linha);
            });
        });
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

async function salvarEdicaoUsuario() {
    const id = document.getElementById('editId').value;
    const nome = document.getElementById('editNome').value;
    const email = document.getElementById('editEmail').value;
    const cpf = document.getElementById('editCPF').value.replace(/\D/g, '');
    const dataNascimentoRaw = document.getElementById('editDataNasc').value;

    let dataNascimento = "";
    if (dataNascimentoRaw) {
        const [ano, mes, dia] = dataNascimentoRaw.split('-');
        dataNascimento = `${ano}-${mes}-${dia}T00:00:00Z`;
    }

    const body = { nome, email, cpf };
    if (dataNascimento) body.dataNascimento = dataNascimento;

    const response = await fetch(`/api/usuario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        Swal.fire('Usuário atualizado com sucesso!');
        bootstrap.Modal.getInstance(document.getElementById('modalEdicaoUsuario')).hide();
        document.getElementById('TabelaCorpo').innerHTML = '';
        listarUsuarios(); // atualiza a tabela
    } else {
        const erro = await response.json();
        Swal.fire('Erro', erro.mensagem || 'Erro ao atualizar usuário', 'error');
    }
}



function formatarCPF(cpf) {
    cpf = cpf.toString().padStart(11, '0');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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


document.addEventListener('DOMContentLoaded', function () {
    listarUsuarios();
})

async function deletarUsuario(id) {
    try {
        const response = await fetch(`/api/usuario/${id}`, {
            method: 'DELETE'
        })
        const result = await response.json()
        console.log(result.mensagem)
        listarUsuarios()
    } catch (error) {
        console.log(`Erro ao excluir o usuário: ${error}`)
    }
}

async function PopUpDelete(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar!'
    })
    const result = await Swal.fire({
    title: "Deseja deletar esse usuário?",
    text: "Não será possível reverter essa ação!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Deletar"
    });
    if (result.isConfirmed) {
        await deletarUsuario(id)
        await Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
        });
    }
}
function trocarTipo() {
    let nome = document.getElementById('nome');
    let email = document.getElementById('email');
    let cpf = document.getElementById('cpf');
    if (nome.readOnly) {
        nome.readOnly = false;
        email.readOnly = false;
        cpf.readOnly = false;
    } else {
        nome.readOnly = true;
        email.readOnly = true;
        cpf.readOnly = true;
    }
}

async function editarUsuario(id) {
    let nome = document.getElementById(`userNome[id="${id}"]`);
    let email = document.querySelector(`.userEmail[id="${id}"]`);
    let cpf = document.querySelector(`.userCPF[id="${id}"]`);
    try {
        const response = await fetch(`/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome:nome.value, email:email.value, cpf:cpf.value })
        })
        const result = await response.json()
        console.log(result.mensagem)
        listarUsuarios()
    } catch (error) {
        console.log(`Erro ao editar o usuário: ${error}`)
    }
}

async function acessarAreaAdm() {
    try {
        const res = await fetch('/listaUsuarios'); // substitua pela rota real

        if (!res.ok) {
            const erro = await res.json();
            if (res.status === 401) {
                Swal.fire({
                    title: "Acesso negado",
                    text: "Você não tem permissão para acessar essa área.",
                    icon: "error",
                    confirmButtonText: "OK"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/';
                    }
                });
            } else {
                window.location.href = '/';
            }
            return;
        }

        // Se autorizado, redireciona ou faz algo
        const dados = await res.json();
        console.log(dados); // ou redirecionar
    } catch (err) {
        console.error('Erro na requisição:', err);
        mostrarPopup('Erro de conexão.');
    }
}
