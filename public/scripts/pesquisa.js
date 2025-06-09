const btnLimpar = document.querySelector('#btnLimparFiltros');
const btnAplicar = document.querySelector('#btnAplicarFiltros');
const inputSearch = document.querySelector('#inputSearch');
const selectOrdem = document.querySelector('#ordem-choice');
const chkCategorias = document.querySelectorAll('input[name="categoria"]');
const chkAvaliacoes = document.querySelectorAll('input[name="avaliacao"]');
const rangePreco = { min: 0, max: 10000 }; // pegue do seu <input type="range"> ou de dois inputs
const inputCidade = document.querySelector('#cidades-choice');

// 2. Função para ler os checks
function getChecked(nodeList) {
    return Array.from(nodeList)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

async function listarEstabelecimentosComFiltros() {
    const filtros = {
        search: inputSearch.value,
        categorias: getChecked(chkCategorias).join(','),
        avaliacoes: getChecked(chkAvaliacoes).join(','),
        precoMin: rangePreco.min,
        precoMax: rangePreco.max,
        cidade: inputCidade.value,
        ordem: selectOrdem.value
    };
    const qs = new URLSearchParams(filtros).toString();
    const resp = await fetch(`/api/estabelecimentos-completos?${qs}`);
    const dados = await resp.json();
    renderEstabelecimentos(dados);
}
//listarEstabelecimentosComFiltros
btnAplicar.addEventListener('click', async () => {
    const Search = document.getElementById('inputSearch').value;
    let chkAvaliacoes = document.querySelectorAll('input[name="avaliacao"]');
    let nota = getChecked(chkAvaliacoes).join(',');
    const response = await fetch('/api/estabelecimento/filtro', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome:Search,
            nota: nota
        })

    })
    if(response.ok) {
        const dados =await response.json();
        console.log(dados)

        const grade = document.getElementById('grade-produtos');
        grade.innerHTML = '';
        dados.forEach(estab => {

            const nome = estab.Nome || '—';
            const media = estab.Ofertas[0].Avaliacao[0].Nota || 'Sem avaliações';
            const foto = estab.fotoSrc || 'imagens/placeholder.png';

            // Pega a primeira oferta, se existir
            const oferta = (estab.Ofertas && estab.Ofertas[0]) || {};
            const servico = oferta.servicoNome || '—';
            const desc = oferta.Descricao || 'Sem descrição';
            const valor = oferta.Valor != null
                ? `R$ ${oferta.Valor.toFixed(2)}`
                : 'Preço indisponível';

            const card = document.createElement('div');
            card.className = 'produto';

            card.innerHTML = `
        <div class="imagem-container">
          <img src="${foto}" alt="Foto de ${nome}" />
          <button class="favorito">❤️</button>
        </div>
        <h4><a href="estabelecimento" style="color: black; text-decoration: none"> ${nome} <span class="avaliacao">★ ${media} </a> </span></h4>
        <h5>${servico}</h5>
        <p>${desc}</p>
        <h4>Preço: ${valor}</h4>
      `;
            grade.appendChild(card);
        })
    }
});
btnLimpar.addEventListener('click', () => {
    // limpa UI e recarrega sem filtros
    inputSearch.value = '';
    chkCategorias.forEach(c => c.checked = false);
    chkAvaliacoes.forEach(c => c.checked = false);
    selectOrdem.value = 'Ordem';
    inputCidade.value = '';
    // (resete rangePreco.min/max conforme seu input)
    listarEstabelecimentosComFiltros();
});



