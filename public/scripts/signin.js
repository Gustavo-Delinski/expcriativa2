function mascaraCPF(event) {
  let tecla = event.key;
  // Remove todos os caracteres não numéricos
  let cpf = event.target.value.replace(/\D+/g, "");

  // Se a tecla pressionada for um número, adiciona ao CPF
  if (/^[0-9]$/i.test(tecla)) {
    cpf += tecla;
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

function validaCPF(cpf) {
  var Soma = 0;
  var Resto;

  var strCPF = String(cpf).replace(/[^\d]/g, ''); // substitui tudo o que NÃO for número por vazio, para testar CPF apenas com números
  
  if (strCPF.length !== 11)
      return false;
  
  if ([
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    ].indexOf(strCPF) !== -1)
    return false;

  for (i=1; i<=9; i++)  //Calcula o primeiro dígito verificador, índice = 9
    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);

  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) 
    Resto = 0;

  if (Resto != parseInt(strCPF.substring(9, 10)) ) //Compara Resto com o índice verificador índice = 9
    return false;

  Soma = 0;

  for (i = 1; i <= 10; i++) //Calcula o segundo dígito verificador, índice = 10
    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);

  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) 
    Resto = 0;

  if (Resto != parseInt(strCPF.substring(10, 11) ) ) //Compara Resto com o índice verificador índice = 10
      return false;
  else
      return true;
}

function msgValidaCPF (cpf) {
  var cpf;

  cpf = document.getElementById('cpf').value; 

  if (!validaCPF(cpf)){
    Swal.fire(
      'CPF Inválido',
      '',
      'error'
    );
    return false;
  } 
  return true;
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

function validaSenhas (senha, senhaConfirmar) {
  let mascara = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/


  if (senha.length < 8) {
    Swal.fire(
      'Senha Fraca',
      'A senha deve ter pelo menos 8 caracteres.',
      'error'
    );
    return false;
  }
  if (!mascara.test(senha)) {
    Swal.fire(
      'Senha Fraca',
      'A senha deve ter pelo menos uma letra maiúscula, uma letra minúscula, um número e um símbolo especial.',
      'error'
    );
    return false;
  }
  if (senha != senhaConfirmar) {
    Swal.fire(
      'Senhas Diferentes',
      'O campo de senha e confirmação de senha devem ser iguais.',
      'error'
    );
    return false;
  }
  return true;
};

function validarEmail(email) {
  // ^[^\s@]+@[^\s@]+\.[^\s@]+$
  var regex = /^[A-Za-z0-9._!#$%&*+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!regex.test(email)){
    Swal.fire(
      'Email Inválido',
      'Por favor, insira um email v&aacute;lido.',
      'error'
    )
    return false;
  };
  return true;
}

function ValidarCampos() {
  var nome = document.getElementById('nome').value;
  var email = document.getElementById('email').value;
  var cpf = document.getElementById('cpf').value;
  var senha = document.getElementById('senha').value;
  var senhaConfirmar = document.getElementById('senhaConfirmar').value;

  if (nome === '' || email === '' || cpf === '' || senha === '' || senhaConfirmar === '') {
    Swal.fire(
      'Campos Vazios',
      'Por favor, preencha todos os campos.',
      'error'
    );
    return;
  }

  if(!validarEmail(email)){return;};
  if(!msgValidaCPF()){return;};
  if(!validaSenhas(senha, senhaConfirmar)){return;};
}
