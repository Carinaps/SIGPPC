/* ==========================================
   utils.js
   Funções auxiliares do SIGPPC
========================================== */

/**
 * Seleciona um elemento
 */
function $(seletor) {
    return document.querySelector(seletor);
}

/**
 * Seleciona vários elementos
 */
function $$(seletor) {
    return document.querySelectorAll(seletor);
}

/**
 * Gera um ID único
 */
function gerarId() {

    return Date.now().toString(36) +
        Math.random().toString(36).substring(2, 8);

}

/**
 * Retorna data atual formatada
 */
function dataAtual() {

    return new Date().toLocaleDateString(
        "pt-BR"
    );

}

/**
 * Mostra mensagem simples
 */
function mensagem(texto) {

    alert(texto);

}

/**
 * Confirma uma ação
 */
function confirmar(texto) {

    return confirm(texto);

}

/**
 * Remove espaços extras
 */
function limparTexto(texto) {

    return texto.trim();

}

/**
 * Verifica se string está vazia
 */
function vazio(texto) {

    return texto.trim() === "";

}

/**
 * Clona um objeto
 */
function copiar(objeto) {

    return JSON.parse(
        JSON.stringify(objeto)
    );

}
