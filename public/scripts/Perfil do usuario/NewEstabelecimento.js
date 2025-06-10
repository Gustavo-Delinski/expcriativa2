let fotos = []
let fotoMostrada;

function verificarNome(nome) {
    const regex = /^[A-Za-zÀ-ÿ-'.,]+(?:\s+[A-Za-zÀ-ÿ-'.,]+)*$/;
    if (nome.length <= 3) {
        Swal.fire({
            title:'Nome Inválido',
            text:'tamanho do nome inválido, digite um nome maior que 3 caracteres',
            icon:'error'
        })
        document.getElementById("nomeEstabele").style.border = "1px solid rgb(202, 50, 121)";
        return false
    }
    if (!regex.test(nome)) {
        Swal.fire({
            title:'Nome inválido',
            text: 'Insira apenas caracteres permitidos: letras Maúsculas,minúsculas, espaço, acentos, pontuação, -, \'',
            icon:'error'
        })
        document.getElementById("nomeEstabele").style.border = "1px solid rgb(202, 50, 121)";
        return false
    }
    return true;
}
function mascaraTelefone(input) {
    let numero = input.value.replace(/\D/g, '');
    // Limita a 14 dígitos
    numero = numero.substring(0, 11);
    // Aplica a máscara progressivamente
    if (numero.length === 11) {
        numero = numero.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1)$2-$3");
    }else if (numero.length >= 7) {
        numero = numero.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1)$2-$3");
    } else if (numero.length >= 3) {
        numero = numero.replace(/^(\d{2})(\d{0,5})/, "($1)$2");
    }
    input.value = numero;
}
function mascaraCNPJ(input) {
    let cnpj = input.value.replace(/\D/g, '');

    // Limita a 14 dígitos
    cnpj = cnpj.substring(0, 14);

    // Aplica a máscara progressivamente
    if (cnpj.length >= 13) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
    } else if (cnpj.length >= 9) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
    } else if (cnpj.length >= 5) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else if (cnpj.length >= 3) {
        cnpj = cnpj.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
    }

    input.value = cnpj;

}
function mascaraCEP(input) {
    let cep = input.value.replace(/\D/g, '');
    cep = cep.substring(0, 8);
    cep = cep.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = cep;
}
async function buscarCEP(CEP) {
    if (CEP.length < 8) {
        Swal.fire({
            title:'CEP Inválido',
            text:'CEP não encontrado',
            icon:'error'
        })
        document.getElementById("cep").style.border = "1px solid rgb(202, 50, 121)";
        return
    }
    const cep = CEP.replace(/\D/g, '');

    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();
    if (dados.erro) {
        Swal.fire({
            title:'CEP Inválido',
            text:'CEP não encontrado',
            icon:'error'
        })
        document.getElementById("cep").style.border = "1px solid rgb(202, 50, 121)";
        return;
    }
    console.log(await dados)
    document.getElementById('estado').value = dados.uf;
    document.getElementById('cidade').value = dados.localidade;
    document.getElementById('bairro').value = dados.bairro;
    document.getElementById('endereco').value = dados.logradouro;
}
function VerificarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false; // Rejeita todos iguais

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
}
function msgCNPJ(cnpj) {
    if (!VerificarCNPJ(cnpj)) {
        Swal.fire({
            title:'CNPJ Inválido',
            text:'CNPJ não encontrado',
            icon:'error'
        })
        document.getElementById("cnpj").style.border = "1px solid rgb(202, 50, 121)";
        return false
    }
    return true
}

