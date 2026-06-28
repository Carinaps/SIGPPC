
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
        <div class="item">
          <strong>${p.nome}</strong>
          <small>ID: ${p.id}</small>
        </div>
      `).join("")}
    </div>
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
