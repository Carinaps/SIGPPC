// ===============================
// SIGPPC - APP (ARQUITETURA LIMPA)
// ===============================

// 🔥 ÚNICO estado do sistema
let state = loadState();

// -------------------------------
// NAV / ELEMENTOS
// -------------------------------
const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");

// -------------------------------
// NAVEGAÇÃO
// -------------------------------
menuItems.forEach(item => {
    item.addEventListener("click", () => {

        const target = item.dataset.page;

        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        pages.forEach(p => {
            p.classList.toggle("active", p.id === target);
        });

        renderAll();
    });
});

// -------------------------------
// DASHBOARD
// -------------------------------
function updateDashboard() {
    document.getElementById("totalPPC").textContent = state.ppcs.length;
    document.getElementById("totalModelos").textContent = state.modelos.length;
    document.getElementById("totalVersoes").textContent = state.versoes.length;
    document.getElementById("totalBases").textContent = state.bases.length;
}

// -------------------------------
// PPCs
// -------------------------------
function renderPPCs() {
    const container = document.getElementById("listaPPCs");

    container.innerHTML = `
        <button onclick="addPPC()">+ Novo PPC</button>

        <div>
            ${state.ppcs.map(p => `
                <div onclick="openPPC(${p.id})" style="cursor:pointer">
                    <strong>${p.nome}</strong>
                </div>
            `).join("")}
        </div>

        <div id="ppc-detail"></div>
    `;
}

// -------------------------------
// ABRIR PPC
// -------------------------------
function openPPC(id) {
    const ppc = state.ppcs.find(p => p.id === id);
    renderPPCDetail(ppc);
}

// -------------------------------
// DETALHE PPC
// -------------------------------
function renderPPCDetail(ppc) {

    const container = document.getElementById("ppc-detail");

    if (!ppc) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <div>
            <h3>Editar PPC</h3>

            <input id="ppc-name" value="${ppc.nome}" />

            <button onclick="savePPC(${ppc.id})">Salvar</button>
            <button onclick="closePPC()">Fechar</button>
        </div>
    `;
}

// -------------------------------
// SALVAR PPC
// -------------------------------
function savePPC(id) {

    const input = document.getElementById("ppc-name");

    state.ppcs = state.ppcs.map(p =>
        p.id === id ? { ...p, nome: input.value } : p
    );

    saveState(state);

    renderAll();
}

// -------------------------------
// FECHAR
// -------------------------------
function closePPC() {
    renderAll();
}

// -------------------------------
// ADICIONAR PPC
// -------------------------------
function addPPC() {

    const nome = prompt("Nome do PPC:");
    if (!nome) return;

    state.ppcs.push({
        id: Date.now(),
        nome
    });

    saveState(state);

    renderAll();
}

// -------------------------------
// RENDER GERAL
// -------------------------------
function renderAll() {
    updateDashboard();
    renderPPCs();
}

// -------------------------------
// INIT
// -------------------------------
renderAll();
