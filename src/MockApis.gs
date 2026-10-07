/**
 * APIs simuladas para a demonstração. Todos os dados são fictícios.
 * Em produção, cada objeto é substituído por um cliente HTTP real
 * (UrlFetchApp + autenticação via token guardado em PropertiesService).
 */
const ErpMock = {
  listarNovosIngressos() {
    return [
      { ra: '2026001', nome: 'Ana Beatriz Souza', segmento: 'MEDIO', turma: '1A',
        responsavel: { nome: 'Carla Souza', email: 'carla.souza@exemplo.com', telefone: '(11) 98888-0001' } },
      { ra: '2026002', nome: 'Bruno Lima', segmento: 'FUNDAMENTAL_1', turma: '3B',
        responsavel: { nome: 'Diego Lima', email: 'diego.lima@exemplo', telefone: '(11) 98888-0002' } },
      { ra: '2026003', nome: 'Ana Souza', segmento: 'FUNDAMENTAL_2', turma: '7A',
        responsavel: { nome: 'Elisa Souza', email: 'elisa@exemplo.com', telefone: '11988880003' } }
    ];
  }
};

const ClassAppMock = {
  cadastrarAluno(aluno) { return { id: 'CA-' + aluno.ra }; }
};

const VestibulareMock = {
  cadastrarAluno(aluno) { return { id: 'VB-' + aluno.ra }; }
};

const WorkspaceMock = {
  _contas: ['ana.souza'],
  listarLogins() { return this._contas.slice(); },
  criarConta(login, aluno) {
    this._contas.push(login);
    return { email: login + '@' + CONFIG.DOMINIO_EMAIL };
  }
};
