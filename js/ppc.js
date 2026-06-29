/**
 * ==========================================
 * SIGPPC
 * Módulo de Gerenciamento de PPCs
 * ==========================================
 */

const PPC = (() => {

    let lista = [];

    function inicializar() {

        Utils.log("Módulo PPC inicializado.");

        carregar();

    }

    function carregar() {

        lista = [];

    }

    function listar() {

        return Utils.deepClone(lista);

    }

    function adicionar(ppc) {

        if (!ppc) return false;

        lista.push(ppc);

        salvar();

        return true;

    }

    function remover(id) {

        lista = lista.filter(item => item.id !== id);

        salvar();

    }

    function buscar(id) {

        return lista.find(item => item.id === id);

    }

    function salvar() {

        // Integração com storage.js
        // será realizada na próxima sprint.

    }

    function total() {

        return lista.length;

    }

    return {

        inicializar,

        listar,

        adicionar,

        remover,

        buscar,

        total

    };

})();
