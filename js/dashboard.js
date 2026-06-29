/**
 * ==========================================
 * SIGPPC - DASHBOARD
 * ==========================================
 * Arquivo: dashboard.js
 * Responsabilidade:
 *  - Inicializar o Dashboard
 *  - Atualizar indicadores
 *  - Integrar com storage.js
 * ==========================================
 */

const Dashboard = (() => {

    let indicadores = {
        totalPPC: 0,
        emRevisao: 0,
        concluidos: 0,
        basesLegais: 0
    };

    function inicializar() {
        Utils.log("Dashboard inicializado.");

        carregarDados();
        atualizarTela();
    }

    function carregarDados() {

        // Estrutura preparada para integração
        // com storage.js nas próximas sprints.

        indicadores = {
            totalPPC: 0,
            emRevisao: 0,
            concluidos: 0,
            basesLegais: 0
        };

    }

    function atualizarTela() {

        atualizarCard("totalPPC", indicadores.totalPPC);
        atualizarCard("emRevisao", indicadores.emRevisao);
        atualizarCard("concluidos", indicadores.concluidos);
        atualizarCard("basesLegais", indicadores.basesLegais);

    }

    function atualizarCard(id, valor) {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }

    }

    return {
        inicializar
    };

})();
