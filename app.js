
// ===============================
// SIGPPC - SPRINT 2 (FUNCIONAL)
// ===============================

// -------------------------------
// STORAGE HELPERS
// -------------------------------
function loadState() {
  const data = localStorage.getItem("sigppc_state");
  if (data) return JSON.parse(data);

  return {
    ppcs: [],
    modelos: [],
    versoes: [],
    bases: []
  };
}

function saveState() {
  localStorage.setItem("sigppc_state", JSON.stringify(state));
}

// -------------------------------
// ESTADO GLOBAL
// -------------------------------
let state = loadState();
let selectedPPC = null;

// -------------------------------
// ELEMENTOS
// -------------------------------
const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".section");

// -------------------------------
// NAVEGAÇÃO
// -------------------------------
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.section;

    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    sections.forEach(sec => {
      sec.classList.toggle("active", sec.id === target);
    });

    renderAll();
  });
});

// -------------------------------
// RENDER DASHBOARD
// -------------------------------
function updateDashboard() {
  document.getElementById("count-ppcs").textContent = state.ppcs.length;
  document.getElementById("count-modelos").textContent = state.modelos.length;
  document.getElementById("count-versoes").textContent = state.versoes.length;
  document.getElementById("count-bases").textContent = state.bases.length;
}

// -------------------------------
// RENDER LISTAS
// -------------------------------
function renderPPCs() {
  const section = document.querySelector("#ppcs .panel");

  section.innerHTML = `
    <button onclick="addPPC()" class="btn">+ Novo PPC</button>

    <div class="list">
      ${state.ppcs.map(p => `
        <div class="item" onclick="openPPC(${p.id})" style="cursor:pointer">
          <strong>${p.nome}</strong>
          <small style="display:block;color:#6b7280;">Clique para abrir</small>
        </div>
      `).join("")}
    </div>

    <div id="ppc-detail"></div>
  `;
}

function renderModelos() {
  const section = document.querySelector("#modelos .panel");

  section.innerHTML = `
    <button onclick="addModelo()" class="btn">+ Novo Modelo</button>
    <div class="list">
      ${state.modelos.map(m => `
        <div class="item">
          <strong>${m.nome}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

// -------------------------------
// FUNÇÕES DE CRIAÇÃO
// -------------------------------
function openPPC(id) {
  selectedPPC = state.ppcs.find(p => p.id === id);
  renderPPCDetail();
}
function renderPPCDetail() {
  const container = document.getElementById("ppc-detail");
  function savePPC() {
  const input = document.getElementById("ppc-name");

  selectedPPC.nome = input.value;

  state.ppcs = state.ppcs.map(p =>
    p.id === selectedPPC.id ? selectedPPC : p
  );

  saveState();
  renderAll();
  renderPPCDetail();
}

  if (!selectedPPC) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="panel" style="margin-top:20px;">
      <h3>Editar PPC</h3>

      <label>Nome:</label>
      <input id="ppc-name" value="${selectedPPC.nome}" style="width:100%;padding:8px;margin:8px 0;border:1px solid #e5e7eb;border-radius:8px;"/>

      <div style="display:flex;gap:10px;">
        <button class="btn" onclick="savePPC()">Salvar</button>
        <button class="btn" style="background:#9ca3af" onclick="closePPC()">Fechar</button>
      </div>
    </div>
  `;
}
function addPPC() {
  const nome = prompt("Nome do PPC:");
  if (!nome) return;

  state.ppcs.push({
    id: Date.now(),
    nome,
    createdAt: new Date()
  });

  saveState();
  renderAll();
}

function addModelo() {
  const nome = prompt("Nome do Modelo:");
  if (!nome) return;

  state.modelos.push({
    id: Date.now(),
    nome,
    createdAt: new Date()
  });

  saveState();
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
