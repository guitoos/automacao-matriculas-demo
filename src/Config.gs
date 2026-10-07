/**
 * Configuração central da automação.
 * Em produção, credenciais e URLs ficam em PropertiesService (nunca no código).
 */
const CONFIG = {
  MODO_DEMO: true,                       // true = usa APIs simuladas (MockApis.gs)
  DOMINIO_EMAIL: 'aluno.escola-exemplo.edu.br',
  ABAS: {
    PROCESSADOS: 'ALUNOS_PROCESSADOS',
    LOGS: 'LOGS',
    ERROS: 'ERROS'
  },
  MAX_TENTATIVAS: 3
};

/** Lê uma credencial das Script Properties. */
function obterSegredo_(chave) {
  const valor = PropertiesService.getScriptProperties().getProperty(chave);
  if (!valor && !CONFIG.MODO_DEMO) {
    throw new Error('Propriedade de script ausente: ' + chave);
  }
  return valor;
}
