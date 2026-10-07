/** Testes das funções puras. Execute testarTudo() no editor do Apps Script. */
function testarTudo() {
  const casos = [
    () => igual_(gerarLogin_('Ana Beatriz Souza', []), 'ana.souza'),
    () => igual_(gerarLogin_('Ana Souza', ['ana.souza']), 'ana.souza1'),
    () => igual_(gerarLogin_('João Conceição', []), 'joao.conceicao'),
    () => lanca_(() => gerarLogin_('Ana', [])),
    () => igual_(plataformasPorSegmento_('MEDIO').join(','), 'CLASSAPP,VESTIBULARE,WORKSPACE'),
    () => igual_(validarResponsavel_({ email: 'a@b.com', telefone: '(11) 98888-0000' }).length, 0),
    () => igual_(validarResponsavel_({ email: 'a@b', telefone: '123' }).length, 2)
  ];
  casos.forEach((caso, i) => caso() || Logger.log('Falhou o caso ' + (i + 1)));
  Logger.log('Testes executados: ' + casos.length);
}

function igual_(obtido, esperado) {
  if (obtido !== esperado) Logger.log('Esperado ' + esperado + ', obtido ' + obtido);
  return obtido === esperado;
}

function lanca_(fn) {
  try { fn(); return false; } catch (e) { return true; }
}
