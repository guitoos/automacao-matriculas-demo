/**
 * Persistência do resultado na planilha de controle (painel da equipe).
 */
function obterAba_(nome, cabecalho) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(nome);
  if (!aba) {
    aba = planilha.insertSheet(nome);
    aba.appendRow(cabecalho);
    aba.setFrozenRows(1);
  }
  return aba;
}

function registrarProcessado_(aluno, resultado) {
  obterAba_(CONFIG.ABAS.PROCESSADOS, ['Data', 'RA', 'Aluno', 'Turma', 'ClassApp', 'Vestibulare', 'Workspace'])
    .appendRow([new Date(), aluno.ra, aluno.nome, aluno.turma,
      resultado.CLASSAPP || '-', resultado.VESTIBULARE || '-', resultado.WORKSPACE || '-']);
}

function registrarErro_(aluno, etapa, mensagem) {
  obterAba_(CONFIG.ABAS.ERROS, ['Data', 'RA', 'Aluno', 'Etapa', 'Erro', 'Status'])
    .appendRow([new Date(), aluno.ra, aluno.nome, etapa, mensagem, 'PENDENTE']);
}

function registrarLog_(mensagem) {
  obterAba_(CONFIG.ABAS.LOGS, ['Data', 'Mensagem']).appendRow([new Date(), mensagem]);
}
