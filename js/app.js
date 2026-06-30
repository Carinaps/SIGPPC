// ===============================
// SIGPPC - APP (SPRINT 2 LIMPO)
// ===============================

// -------------------------------
// ESTADO GLOBAL (ÚNICO)
// -------------------------------
let state = loadState();
let selectedPPC = null;

// -------------------------------
// ELEMENTOS DOM
// -------------------------------
const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".page");

// -------------------------------
// NAVEGAÇÃO
// -------------------------------
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.page;

    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    sections.forEach(sec => {
      sec.classList.toggle("active", sec.id === target);
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
    <button onclick="addPPC()" id="btnNovoPPC">+ Novo PPC</button>

    <div class="lista">
      ${state.ppcs.map(p => `
        <div class="item" onclick="openPPC(${p.id})" style="cursor:pointer">
          <strong>${p.nome}</strong>
          <small>Clique para editar</small>
        </div>
      `).join("")}
    </div>

    <div id="ppc-detail"></div>
  `;
}

// -------------------------------
// MODELOS (placeholder Sprint 2)
// -------------------------------
function renderModelos() {
  // Mantido simples por enquanto (Sprint 3 melhora isso)
}

// -------------------------------
// ABRIR PPC
// -------------------------------
function openPPC(id) {
  selectedPPC = state.ppcs.find(p => p.id === id);
  renderPPCDetail();
}

// -------------------------------
// DETALHE PPC
// -------------------------------
function renderPPCDetail() {
  const container = document.getElementById("ppc-detail");

  if (!selectedPPC) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="modal-box">
      <h3>Editar PPC</h3>

      <input id="ppc-name" value="${selectedPPC.nome}" />

      <div class="actions">
        <button onclick="savePPC()">Salvar</button>
        <button onclick="closePPC()">Fechar</button>
      </div>
    </div>
  `;
}

// -------------------------------
// SALVAR PPC
// -------------------------------
function savePPC() {
  const input = document.getElementById("ppc-name");

  if (!selectedPPC || !input) return;

  selectedPPC.nome = input.value;

  state.ppcs = state.ppcs.map(p =>
    p.id === selectedPPC.id ? selectedPPC : p
  );

  saveState(state);

  renderAll();
  renderPPCDetail();
}

// -------------------------------
// FECHAR PPC
// -------------------------------
function closePPC() {
  selectedPPC = null;
  renderPPCDetail();
}

// -------------------------------
// ADICIONAR PPC
// -------------------------------
function addPPC() {
  const nome = prompt("Nome do PPC:");
  if (!nome) return;

  state.ppcs.push({
    id: Date.now(),
    nome,
    createdAt: new Date()
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
  renderModelos();
}

// -------------------------------
// INIT
// -------------------------------
function init() {
  renderAll();
}

init();
