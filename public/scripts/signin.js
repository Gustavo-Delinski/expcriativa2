function mascaraCPF(event) {
      let tecla = event.key;
      // Remove todos os caracteres não numéricos
      let cpf = event.target.value.replace(/\D+/g, "");

      // Se a tecla pressionada for um número, adiciona ao CPF
      if (/^[0-9]$/i.test(tecla)) {
        cpf = cpf + tecla;
        let tamanho = cpf.length;

        // Se o CPF já tiver 11 caracteres, não faz mais nada
        if (tamanho > 11) {
          return false;
        }

        // Aplica as máscaras conforme o tamanho do CPF
        if (tamanho > 9) { 
          cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
        } else if (tamanho > 6) { 
          cpf = cpf.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
        } else if (tamanho > 3) { 
          cpf = cpf.replace(/^(\d{3})(\d{1,3})/, "$1.$2");
        } else {
          cpf = cpf.replace(/^(\d*)/, "$1");
        }

        // Atualiza o valor do campo de entrada
        event.target.value = cpf;
      }

      // Permite as teclas de backspace, delete e tab
      if (!["Backspace", "Delete", "Tab"].includes(tecla)) {
        return false;
      }
    }

    function mostrarSenha (event) {
        var campoSenha = document.getElementById('senha');
        var campoSenha2 = document.getElementById('senhaConfirmar');

            if (campoSenha.type == 'text') {
                campoSenha.type = 'password';
            } else {
                campoSenha.type = 'text';
            }

            if (campoSenha2.type == 'text') {
                campoSenha2.type = 'password';
            } else {
                campoSenha2.type = 'text';
            }
    }