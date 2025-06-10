function debounce(func, timeout){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

async function pegarEstabelecimentos() {
    const response = await fetch('/api/estabelecimentos');
    const estabelecimentos = await response.json();
    const grid = document.getElementById('Estabelecimentos');
    grid.innerHTML = '';
    for (const estab of estabelecimentos) {
        let dados;
        let url;
        const responseImg = await fetch(`/api/estabelecimento/primeirafoto/${estab.ID_estabelecimento}`)
        console.log(responseImg.status)
        if (!response.ok) {
            Swal.fire({
                title:'Erro ao carregar imagem',
                text:'Não foi possível carregar a imagem do estabelecimento.',
                icon:'error'
            })
        }
        if (responseImg.status === 204) {
            dados = null
        } else {
            dados = await responseImg.blob()
            url = URL.createObjectURL(dados)
        }
        url = url ? url : "https://placehold.co/200x200?text=imagem"
        const responseOferta = await fetch(`/api/PrimeiraEstabelecimentoOfertas/${estab.ID_estabelecimento}`)
        const oferta = await responseOferta.json()
        const responseServico = await fetch(`/api/servicoOferta/${oferta.ID_oferta}`)
        const servico = await responseServico.json()
        const card = document.createElement('a');
        card.href = `/estabelecimento/?id=${estab.ID_estabelecimento}`;
        card.classList.add('card');
        card.innerHTML = `<div class="card-img">
                        <img src="${url}" alt="Card1">
                    </div>
                    <div class="nomeAva">
                        <h5>${estab.Nome}</h5>
                        <div class="Avaliacao">
                            <svg width="25px" height="25px" viewBox="0 -0.03 60.062 60.062" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <style>
                                    .cls-1 {
                                        fill: #E6BF65;
                                        fill-rule: evenodd;
                                    }
                                </style>
                            </defs>
                            <path class="cls-1" d="M670.68,227.733a3.03,3.03,0,0,0,.884,1.072,3.168,3.168,0,0,0,1.282.578l14.662,2.965a3.067,3.067,0,0,1,2.394,2.284,3,3,0,0,1-1.118,3.084l-11.408,8.654a3.01,3.01,0,0,0-.994,1.3,2.956,2.956,0,0,0-.16,1.618L679.3,266.42a3,3,0,0,1-1.275,3.01,3.166,3.166,0,0,1-3.328.146l-13.18-7.407a3.165,3.165,0,0,0-3.091,0l-13.181,7.407a3.156,3.156,0,0,1-3.327-.146,3,3,0,0,1-1.275-3.01l3.078-17.129a2.956,2.956,0,0,0-.16-1.618,3.01,3.01,0,0,0-.994-1.3l-11.408-8.654a3,3,0,0,1-1.118-3.084,3.068,3.068,0,0,1,2.393-2.284l14.66-2.965a3.141,3.141,0,0,0,1.281-.578,3.044,3.044,0,0,0,.885-1.072l7.918-16.013a3.133,3.133,0,0,1,5.587,0Z" id="rating" transform="translate(-629.938 -210)"/>
                        </svg>
                            <p>5.0</p>
                        </div>
                    </div>
                    <p class="categoria">${servico.Nome}</p>
                    <p class="descricao">${oferta.Descricao}</p>
                    <hr>
                    <div class="preco">
                        <h4 class="apxm">≈</h4>
                        <h4 class="valor">R$${oferta.Valor}</h4>
                    </div>`
        grid.appendChild(card);
    }
}

async function buscarEstabelecimentos() {
    const cidade = document.getElementById('cidades').value;
    const input = document.getElementById('SearchInput');
    const response = await fetch(`/api/estabelecimentos`);
    const estabelecimentos = await response.json();
    const grid = document.getElementById('Estabelecimentos');
    grid.innerHTML = '';
    for (const estab of estabelecimentos) {
        if (cidade !== '') {

        } else {
            if (estab.Nome.toLowerCase().includes(SearchInput.value.toLowerCase())) {
                let dados;
                let url;
                const responseImg = await fetch(`/api/estabelecimento/primeirafoto/${estab.ID_estabelecimento}`)
                if (!response.ok) {
                    Swal.fire({
                        title:'Erro ao carregar imagem',
                        text:'Não foi possível carregar a imagem do estabelecimento.',
                        icon:'error'
                    })
                }
                if (responseImg.status === 204) {
                    dados = null
                } else {
                    dados = await responseImg.blob()
                    url = URL.createObjectURL(dados)
                }
                url = url ? url : "https://placehold.co/200x200?text=imagem"
                const responseOferta = await fetch(`/api/PrimeiraEstabelecimentoOfertas/${estab.ID_estabelecimento}`)
                const oferta = await responseOferta.json()
                const responseServico = await fetch(`/api/servicoOferta/${oferta.ID_oferta}`)
                const servico = await responseServico.json()
                const card = document.createElement('a');
                card.href = `/estabelecimento/?id=${estab.ID_estabelecimento}`;
                card.classList.add('card');
                card.innerHTML = `<div class="card-img">
                            <img src="${url}" alt="Card1">
                        </div>
                        <div class="nomeAva">
                            <h5>${estab.Nome}</h5>
                            <div class="Avaliacao">
                                <svg width="25px" height="25px" viewBox="0 -0.03 60.062 60.062" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <style>
                                        .cls-1 {
                                            fill: #E6BF65;
                                            fill-rule: evenodd;
                                        }
                                    </style>
                                </defs>
                                <path class="cls-1" d="M670.68,227.733a3.03,3.03,0,0,0,.884,1.072,3.168,3.168,0,0,0,1.282.578l14.662,2.965a3.067,3.067,0,0,1,2.394,2.284,3,3,0,0,1-1.118,3.084l-11.408,8.654a3.01,3.01,0,0,0-.994,1.3,2.956,2.956,0,0,0-.16,1.618L679.3,266.42a3,3,0,0,1-1.275,3.01,3.166,3.166,0,0,1-3.328.146l-13.18-7.407a3.165,3.165,0,0,0-3.091,0l-13.181,7.407a3.156,3.156,0,0,1-3.327-.146,3,3,0,0,1-1.275-3.01l3.078-17.129a2.956,2.956,0,0,0-.16-1.618,3.01,3.01,0,0,0-.994-1.3l-11.408-8.654a3,3,0,0,1-1.118-3.084,3.068,3.068,0,0,1,2.393-2.284l14.66-2.965a3.141,3.141,0,0,0,1.281-.578,3.044,3.044,0,0,0,.885-1.072l7.918-16.013a3.133,3.133,0,0,1,5.587,0Z" id="rating" transform="translate(-629.938 -210)"/>
                            </svg>
                                <p>5.0</p>
                            </div>
                        </div>
                        <p class="categoria">${servico.Nome}</p>
                        <p class="descricao">${oferta.Descricao}</p>
                        <hr>
                        <div class="preco">
                            <h4 class="apxm">≈</h4>
                            <h4 class="valor">R$${oferta.Valor}</h4>
                        </div>`
                grid.appendChild(card);
            }
        }
    }
}

function clearFilter() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    const input = document.getElementById('SearchInput');
    input.value = '';
    const inputCidade = document.getElementById('cidades');
    inputCidade.value = '';
    pegarEstabelecimentos()
}

async function pegarServicos() {
    const response = await fetch('/api/servicos');
    const servicos = await response.json();
    const select = document.getElementById('servicos');
    select.innerHTML = '';
    servicos.forEach(servico => {
        const option = document.createElement('div');
        option.classList = 'checkbox';
        option.innerHTML = `<input type="checkbox" name="categoria" id="checkbox${servico.ID_servico}" value="${servico.ID_servico}"><label for="checkbox${servico.ID_servico}">${servico.Nome.toUpperCase()}</label>`;
        select.appendChild(option);
    });
}

const debouncedSearch = debounce(buscarEstabelecimentos, 500);

document.addEventListener('DOMContentLoaded', () => {pegarServicos().then(pegarEstabelecimentos())});