function mostrarFotoEstabelecimento(index) {
    const foto = document.getElementById('Estabelecimentoimg');
    if (fotos[index]) {
        fotoMostrada = index
        foto.style.backgroundImage = `url(${URL.createObjectURL(fotos[index])})`;
    }
}
function ProximaFoto() {
    const spans =  document.querySelectorAll('[data-value]');
    mostrarFotoEstabelecimento(fotoMostrada+1);
    spans.forEach(span => {
        if (span.dataset.value !== `${fotoMostrada}`) {
            span.style.backgroundColor = 'transparent';
        } else {
            span.style.backgroundColor = '#3E996F';
        }
    })

}
function AnteriorFoto() {
    const spans =  document.querySelectorAll('[data-value]');
    mostrarFotoEstabelecimento(fotoMostrada-1);
    spans.forEach(span => {
        if (span.dataset.value !== `${fotoMostrada}`) {
            span.style.backgroundColor = 'transparent';
        } else {
            span.style.backgroundColor = '#3E996F';
        }
    })
}
function DeletarFoto() {
    const foto = document.getElementById('Estabelecimentoimg');
    const spans = document.getElementById('spans');

    if (isNaN(fotoMostrada) || fotoMostrada < 0 || fotoMostrada > fotos.length) {
        console.error("Índice inválido",fotoMostrada,fotos.length,isNaN(fotoMostrada));
        return;
    }

    fotos.splice(fotoMostrada, 1);

    if (fotos.length > 0) {
        spans.innerHTML = '';
        for (let i = 0; i < fotos.length; i++) {
            const span = document.createElement("span");
            span.dataset.value = `${i}`;
            spans.appendChild(span)
        }
        const novoIndex = Math.max(0, Math.min(fotoMostrada, fotos.length - 1));
        mostrarFotoEstabelecimento(novoIndex);
        const spansColor =  document.querySelectorAll('[data-value]');
        spansColor.forEach(span => {
            if (span.dataset.value !== `${fotoMostrada}`) {
                span.style.backgroundColor = 'transparent';
            } else {
                span.style.backgroundColor = '#3E996F';
            }
        })
    } else {
        foto.style.backgroundImage = `url('https://placehold.co/300x400?text=Adicione+sua+foto')`;
        spans.innerHTML = '<p> Nenhuma imagem Adicionada </p>';
    }

    console.log(fotos.length);
}
function adicionarFoto() {
    const input = document.getElementById('fileEstabele');
    const novasFotos = Array.from(input.files);
    const spans = document.getElementById('spans');
    if (fotos.length + novasFotos.length > 5) {
        Swal.fire({
            title: 'Limite máximo atingido',
            text:'Máximo de 5 fotos',
            icon: 'warning'
        })
        return;
    }
    const indicePrimeiraNova = fotos.length; // antes de adicionar

    fotos.push(...novasFotos);

    spans.innerHTML = '';
    for (let i = 0; i < fotos.length; i++) {
        const span = document.createElement("span");
        span.dataset.value = `${i}`;
        spans.appendChild(span)
    }

    mostrarFotoEstabelecimento(indicePrimeiraNova);// mostra a primeira das novas

    const spansColor =  document.querySelectorAll('[data-value]');
    spansColor.forEach(span => {
        if (span.dataset.value !== `${fotoMostrada}`) {
            span.style.backgroundColor = 'transparent';
        } else {
            span.style.backgroundColor = '#3E996F';
        }
    })
    console.log(fotos);
}

async function adicionarLocalTop() {
    const nome = document.getElementById('nomeEstabele').value;
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

    console.log(nome, email, telefone.replace(/\D/g,""), cnpj.replace(/\D/g,""), cep.replace(/\D/g,""), estado, cidade, bairro, endereco, numero, complemento);
    if (!verificarNome(nome)) return console.log('nome inválido') ;
    if (!validarEmail(email)) return console.log('email inválido') ;
    if (!msgCNPJ(cnpj)) return console.log('cnpj inválido') ;

    // const resposta = await fetch('/auth/estado');
    // const dados = await resposta.json();
    const response = await fetch('/api/CriarEstabelecimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Nome: nome,
            Email: email,
            Telefone: telefone.replace(/\D/g,""),
            CNPJ: cnpj.replace(/\D/g,""),
            CEP: cep.replace(/\D/g,""),
            Estado: estado,
            Cidade: cidade,
            Bairro: bairro,
            Endereco: endereco,
            Numero: numero,
            Complemento: complemento,
            usuarioId: 1
        })
    })
    if (response.ok) {
        await Swal.fire({
            title: 'Estabelecimento criado com sucesso',
            icon: 'success'
        })
        if (fotos.length === 0) {
            return
        }
        for (const foto of fotos) {
            const formData = new FormData();
            formData.append('file', foto);
            formData.append('CNPJ', cnpj.replace(/\D/g,""))
            const resposta = await fetch('/api/CriarFotoEstabelecimento', {
                method: 'POST',
                body: formData
            })
            if (resposta.ok) {
                fotos = [];
                mostrarFotoEstabelecimento(0);

            } else {
                const erro = resposta.json()
                Swal.fire({
                    title: 'Erro ao adicionar fotos',
                    text: `${erro.mensagem}`,
                    icon: 'error'
                });
            }
        }
        await Swal.fire({
            title: 'Fotos adicionadas com sucesso',
            icon: 'success'
        })
    } else {
        Swal.fire({
            title: 'Erro ao criar estabelecimento',
            text: `Verifique os dados e tente novamente${response.status}`,
            icon: 'error'
        });
    }
}

async function pegarServicos() {
    const SelectServicos = document.getElementById('tipoServico')
    const response = await fetch('/api/servicos');
        console.log(response);
    if (response.ok) {
        const servicos = await response.json();
        SelectServicos.innerHTML = ' ';
        const SelectDefault = document.createElement('option');
        SelectDefault.value = 'Selecionar';
        SelectDefault.textContent = 'Selecione uma opção';
        SelectServicos.appendChild(SelectDefault);
        console.log(servicos);
        servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.id;
            option.textContent = servico.Nome;
            SelectServicos.appendChild(option);
        })
        const Outro = document.createElement('option');
        Outro.value = 'Outro';
        Outro.textContent = 'Outro';
        SelectServicos.appendChild(Outro);
    }
}

if (document.getElementById('cep')) document.getElementById('cep').addEventListener('input', function () {
    document.getElementById('cep').style.border = '1px solid rgba(62, 62, 62, 1)';
})

if (document.getElementById('cnpj')) document.getElementById('cnpj').addEventListener('input', function () {
    document.getElementById('cnpj').style.border = '1px solid rgba(62, 62, 62, 1)';
})