// ===============================
// SIGPPC - APP (VERSÃO LIMPA FUNCIONAL)
// ===============================

// 🔥 ESTADO GLOBAL (único dono no app.js)
let state = loadState();

// -------------------------------
// ELEMENTOS
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
// PPC LISTA
// -------------------------------
function renderPPCs() {
    const container = document.getElementById("listaPPCs");

    container.innerHTML = `
        <button onclick="addPPC()">+ Novo PPC</button>

        <div>
            ${state.ppcs.map(p => `
                <div onclick="openPPC(${p.id})" style="cursor:pointer; padding:8px; border-bottom:1px solid #eee;">
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
        <div style="margin-top:20px; padding:10px; border:1px solid #ddd;">
            <h3>Editar PPC</h3>

            <input id="ppc-name" value="${ppc.nome}" style="padding:8px; width:100%; margin:10px 0;" />

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
// FECHAR DETALHE
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

// -------------------------------
// 🔥 EXPOSIÇÃO GLOBAL (resolve onclick)
// -------------------------------
window.addPPC = addPPC;
window.openPPC = openPPC;
window.savePPC = savePPC;
window.closePPC = closePPC;
