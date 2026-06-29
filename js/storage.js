/* ===========================================
   storage.js
   Gerenciamento do Local Storage do SIGPPC
=========================================== */

const STORAGE_KEY = "sigppc";

/**
 * Estado global da aplicação
 */
let state = {
    ppcs: [],
    modelos: [],
    bases: [],
    configuracoes: {}
};

/**
 * Carrega os dados do navegador
 */
function carregarDados() {

    const dados = localStorage.getItem(STORAGE_KEY);

    if (dados) {
        state = JSON.parse(dados);
    }

}

/**
 * Salva os dados no navegador
 */
function salvarDados() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}

/**
 * Retorna todo o estado
 */
function getState() {
    return state;
}

/**
 * Atualiza o estado e salva
 */
function setState(novoEstado) {

    state = novoEstado;

    salvarDados();

}

/**
 * Cria um novo PPC
 */
function adicionarPPC(ppc) {

    state.ppcs.push(ppc);

    salvarDados();

}

/**
 * Procura um PPC pelo ID
 */
function buscarPPC(id) {

    return state.ppcs.find(ppc => ppc.id === id);

}

/**
 * Atualiza um PPC
 */
function atualizarPPC(id, novosDados) {

    const indice = state.ppcs.findIndex(
        ppc => ppc.id === id
    );

    if (indice === -1) return;

    state.ppcs[indice] = {

        ...state.ppcs[indice],

        ...novosDados

    };

    salvarDados();

}

/**
 * Remove um PPC
 */
function excluirPPC(id) {

    state.ppcs = state.ppcs.filter(
        ppc => ppc.id !== id
    );

    salvarDados();

}

/**
 * Limpa todos os dados
 */
function limparBanco() {

    localStorage.removeItem(STORAGE_KEY);

    state = {

        ppcs: [],
        modelos: [],
        bases: [],
        configuracoes: {}

    };

}
