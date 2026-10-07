/** Web app com o painel de monitoramento para a equipe. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Painel')
    .setTitle('Painel de Matrículas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Dados consumidos pelo painel (google.script.run). */
function obterDadosPainel() {
  const ler = nome => {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nome);
    if (!aba || aba.getLastRow() < 2) return [];
    return aba.getRange(2, 1, aba.getLastRow() - 1, aba.getLastColumn()).getDisplayValues();
  };
  return { processados: ler(CONFIG.ABAS.PROCESSADOS), erros: ler(CONFIG.ABAS.ERROS) };
}
