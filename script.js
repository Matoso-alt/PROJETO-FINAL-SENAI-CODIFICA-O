const Maria = {
    nome: "Maria Eduarda Silva",
    matricula: "109001"
};

const colaboradores = [Maria];

const campo = document.getElementById("matricula");
const nomeMatricula = document.getElementById("nomeMatricula");
const resultado = document.getElementById("resultado");

function mensagemInicial() {
    return "Digite a matricula...";
}

resultado.textContent = mensagemInicial();

function consultar() {
    const matricula = campo.value.trim();
    nomeSaida.textContent = "";
    if (matricula === "") {
      resultado.textContent = "Informe a matrícula.";
      campo.focus();
      return;
    }
    const pessoa = buscarColaborador(matricula);
    if (pessoa === null) {
      resultado.textContent = "Não encontrado.";
    } else {
      nomeSaida.textContent = pessoa.nome;
      resultado.textContent =
        "Matrícula: " + pessoa.matricula;
    }
  }

  //funções em desenvolvimento: 
  // botão de consulta, 
  // exibir informações do colaborador na consulta após retirada permitida, 
  // aviso de tentitava de retirada dupla, 
  // sera usado apenas um colaborador para os testes! 
  // botão de confirmação de retirada
  // 
