/**
 * Orquestrador: busca os novos ingressos no ERP e provisiona cada aluno
 * nas plataformas do seu segmento. Um erro em um aluno não interrompe o lote.
 */
function processarNovosIngressos() {
  const clientes = obterClientes_();
  const alunos = clientes.erp.listarNovosIngressos();
  const loginsExistentes = clientes.workspace.listarLogins();
  const resumo = { processados: 0, comErro: 0 };

  registrarLog_('Início do lote: ' + alunos.length + ' aluno(s)');

  alunos.forEach(aluno => {
    const errosValidacao = validarResponsavel_(aluno.responsavel);
    if (errosValidacao.length) {
      errosValidacao.forEach(e => registrarErro_(aluno, 'VALIDACAO', e));
      resumo.comErro++;
      return;
    }

    const resultado = {};
    let teveErro = false;
    plataformasPorSegmento_(aluno.segmento).forEach(plataforma => {
      try {
        resultado[plataforma] = provisionar_(plataforma, aluno, clientes, loginsExistentes);
      } catch (erro) {
        teveErro = true;
        resultado[plataforma] = 'ERRO';
        registrarErro_(aluno, plataforma, erro.message);
      }
    });

    registrarProcessado_(aluno, resultado);
    teveErro ? resumo.comErro++ : resumo.processados++;
  });

  registrarLog_('Fim do lote: ' + resumo.processados + ' ok, ' + resumo.comErro + ' com erro');
  return resumo;
}

function provisionar_(plataforma, aluno, clientes, loginsExistentes) {
  switch (plataforma) {
    case 'CLASSAPP':
      return clientes.classApp.cadastrarAluno(aluno).id;
    case 'VESTIBULARE':
      return clientes.vestibulare.cadastrarAluno(aluno).id;
    case 'WORKSPACE': {
      const login = gerarLogin_(aluno.nome, loginsExistentes);
      loginsExistentes.push(login);
      return clientes.workspace.criarConta(login, aluno).email;
    }
    default:
      throw new Error('Plataforma não suportada: ' + plataforma);
  }
}

/** Cria o gatilho diário de madrugada (executar uma vez). */
function instalarGatilhoDiario() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'processarNovosIngressos')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('processarNovosIngressos').timeBased().everyDays(1).atHour(2).create();
}
