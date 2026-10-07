/**
 * Funções utilitárias puras (sem dependência de serviços do Google),
 * fáceis de testar.
 */

/** Remove acentos e caracteres especiais, deixando minúsculas. */
function normalizarTexto_(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Gera o login no padrão primeiro_nome.ultimo_nome.
 * Em caso de duplicidade, acrescenta sufixo numérico (1 a 3).
 */
function gerarLogin_(nomeCompleto, loginsExistentes) {
  const partes = normalizarTexto_(nomeCompleto).split(/\s+/).filter(Boolean);
  if (partes.length < 2) {
    throw new Error('Nome incompleto para gerar login: "' + nomeCompleto + '"');
  }
  const base = partes[0] + '.' + partes[partes.length - 1];
  const existentes = new Set(loginsExistentes || []);
  if (!existentes.has(base)) return base;
  for (let i = 1; i <= 3; i++) {
    if (!existentes.has(base + i)) return base + i;
  }
  throw new Error('Não há login disponível para ' + nomeCompleto + ' (verificação manual)');
}

/** Define as plataformas de cada aluno de acordo com o segmento. */
function plataformasPorSegmento_(segmento) {
  const mapa = {
    INFANTIL: ['CLASSAPP', 'VESTIBULARE'],
    FUNDAMENTAL_1: ['CLASSAPP', 'VESTIBULARE'],
    FUNDAMENTAL_2: ['CLASSAPP', 'VESTIBULARE', 'WORKSPACE'],
    MEDIO: ['CLASSAPP', 'VESTIBULARE', 'WORKSPACE']
  };
  const plataformas = mapa[segmento];
  if (!plataformas) throw new Error('Segmento desconhecido: ' + segmento);
  return plataformas;
}

/** Valida e-mail e telefone do responsável antes de chamar as APIs. */
function validarResponsavel_(responsavel) {
  const erros = [];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(responsavel.email || '')) {
    erros.push('E-mail do responsável inválido');
  }
  const digitos = String(responsavel.telefone || '').replace(/\D/g, '');
  if (digitos.length < 10 || digitos.length > 11) {
    erros.push('Telefone do responsável inválido');
  }
  return erros;
}
