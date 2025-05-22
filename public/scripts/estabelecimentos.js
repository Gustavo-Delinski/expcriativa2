const idOferta = 1; // Defina dinamicamente se possível

// Função para carregar avaliações da oferta
async function carregarAvaliacoes() {
    const divAvaliacoes = document.getElementById('avaliacoes');

    try {
        const response = await fetch(`/api/avaliacoes/${idOferta}`);
        const avaliacoes = await response.json();

        // Limpa avaliações antigas
        divAvaliacoes.innerHTML = '';
        
        const titulo = document.createElement('h2');
        titulo.textContent = 'Avaliações:';
        divAvaliacoes.appendChild(titulo);

        if (avaliacoes.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Sem avaliações ainda.';
            divAvaliacoes.appendChild(p);
            return;
        }

        avaliacoes.forEach(av => {
            const div = document.createElement('div');

            const strong = document.createElement('strong');
            strong.textContent = `${av.Usuario.Nome}`;
            div.appendChild(strong);

            const textoNota = document.createTextNode(` - Nota: ${av.Nota}`);
            div.appendChild(textoNota);

            div.appendChild(document.createElement('br'));

            const p = document.createElement('p');
            p.textContent = av.Comentario;
            div.appendChild(p);

            const hr = document.createElement('hr');
            div.appendChild(hr);

            divAvaliacoes.appendChild(div);
        });

    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
    }
}

// Evento para enviar avaliação
async function SubmitComentario() {
    const nota = document.getElementById('nota').value;
    const comentario = document.getElementById('comentario').value;

    const idUsuario = 1; // Defina dinamicamente se tiver login
    const idOferta = 1;

    try {
        const response = await fetch('/api/avaliacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nota,
                comentario,
                id_oferta: idOferta,
                id_usuario: idUsuario
            })
        });

        if (response.ok) {
            alert('Avaliação enviada com sucesso!');
            carregarAvaliacoes();
        } else {
            alert('Erro ao enviar avaliação.');
        }
    } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
    }
}

// Carrega avaliações ao abrir a página
carregarAvaliacoes();