async function listarEstabelecimentos() {
    try {
        const resp = await fetch('/api/estabelecimentos-completos');
        if (!resp.ok) {
            console.log(`Status ${resp.status}`);
            return
        }
        const estabelecimentos = await resp.json();
        // console.log('JSON da API →', estabelecimentos);

        if (!Array.isArray(estabelecimentos)) {
            console.error('Esperava um array, recebi:', estabelecimentos);
            return;
        }

        const grade = document.getElementById('grade-produtos');
        grade.innerHTML = '';

        for (const estab of estabelecimentos) {
            console.log(estab.ID_estabelecimento)
            const responseImg = await fetch(`/api/estabelecimento/imagem/${estab.ID_estabelecimento}`)
            console.log(responseImg)
            if (responseImg.ok) {
                const dados = await responseImg.json();
                console.log(dados)
            }
            const nome = estab.Nome || '—';
            const media = estab.Ofertas[0].Avaliacao[0].Nota || 'Sem avaliações';
            const foto = estab.fotoSrc || 'https://placehold.co/200x200';

            // Pega a primeira oferta, se existir
            const oferta = (estab.Ofertas && estab.Ofertas[0]) || {};
            const servico = oferta.servicoNome || '—';
            const desc = oferta.Descricao || 'Sem descrição';
            const valor = oferta.Valor != null
                ? `R$ ${oferta.Valor.toFixed(2)}`
                : 'Preço indisponível';

            const card = document.createElement('div');
            card.className = 'produto';

            card.innerHTML = `
        <div class="imagem-container">
          <img src="${foto}" alt="Foto de ${nome}" />
          <button class="favorito">❤️</button>
        </div>
        <h4><a href="estabelecimento" style="color: black; text-decoration: none"> ${nome} <span class="avaliacao">★ ${media} </a> </span></h4>
        <h5>${servico}</h5>
        <p>${desc}</p>
        <h4>Preço: ${valor}</h4>
      `;
            grade.appendChild(card);
        }
    } catch (err) {
        console.error('Erro ao chamar /api/estabelecimentos-completos:', err);
    }
}

// async function listarEstabelecimentos() {
//     try {
//         const resp = await fetch('/api/estabelecimentos-completos');
//         if (!resp.ok) {
//             throw new Error(`Status ${resp.status}`);
//         }
//
//         const estabelecimentos = await resp.json();
//
//         if (!Array.isArray(estabelecimentos)) {
//             console.error('Esperava um array, recebi:', estabelecimentos);
//             return;
//         }
//
//         const grade = document.getElementById('grade-produtos');
//         grade.innerHTML = '';
//
//         estabelecimentos.forEach(estab => {
//             const nome = estab.Nome || '—';
//             const foto = estab.fotoSrc || 'imagens/placeholder.png';
//
//             // Verificações seguras
//             const ofertas = estab.Ofertas || [];
//             const primeiraOferta = ofertas[0] || {};
//             const avaliacoes = primeiraOferta.Avaliacaos || [];
//             const media = avaliacoes[0]?.Nota || 'Sem avaliações';
//
//             const servico = primeiraOferta.servicoNome || '—';
//             const desc = primeiraOferta.Descricao || 'Sem descrição';
//             const valor = primeiraOferta.Valor != null
//                 ? `R$ ${primeiraOferta.Valor.toFixed(2)}`
//                 : 'Preço indisponível';
//
//             const card = document.createElement('div');
//             card.className = 'produto';
//
//             card.innerHTML = `
//         <div class="imagem-container">
//             <img src="${foto}" alt="Foto de ${nome}" />
//             <button class="favorito">❤️</button>
//         </div>
//         <h4><a href="/estabelecimento" style="color: black; text-decoration: none">
//             ${nome} <span class="avaliacao">★ ${media}</span></a></h4>
//         <h5>${servico}</h5>
//         <p>${desc}</p>
//         <h4>Preço: ${valor}</h4>
//     `;
//
//             grade.appendChild(card);
//         });
//     } catch (err) {
//         console.error('Erro ao chamar /api/estabelecimentos-completos:', err);
//     }
// }

document.addEventListener('DOMContentLoaded', listarEstabelecimentos);

function dropdown() {
    const dropdown = document.querySelector(`.dropdown-content`);
    dropdown.style.display === "flex" ? dropdown.style.display = "none" : dropdown.style.display = "flex";
};

function limparFiltros() {
    window.location.href = '/pesquisa'; // ou atualizar sem filtros via JS
}

function renderEstabelecimentos(estabelecimentos) {
    const container = document.getElementById('lista-estabelecimentos');
    if (!container) {
        console.warn('Elemento para listar não encontrado');
        return;
    }

    // Limpa resultados antigos
    container.innerHTML = '';

    if (estabelecimentos.length === 0) {
        container.innerHTML = '<p>Nenhum estabelecimento encontrado.</p>';
        return;
    }

    // Para cada loja, cria um card básico
    estabelecimentos.forEach(loja => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.innerHTML = `
        <h5>${loja.nome}</h5>
        <p>Cidade: ${loja.cidade}</p>
        <p>Categoria: ${loja.categoriaNome}</p>
        <p>Preço médio: R$ ${loja.precoMedio.toFixed(2)}</p>
        <p>Avaliação: ${loja.avaliacao} ★</p>
      `;
        container.appendChild(card);
    });
}