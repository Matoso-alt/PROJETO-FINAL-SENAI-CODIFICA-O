
// Lista de colaboradores cadastrados no protótipo.
const alunos = [
  {
      nome: "Maria Eduarda Silva",
      matricula: "109001"
  }
];

// Campo onde o usuário digita a matrícula.
const campo = document.getElementById("matricula");

// Elementos que exibem o resultado da consulta.
const nomeSaida = document.getElementById("nomeResultado");
const resultado = document.getElementById("resultado");

// Botão para confirmar a retirada.
const botaoConfirmar = document.getElementById("confirmar");

// Colaborador atualmente selecionado.
let colaboradorAtual = null;

/* =========================================
 3. DATA ATUAL
 ========================================= */

// Retorna a data local no formato AAAA-MM-DD.
// Usamos a data local para evitar diferenças de fuso horário.
function obterDataAtual() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}


/* =========================================
 4. BUSCAR COLABORADOR
 ========================================= */

function buscarColaborador(matricula) {
  for (let i = 0; i < alunos.length; i++) {
      const pessoa = alunos[i];

      // Compara a matrícula digitada com a matrícula cadastrada.
      if (pessoa.matricula === matricula) {
          return pessoa;
      }
  }

  // Retorna null quando não encontra ninguém.
  return null;
}


/* =========================================
 5. CONSULTAR MATRÍCULA
 ========================================= */

function consultar() {
  const matricula = campo.value.trim();

  // Limpa os resultados anteriores.
  nomeSaida.textContent = "";
  colaboradorAtual = null;

  // Exige uma matrícula preenchida.
  if (matricula === "") {
      resultado.textContent = "Informe a matrícula.";
      botaoConfirmar.disabled = true;
      campo.focus();
      return;
  }

  // Procura o colaborador na lista.
  const pessoa = buscarColaborador(matricula);

  // Verifica se a matrícula existe.
  if (pessoa === null) {
      resultado.textContent = "Colaborador não encontrado.";
      botaoConfirmar.disabled = true;
      return;
  }

  // Guarda o colaborador encontrado.
  colaboradorAtual = pessoa;

  // Exibe o nome.
  nomeSaida.textContent = "Nome: " + pessoa.nome;

  // Verifica se já houve retirada hoje.
  if (jaRetirouHoje(pessoa.matricula)) {
      resultado.textContent =
          "Retirada já realizada hoje. Nova retirada bloqueada.";

      botaoConfirmar.disabled = true;
      return;
  }

  // Se chegou aqui, o colaborador pode retirar o lanche.
  resultado.textContent =
      "Matrícula: " + pessoa.matricula +
      " — Elegível para retirada.";

  botaoConfirmar.disabled = false;
}


/* =========================================
 6. LER O HISTÓRICO DE RETIRADAS
 ========================================= */

function obterRetiradas() {
  // Recupera os registros salvos neste navegador.
  const dados = localStorage.getItem("retiradasLanche");

  // Se ainda não existem registros, retorna uma lista vazia.
  return dados ? JSON.parse(dados) : [];
}


/* =========================================
 7. VERIFICAR RETIRADA DUPLICADA
 ========================================= */

function jaRetirouHoje(matricula) {
  const retiradas = obterRetiradas();
  const hoje = obterDataAtual();

  // Procura uma retirada da mesma matrícula na data atual.
  return retiradas.some(function (retirada) {
      return retirada.matricula === matricula &&
             retirada.data === hoje;
  });
}


/* =========================================
 8. CONFIRMAR ENTREGA
 ========================================= */

function confirmarRetirada() {
  // Não permite confirmar sem uma consulta válida.
  if (colaboradorAtual === null) {
      resultado.textContent =
          "Consulte um colaborador antes de confirmar.";

      botaoConfirmar.disabled = true;
      return;
  }

  const matricula = colaboradorAtual.matricula;

  // Confere novamente para impedir duplicidade.
  if (jaRetirouHoje(matricula)) {
      resultado.textContent =
          "Retirada já realizada hoje. Operação bloqueada.";

      botaoConfirmar.disabled = true;
      return;
  }

  const agora = new Date();

  // Cria o registro da retirada.
  const retirada = {
      nome: colaboradorAtual.nome,
      matricula: matricula,
      data: obterDataAtual(),
      horario: agora.toLocaleTimeString("pt-BR")
  };

  // Guarda o registro no histórico.
  const retiradas = obterRetiradas();
  retiradas.push(retirada);

  localStorage.setItem(
      "retiradasLanche",
      JSON.stringify(retiradas)
  );

  // Exibe a confirmação ao usuário.
  resultado.textContent =
      "Entrega confirmada para " + retirada.nome +
      " às " + retirada.horario + ".";

  // Impede uma nova confirmação nesta tela.
  botaoConfirmar.disabled = true;
}


/* =========================================
 9. REINICIAR A CONSULTA AO EDITAR A MATRÍCULA
 ========================================= */

// Quando a matrícula mudar, exige uma nova consulta.
campo.addEventListener("input", function () {
  colaboradorAtual = null;
  nomeSaida.textContent = "";
  resultado.textContent = "Consulte a matrícula digitada.";
  botaoConfirmar.disabled = true;
});
