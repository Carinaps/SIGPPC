
/* ===========================================
   storage.js - SIGPPC (VERSÃO LIMPA)
=========================================== */

const STORAGE_KEY = "sigppc";

/**
 * Carrega estado do LocalStorage
 */
function loadState() {
    const dados = localStorage.getItem(STORAGE_KEY);

    if (dados) {
        return JSON.parse(dados);
    }

    return {
        ppcs: [],
        modelos: [],
        bases: [],
        configuracoes: {}
    };
}

/**
 * Salva estado no LocalStorage
 */
function saveState(state) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}

/**
 * Limpa dados
 */
function clearState() {
    localStorage.removeItem(STORAGE_KEY);
}
