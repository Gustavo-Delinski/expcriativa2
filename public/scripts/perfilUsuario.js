const mostrarFoto = () => {
    const input = document.getElementById('file');
    const img = document.getElementById('img');
    img.src = URL.createObjectURL(input.files[0]);
}

const Cancelar = () => {

}

let verdade = true
