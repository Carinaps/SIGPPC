const STORAGE_KEY = "sigppc";

function normalizarEstado(dados = {}) {

  return {
    ppcs: Array.isArray(dados.ppcs) ? dados.ppcs : [],
    modelos: Array.isArray(dados.modelos) ? dados.modelos : [],
    bases: Array.isArray(dados.bases) ? dados.bases : [],
    versoes: Array.isArray(dados.versoes) ? dados.versoes : [],
    configuracoes: dados.configuracoes || {}
  };

}

function loadState() {

  try {

    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    const dadosConvertidos = JSON.parse(dadosSalvos || "{}");

    return normalizarEstado(dadosConvertidos);

  } catch (erro) {

    console.error("Erro ao carregar os dados:", erro);

    return normalizarEstado();

  }

}

function saveState(state) {

  const estadoNormalizado = normalizarEstado(state);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(estadoNormalizado)
  );

}

function clearState() {

  localStorage.removeItem(STORAGE_KEY);

}
