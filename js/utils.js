/**
 * ==========================================
 * SIGPPC - UTILITÁRIOS GLOBAIS
 * ==========================================
 * Arquivo: utils.js
 * Responsabilidade: funções auxiliares do sistema
 * Sem dependências de outros módulos
 * ==========================================
 */

const Utils = (() => {

    /**
     * =========================
     * 🔹 DATA E IDENTIFICADORES
     * =========================
     */

    function gerarId(prefix = "id") {
        return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    }

    function formatarData(data = new Date()) {
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR");
    }

    function formatarDataHora(data = new Date()) {
        const d = new Date(data);
        return d.toLocaleString("pt-BR");
    }

    function anoAtual() {
        return new Date().getFullYear();
    }

    /**
     * =========================
     * 🔹 OBJETOS E SEGURANÇA
     * =========================
     */

    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function isEmpty(value) {
        return value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "") ||
            (Array.isArray(value) && value.length === 0);
    }

    function validarObjeto(obj, camposObrigatorios = []) {
        if (!obj) return false;

        return camposObrigatorios.every(campo =>
            obj.hasOwnProperty(campo) && !isEmpty(obj[campo])
        );
    }

    /**
     * =========================
     * 🔹 STRINGS
     * =========================
     */

    function normalizarTexto(texto) {
        if (!texto) return "";
        return texto
            .toString()
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // remove acentos
    }

    function capitalizar(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    /**
     * =========================
     * 🔹 DOM (INTERFACE)
     * =========================
     */

    function qs(selector, parent = document) {
        return parent.querySelector(selector);
    }

    function qsa(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
    }

    function criarElemento(tag, classes = [], texto = "") {
        const el = document.createElement(tag);
        if (classes.length) el.classList.add(...classes);
        if (texto) el.textContent = texto;
        return el;
    }

    function limparElemento(el) {
        if (el) el.innerHTML = "";
    }

    function mostrar(el) {
        if (el) el.style.display = "";
    }

    function esconder(el) {
        if (el) el.style.display = "none";
    }

    /**
     * =========================
     * 🔹 LOGS E DEBUG
     * =========================
     */

    function log(...args) {
        console.log("[SIGPPC]", ...args);
    }

    function warn(...args) {
        console.warn("[SIGPPC]", ...args);
    }

    function error(...args) {
        console.error("[SIGPPC]", ...args);
    }

    /**
     * =========================
     * 🔹 EXPORT PÚBLICO
     * =========================
     */

    return {
        gerarId,
        formatarData,
        formatarDataHora,
        anoAtual,

        deepClone,
        isEmpty,
        validarObjeto,

        normalizarTexto,
        capitalizar,

        qs,
        qsa,
        criarElemento,
        limparElemento,
        mostrar,
        esconder,

        log,
        warn,
        error
    };

})();
