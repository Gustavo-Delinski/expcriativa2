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

function listarLojas() {
  fetch('/api/estabelecimentos', {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      const tabela = document.getElementById('TabelaCorpo');
      tabela.innerHTML = ''; // limpa antes
      data.forEach(estabelecimento => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${estabelecimento.ID_estabelecimento}</td>
          <td>${estabelecimento.Nome}</td>
          <td>${estabelecimento.Numero || ''}</td>
          <td>${estabelecimento.Complemento || ''}</td>
          <td>${estabelecimento.Cnpj || ''}</td>
          <td>${estabelecimento.CEP || ''}</td>
          <td>
            <button onclick="PopUpDelete(${estabelecimento.ID_estabelecimento})" class="btn btn-danger btn-sm" title="Deletar usuário" style="width: 100%; background-color: red; color: white; border-radius: 0px">X</button>
          </td>
<td>
  <button 
    class="btn btn-primary btn-sm" 
    data-bs-toggle="modal" 
    data-bs-target="#modalEdicaoLoja"
    onclick="abrirModalEdicaoLoja(${estabelecimento.ID_estabelecimento})" style="width: 100%; background-color: #0d6efd; border-radius: 0px">
    🔄
  </button>
</td>
        `;
        tabela.appendChild(linha);
      });
    });
}


document.addEventListener('DOMContentLoaded', function () {
    listarLojas();
})



function habilitarEdicao(id) {
    const campos = ['nome', 'numero', 'compl', 'cnpj', 'cep'];
    
    campos.forEach(campo => {
        const input = document.getElementById(`${campo}-${id}`);
        if (input) {
            input.readOnly = false;
        } else {
            console.warn(`Campo ${campo}-${id} não encontrado no DOM`);
        }
    });
}


async function editarLoja(id) {
    const nome = document.getElementById(`nome-${id}`).value;
    const numero = document.getElementById(`numero-${id}`).value;
    const compl = document.getElementById(`compl-${id}`).value;
    const cnpj = document.getElementById(`cnpj-${id}`).value;
    const cep = document.getElementById(`cep-${id}`).value;

    try {
        console.log(id);
        const response = await fetch(`/api/estabelecimento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: nome, numero: numero, complemento: compl, cnpj: cnpj, cep:cep })
        });
        const result = await response.json();
        console.log(result.mensagem);
        window.location.reload(); // Recarrega a tabela após a edição
    } catch (error) {
        console.log(`Erro ao editar a loja: ${error}`);
    }
}

// 1) Abre o modal e popula campos
async function abrirModalEdicaoLoja(id) {
  try {
    console.log("Abrindo modal de edição para ID", id);
    const res = await fetch(`/api/estabelecimento/${id}`); // singular no GET
    if (!res.ok) throw new Error("Loja não encontrada");
    const loja = await res.json();

    document.getElementById('editLojaId').value = loja.ID_estabelecimento;
    document.getElementById('editLojaNome').value = loja.Nome;
    document.getElementById('editLojaNumero').value = loja.Numero || '';
    document.getElementById('editLojaComplemento').value = loja.Complemento || '';
    document.getElementById('editLojaCnpj').value = loja.Cnpj;
    document.getElementById('editLojaCep').value = loja.CEP;
    // o data-bs-toggle abre o modal
  } catch (e) {
    console.error(e);
    Swal.fire('Erro', e.message, 'error');
  }
}

// 2) Envia PUT, fecha modal limpando backdrop e recarrega tabela
async function salvarEdicaoLoja() {
  try {
    console.log(">> Iniciando salvarEdicaoLoja");
    const id = document.getElementById('editLojaId').value;
    const body = {
      Nome: document.getElementById('editLojaNome').value,
      Numero: document.getElementById('editLojaNumero').value,
      Complemento: document.getElementById('editLojaComplemento').value,
      Cnpj: document.getElementById('editLojaCnpj').value,
      CEP: document.getElementById('editLojaCep').value
    };
    console.log("Dados a enviar:", id, body);

    const response = await fetch(`/api/estabelecimentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    console.log("Status da resposta:", response.status);
    const data = await response.json().catch(() => ({}));
    console.log("Body da resposta:", data);

    if (!response.ok) {
      return Swal.fire('Erro', data.mensagem || 'Falha ao atualizar', 'error');
    }

    await Swal.fire('Sucesso', 'Estabelecimento atualizado.', 'success');

    // Fecha modal e remove backdrop
    const modalEl = document.getElementById('modalEdicaoLoja');
    const modalInst = bootstrap.Modal.getInstance(modalEl);
    modalInst.hide();
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    // Recarrega só a tabela
    listarLojas();

  } catch (err) {
    console.error("Catch salvarEdicaoLoja:", err);
    Swal.fire('Erro inesperado', err.message, 'error');
  }
}

// 3) Remove a loja no back e atualiza a tabela
async function deletarLoja(id) {
  console.log("Chamando DELETE para ID", id);
  const res = await fetch(`/api/estabelecimentos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Não consegui deletar');
  const j = await res.json().catch(() => ({}));
  console.log("Resposta DELETE:", j);
}

// 4) Popup de confirmação e chamada ao delete
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
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Deletar"
    });
    if (result.isConfirmed) {
        await deletarLoja(id)
        await Swal.fire({
            title: "Deletado!",
            text: "Seu estabelecimento foi deletado.",
            icon: "success"
        });
        listarLojas();
    }
}






