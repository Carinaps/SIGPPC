

// ===============================
// SIGPPC - APP.JS (SPRINT 1)
// ===============================

// -------------------------------
// DADOS INICIAIS (MOCK)
// -------------------------------
const state = {
  ppcs: [],
  modelos: [],
  versoes: [],
  bases: []
};

// -------------------------------
// ELEMENTOS DO DOM
// -------------------------------
const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".section");

// -------------------------------
// NAVEGAÇÃO ENTRE SEÇÕES
// -------------------------------
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-section");

    // remove active do menu
    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    // troca seção ativa
    sections.forEach((sec) => {
      sec.classList.remove("active");
      if (sec.id === target) {
        sec.classList.add("active");
      }
    });
  });
});

// -------------------------------
// ATUALIZAR DASHBOARD
// -------------------------------
function updateDashboard() {
  document.getElementById("count-ppcs").textContent = state.ppcs.length;
  document.getElementById("count-modelos").textContent = state.modelos.length;
  document.getElementById("count-versoes").textContent = state.versoes.length;
  document.getElementById("count-bases").textContent = state.bases.length;
}

// -------------------------------
// FUNÇÕES FUTURAS (BASE)
// -------------------------------

// Criar PPC (base para Sprint futura)
function createPPC(nome) {
  const novoPPC = {
    id: Date.now(),
    nome,
    createdAt: new Date(),
    versoes: []
  };

  state.ppcs.push(novoPPC);
  updateDashboard();
  return novoPPC;
}

// Criar Modelo
function createModelo(nome) {
  const modelo = {
    id: Date.now(),
    nome,
    createdAt: new Date()
  };

  state.modelos.push(modelo);
  updateDashboard();
  return modelo;
}

// Criar Base Legal
function createBaseLegal(titulo) {
  const base = {
    id: Date.now(),
    titulo,
    createdAt: new Date()
  };

  state.bases.push(base);
  updateDashboard();
  return base;
}

// Criar Versão de PPC
function createVersao(ppcId, descricao) {
  const versao = {
    id: Date.now(),
    ppcId,
    descricao,
    createdAt: new Date()
  };

  state.versoes.push(versao);
  updateDashboard();
  return versao;
}

// -------------------------------
// INICIALIZAÇÃO
// -------------------------------
function init() {
  updateDashboard();

  // dados iniciais de teste (opcional)
  createModelo("Modelo Base Engenharias");
  createBaseLegal("LDB 9.394/96");
  createPPC("Engenharia de Software");
}

init();
