/**
 * Fábrica de clientes: devolve a implementação simulada ou a real,
 * conforme CONFIG.MODO_DEMO. O orquestrador não sabe qual está usando.
 */
function obterClientes_() {
  if (CONFIG.MODO_DEMO) {
    return { erp: ErpMock, classApp: ClassAppMock, vestibulare: VestibulareMock, workspace: WorkspaceMock };
  }
  return {
    erp: criarClienteHttp_('ERP_BASE_URL', 'ERP_TOKEN'),
    classApp: criarClienteHttp_('CLASSAPP_BASE_URL', 'CLASSAPP_TOKEN'),
    vestibulare: criarClienteHttp_('VESTIBULARE_BASE_URL', 'VESTIBULARE_TOKEN'),
    workspace: criarClienteWorkspace_()
  };
}

/** Exemplo de cliente HTTP genérico com retentativa e backoff exponencial. */
function criarClienteHttp_(chaveUrl, chaveToken) {
  const baseUrl = obterSegredo_(chaveUrl);
  const token = obterSegredo_(chaveToken);
  return {
    requisitar(metodo, caminho, corpo) {
      for (let tentativa = 1; tentativa <= CONFIG.MAX_TENTATIVAS; tentativa++) {
        const resposta = UrlFetchApp.fetch(baseUrl + caminho, {
          method: metodo,
          contentType: 'application/json',
          headers: { Authorization: 'Bearer ' + token },
          payload: corpo ? JSON.stringify(corpo) : undefined,
          muteHttpExceptions: true
        });
        const status = resposta.getResponseCode();
        if (status < 500) {
          if (status >= 400) throw new Error('HTTP ' + status + ' em ' + caminho);
          return JSON.parse(resposta.getContentText() || '{}');
        }
        Utilities.sleep(Math.pow(2, tentativa) * 500);
      }
      throw new Error('Serviço indisponível após ' + CONFIG.MAX_TENTATIVAS + ' tentativas: ' + caminho);
    }
  };
}

/** Exemplo de cliente do Google Workspace via Admin SDK (serviço avançado). */
function criarClienteWorkspace_() {
  return {
    listarLogins() {
      const usuarios = AdminDirectory.Users.list({ domain: CONFIG.DOMINIO_EMAIL, maxResults: 500 }).users || [];
      return usuarios.map(u => u.primaryEmail.split('@')[0]);
    },
    criarConta(login, aluno) {
      const usuario = AdminDirectory.Users.insert({
        primaryEmail: login + '@' + CONFIG.DOMINIO_EMAIL,
        name: { givenName: aluno.nome.split(' ')[0], familyName: aluno.nome.split(' ').slice(-1)[0] },
        password: Utilities.getUuid(),
        changePasswordAtNextLogin: true
      });
      return { email: usuario.primaryEmail };
    }
  };
}
